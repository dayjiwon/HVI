import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext"; // Context import 추가

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
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 상태 추가

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

    setIsListening(false); // UI Update
  };

  /* ============================
     🎯 Logic: STT → Chatbot → emit
  ============================ */
  const sendAudioToServer = async () => {
    if (isProcessing) return;
    setIsProcessing(true); // UI에 '처리중' 표시용

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      if (audioBlob.size === 0) return;

      // 1️⃣ STT
      const sttForm = new FormData();
      sttForm.append("audio", audioBlob, "voice.webm");

      const sttRes = await fetch(STT_API, {
        method: "POST",
        body: sttForm,
      });

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

      // 3️⃣ Intent → UI Command Broadcast
      handleParsedCommand(command);
    } catch (e) {
      console.error("❌ Voice pipeline failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ============================
     🔌 Logic: Intent Mapping
  ============================ */
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

  // 클릭 핸들러: 기존 UI의 onClick에 연결
  const handleInteraction = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  /* ============================
     🖼 UI Structure (Unchanged)
  ============================ */
  return (
    <div className="relative">
      {/* Floating Dock Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-[40px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center gap-6">
          {/* Cute Character Face */}
          <motion.button
            onClick={handleInteraction} // 👈 Logic 연결
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex-shrink-0"
            disabled={isProcessing} // 처리 중일 때 중복 클릭 방지
          >
            {/* Character Blob */}
            <motion.div
              animate={
                isListening
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full shadow-[0_8px_28px_rgba(236,72,153,0.4)] flex items-center justify-center relative ${isProcessing ? 'opacity-80' : ''}`}
            >
              {/* Glow Effect when listening */}
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-pink-400 rounded-full"
                />
              )}

              {/* Character Face */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="flex gap-2 mb-1">
                  <motion.div
                    animate={
                      isListening
                        ? {
                            scaleY: [1, 1.5, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.3,
                      repeat: isListening ? Infinity : 0,
                    }}
                    className="w-2 h-2 bg-gray-800 rounded-full"
                  />
                  <motion.div
                    animate={
                      isListening
                        ? {
                            scaleY: [1, 1.5, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.3,
                      repeat: isListening ? Infinity : 0,
                      delay: 0.1,
                    }}
                    className="w-2 h-2 bg-gray-800 rounded-full"
                  />
                </div>
                <motion.div
                  animate={
                    isListening
                      ? {
                          scaleX: [1, 1.2, 1],
                        }
                      : {}
                  }
                  className="w-8 h-4 border-b-4 border-gray-800 rounded-full"
                />
              </div>

              {/* Mic Icon Overlay */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Mic className="w-3 h-3 text-pink-500" />
              </div>
            </motion.div>
          </motion.button>

          {/* Speech Bubble */}
          <div className="flex-1 relative">
            {/* Bubble Tail */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-pink-100 to-purple-100 rotate-45 rounded-lg" />

            {/* Bubble Content */}
            <motion.div
              animate={
                isListening
                  ? {
                      boxShadow: [
                        "0 4px 20px rgba(236,72,153,0.2)",
                        "0 4px 30px rgba(236,72,153,0.4)",
                        "0 4px 20px rgba(236,72,153,0.2)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-[32px] px-8 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <p className="text-gray-700">
                {/* 👇 상태에 따른 텍스트 변경 로직 적용 */}
                {isProcessing ? (
                   <span className="flex items-center gap-2">
                   <motion.span
                     animate={{ opacity: [1, 0.5, 1] }}
                     transition={{ duration: 0.8, repeat: Infinity }}
                   >
                     처리 중이에요...
                   </motion.span>
                   <span className="text-xl">🤔</span>
                 </span>
                ) : isListening ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      듣고 있어요...
                    </motion.span>
                    <span className="text-xl">👂</span>
                  </span>
                ) : (
                  <>말해줘! 내가 도와줄게 🎶</>
                )}
              </p>
            </motion.div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full shadow-[0_4px_16px_rgba(59,130,246,0.3)] flex items-center justify-center"
            >
              <span className="text-2xl">🎵</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full shadow-[0_4px_16px_rgba(251,191,36,0.3)] flex items-center justify-center"
            >
              <span className="text-2xl">🗺️</span>
            </motion.button>
          </div>
        </div>

        {/* Listening Wave Animation */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
                className="w-1 h-6 bg-gradient-to-t from-pink-400 to-purple-400 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}