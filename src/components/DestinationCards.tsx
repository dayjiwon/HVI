import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { School, Coffee, Home, MapPin } from "lucide-react";
import { useVoiceCommand } from "../context/VoiceCommandContext";
import YouTubeMusicList from "./YouTubeMusicList";

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

const CATEGORY_ICON_MAP: Record<string, any> = {
  school: School,
  cafe: Coffee,
  home: Home,
  shopping: MapPin,
  leisure: MapPin,
};

export default function DestinationCards({
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
      console.log("📍 Voice selected destination:", match.name);
      onSelectDestination(match);
    }
  }, [command, destinations]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* ================= 목적지 영역 ================= */}
      <div className="flex flex-col items-center gap-4 px-6 pt-4">
        <div className="text-l text-gray-600 mb-2">
          오늘의 추천 목적지
        </div>

        <div className="flex flex-col gap-3 w-full">
          {destinations.map((dest, index) => {
            const Icon =
              CATEGORY_ICON_MAP[dest.category] ?? MapPin;

            return (
              <motion.button
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-3 px-4 py-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl border border-gray-200/50 hover:border-[#2D9CFF]/50 transition-all"
              >
                <div className="p-2 rounded-xl bg-[#2D9CFF]/10">
                  <Icon className="w-5 h-5 text-[#2D9CFF]" />
                </div>

                <div className="flex-1 text-left">
                  <div className="text-m text-gray-800">
                    {dest.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dest.reason}
                  </div>
                </div>

                <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#2D9CFF]" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ================= YouTube Music 영역 ================= */}
      <YouTubeMusicList
        musics={musics}
        onPlay={onPlayMusic}
      />
    </div>
  );
}
