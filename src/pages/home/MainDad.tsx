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
          className="flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-[#2D9CFF]/30"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-[#2D9CFF]" />
          </motion.div>

          <span className="text-lg font-medium text-gray-800">
            AI 기반 좌석 · 목적지 · 음악 설정중…
          </span>
        </motion.div>
      </motion.div>
    );
  }

  /* ================= 메인 UI ================= */

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF] flex flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Seat */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6">
          <SeatVisualization />
        </div>

        {/* Climate */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6">
          <ClimateControl />
        </div>

        {/* Destination + Music */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 overflow-hidden">
          <DestinationCards
            destinations={destinations}
            musics={musics}
            onSelectDestination={setSelectedDest}
            onPlayMusic={handlePlayMusic}
          />
        </div>
      </div>

      {/* Voice */}
      <div className="h-32 px-6 pb-6">
        <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg">
          <VoiceInteraction />
        </div>
      </div>
    </div>
  );
}
