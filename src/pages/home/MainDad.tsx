import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import SeatVisualization from "../../components/SeatVisualization";
import ClimateControl from "../../components/ClimateControl";
import DestinationCards from "../../components/DestinationCards";
import VoiceInteraction from "../../components/VoiceInteraction";
import MapView from "../map/MapView";

/* ================= Types ================= */

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

/* ================= Component ================= */

export default function MainDad() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🎵 YouTube Music (Mock) */
  const [musics] = useState<MusicItem[]>([
    {
      id: "m1",
      title: "Love wins all",
      artist: "아이유",
      videoId: "JleoAppaxi0",
    },
    {
      id: "m2",
      title: "Perfect Night",
      artist: "LE SSERAFIM",
      videoId: "hLvWy2b857I",
    },
    {
      id: "m3",
      title: "사건의 지평선",
      artist: "윤하",
      videoId: "BBdC1rl5sKY",
    },
  ]);

  /* ================= 목적지 추천 ================= */

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(
          "http://165.246.44.77:8000/api/v1/recommend/recommendations?user_id=father"
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

  /* ================= 지도 화면 ================= */

  if (selectedDest) {
    return (
      <MapView
        destination={selectedDest}
        onBack={() => setSelectedDest(null)}
      />
    );
  }

  /* ================= 로딩 ================= */

  if (loading) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-[#2D9CFF]/30"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-[#2D9CFF]" />
          </motion.div>

          <span className="text-base font-medium text-gray-800">
            AI 설정 적용 중...
          </span>
        </motion.div>
      </motion.div>
    );
  }

  /* ================= 메인 UI (800x480 Optimized) ================= */

  return (
    // 전체 컨테이너: ScaleWrapper 내부에서 꽉 차게 설정
    <div className="w-full h-full bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF] flex flex-col overflow-hidden">
      
      {/* 상단 3단 그리드 영역 (Seat, Climate, Dest/Music) */}
      {/* gap과 padding을 줄여서 공간 확보 (p-6 -> p-3, gap-6 -> gap-3) */}
      <div className="flex-1 grid grid-cols-3 gap-3 p-3 min-h-0">
        
        {/* Seat */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 flex flex-col justify-center">
          <SeatVisualization />
        </div>

        {/* Climate */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 flex flex-col justify-center">
          <ClimateControl />
        </div>

        {/* Destination + Music */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 overflow-hidden flex flex-col">
          <DestinationCards
            destinations={destinations}
            musics={musics}
            onSelectDestination={setSelectedDest}
            onPlayMusic={handlePlayMusic}
          />
        </div>
      </div>

      {/* Voice Interaction Bar (Bottom) */}
      {/* 높이를 h-32(128px)에서 h-20(80px)으로 줄임 */}
      <div className="h-20 px-3 pb-3 shrink-0">
        <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg flex items-center justify-center">
          <VoiceInteraction />
        </div>
      </div>
    </div>
  );
}