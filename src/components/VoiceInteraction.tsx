import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";

const SILENCE_THRESHOLD = 0.05;
const SILENCE_DURATION = 1000;
const MAX_RECORD_TIME = 6000;

const STT_API = "http://165.246.44.77:8000/api/v1/stt/transcribe";
const CHATBOT_API = "http://165.246.44.77:8000/api/v1/chat/parse";

export default function VoiceInteraction() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { emit } = useVoiceCommand();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const forceStopTimerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  /* ============================
     🎤 Recording Control
  ============================ */
  const startRecording = async () => {
    if (isListening || isProcessing) return;

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

    animationRef.current && cancelAnimationFrame(animationRef.current);
    forceStopTimerRef.current && clearTimeout(forceStopTimerRef.current);

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
     🎯 STT → Chatbot → emit
  ============================ */
  const sendAudioToServer = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

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
     🔌 Intent Mapping
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

  /* ============================
     🖼 UI
  ============================ */
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent rounded-t-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-xs text-gray-500">
          {isProcessing
            ? "명령을 처리 중입니다…"
            : "AI 비서가 대기 중입니다. 말씀해주세요."}
        </div>

        <button onClick={startRecording} className="relative">
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#2D9CFF]/30"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          <motion.div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
              isListening
                ? "bg-[#2D9CFF] shadow-lg shadow-[#2D9CFF]/50"
                : "bg-white shadow-md border border-gray-200"
            }`}
          >
            <Mic
              className={`w-7 h-7 ${
                isListening ? "text-white" : "text-gray-600"
              }`}
            />
          </motion.div>
        </button>
      </div>
    </div>
  );
}
