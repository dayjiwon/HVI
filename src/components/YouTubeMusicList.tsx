import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  videoId: string; // ⭐ 추가
}

interface Props {
  musics: MusicItem[];
  onPlay: (music: MusicItem) => void;
}

export default function YouTubeMusicList({ musics }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="w-full px-6 mt-6">
      <div className="text-l text-gray-600 mb-2">
        YouTube Music 추천
      </div>

      <div className="flex flex-col gap-2">
        {musics.map((music, index) => {
          const isPlaying = playingId === music.id;

          return (
            <div key={music.id}>
              <motion.button
                onClick={() =>
                  setPlayingId(isPlaying ? null : music.id)
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between px-4 py-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-left">
                  <div className="text-sm text-gray-800">
                    {music.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {music.artist}
                  </div>
                </div>

                <Play
                  className={`w-4 h-4 transition-colors ${
                    isPlaying
                      ? "text-red-500"
                      : "text-gray-400 hover:text-[#FF0000]"
                  }`}
                />
              </motion.button>

              {/* ▶️ 선택된 곡만 iframe 표시 */}
              {isPlaying && (
                <div className="mt-0 rounded-xl overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${music.videoId}?autoplay=1`}
                    style={{ display: "none" }}
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
