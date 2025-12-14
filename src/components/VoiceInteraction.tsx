import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Music, Map, Activity, Sparkles } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";

/* ============================
   ⚙️ Logic Constants & Config
============================ */
const SILENCE_THRESHOLD = 0.05;
const SILENCE_DURATION = 1000;
const MAX_RECORD_TIME = 6000;

const STT_API = "http://165.246.44.77:8000/api/v1/stt/transcribe";
const CHATBOT_API = "http://165.246.44.77:8000/api/v1/chat/parse";

export default function VoiceInteraction() {
  // UI State + Logic State
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { emit } = useVoiceCommand();

  // Refs for Logic
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const forceStopTimerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  /* ============================
     🎤 Logic: Recording Control
  ============================ */
  const startRecording = async () => {
    if (isListening || isProcessing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = sendAudioToServer;
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      silenceStartRef.current = null;
      setIsListening(true); // UI Update
      detectSilence();

      forceStopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORD_TIME);
    } catch (err) {
      console.error("Mic Access Error:", err);
    }
  };

  const detectSilence = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const buffer = new Uint8Array(analyser.fftSize);

    const check = () => {
      analyser.getByteTimeDomainData(buffer);
      const volume = Math.sqrt(
        buffer.reduce((s, v) => s + ((v - 128) / 128) ** 2, 0) / buffer.length
      );

      if (volume < SILENCE_THRESHOLD) {
        silenceStartRef.current ??= Date.now();
        if (Date.now() - silenceStartRef.current > SILENCE_DURATION) {
          stopRecording();
          return;
        }
      } else {
        silenceStartRef.current = null;
      }

      animationRef.current = requestAnimationFrame(check);
    };
    check();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (forceStopTimerRef.current) clearTimeout(forceStopTimerRef.current);

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    analyserRef.current = null;
    silenceStartRef.current = null;

    setIsListening(false);
  };

  /* ============================
     🎯 Logic: STT → Chatbot → emit
  ============================ */
  const sendAudioToServer = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      if (audioBlob.size === 0) return;

      // 1️⃣ STT
      const sttForm = new FormData();
      sttForm.append("audio", audioBlob, "voice.webm");

      const sttRes = await fetch(STT_API, { method: "POST", body: sttForm });
      const sttData = await sttRes.json();
      if (!sttData.success || !sttData.text) return;

      console.log("📝 STT:", sttData.text);

      // 2️⃣ Chatbot
      const chatRes = await fetch(CHATBOT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sttData.text }),
      });

      const command = await chatRes.json();
      console.log("🤖 Parsed Command:", command);

      // 3️⃣ Intent Mapping
      handleParsedCommand(command);
    } catch (e) {
      console.error("❌ Voice pipeline failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParsedCommand = (command: any) => {
    switch (command.intent) {
      case "adjust_temperature":
        emit({
          domain: "climate",
          action: "temperature",
          delta: command.delta,
          target_temperature: command.target_temperature,
          mode: command.mode
        });
        break;
      case "adjust_seat_position":
        emit({
          domain: "seat",
          action: command.direction,
          delta: command.amount ?? 1,
        });
        break;
      case "control_music":
        emit({
          domain: "music",
          action: command.action,
          target: command.song,
        });
        break;
      case "set_destination":
        emit({
          domain: "navigation",
          action: "set",
          destination: command.destination,
        });
        break;
      default:
        console.warn("⚠️ Unknown intent:", command);
    }
  };

  const handleInteraction = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  /* ============================
     🖼 UI Structure (Refined Dad Style)
  ============================ */
  return (
    <div className="w-full h-full flex items-center justify-between px-4 gap-4">
      
      {/* 1. Mic Button (Left) */}
      <div className="relative flex-shrink-0">
        <motion.button
          onClick={handleInteraction}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "bg-gradient-to-tr from-[#2D9CFF] to-[#0073e6] shadow-[0_0_20px_rgba(45,156,255,0.5)] border-transparent"
              : "bg-white border border-gray-200/80 shadow-sm hover:border-[#2D9CFF]/50"
          }`}
          disabled={isProcessing}
        >
          <Mic className={`w-6 h-6 ${isListening ? "text-white" : "text-gray-500"}`} />
        </motion.button>
        
        {/* Ripple Animation */}
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#2D9CFF]/30 z-0"
          />
        )}
      </div>

      {/* 2. Status Panel (Middle) - Cleaner Glass Style */}
      <div className="flex-1 min-w-0">
        <motion.div 
          className="relative h-12 rounded-2xl flex items-center px-5 overflow-hidden border border-white/50 bg-white/40 backdrop-blur-md shadow-sm"
          layout
        >
            <div className="flex items-center gap-3 w-full">
                {isProcessing ? (
                    <>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                            <Activity className="w-5 h-5 text-[#2D9CFF]" />
                        </motion.div>
                        <span className="text-[#2D9CFF] font-semibold text-sm animate-pulse">
                          명령 처리 중...
                        </span>
                    </>
                ) : isListening ? (
                    <>
                         {/* Waveform Animation */}
                         <div className="flex gap-1 h-3 items-center">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-[#2D9CFF] rounded-full"
                                    animate={{ height: ["30%", "100%", "30%"] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                        <span className="text-gray-800 font-medium text-sm ml-1">
                          듣고 있어요...
                        </span>
                    </>
                ) : (
                    <>
                        {/* Idle State: Sparkle Icon + Friendly Text */}
                        <div className="w-8 h-8 rounded-full bg-[#2D9CFF]/10 flex items-center justify-center shrink-0">
                           <Sparkles className="w-4 h-4 text-[#2D9CFF]" />
                        </div>
                        <span className="text-gray-600 font-medium text-sm truncate">
                          AI 비서가 대기 중입니다.
                        </span>
                    </>
                )}
            </div>
        </motion.div>
      </div>

      {/* 3. Quick Actions (Right) */}
      <div className="flex gap-3 shrink-0">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => emit({ domain: 'music', action: 'play' })}
            className="w-12 h-12 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 flex items-center justify-center hover:bg-white transition-colors group"
        >
            <Music className="w-5 h-5 text-gray-500 group-hover:text-[#2D9CFF] transition-colors" />
        </motion.button>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => emit({ domain: 'navigation', action: 'home' })}
            className="w-12 h-12 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 flex items-center justify-center hover:bg-white transition-colors group"
        >
            <Map className="w-5 h-5 text-gray-500 group-hover:text-[#2D9CFF] transition-colors" />
        </motion.button>
      </div>

    </div>
  );
}