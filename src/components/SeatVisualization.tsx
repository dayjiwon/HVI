import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SeatVisualization() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* AI Adjustment Header */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-[#2D9CFF]/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-4 h-4 text-[#2D9CFF]" />
        </motion.div>
        <span className="text-sm text-gray-700">AI 기반 좌석 자동 조정 중…</span>
      </motion.div>

      {/* 3D Seat Rendering */}
      <div className="relative w-64 h-80">
        {/* Seat Base */}
        <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#F5F5F7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#E0E0E3', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="seatShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Seat Back */}
          <path
            d="M 60 40 Q 50 35 50 50 L 50 150 Q 50 160 60 160 L 140 160 Q 150 160 150 150 L 150 50 Q 150 35 140 40 Z"
            fill="url(#seatGradient)"
            filter="url(#seatShadow)"
            stroke="#C0C0C5"
            strokeWidth="1"
          />
          
          {/* Headrest */}
          <ellipse cx="100" cy="30" rx="25" ry="15" fill="url(#seatGradient)" filter="url(#seatShadow)" stroke="#C0C0C5" strokeWidth="1"/>
          
          {/* Seat Cushion */}
          <path
            d="M 40 165 Q 40 170 45 175 L 60 200 Q 65 210 70 220 L 130 220 Q 135 210 140 200 L 155 175 Q 160 170 160 165 L 160 155 Q 160 145 150 145 L 50 145 Q 40 145 40 155 Z"
            fill="url(#seatGradient)"
            filter="url(#seatShadow)"
            stroke="#C0C0C5"
            strokeWidth="1"
          />
          
          {/* Armrests */}
          <path d="M 35 145 Q 30 145 30 150 L 30 180 Q 30 185 35 185 L 45 185 Q 50 185 50 180 L 50 150 Q 50 145 45 145 Z" fill="#D5D5D8" stroke="#C0C0C5" strokeWidth="1"/>
          <path d="M 155 145 Q 150 145 150 150 L 150 180 Q 150 185 155 185 L 165 185 Q 170 185 170 180 L 170 150 Q 170 145 165 145 Z" fill="#D5D5D8" stroke="#C0C0C5" strokeWidth="1"/>
        </svg>

        {/* Floating Indicators */}
        <motion.div
          className="absolute -left-12 top-16 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-[#2D9CFF]/30">
            <div className="text-xs text-gray-500">등받이 각도</div>
            <div className="text-sm text-[#2D9CFF]">20°</div>
          </div>
          <motion.div
            className="w-8 h-8 rounded-full bg-[#2D9CFF]/20 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-4 h-4 rounded-full bg-[#2D9CFF]" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute -right-12 top-32 flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-[#00B5F5]/20 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-4 h-4 rounded-full bg-[#00B5F5]" />
          </motion.div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-[#00B5F5]/30">
            <div className="text-xs text-gray-500">시트 높이</div>
            <div className="text-sm text-[#00B5F5]">+2 cm</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-[#2D9CFF]/20 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="w-4 h-4 rounded-full bg-[#2D9CFF]" />
          </motion.div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-[#2D9CFF]/30">
            <div className="text-xs text-gray-500">전후 위치</div>
            <div className="text-sm text-[#2D9CFF]">+1.5 cm</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
