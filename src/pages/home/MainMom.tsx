import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { SeatVisualizationUser2 } from "../../components/SeatVisualizationUser2";
import { ClimateControlUser2 } from "../../components/ClimateControlUser2";
import { DestinationCardsUser2 } from "../../components/DestinationCardsUser2";
import { VoiceAssistant } from "../../components/VoiceAssistant";
import MapView from "../map/MapView";

interface Destination {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  reason: string;
}

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  videoId: string;
}

export default function MainMom() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🎵 YouTube Music (Mock) */
  const [musics] = useState<MusicItem[]>([
    {
      id: "m1",
      title: "APT.",
      artist: "ROSÉ & Bruno Mars",
      videoId: "ekr2nIex040",
    },
    {
      id: "m2",
      title: "Supernova",
      artist: "aespa",
      videoId: "phuiiNCxRMg",
    },
    {
      id: "m3",
      title: "한 페이지가 될 수 있게",
      artist: "DAY6 (데이식스)",
      videoId: "vnS_jn2uibs",
    },
  ]);

  // 🔥 MainMom 진입 시 → mother 기준 목적지 추천
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(
          "http://165.246.44.77:8000/api/v1/recommend/recommendations?user_id=mother"
        );
        if (!res.ok) throw new Error("Failed to fetch recommendations");

        const data = await res.json();
        setDestinations(data.recommendations);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  /* ================= 음악 재생 ================= */
  const handlePlayMusic = (music: MusicItem) => {
    console.log("🎵 Play music:", music.title, "-", music.artist);
    // 실제 재생은 DestinationCards 내부 iframe에서 처리
  };
  

  // 목적지 선택 → 지도
  if (selectedDest) {
    return (
      <MapView
        destination={selectedDest}
        onBack={() => setSelectedDest(null)}
      />
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <>
        {/* AI Header - Centered & Scaled */}
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-[#2D9CFF]/30"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1.2, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#2D9CFF]" />
            </motion.div>
  
            <span className="text-lg font-medium text-gray-800">
              AI 기반 좌석, 목적지 설정중…
            </span>
          </motion.div>
        </motion.div>
      </>
    );
  }  

  // 🔵 기존 UI 구조 그대로
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-6 flex flex-col gap-6">
      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SeatVisualizationUser2 />
        <ClimateControlUser2 />
        <DestinationCardsUser2
          destinations={destinations}
          musics={musics}
          onSelectDestination={setSelectedDest}
          onPlayMusic={handlePlayMusic}
        />
      </div>

      <VoiceAssistant />
    </div>
  );
}
