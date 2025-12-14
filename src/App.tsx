import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

import MainDad from "./pages/home/MainDad";
import MainMom from "./pages/home/MainMom";
import { VoiceCommandProvider } from "./context/VoiceCommandContext";

export default function App() {
  const [phase, setPhase] = useState<"face" | "pin" | "main">("face");
  const [user, setUser] = useState<null | "user1" | "user2">(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const PASSWORDS = {
    user1: "1301",
    user2: "1302",
  };

  // 미니 터치스크린 감지
  const isMini =
    window.innerHeight < 600 || window.innerWidth < 900;

  // 얼굴 인식 (실제는 WebSocket)
  useEffect(() => {
    if (phase === "face") {
      setTimeout(() => {
        setUser("user1");
        setPhase("pin");
      }, 2000);
    }
  }, [phase]);

  // PIN 입력 로직
  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError(false);

      if (next.length === 4) {
        setTimeout(() => {
          if (user && next === PASSWORDS[user]) {
            setPhase("main");
          } else {
            setError(true);
            setPin("");
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const switchUser = () => {
    setUser(user === "user1" ? "user2" : "user1");
    setPin("");
    setError(false);
  };

  // 1️⃣ 얼굴 인식 UI
  if (phase === "face") {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF]">
        <motion.div
          className="w-32 h-32 bg-white/60 backdrop-blur-xl rounded-full border border-white/50 shadow-xl flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="text-[#2D9CFF] text-base font-semibold">
            얼굴 인식 중…
          </div>
        </motion.div>
        <div className="mt-4 text-gray-600 text-sm">
          사용자 식별을 진행하고 있습니다.
        </div>
      </div>
    );
  }

  // 2️⃣ PIN UI
  if (phase === "pin") {
    const bgClass =
      user === "user1"
        ? "bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF]"
        : "bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50";

    const cardClass =
      user === "user1"
        ? "bg-white/60 backdrop-blur-xl"
        : "bg-white/50 backdrop-blur-md border-pink-200";

    const titleColor =
      user === "user1" ? "text-gray-700" : "text-pink-700";

    const keypadButtonClass =
      user === "user1"
        ? "bg-white/70 backdrop-blur-md"
        : "bg-white/60 backdrop-blur-md border border-pink-200";

    return (
      <div
        className={`w-full h-screen flex justify-center ${bgClass} overflow-y-auto`}
      >
        <div
          className={`${
            isMini ? "w-[95vw] p-3" : "w-80 p-8"
          } my-6 rounded-2xl shadow-xl border border-white/50 text-center ${cardClass}`}
        >
          <h2 className={`text-lg font-semibold mb-1 ${titleColor}`}>
            {user === "user1" ? "아빠" : "엄마"} 인증
          </h2>

          <button
            onClick={switchUser}
            className="text-xs underline text-gray-500 mb-2"
          >
            다른 사용자로 전환
          </button>

          {/* PIN 표시부 */}
          <motion.div
            className={`w-full py-2 mb-2 text-2xl tracking-widest rounded-xl bg-white/80 border ${
              error
                ? "border-red-400 text-red-500"
                : "border-gray-300 text-gray-700"
            }`}
            animate={error ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.25 }}
          >
            {pin.split("").map(() => "●").join("")}
          </motion.div>

          {error && (
            <div className="text-xs text-red-500 mb-2">
              비밀번호가 일치하지 않습니다.
            </div>
          )}

          {/* 숫자 키패드 */}
          <div className="grid grid-cols-3 gap-3 font-semibold">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleKeyPress(n.toString())}
                className={`w-full ${
                  isMini ? "h-12 text-lg" : "h-16 text-xl"
                } rounded-full shadow-md transition flex items-center justify-center ${keypadButtonClass}`}
              >
                {n}
              </button>
            ))}

            <div></div>

            <button
              onClick={() => handleKeyPress("0")}
              className={`w-full ${
                isMini ? "h-12 text-lg" : "h-16 text-xl"
              } rounded-full shadow-md transition flex items-center justify-center ${keypadButtonClass}`}
            >
              0
            </button>

            <button
              onClick={handleDelete}
              className={`w-full ${
                isMini ? "h-12 text-base" : "h-16 text-lg"
              } rounded-full shadow-md transition flex items-center justify-center ${keypadButtonClass}`}
            >
              ←
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3️⃣ 메인 UI
  if (phase === "main") {
    return (
      <VoiceCommandProvider>
        <div className="w-full h-screen overflow-hidden">
          {user === "user1" && <MainDad />}
          {user === "user2" && <MainMom />}
        </div>
      </VoiceCommandProvider>
    );
  }

  return null;
}
