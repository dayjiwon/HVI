import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Smile } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext"; // 1. Context import 추가

type ControlTarget = "backrest" | "height" | "position";

export function SeatVisualizationUser2() {
  // 2. 음성 명령 Hook 사용
  const { command } = useVoiceCommand();
  
  const [target, setTarget] = useState<ControlTarget>("backrest");
  const [backrestAngle, setBackrestAngle] = useState(20); // °
  const [seatHeight, setSeatHeight] = useState(2);        // cm
  const [seatPosition, setSeatPosition] = useState(1.5);  // cm

  /* ============================
     🎙️ Logic Integration (From SeatVisualization)
  ============================ */
  useEffect(() => {
    if (!command) return;
    if (command.domain !== "seat") return;

    console.log("🪑 seat command (User2):", command);

    const delta = command.delta ?? 1;

    switch (command.action) {
      case "recline":
        setTarget("backrest");
        setBackrestAngle(v => Math.min(45, v + delta * 5));
        break;

      case "up":
        setTarget("height");
        setSeatHeight(v => +(v + delta * 0.5).toFixed(1));
        break;

      case "down":
        setTarget("height");
        setSeatHeight(v => +(v - delta * 0.5).toFixed(1));
        break;

      case "forward":
        setTarget("position");
        setSeatPosition(v => +(v + delta * 0.5).toFixed(1));
        break;

      case "backward":
        setTarget("position");
        setSeatPosition(v => +(v - delta * 0.5).toFixed(1));
        break;

      default:
        break;
    }
  }, [command]);

  /* ============================
     🔘 Manual Controls (Logic Updated for safety)
  ============================ */
  const handleIncrease = () => {
    if (target === "backrest") setBackrestAngle(v => Math.min(45, v + 5));
    if (target === "height") setSeatHeight(v => +(v + 0.5).toFixed(1));
    if (target === "position") setSeatPosition(v => +(v + 0.5).toFixed(1));
  };

  const handleDecrease = () => {
    if (target === "backrest") setBackrestAngle(v => Math.max(0, v - 5));
    if (target === "height") setSeatHeight(v => +(v - 0.5).toFixed(1));
    if (target === "position") setSeatPosition(v => +(v - 0.5).toFixed(1));
  };

  const centerLabel = {
    backrest: "등받이 각도",
    height: "시트 높이",
    position: "전후 위치",
  }[target];

  const IndicatorDot = ({ delay = 0 }) => (
    <motion.div
      className="w-7 h-7 rounded-full bg-purple-300/40 flex items-center justify-center"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    >
      <div className="w-3 h-3 rounded-full bg-purple-500" />
    </motion.div>
  );

  /* ============================
     🖼️ UI Implementation (Preserved EXACTLY)
  ============================ */
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Smile className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-purple-400 font-semibold">
          AI가 의자를 맞춰줄게 ✨
        </h2>
      </div>

      {/* Seat + Indicators */}
      <div className="relative flex items-center justify-center my-10">
        {/* Seat SVG */}
        <svg viewBox="0 0 200 280" className="w-56 drop-shadow-2xl">
          <defs>
            <linearGradient id="seatUser2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F3E8FF" />
              <stop offset="100%" stopColor="#E9D5FF" />
            </linearGradient>
          </defs>

          <path
            d="M 60 40 Q 50 35 50 50 L 50 150 Q 50 160 60 160 
               L 140 160 Q 150 160 150 150 L 150 50 
               Q 150 35 140 40 Z"
            fill="url(#seatUser2)"
            stroke="#C4B5FD"
            strokeWidth="1"
          />
          <ellipse
            cx="100"
            cy="30"
            rx="25"
            ry="15"
            fill="url(#seatUser2)"
            stroke="#C4B5FD"
            strokeWidth="1"
          />
          <path
            d="M 40 165 Q 40 170 45 175 
               L 60 200 Q 65 210 70 220 
               L 130 220 Q 135 210 140 200 
               L 155 175 Q 160 170 160 165 
               L 160 155 Q 160 145 150 145 
               L 50 145 Q 40 145 40 155 Z"
            fill="url(#seatUser2)"
            stroke="#C4B5FD"
            strokeWidth="1"
          />
          <path d="M 35 145 Q 30 145 30 150 L 30 180 Q 30 185 35 185 L 45 185 Q 50 185 50 180 L 50 150 Q 50 145 45 145 Z" fill="#9e65b8" stroke="#6e2d8c" strokeWidth="1" />
          <path d="M 155 145 Q 150 145 150 150 L 150 180 Q 150 185 155 185 L 165 185 Q 170 185 170 180 L 170 150 Q 170 145 165 145 Z" fill="#9e65b8" stroke="#6e2d8c" strokeWidth="1" />
        </svg>

        {/* 등받이 각도 */}
        <motion.div
          onClick={() => setTarget("backrest")}
          className="absolute left-20 top-20 flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-purple-300">
            <div className="text-xs text-gray-500">등받이 각도</div>
            <div className="text-sm text-purple-500">{backrestAngle}°</div>
          </div>
          <IndicatorDot />
        </motion.div>

        {/* 시트 높이 */}
        <motion.div
          onClick={() => setTarget("height")}
          className="absolute right-20 top-50 flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <IndicatorDot delay={0.5} />
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-purple-300">
            <div className="text-xs text-gray-500">시트 높이</div>
            <div className="text-sm text-purple-500">{seatHeight > 0 ? `+${seatHeight}` : seatHeight}</div>
          </div>
        </motion.div>

        {/* 전후 위치 */}
        <motion.div
          onClick={() => setTarget("position")}
          className="absolute left-2/5 -translate-x-1/2 bottom-0 flex flex-col items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <IndicatorDot delay={1} />
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-purple-300">
            <div className="text-xs text-gray-500">전후 위치</div>
            <div className="text-sm text-purple-500">{seatPosition > 0 ? `+${seatPosition}` : seatPosition} cm</div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          onClick={handleIncrease}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowUp className="text-white" />
        </motion.button>

        <motion.div
          key={target}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-28 h-14 bg-purple-400 rounded-full flex items-center justify-center shadow-lg text-white font-semibold text-sm"
        >
          {centerLabel}
        </motion.div>

        <motion.button
          onClick={handleDecrease}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowDown className="text-white" />
        </motion.button>
      </div>

      {/* Status */}
      <div className="text-center mt-6">
        <span className="inline-block bg-purple-100 px-6 py-2 rounded-full text-purple-600">
          {centerLabel} 조절 중 💜
        </span>
      </div>
    </div>
  );
}