import React from "react";
import { motion } from "framer-motion";
import { Home, School, Coffee, MapPin } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  color: string;
  distance: string;
  time: string;
}

const destinations: Destination[] = [
  {
    id: "school",
    name: "학교",
    icon: "school",
    emoji: "🏫",
    color: "from-yellow-200 to-yellow-300",
    distance: "2.5km",
    time: "8분",
  },
  {
    id: "starbucks",
    name: "스타벅스",
    icon: "coffee",
    emoji: "☕",
    color: "from-green-200 to-green-300",
    distance: "850m",
    time: "3분",
  },
  {
    id: "home",
    name: "집",
    icon: "home",
    emoji: "🏠",
    color: "from-pink-200 to-pink-300",
    distance: "5.2km",
    time: "15분",
  },
];

export function DestinationCardsUser2() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "school":
        return <School className="w-6 h-6 text-white" />;
      case "coffee":
        return <Coffee className="w-6 h-6 text-white" />;
      case "home":
        return <Home className="w-6 h-6 text-white" />;
      default:
        return <MapPin className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📍</span>
        <h2 className="text-pink-400">어디로 갈까? ✨</h2>
      </div>

      {/* Destination Cards */}
      <div className="space-y-4">
        {destinations.map((destination, index) => (
          <motion.button
            key={destination.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-4 border-transparent hover:border-pink-200 transition-all"
          >
            <div className="flex items-center gap-4">
              {/* 3D Icon Container */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className={`w-16 h-16 bg-gradient-to-br ${destination.color} rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center relative`}
              >
                <div className="absolute inset-2 bg-white/20 rounded-[16px]" />
                <span className="text-3xl relative z-10">
                  {destination.emoji}
                </span>
              </motion.div>

              {/* Destination Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-800">{destination.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="text-sm">📏 {destination.distance}</span>
                  <span className="text-sm">⏱️ {destination.time}</span>
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl"
              >
                →
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Add New Destination Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-gradient-to-br from-purple-200 to-purple-300 rounded-[32px] p-5 shadow-[0_6px_20px_rgba(147,51,234,0.2)] text-white"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">➕</span>
          <span>새로운 장소 추가</span>
        </div>
      </motion.button>
    </div>
  );
}
