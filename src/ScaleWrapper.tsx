import React, { useState, useEffect } from "react";

interface ScaleWrapperProps {
  children: React.ReactNode;
  designWidth?: number;  // 우리가 원래 디자인한 기준 너비 (예: 1920)
  designHeight?: number; // 우리가 원래 디자인한 기준 높이 (예: 1080)
}

export default function ScaleWrapper({
  children,
  designWidth = 1920, // 기본값: PC Full HD 기준 (프로젝트에 맞춰 수정하세요)
  designHeight = 1080,
}: ScaleWrapperProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // 현재 창의 크기 구하기
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 가로 비율과 세로 비율 중 더 '작은' 쪽을 기준으로 맞춰야 화면에 다 들어옵니다.
      const scaleX = windowWidth / designWidth;
      const scaleY = windowHeight / designHeight;
      
      // 화면에 꽉 차게 하되 비율을 유지하려면 Math.min 사용
      // 여백 없이 무조건 꽉 채우려면 Math.max 혹은 각각 scaleX, scaleY 적용 (찌그러짐 주의)
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    // 초기 실행 및 리사이즈 이벤트 등록
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [designWidth, designHeight]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000", // 레터박스 색상 (필요시 변경)
      }}
    >
      <div
        style={{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center", // 중앙 정렬 축소
          // transformOrigin: "top left", // 좌상단 기준 축소 (필요시 변경)
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}