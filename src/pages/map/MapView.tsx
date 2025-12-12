import React, { useEffect, useRef } from "react";
declare const Tmapv2: any;

export default function MapView({ destination, onBack }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 출발지: 현재 위치 (예시 - 인하대 앞)
    const startLat = 37.450316;
    const startLon = 126.653259;

    // 목적지
    const endLat = destination.lat;
    const endLon = destination.lon;

    const map = new Tmapv2.Map(mapRef.current, {
      center: new Tmapv2.LatLng(startLat, startLon),
      width: "100%",
      height: "100%",
      zoom: 14,
    });

    const headers = new Headers({
      appKey: process.env.REACT_APP_TMAP_APPKEY!,
      "Content-Type": "application/json",
    });

    fetch("https://apis.openapi.sk.com/tmap/routes", {
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
    })
      .then((res) => res.json())
      .then((json) => {
        const features = json.features;

        features.forEach((item) => {
          if (item.geometry.type === "LineString") {
            const line = item.geometry.coordinates.map(
              (coord: any) => new Tmapv2.LatLng(coord[1], coord[0])
            );

            new Tmapv2.Polyline({
              path: line,
              strokeColor: "#2D9CFF",
              strokeWeight: 5,
              map,
            });
          }
        });
      });
  }, [destination]);

  return (
    <div className="relative w-full h-full">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-xl shadow"
      >
        ← 뒤로
      </button>

      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
