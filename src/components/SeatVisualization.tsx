import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";

type ControlTarget = "backrest" | "height" | "position";

export default function SeatVisualization() {
  const { command } = useVoiceCommand();

  const [target, setTarget] = useState<ControlTarget>("backrest");

  const [backrestAngle, setBackrestAngle] = useState(20); // °
  const [seatHeight, setSeatHeight] = useState(2);       // cm
  const [seatPosition, setSeatPosition] = useState(1.5); // cm

  /* ============================
     🎙 Voice → Seat Mapping
  ============================ */
  useEffect(() => {
    if (!command) return;
    if (command.domain !== "seat") return;

    console.log("🪑 seat command:", command);

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
     🔘 Manual Controls
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
    backrest: "등받이", // 텍스트를 짧게 줄임 (등받이 각도 -> 등받이)
    height: "높이",
    position: "위치", // (전후 위치 -> 위치)
  }[target];

  // Indicator 점 크기 축소 (w-8 -> w-5)
  const IndicatorDot = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="w-5 h-5 rounded-full bg-[#2D9CFF]/20 flex items-center justify-center shrink-0"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    >
      <div className="w-2 h-2 rounded-full bg-[#2D9CFF]" />
    </motion.div>
  );

  return (
    // 전체 컨테이너: justify-evenly로 상하 여백 자동 분배
    <div className="relative flex flex-col items-center justify-evenly h-full w-full py-1">
      
      {/* ================= Seat SVG ================= */}
      {/* 크기 대폭 축소: w-64 -> w-28 (112px), h-80 -> h-36 (144px) */}
      <div className="relative w-28 h-36">
        <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5F5F7" />
              <stop offset="100%" stopColor="#E0E0E3" />
            </linearGradient>
          </defs>

          {/* Seat Back */}
          <path
            d="M 60 40 Q 50 35 50 50 L 50 150 Q 50 160 60 160 
               L 140 160 Q 150 160 150 150 L 150 50 
               Q 150 35 140 40 Z"
            fill="url(#seatGradient)"
            stroke="#C0C0C5"
            strokeWidth="2"
          />

          {/* Headrest */}
          <ellipse
            cx="100"
            cy="30"
            rx="25"
            ry="15"
            fill="url(#seatGradient)"
            stroke="#C0C0C5"
            strokeWidth="2"
          />

          {/* Seat Cushion */}
          <path
            d="M 40 165 Q 40 170 45 175 
               L 60 200 Q 65 210 70 220 
               L 130 220 Q 135 210 140 200 
               L 155 175 Q 160 170 160 165 
               L 160 155 Q 160 145 150 145 
               L 50 145 Q 40 145 40 155 Z"
            fill="url(#seatGradient)"
            stroke="#C0C0C5"
            strokeWidth="2"
          />

          {/* Armrests */}
          <path
            d="M 35 145 Q 30 145 30 150 L 30 180 
               Q 30 185 35 185 L 45 185 
               Q 50 185 50 180 L 50 150 
               Q 50 145 45 145 Z"
            fill="#D5D5D8"
            stroke="#C0C0C5"
            strokeWidth="2"
          />
          <path
            d="M 155 145 Q 150 145 150 150 L 150 180 
               Q 150 185 155 185 L 165 185 
               Q 170 185 170 180 L 170 150 
               Q 170 145 165 145 Z"
            fill="#D5D5D8"
            stroke="#C0C0C5"
            strokeWidth="2"
          />
        </svg>

        {/* Indicators: 위치 조정 및 텍스트/박스 크기 축소 */}
        
        {/* 1. 등받이 (Left) */}
        <motion.div
          onClick={() => setTarget("backrest")}
          // -left-12 -> -left-16 (SVG가 작아졌으므로 상대 위치 조정)
          className="absolute -left-16 top-6 flex items-center gap-1 cursor-pointer z-10"
        >
          <div className="bg-white/95 px-2 py-1 rounded-md shadow-sm border border-[#2D9CFF]/30 text-right min-w-[48px]">
            <div className="text-[9px] text-gray-400">등받이</div>
            <div className="text-[11px] font-bold text-[#2D9CFF]">{backrestAngle}°</div>
          </div>
          <IndicatorDot />
        </motion.div>

        {/* 2. 높이 (Right) */}
        <motion.div
          onClick={() => setTarget("height")}
          className="absolute -right-16 top-14 flex items-center gap-1 cursor-pointer z-10"
        >
          <IndicatorDot delay={0.5} />
          <div className="bg-white/95 px-2 py-1 rounded-md shadow-sm border border-[#2D9CFF]/30 text-left min-w-[48px]">
            <div className="text-[9px] text-gray-400">높이</div>
            <div className="text-[11px] font-bold text-[#2D9CFF]">
              {seatHeight > 0 ? `+${seatHeight}` : seatHeight}
            </div>
          </div>
        </motion.div>

        {/* 3. 위치 (Bottom) */}
        <motion.div
          onClick={() => setTarget("position")}
          // SVG 바로 아래에 딱 붙도록 bottom 값 조정
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 flex flex-col items-center gap-0.5 cursor-pointer z-10"
        >
          <IndicatorDot delay={1} />
          <div className="bg-white/95 px-2 py-0.5 rounded-md shadow-sm border border-[#2D9CFF]/30 text-center min-w-[48px]">
            <div className="text-[9px] text-gray-400">위치</div>
            <div className="text-[11px] font-bold text-[#2D9CFF]">
              {seatPosition > 0 ? `+${seatPosition}` : seatPosition}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= Bottom Controls ================= */}
      {/* 간격 좁힘: gap-4 -> gap-2 */}
      <div className="flex justify-center gap-2 mt-4 shrink-0">
        <motion.button
          onClick={handleIncrease}
          whileTap={{ scale: 0.9 }}
          // 버튼 크기 축소: w-14 -> w-9 (36px)
          className="w-9 h-9 bg-[#2D9CFF]/90 rounded-full flex items-center justify-center shadow-md hover:bg-[#2D9CFF]"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </motion.button>

        <motion.div
          key={target}
          // 라벨 박스 크기 축소: w-28 -> w-20, h-14 -> h-9
          className="w-20 h-9 bg-[#2D9CFF] rounded-full flex items-center justify-center shadow-md text-white font-bold text-xs"
        >
          {centerLabel}
        </motion.div>

        <motion.button
          onClick={handleDecrease}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 bg-[#2D9CFF]/90 rounded-full flex items-center justify-center shadow-md hover:bg-[#2D9CFF]"
        >
          <ArrowDown className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
}