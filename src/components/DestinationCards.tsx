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

    const match = destinations.find((d) =>
      d.name.includes(command.destinationName)
    );

    if (match) {
      console.log("📍 Voice selected destination:", match.name);
      onSelectDestination(match);
    }
  }, [command, destinations]);

  return (
    // 전체 컨테이너: 패딩을 최소화 (p-2)
    <div className="flex flex-col h-full overflow-hidden px-2 py-1">
      
      {/* ================= 목적지 영역 ================= */}
      {/* shrink-0: 공간 부족해도 찌그러지지 않음 */}
      <div className="flex flex-col gap-1 mb-1 shrink-0">
        <div className="text-[10px] font-bold text-gray-500 pl-1">
          추천 목적지
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          {destinations.map((dest, index) => {
            const Icon = CATEGORY_ICON_MAP[dest.category] ?? MapPin;

            return (
              <motion.button
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                // ★ 카드 높이 대폭 축소: py-1.5 (6px 여백)
                className="group relative flex items-center gap-2 px-2 py-1.5 bg-white/80 backdrop-blur-md rounded-lg shadow-sm hover:shadow-md border border-gray-200/50 hover:border-[#2D9CFF]/50 transition-all text-left"
              >
                {/* 아이콘 박스 축소 */}
                <div className="p-1 rounded-md bg-[#2D9CFF]/10 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#2D9CFF]" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* 폰트 사이즈: text-sm -> text-xs, text-[10px] -> text-[9px] */}
                  <div className="text-xs font-bold text-gray-800 truncate leading-tight">
                    {dest.name}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-0.5 truncate leading-tight">
                    {dest.reason}
                  </div>
                </div>

                <MapPin className="w-3 h-3 text-gray-400 group-hover:text-[#2D9CFF] shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 구분선: 여백(my-1)을 아주 좁게 설정 */}
      <div className="w-full h-[1px] bg-gray-200 my-1 mx-1 shrink-0" />

      {/* ================= YouTube Music 영역 ================= */}
      {/* flex-1 min-h-0: 남은 공간을 차지하되 넘치면 내부 스크롤 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="text-[10px] font-bold text-gray-500 pl-1 mb-1 shrink-0">
           추천 음악
        </div>
        
        {/* 음악 리스트 컨테이너 - 스크롤 가능하게 */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          {/* 만약 YouTubeMusicList 컴포넌트 내부도 수정 가능하다면
            padding을 py-1.5 수준으로 줄여야 합니다. 
            여기서는 overflow 처리를 통해 화면 밖으로 나가는 것을 방지합니다.
          */}
          <YouTubeMusicList
            musics={musics}
            onPlay={onPlayMusic}
          />
        </div>
      </div>
    </div>
  );
}