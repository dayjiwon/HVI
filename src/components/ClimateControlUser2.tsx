import React from "react";
import { useState } from 'react';
import { motion } from 'motion/react';

export function ClimateControlUser2() {
  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState<'weak' | 'medium' | 'strong'>('medium');

  // Calculate rotation based on temperature (16-30°C range)
  const rotation = ((temperature - 16) / (30 - 16)) * 270 - 135;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-pink-400 mb-2">온도 조절 🌈</h2>
        <p className="text-gray-500">완벽한 온도를 찾아봐!</p>
      </div>

      {/* Donut Temperature Control */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Donut Ring */}
        <svg width="240" height="240" className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="120"
            cy="120"
            r="90"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="28"
            strokeLinecap="round"
          />
          
          {/* Gradient Ring */}
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
            strokeDasharray={`${(temperature - 16) / (30 - 16) * 565} 565`}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(255, 105, 180, 0.3))'
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
              {temperature < 20 ? '❄️' : temperature < 25 ? '🍃' : '☀️'}
            </div>
          </motion.div>
        </div>

        {/* Interactive Handle */}
        <motion.div
          className="absolute w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full shadow-[0_6px_20px_rgba(236,72,153,0.4)] cursor-pointer"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-24px',
            marginLeft: '-24px',
          }}
          animate={{
            rotate: rotation,
            x: Math.cos((rotation * Math.PI) / 180) * 90,
            y: Math.sin((rotation * Math.PI) / 180) * 90,
          }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-full h-full flex items-center justify-center text-xl">
            🎯
          </div>
        </motion.div>
      </div>

      {/* Temperature Buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTemperature(Math.max(16, temperature - 1))}
          className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
        >
          <span className="text-2xl">❄️</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTemperature(Math.min(30, temperature + 1))}
          className="w-14 h-14 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full shadow-[0_4px_16px_rgba(236,72,153,0.3)]"
        >
          <span className="text-2xl">☀️</span>
        </motion.button>
      </div>

      {/* Fan Speed Controls */}
      <div className="space-y-3">
        <div className="text-center text-gray-600 mb-4">바람 세기 🍃</div>
        <div className="flex justify-center gap-3">
          {(['weak', 'medium', 'strong'] as const).map((speed) => (
            <motion.button
              key={speed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFanSpeed(speed)}
              className={`px-6 py-3 rounded-full transition-all ${
                fanSpeed === speed
                  ? 'bg-gradient-to-br from-mint-200 to-mint-300 shadow-[0_6px_20px_rgba(72,187,120,0.4)] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              style={{
                background: fanSpeed === speed ? 'linear-gradient(to bottom right, #C8E6C9, #A5D6A7)' : undefined
              }}
            >
              {speed === 'weak' && '약하게'}
              {speed === 'medium' && '보통'}
              {speed === 'strong' && '세게'}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
