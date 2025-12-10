import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="relative">
      {/* Floating Dock Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-[40px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center gap-6">
          {/* Cute Character Face */}
          <motion.button
            onClick={() => setIsListening(!isListening)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex-shrink-0"
          >
            {/* Character Blob */}
            <motion.div
              animate={
                isListening
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full shadow-[0_8px_28px_rgba(236,72,153,0.4)] flex items-center justify-center relative"
            >
              {/* Glow Effect when listening */}
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-pink-400 rounded-full"
                />
              )}

              {/* Character Face */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="flex gap-2 mb-1">
                  <motion.div
                    animate={
                      isListening
                        ? {
                            scaleY: [1, 1.5, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.3,
                      repeat: isListening ? Infinity : 0,
                    }}
                    className="w-2 h-2 bg-gray-800 rounded-full"
                  />
                  <motion.div
                    animate={
                      isListening
                        ? {
                            scaleY: [1, 1.5, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.3,
                      repeat: isListening ? Infinity : 0,
                      delay: 0.1,
                    }}
                    className="w-2 h-2 bg-gray-800 rounded-full"
                  />
                </div>
                <motion.div
                  animate={
                    isListening
                      ? {
                          scaleX: [1, 1.2, 1],
                        }
                      : {}
                  }
                  className="w-8 h-4 border-b-4 border-gray-800 rounded-full"
                />
              </div>

              {/* Mic Icon Overlay */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Mic className="w-3 h-3 text-pink-500" />
              </div>
            </motion.div>
          </motion.button>

          {/* Speech Bubble */}
          <div className="flex-1 relative">
            {/* Bubble Tail */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-pink-100 to-purple-100 rotate-45 rounded-lg" />

            {/* Bubble Content */}
            <motion.div
              animate={
                isListening
                  ? {
                      boxShadow: [
                        "0 4px 20px rgba(236,72,153,0.2)",
                        "0 4px 30px rgba(236,72,153,0.4)",
                        "0 4px 20px rgba(236,72,153,0.2)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-[32px] px-8 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <p className="text-gray-700">
                {isListening ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      듣고 있어요...
                    </motion.span>
                    <span className="text-xl">👂</span>
                  </span>
                ) : (
                  <>말해줘! 내가 도와줄게 🎶</>
                )}
              </p>
            </motion.div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full shadow-[0_4px_16px_rgba(59,130,246,0.3)] flex items-center justify-center"
            >
              <span className="text-2xl">🎵</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full shadow-[0_4px_16px_rgba(251,191,36,0.3)] flex items-center justify-center"
            >
              <span className="text-2xl">🗺️</span>
            </motion.button>
          </div>
        </div>

        {/* Listening Wave Animation */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
                className="w-1 h-6 bg-gradient-to-t from-pink-400 to-purple-400 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
