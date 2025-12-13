import React, { useEffect, useRef } from "react";

/* global Tmapv2 */
declare global {
  interface Window {
    Tmapv2: any;
  }
}

interface Destination {
  label: string;
  lat: number;
  lon: number;
}

interface Props {
  destination: Destination;
  onBack: () => void;
}

export default function MapView({ destination, onBack }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- 1) SDK 로드 완료 대기 ---
    const waitForTmap = () =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (window.Tmapv2) resolve();
          else setTimeout(check, 100);
        };
        check();
      });

    // --- 2) 초기화 함수 ---
    const init = async () => {
      await waitForTmap();

      // 출발지 예시 (인하대)
      const startLat = 37.450316;
      const startLon = 126.653259;

      // 목적지
      const endLat = destination.lat;
      const endLon = destination.lon;

      // --- 3) 지도 생성 ---
      const map = new window.Tmapv2.Map(mapRef.current, {
        center: new window.Tmapv2.LatLng(startLat, startLon),
        width: "100%",
        height: "100%",
        zoom: 14,
      });

      // 출발지 마커
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(startLat, startLon),
        map,
        icon: "https://apis.openapi.sk.com/tmap/marker/pin_r_m_s.png",
        iconSize: new window.Tmapv2.Size(24, 38),
        title: "출발지",
      });

      // 도착지 마커
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(endLat, endLon),
        map,
        icon: "https://apis.openapi.sk.com/tmap/marker/pin_b_m_e.png",
        iconSize: new window.Tmapv2.Size(24, 38),
        title: destination.label,
      });

      // --- 4) 길찾기 API 요청 ---
      const headers = new Headers({
        appKey: process.env.REACT_APP_TMAP_APPKEY!,
        "Content-Type": "application/json",
      });

      const res = await fetch("https://apis.openapi.sk.com/tmap/routes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          startX: startLon,
          startY: startLat,
          endX: endLon,
          endY: endLat,
          reqCoordType: "WGS84GEO",
          resCoordType: "WGS84GEO",
        }),
      });

      const json = await res.json();

      // --- 5) Polyline 그리기 ---
      if (!json.features) {
        console.error("경로 데이터 없음: ", json);
        return;
      }

      json.features.forEach((item: any) => {
        if (item.geometry.type === "LineString") {
          const line = item.geometry.coordinates.map(
            (coord: number[]) =>
              new window.Tmapv2.LatLng(coord[1], coord[0])
          );

          new window.Tmapv2.Polyline({
            path: line,
            strokeColor: "#2D9CFF",
            strokeWeight: 6,
            map,
          });
        }
      });
    };

    init();
  }, [destination]);

  return (
    <div className="relative w-full h-screen">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-xl shadow"
      >
        ← 뒤로
      </button>

      {/* 지도 영역 */}
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
