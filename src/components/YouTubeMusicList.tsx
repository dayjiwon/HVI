import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  videoId: string;
}

interface Props {
  musics: MusicItem[];
  onPlay?: (music: MusicItem) => void;
}

export default function YouTubeMusicList({ musics }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    // 여백 최소화 (gap-1.5 -> gap-1)
    <div className="flex flex-col gap-1 w-full">
      {musics.map((music, index) => {
        const isPlaying = playingId === music.id;

        return (
          <div key={music.id} className="w-full">
            <motion.button
              onClick={() => setPlayingId(isPlaying ? null : music.id)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              // ★ 스타일: 패딩을 더 줄임 (py-1.5 -> py-1)
              className={`group relative flex items-center gap-2 px-2 py-1 w-full rounded-lg shadow-sm border transition-all text-left ${
                isPlaying
                  ? "bg-[#2D9CFF]/10 border-[#2D9CFF] ring-1 ring-[#2D9CFF]"
                  : "bg-white/80 backdrop-blur-md border-gray-200/50 hover:border-[#2D9CFF]/50 hover:shadow-md"
              }`}
            >
              {/* 1. 앨범 아트 (썸네일) - 크기 축소 (w-9 -> w-8) */}
              <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 shadow-sm border border-gray-100">
                {music.videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`}
                    alt={music.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Music className="w-3 h-3 text-gray-400" />
                  </div>
                )}
                {/* 재생 중일 때 오버레이 표시 */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-0.5 h-2 bg-white mx-0.5 animate-pulse" />
                    <div className="w-0.5 h-3 bg-white mx-0.5 animate-pulse delay-75" />
                    <div className="w-0.5 h-1.5 bg-white mx-0.5 animate-pulse delay-150" />
                  </div>
                )}
              </div>

              {/* 2. 곡 정보 (Text) */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-bold truncate leading-tight ${
                    isPlaying ? "text-[#2D9CFF]" : "text-gray-800"
                  }`}
                >
                  {music.title}
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5 truncate leading-tight">
                  {music.artist}
                </div>
              </div>

              {/* 3. 재생/정지 아이콘 */}
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-[#2D9CFF] shrink-0" />
              ) : (
                <Play className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2D9CFF] shrink-0 transition-colors" />
              )}
            </motion.button>

            {/* ▶️ iframe 로직 */}
            {isPlaying && (
              <div className="hidden">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${music.videoId}?autoplay=1`}
                  title="YouTube video player"
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}