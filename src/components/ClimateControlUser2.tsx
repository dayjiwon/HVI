import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVoiceCommand } from "../context/VoiceCommandContext";

export default function ClimateControlUser2() {
  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState<"weak" | "medium" | "strong">("medium");

  const { command } = useVoiceCommand();

  /* =========================================
     🧩 Logic Integration
  ========================================= */
  useEffect(() => {
    if (!command) return;
    if (command.domain !== "climate") return;
  
    console.log("🌡 climate command (User2):", command);
  
    // 1️⃣ 절대 온도 설정
    if (typeof command.target_temperature === "number") {
      setTemperature(
        Math.min(30, Math.max(16, command.target_temperature))
      );
      return;
    }
  
    // 2️⃣ 상대 온도 조절
    if (command.action === "temperature" && typeof command.delta === "number") {
      setTemperature(t =>
        Math.min(30, Math.max(16, t + command.delta))
      );
    }
  }, [command]);

  /* =========================================
     🖼 UI Implementation (Optimized for 800x480)
  ========================================= */
  return (
    // 부모 컨테이너 크기에 맞춰 꽉 채우고 내부 요소 균등 배치 (justify-evenly)
    <div className="flex flex-col items-center justify-evenly h-full w-full py-1 px-2 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm">
      
      {/* 1. Header (Title) - 크기 축소 */}
      <div className="text-center shrink-0">
        <h2 className="text-xs font-bold text-pink-400 mb-0.5">온도 조절 🌈</h2>
        <p className="text-[9px] text-gray-500">완벽한 온도를 찾아봐!</p>
      </div>

      {/* 2. Donut Temperature Control - 크기 대폭 축소 */}
      <div className="relative flex items-center justify-center shrink-0">
        
        {/* SVG Ring: 240px -> 112px (w-28) 수준으로 축소 */}
        <div className="relative w-28 h-28">
            <svg width="100%" height="100%" viewBox="0 0 240 240" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
                cx="120"
                cy="120"
                r="90"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="28"
                strokeLinecap="round"
            />

            <defs>
                <linearGradient id="tempGradientUser2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B3E5FC" />
                <stop offset="50%" stopColor="#FFF9C4" />
                <stop offset="100%" stopColor="#FFD1DC" />
                </linearGradient>
            </defs>

            {/* Value Circle */}
            <circle
                cx="120"
                cy="120"
                r="90"
                fill="none"
                stroke="url(#tempGradientUser2)"
                strokeWidth="28"
                strokeLinecap="round"
                strokeDasharray={`${((temperature - 16) / (30 - 16)) * 565} 565`}
                style={{
                filter: "drop-shadow(0 2px 6px rgba(255, 105, 180, 0.3))",
                }}
            />
            </svg>

            {/* Center Content (Temperature Display) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
                key={temperature}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
            >
                {/* 폰트 크기: text-5xl -> text-2xl */}
                <div className="text-2xl font-bold text-gray-700 mb-0.5">{temperature}°</div>
                <div className="text-base">
                {temperature < 20 ? "❄️" : temperature < 25 ? "🍃" : "☀️"}
                </div>
            </motion.div>
            </div>

            {/* ☀️ Temperature Up Button (Top) */}
            <motion.button
            onClick={() => setTemperature(Math.min(30, temperature + 0.5))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-8 h-8 rounded-full
                        bg-gradient-to-br from-pink-200 to-pink-300
                        shadow-md flex items-center justify-center cursor-pointer z-10"
            // SVG 좌표 기준 (120, 120)에서 r=90, stroke=28 고려하여 위치 조정
            // 화면상 위치를 CSS top/left로 미세조정: top -5px 정도
            style={{ top: "10px" }} 
            aria-label="온도 올리기"
            >
            <span className="text-xs">☀️</span>
            </motion.button>

            {/* ❄️ Temperature Down Button (Bottom) */}
            <motion.button
            onClick={() => setTemperature(Math.max(16, temperature - 0.5))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-8 h-8 rounded-full
                        bg-gradient-to-br from-blue-200 to-blue-300
                        shadow-md flex items-center justify-center cursor-pointer z-10"
            style={{ top: "calc(100% - 10px)" }}
            aria-label="온도 내리기"
            >
            <span className="text-xs">❄️</span>
            </motion.button>
        </div>
      </div>

      {/* 3. Fan Speed Controls - 크기 및 패딩 축소 */}
      <div className="w-full shrink-0 mt-1">
        <div className="text-center text-[10px] text-gray-500 mb-1">바람 세기 🍃</div>
        <div className="flex justify-center gap-1.5">
          {(["weak", "medium", "strong"] as const).map((speed) => (
            <motion.button
              key={speed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFanSpeed(speed)}
              // 버튼 크기: px-6 py-3 -> px-2.5 py-1
              className={`px-2.5 py-1 text-[10px] rounded-full transition-all ${
                fanSpeed === speed
                  ? "text-white shadow-sm font-bold"
                  : "bg-gray-100 text-gray-500"
              }`}
              style={{
                background:
                  fanSpeed === speed
                    ? "linear-gradient(to bottom right, #C8E6C9, #A5D6A7)"
                    : undefined,
              }}
            >
              {speed === "weak" && "약하게"}
              {speed === "medium" && "보통"}
              {speed === "strong" && "세게"}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}