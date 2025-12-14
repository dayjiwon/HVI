import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import React from "react";
import MainDad from "./pages/home/MainDad";
import MainMom from "./pages/home/MainMom";
import { VoiceCommandProvider } from "./context/VoiceCommandContext";
import ScaleWrapper from "./components/ScaleWrapper"; 

export default function App() {
  const [phase, setPhase] = useState<"face" | "pin" | "main">("face");
  const [user, setUser] = useState<null | "user1" | "user2">(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); // video ref 추가
  const [isStreaming, setIsStreaming] = useState(false);

  const PASSWORDS = {
    user1: "1301",
    user2: "1302",
  };

  // 얼굴 인식
  useEffect(() => {
    if (phase === "face") {
      // 카메라 스트리밍 시작 함수
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            // video.srcObject 리셋 (새로 시작할 때마다)
            videoRef.current.srcObject = stream;
            setIsStreaming(true);
          }
        } catch (err) {
          console.error("Camera access denied:", err);
        }
      };

      startCamera(); // 카메라 시작

      setTimeout(() => {
        const processFaceRecognition = async () => {
          try {
            const video = videoRef.current;
            if (!video) return;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) return;

            // 비디오 프레임을 캔버스에 그리기
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 캔버스 이미지를 Blob으로 변환하여 서버로 전송
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/jpeg")
            );
            if (!blob) return;

            const formData = new FormData();
            formData.append("image", blob, "face.jpg");

            for (let [key, value] of formData.entries()) {
              if (value instanceof File) {
                console.log(`${key}: Name - ${value.name}, Type - ${value.type}, Size - ${value.size}`);
              } else {
                console.log(`${key}: ${value}`);
              }
            }

            const res = await fetch("http://localhost:8000/api/v1/face/recognize", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            console.log("Face recognition result:", data);

            if (data.success) {
              // 1. 인식이 성공했을 때 (등록된 사용자)
              if (data.user_id === "강민우") {
                setUser("user1"); // 아빠
              } else if (data.user_id === "박준용") {
                setUser("user2"); // 엄마
              } else {
                setUser("user1"); 
              }
              setPhase("pin"); 
            } else {
              console.log("인식 실패, 기본값(아빠)으로 진행합니다.");
              setUser("user1"); 
              setPhase("pin");
            }}
          catch (error) {
            console.error("Error during face recognition:", error);
            setError(true);
            setPhase("face");
          }
        };

        processFaceRecognition();
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

  // 렌더링할 내용을 별도 함수로 분리 (ScaleWrapper 내부로 넣기 위해)
  const renderContent = () => {
    // 1. 얼굴 인식 UI
    if (phase === "face") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF]">
          <motion.div
            className="w-40 h-40 bg-white/60 backdrop-blur-xl rounded-full border border-white/50 shadow-xl flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {/* 비디오가 동그란 영역에 들어가도록 하기 */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
          <div className="mt-6 text-gray-600 text-sm">
            사용자 식별을 진행하고 있습니다...
          </div>
        </div>
      );
    }

    // 2. PIN UI
    if (phase === "pin") {
      const bgClass =
        user === "user1"
          ? "bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF]"
          : "bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50";

      const cardClass =
        user === "user1"
          ? "bg-white/60 backdrop-blur-xl"
          : "bg-white/50 backdrop-blur-md border-pink-200";

      const titleColor = user === "user1" ? "text-gray-700" : "text-pink-700";

      const keypadButtonClass =
        user === "user1"
          ? "bg-white/70 backdrop-blur-md"
          : "bg-white/60 backdrop-blur-md border border-pink-200";

      return (
        <div
          className={`w-full h-full flex items-center justify-center ${bgClass}`}
        >
          <div
            className={`w-80 p-8 rounded-3xl shadow-xl border border-white/50 text-center ${cardClass}`}
          >
            <h2 className={`text-xl font-semibold mb-2 ${titleColor}`}>
              {user === "user1" ? "아빠" : "엄마"} 인증
            </h2>

            <button
              onClick={switchUser}
              className="text-xs underline text-gray-500 mb-4"
            >
              다른 사용자로 전환
            </button>

            {/* PIN 표시부 */}
            <motion.div
              className={`w-full h-full py-3 mb-4 text-3xl tracking-widest rounded-2xl bg-white/80 border ${
                error
                  ? "border-red-400 text-red-500"
                  : "border-gray-300 text-gray-700"
              }`}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {pin
                .split("")
                .map(() => "●")
                .join("")}
            </motion.div>

            {error && (
              <div className="text-sm text-red-500 mb-3">
                비밀번호가 일치하지 않습니다.
              </div>
            )}

            {/* 숫자 키패드 */}
            <div className="grid grid-cols-3 gap-4 font-semibold">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => handleKeyPress(n.toString())}
                  className={`w-full h-16 rounded-full shadow-md text-xl hover:bg-white transition flex items-center justify-center ${keypadButtonClass}`}
                >
                  {n}
                </button>
              ))}

              <div></div>

              <button
                onClick={() => handleKeyPress("0")}
                className={`w-full h-16 rounded-full shadow-md text-xl hover:bg-white transition flex items-center justify-center ${keypadButtonClass}`}
              >
                0
              </button>

              <button
                onClick={handleDelete}
                className={`w-full h-16 rounded-full shadow-md text-lg hover:bg-white transition flex items-center justify-center ${keypadButtonClass}`}
              >
                ←
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 3. 메인 UI
    if (phase === "main") {
      return (
        <VoiceCommandProvider>
          {user === "user1" && <MainDad />}
          {user === "user2" && <MainMom />}
        </VoiceCommandProvider>
      );
    }
    return null;
  };

  return (
    <ScaleWrapper designWidth={800} designHeight={480}>
      {renderContent()}
    </ScaleWrapper>
  );
}
