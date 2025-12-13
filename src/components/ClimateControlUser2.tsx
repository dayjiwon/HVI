import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVoiceCommand } from "../context/VoiceCommandContext";

export function ClimateControlUser2() {
  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState<"weak" | "medium" | "strong">(
    "medium"
  );

  // 16 ~ 30°C → -135° ~ +135° (UI 계산 로직 유지)
  const rotation = ((temperature - 16) / (30 - 16)) * 270 - 135;
  
  const { command } = useVoiceCommand();

  /* =========================================
     🧩 Logic Integration (from ClimateControl)
  ========================================= */
  useEffect(() => {
    if (!command) return;
    if (command.domain !== "climate") return;
  
    console.log("🌡 climate command (User2):", command);
  
    // 1️⃣ 절대 온도 설정 (예: "온도 24도로 해줘")
    // ClimateControl.tsx의 로직을 그대로 가져옴
    if (typeof command.target_temperature === "number") {
      setTemperature(
        Math.min(30, Math.max(16, command.target_temperature))
      );
      return;
    }
  
    // 2️⃣ 상대 온도 조절 (예: "온도 올려줘", "1도 내려줘")
    if (command.action === "temperature" && typeof command.delta === "number") {
      setTemperature(t =>
        Math.min(30, Math.max(16, t + command.delta))
      );
    }
    
    // (참고: 풍량 조절 명령이 있다면 여기에 추가 가능)
  }, [command]);

  /* =========================================
     🖼 UI Implementation (Preserved EXACTLY)
  ========================================= */
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="text-center mb-24">
        <h2 className="text-pink-400 mb-2">온도 조절 🌈</h2>
        <p className="text-gray-500">완벽한 온도를 찾아봐!</p>
      </div>

      {/* Donut Temperature Control */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Donut Ring */}
        <svg width="240" height="240" className="transform -rotate-90">
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
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B3E5FC" />
              <stop offset="50%" stopColor="#FFF9C4" />
              <stop offset="100%" stopColor="#FFD1DC" />
            </linearGradient>
          </defs>

          <circle
            cx="120"
            cy="120"
            r="90"
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray={`${((temperature - 16) / (30 - 16)) * 565} 565`}
            style={{
              filter: "drop-shadow(0 4px 12px rgba(255, 105, 180, 0.3))",
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={temperature}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-5xl mb-2">{temperature}°</div>
            <div className="text-2xl">
              {temperature < 20 ? "❄️" : temperature < 25 ? "🍃" : "☀️"}
            </div>
          </motion.div>
        </div>

        {/* ☀️ Temperature Up (12시) */}
        <motion.button
          onClick={() => setTemperature(Math.min(30, temperature + 0.5))}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-14 h-14 rounded-full
                     bg-gradient-to-br from-pink-200 to-pink-300
                     shadow-[0_4px_16px_rgba(236,72,153,0.3)]"
          style={{ top: "calc(50% - 90px)" }}
          aria-label="온도 올리기"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full flex items-center justify-center"
          >
            <span className="text-2xl">☀️</span>
          </motion.div>
        </motion.button>

        {/* ❄️ Temperature Down (6시) */}
        <motion.button
          onClick={() => setTemperature(Math.max(16, temperature - 0.5))}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-14 h-14 rounded-full
                     bg-gradient-to-br from-blue-200 to-blue-300
                     shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
          style={{ top: "calc(50% + 90px)" }}
          aria-label="온도 내리기"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full flex items-center justify-center"
          >
            <span className="text-2xl">❄️</span>
          </motion.div>
        </motion.button>
      </div>

      {/* Fan Speed Controls */}
      <div className="space-y-3">
        <div className="text-center text-gray-600 mb-4">바람 세기 🍃</div>
        <div className="flex justify-center gap-3">
          {(["weak", "medium", "strong"] as const).map((speed) => (
            <motion.button
              key={speed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFanSpeed(speed)}
              className={`px-6 py-3 rounded-full transition-all ${
                fanSpeed === speed
                  ? "text-white shadow-[0_6px_20px_rgba(72,187,120,0.4)]"
                  : "bg-gray-100 text-gray-600"
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