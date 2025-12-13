import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp, ArrowDown } from "lucide-react";
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
    backrest: "등받이 각도",
    height: "시트 높이",
    position: "전후 위치",
  }[target];

  const IndicatorDot = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="w-8 h-8 rounded-full bg-[#2D9CFF]/20 flex items-center justify-center"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    >
      <div className="w-4 h-4 rounded-full bg-[#2D9CFF]" />
    </motion.div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* ================= Seat SVG ================= */}
      <div className="relative w-64 h-80 mt-16">
        <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-2xl">
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
            strokeWidth="1"
          />

          {/* Headrest */}
          <ellipse
            cx="100"
            cy="30"
            rx="25"
            ry="15"
            fill="url(#seatGradient)"
            stroke="#C0C0C5"
            strokeWidth="1"
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
            strokeWidth="1"
          />

          {/* Armrests */}
          <path
            d="M 35 145 Q 30 145 30 150 L 30 180 
               Q 30 185 35 185 L 45 185 
               Q 50 185 50 180 L 50 150 
               Q 50 145 45 145 Z"
            fill="#D5D5D8"
            stroke="#C0C0C5"
            strokeWidth="1"
          />
          <path
            d="M 155 145 Q 150 145 150 150 L 150 180 
               Q 150 185 155 185 L 165 185 
               Q 170 185 170 180 L 170 150 
               Q 170 145 165 145 Z"
            fill="#D5D5D8"
            stroke="#C0C0C5"
            strokeWidth="1"
          />
        </svg>

        {/* Indicators */}
        <motion.div
          onClick={() => setTarget("backrest")}
          className="absolute -left-12 top-16 flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-[#2D9CFF]/30">
            <div className="text-xs text-gray-500">등받이 각도</div>
            <div className="text-sm text-[#2D9CFF]">{backrestAngle}°</div>
          </div>
          <IndicatorDot />
        </motion.div>

        <motion.div
          onClick={() => setTarget("height")}
          className="absolute -right-12 top-32 flex items-center gap-2 cursor-pointer"
        >
          <IndicatorDot delay={0.5} />
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-[#2D9CFF]/30">
            <div className="text-xs text-gray-500">시트 높이</div>
            <div className="text-sm text-[#2D9CFF]">
              {seatHeight > 0 ? `+${seatHeight}` : seatHeight} cm
            </div>
          </div>
        </motion.div>

        <motion.div
          onClick={() => setTarget("position")}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-2 cursor-pointer"
        >
          <IndicatorDot delay={1} />
          <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-md border border-[#2D9CFF]/30">
            <div className="text-xs text-gray-500">전후 위치</div>
            <div className="text-sm text-[#2D9CFF]">
              {seatPosition > 0 ? `+${seatPosition}` : seatPosition} cm
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= Bottom Controls ================= */}
      <div className="flex justify-center gap-4 mt-10">
        <motion.button
          onClick={handleIncrease}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#2D9CFF]/80 rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowUp className="text-white" />
        </motion.button>

        <motion.div
          key={target}
          className="w-28 h-14 bg-[#2D9CFF] rounded-full flex items-center justify-center shadow-lg text-white font-semibold text-sm"
        >
          {centerLabel}
        </motion.div>

        <motion.button
          onClick={handleDecrease}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#2D9CFF]/80 rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowDown className="text-white" />
        </motion.button>
      </div>
    </div>
  );
}
