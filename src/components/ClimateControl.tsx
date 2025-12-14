import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, ThermometerSun } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";

export default function ClimateControl() {
  const [temperature, setTemperature] = useState(22);
  const [airflow, setAirflow] = useState<"약" | "중" | "강">("중");
  const { command } = useVoiceCommand();

  const temperaturePercentage = ((temperature - 16) / (30 - 16)) * 100;

  useEffect(() => {
    if (!command) return;
    if (command.domain !== "climate") return;
  
    console.log("🌡 climate command:", command);
  
    // 1️⃣ 절대 온도 설정
    if (typeof command.target_temperature === "number") {
      setTemperature(
        Math.min(30, Math.max(16, command.target_temperature))
      );
      return;
    }
  
    // 2️⃣ 상대 온도 조절
    if (command.action === "temperature" && typeof command.delta === "number") {
      setTemperature((t) =>
        Math.min(30, Math.max(16, t + command.delta))
      );
    }
  }, [command]);
  
  return (
    // ★ 수정됨: h-full -> h-[80%] (부모 높이의 4/5)
    // gap-2 -> gap-1 (높이가 줄어든 만큼 간격도 더 좁게)
    <div className="flex flex-col items-center justify-center h-[80%] gap-1 px-2">
      
      {/* 1. 상단 아이콘 및 라벨 */}
      <div className="text-center">
        <ThermometerSun className="w-5 h-5 text-[#2D9CFF] mx-auto mb-1" />
        <div className="text-[10px] text-gray-500">실내 온도</div>
      </div>

      {/* 2. 온도 조절 다이얼 */}
      <div className="relative">
        <div className="relative w-32 h-32">
          
          {/* SVG Background Circle */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E8EBEF"
              strokeWidth="8"
            />
            <defs>
              <linearGradient
                id="tempGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00B5F5" />
                <stop offset="50%" stopColor="#2D9CFF" />
                <stop offset="100%" stopColor="#FF6B6B" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#tempGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(temperaturePercentage / 100) * 251.2} 251.2`}
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{
                strokeDasharray: `${
                  (temperaturePercentage / 100) * 251.2
                } 251.2`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>

          {/* 중앙 온도 텍스트 Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-3xl font-bold text-gray-800"
              key={temperature}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {temperature}°
            </motion.div>
            <div className="text-[10px] text-gray-500 mt-0.5">Celsius</div>
          </div>

          {/* Plus / Minus Buttons */}
          <button
            onClick={() => setTemperature(Math.min(30, temperature + 0.5))}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 hover:border-[#2D9CFF] hover:bg-[#2D9CFF]/5 transition-all flex items-center justify-center group"
          >
            <span className="text-sm text-gray-600 group-hover:text-[#2D9CFF]">
              +
            </span>
          </button>
          <button
            onClick={() => setTemperature(Math.max(16, temperature - 0.5))}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 hover:border-[#2D9CFF] hover:bg-[#2D9CFF]/5 transition-all flex items-center justify-center group"
          >
            <span className="text-sm text-gray-600 group-hover:text-[#2D9CFF]">
              −
            </span>
          </button>
        </div>
      </div>

      {/* 3. 풍량 조절 (Airflow) */}
      <div className="w-full mt-1">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Wind className="w-3 h-3 text-[#2D9CFF]" />
          <span className="text-xs text-gray-600">풍량</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          {(["약", "중", "강"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setAirflow(level)}
              className={`px-3 py-1 text-xs rounded-xl transition-all ${
                airflow === level
                  ? "bg-[#2D9CFF] text-white shadow-md shadow-[#2D9CFF]/30"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 하단 상태 정보 */}
      <div className="text-[10px] text-gray-400 text-center">
        자동모드 ON
      </div>
    </div>
  );
}