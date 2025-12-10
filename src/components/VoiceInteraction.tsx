import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function VoiceInteraction() {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Gradient overlay background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent rounded-t-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-xs text-gray-500">
          AI 비서가 대기 중입니다. 말씀해주세요.
        </div>

        {/* Microphone Button */}
        <button
          onClick={() => setIsListening(!isListening)}
          className="relative"
        >
          {/* Ripple effect when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-[#2D9CFF]/30"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#2D9CFF]/30"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          <motion.div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-[#2D9CFF] shadow-lg shadow-[#2D9CFF]/50"
                : "bg-white shadow-md hover:shadow-lg border border-gray-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic
              className={`w-7 h-7 ${
                isListening ? "text-white" : "text-gray-600"
              }`}
            />
          </motion.div>
        </button>

        {/* Waveform when listening */}
        {isListening && (
          <motion.div
            className="flex items-center gap-1 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#2D9CFF] rounded-full"
                initial={{ height: 4 }}
                animate={{ height: [4, Math.random() * 24 + 8, 4] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
