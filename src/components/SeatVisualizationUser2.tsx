import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Smile } from "lucide-react";

export function SeatVisualizationUser2() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Smile className="w-8 h-8 text-pink-400" />
        </motion.div>
        <h2 className="text-pink-400">AI가 의자를 맞춰줄게! ✨</h2>
      </div>

      {/* Soft 3D Seat */}
      <div className="relative flex items-center justify-center my-8">
        {/* Seat Base */}
        <div className="relative">
          {/* Seat Back */}
          <motion.div
            className="w-32 h-40 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[40px] shadow-[inset_-4px_-4px_12px_rgba(255,255,255,0.8),inset_4px_4px_12px_rgba(147,51,234,0.2),0_8px_24px_rgba(147,51,234,0.15)]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Seat Cushion */}
          <motion.div
            className="w-40 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[35px] shadow-[inset_-4px_-4px_12px_rgba(255,255,255,0.8),inset_4px_4px_12px_rgba(147,51,234,0.2),0_8px_24px_rgba(147,51,234,0.15)] mt-2"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />

          {/* Cute Avatar */}
          <motion.div
            className="absolute -right-6 top-12 w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Adjustment Bubbles */}
      <div className="flex justify-center gap-4 mt-8">
        {/* Up Adjustment */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full shadow-[0_6px_20px_rgba(59,130,246,0.3)] flex items-center justify-center"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </motion.button>

        {/* Center Indicator */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full shadow-[0_6px_20px_rgba(236,72,153,0.3)] flex items-center justify-center"
        >
          <span className="text-2xl">🎯</span>
        </motion.div>

        {/* Down Adjustment */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full shadow-[0_6px_20px_rgba(59,130,246,0.3)] flex items-center justify-center"
        >
          <ArrowDown className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Status Text */}
      <div className="text-center mt-6">
        <div className="inline-block bg-purple-100/80 px-6 py-3 rounded-full">
          <span className="text-purple-600">완벽한 자세! 💜</span>
        </div>
      </div>
    </div>
  );
}
