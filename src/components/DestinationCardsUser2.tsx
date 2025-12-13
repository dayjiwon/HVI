import React, { useEffect } from "react"; // 1. useEffect 추가
import { motion } from "framer-motion";
import YouTubeMusicList from "./YouTubeMusicList"; // 2. YouTubeMusicList import
import { useVoiceCommand } from "../context/VoiceCommandContext"; // 3. 음성 명령 Context 추가

interface Destination {
  id: string;
  name: string;
  category: string;
  reason: string;
  lat?: number;
  lon?: number;
}

// 4. MusicItem 인터페이스 추가
interface MusicItem {
  id: string;
  title: string;
  artist: string;
  videoId: string;
}

interface Props {
  destinations: Destination[];
  musics: MusicItem[]; // 5. Props 추가
  onSelectDestination: (dest: Destination) => void;
  onPlayMusic: (music: MusicItem) => void; // 6. Handler 추가
}

/**
 * category → emoji 매핑 (UI 유지용)
 */
const CATEGORY_EMOJI_MAP: Record<string, string> = {
  school: "🏫",
  cafe: "☕",
  home: "🏠",
  shopping: "🛒",
  leisure: "🎡",
};

/**
 * category → gradient color (UI 유지용)
 */
const CATEGORY_COLOR_MAP: Record<string, string> = {
  school: "from-blue-400 to-blue-600",
  cafe: "from-amber-400 to-orange-500",
  home: "from-pink-400 to-rose-500",
  shopping: "from-purple-400 to-indigo-500",
  leisure: "from-green-400 to-emerald-500",
};

export function DestinationCardsUser2({
  destinations,
  musics, // 7. Props destructuring
  onSelectDestination,
  onPlayMusic,
}: Props) {
  
  // 8. 음성 명령 연동 (기존 로직 이식)
  const { command } = useVoiceCommand();

  useEffect(() => {
    if (!command) return;
    if (command.domain !== "navigation") return;

    const match = destinations.find(d =>
      d.name.includes(command.destinationName)
    );

    if (match) {
      console.log("📍 Voice selected destination (User2):", match.name);
      onSelectDestination(match);
    }
  }, [command, destinations]);

  return (
    // overflow-y-auto 추가 (스크롤 가능하도록)
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">📍</span>
        <h2 className="text-pink-400">어디로 갈까? ✨</h2>
      </div>

      {/* Destination Cards */}
      <div className="space-y-4 mb-8">
        {destinations.map((destination, index) => {
          const emoji =
            CATEGORY_EMOJI_MAP[destination.category] ?? "📍";
          const gradient =
            CATEGORY_COLOR_MAP[destination.category] ??
            "from-gray-400 to-gray-600";

          return (
            <motion.button
              key={destination.id}
              onClick={() => onSelectDestination(destination)}
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
                  className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center relative`}
                >
                  <div className="absolute inset-2 bg-white/20 rounded-[16px]" />
                  <span className="text-3xl relative z-10">
                    {emoji}
                  </span>
                </motion.div>

                {/* Destination Info */}
                <div className="flex-1 text-left">
                  <div className="text-gray-800 mb-1">
                    {destination.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {destination.reason}
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
          );
        })}
      </div>

      {/* 9. YouTube Music List 추가 (구분선 포함) */}
      <div className="border-t-2 border-pink-100/50 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🎵</span>
          <h3 className="text-pink-400 text-lg">신나는 음악 어때?</h3>
        </div>
        
        <YouTubeMusicList
          musics={musics}
          onPlay={onPlayMusic}
        />
      </div>
    </div>
  );
}