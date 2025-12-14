import React, { useState, useEffect } from "react";

interface ScaleWrapperProps {
  children?: React.ReactNode;
  designWidth?: number;  // 디자인 기준 너비 (예: 1920)
  designHeight?: number; // 디자인 기준 높이 (예: 1080)
}

export default function ScaleWrapper({
  children,
  designWidth = 1920, // 만약 1280 해상도로 디자인했다면 1280으로 수정하세요
  designHeight = 1080,
}: ScaleWrapperProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // 현재 브라우저(미니 디스플레이)의 크기
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 가로, 세로 비율 중 더 작은 쪽을 기준으로 맞춤 (화면에 꽉 차게)
      const scaleX = windowWidth / designWidth;
      const scaleY = windowHeight / designHeight;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    // 처음 로딩될 때와 화면 크기가 바뀔 때마다 실행
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [designWidth, designHeight]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden", // 넘치는 부분 숨김
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000", // 레터박스(빈 공간) 색상
      }}
    >
      <div
        style={{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center", // 중앙 기준으로 축소
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}