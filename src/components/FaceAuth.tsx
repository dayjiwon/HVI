// components/auth/FaceAuth.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface FaceAuthProps {
  onSuccess: (userId: string) => void;
  onError?: (msg: string) => void;
}

const API_URL = "http://165.246.44.77:8000/api/v1/face/recognize"; // 실제 서버 주소

export default function FaceAuth({ onSuccess, onError }: FaceAuthProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamStarted, setIsStreamStarted] = useState(false);

  // 1. 웹캠 시작
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamStarted(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        if (onError) onError("카메라 권한이 필요합니다.");
      }
    };

    startCamera();

    // Cleanup: 컴포넌트 언마운트 시 스트림 중지
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onError]);

  // 2. 주기적으로 프레임 캡처 및 서버 전송
  useEffect(() => {
    if (!isStreamStarted) return;

    const captureAndSend = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      // 캔버스에 현재 비디오 프레임 그리기
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 이미지를 Blob으로 변환
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "face.jpg");

        try {
          const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          console.log("Face Recog Result:", data);

          if (data.success) {
            // 성공 시 부모에게 알림 (예: user_id가 'father'면 'user1'으로 매핑하는 로직은 부모에서 처리)
            onSuccess(data.user_id); 
          }
        } catch (e) {
          console.error("API Error:", e);
        }
      }, "image/jpeg");
    };

    // 1.5초마다 인식 시도 (너무 빠르면 서버 부하)
    const intervalId = setInterval(captureAndSend, 1500);

    return () => clearInterval(intervalId);
  }, [isStreamStarted, onSuccess]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 실제 비디오는 숨기고 애니메이션만 보여주거나, 비디오 위에 오버레이를 씌울 수 있습니다. */}
      {/* 디버깅용으로 보고 싶다면 hidden을 제거하세요. */}
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* 인식 애니메이션 UI */}
      <motion.div
        className="relative w-48 h-48 bg-white/40 backdrop-blur-xl rounded-full border-2 border-white/50 shadow-2xl flex items-center justify-center overflow-hidden"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* 스캔 라인 애니메이션 */}
        <motion.div
          className="absolute w-full h-2 bg-blue-400/50 blur-md"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="text-[#2D9CFF] text-lg font-bold z-10">
          Face ID
        </div>
      </motion.div>
      
      <div className="mt-6 text-gray-500 font-medium">
        사용자를 확인하고 있습니다...
      </div>
    </div>
  );
}