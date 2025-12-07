import React from "react";
import SeatVisualization from "../../components/SeatVisualization";
import ClimateControl from "../../components/ClimateControl";
import DestinationCards from "../../components/DestinationCards";
import VoiceInteraction from "../../components/VoiceInteraction";

export default function MainDad() {
    // 2. 기존 메인 UI 렌더링
    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF] flex flex-col overflow-hidden">
            <div className="flex-1 grid grid-cols-3 gap-6 p-6">
                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
                    <SeatVisualization />
                </div>

                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
                    <ClimateControl />
                </div>

                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
                    <DestinationCards />
                </div>
            </div>

            <div className="h-32 px-6 pb-6">
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden">
                    <VoiceInteraction />
                </div>
            </div>
        </div>
    );
}