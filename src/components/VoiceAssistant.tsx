import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Music, Map, Sparkles } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";

/* ============================
   ⚙️ Logic Constants & Config
============================ */
const SILENCE_THRESHOLD = 0.05;
const SILENCE_DURATION = 1000;
const MAX_RECORD_TIME = 6000;

const STT_API = "http://165.246.44.77:8000/api/v1/stt/transcribe";
const CHATBOT_API = "http://165.246.44.77:8000/api/v1/chat/parse";

export function VoiceAssistant() {
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
      setIsListening(true);
      detectSilence();

      forceStopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORD_TIME);
    } catch (err) {
      console.error("마이크 접근 실패:", err);
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
     🖼 UI Structure (Mom Style: Cute & Resized)
  ============================ */
  return (
    // MainMom의 하단 h-20 영역에 꽉 차게 배치
    <div className="w-full h-full flex items-center justify-between px-4 gap-4">
      
      {/* 1. Character Face (Left) - Resized & Animated */}
      <motion.button
        onClick={handleInteraction}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex-shrink-0 outline-none"
        disabled={isProcessing}
      >
        <motion.div
          // Mom 테마: 둥둥 떠다니는 귀여운 모션
          animate={
            isListening
              ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }
              : { y: [0, -4, 0] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          // Mom 테마 색상: Pink/Purple Gradient + Size (w-14 h-14)
          className={`w-14 h-14 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full shadow-lg shadow-pink-200/50 flex items-center justify-center relative border-2 border-white ${
            isProcessing ? "opacity-80" : ""
          }`}
        >
          {/* Listening Glow Effect */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-pink-400 rounded-full -z-10"
            />
          )}

          {/* Character Face (Eyes & Mouth) */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-1">
            <div className="flex gap-1.5">
              <motion.div
                animate={isListening ? { scaleY: [1, 0.1, 1] } : {}} // Blink
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="w-1.5 h-1.5 bg-gray-800 rounded-full"
              />
              <motion.div
                animate={isListening ? { scaleY: [1, 0.1, 1] } : {}} // Blink
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="w-1.5 h-1.5 bg-gray-800 rounded-full"
              />
            </div>
            <motion.div
              animate={isListening ? { height: 6, width: 10 } : { height: 4, width: 8 }}
              className="border-b-2 border-gray-800 rounded-full"
            />
          </div>

          {/* Mic Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
            <Mic className="w-3 h-3 text-pink-500" />
          </div>
        </motion.div>
      </motion.button>

      {/* 2. Speech Bubble (Middle) - Cute & Pastel */}
      <div className="flex-1 min-w-0 relative">
        {/* 말풍선 꼬리 */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-pink-100 to-purple-100 rotate-45 rounded-sm" />

        <motion.div
          layout
          className="w-full h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl px-5 py-2 shadow-sm flex items-center"
        >
          <div className="w-full text-gray-700 text-sm font-medium flex items-center">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                >
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-4 h-4 text-purple-500" />
                    </motion.div>
                    <span>생각하는 중이에요...</span>
                </motion.div>
              ) : isListening ? (
                <motion.div
                    key="listening"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                >
                     <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-2 h-2 bg-pink-500 rounded-full"
                     />
                    <span>듣고 있어요... 말씀해주세요!</span>
                </motion.div>
              ) : (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                >
                    <span className="truncate">"신나는 노래 틀어줘" 라고 해보세요! 🎶</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 3. Quick Action Buttons (Right) - Rounded & Fun */}
      <div className="flex gap-2 shrink-0">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => emit({ domain: 'music', action: 'play' })}
          className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full shadow-sm flex items-center justify-center border-2 border-white text-blue-600"
        >
          <Music className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => emit({ domain: 'navigation', action: 'home' })}
          className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-sm flex items-center justify-center border-2 border-white text-yellow-600"
        >
          <Map className="w-5 h-5" />
        </motion.button>
      </div>

    </div>
  );
}