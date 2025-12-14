import React, { useEffect } from "react";
import { motion } from "framer-motion";
import YouTubeMusicList from "./YouTubeMusicList"; // 기존 YouTubeMusicList 재사용 (이미 최적화됨)
import { useVoiceCommand } from "../context/VoiceCommandContext";

interface Destination {
  id: string;
  name: string;
  category: string;
  reason: string;
  lat?: number;
  lon?: number;
}

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  videoId: string;
}

interface Props {
  destinations: Destination[];
  musics: MusicItem[];
  onSelectDestination: (dest: Destination) => void;
  onPlayMusic: (music: MusicItem) => void;
}

const CATEGORY_EMOJI_MAP: Record<string, string> = {
  school: "🏫",
  cafe: "☕",
  home: "🏠",
  shopping: "🛒",
  leisure: "🎡",
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  school: "from-blue-400 to-blue-600",
  cafe: "from-amber-400 to-orange-500",
  home: "from-pink-400 to-rose-500",
  shopping: "from-purple-400 to-indigo-500",
  leisure: "from-green-400 to-emerald-500",
};

export function DestinationCardsUser2({
  destinations,
  musics,
  onSelectDestination,
  onPlayMusic,
}: Props) {
  
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
    // 컨테이너: 패딩 축소 (p-8 -> px-2 py-1)
    <div className="flex flex-col h-full overflow-hidden px-2 py-1 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm">
      
      {/* ================= 목적지 영역 ================= */}
      <div className="flex flex-col gap-1 mb-1 shrink-0">
        <div className="flex items-center gap-1 mb-1 pl-1">
          <span className="text-xs">📍</span>
          <h2 className="text-[10px] font-bold text-pink-500">어디로 갈까? ✨</h2>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          {destinations.map((destination, index) => {
            const emoji = CATEGORY_EMOJI_MAP[destination.category] ?? "📍";
            const gradient = CATEGORY_COLOR_MAP[destination.category] ?? "from-gray-400 to-gray-600";

            return (
              <motion.button
                key={destination.id}
                onClick={() => onSelectDestination(destination)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                // 카드 스타일: 패딩 및 크기 축소 (p-5 -> px-2 py-1.5)
                className="group relative flex items-center gap-2 px-2 py-1.5 w-full bg-white rounded-xl shadow-sm border border-transparent hover:border-pink-200 transition-all text-left"
              >
                {/* 3D Icon Container: w-16 -> w-8 (32px) */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg shadow-sm flex items-center justify-center relative shrink-0`}
                >
                  <div className="absolute inset-1 bg-white/20 rounded-md" />
                  {/* 이모지 크기: text-3xl -> text-sm */}
                  <span className="text-sm relative z-10">{emoji}</span>
                </motion.div>

                {/* Destination Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate leading-tight">
                    {destination.name}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-0.5 truncate leading-tight">
                    {destination.reason}
                  </div>
                </div>

                {/* Arrow */}
                <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-pink-300"
                >
                    →
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-pink-100/50 my-1 mx-1 shrink-0" />

      {/* ================= YouTube Music 영역 ================= */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-1 mb-1 pl-1 shrink-0">
          <span className="text-xs">🎵</span>
          <h3 className="text-[10px] font-bold text-pink-500">신나는 음악 어때?</h3>
        </div>
        
        {/* 음악 리스트 컨테이너 - 스크롤 가능하게 */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          <YouTubeMusicList
            musics={musics}
            onPlay={onPlayMusic}
          />
        </div>
      </div>
    </div>
  );
}