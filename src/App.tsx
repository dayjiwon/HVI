import SeatVisualization from "./components/SeatVisualization.tsx";
import ClimateControl from "./components/ClimateControl.tsx";
import DestinationCards from "./components/DestinationCards.tsx";
import VoiceInteraction from "./components/VoiceInteraction.tsx";

export default function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#F7F8FA] to-[#E8EBEF] flex flex-col overflow-hidden">
      {/* Main Content - Three Section Layout */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Left Section - 3D Seat Visualization */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
          <SeatVisualization />
        </div>

        {/* Center Section - Climate Controls */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
          <ClimateControl />
        </div>

        {/* Right Section - Destination Cards */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />
          <DestinationCards />
        </div>
      </div>

      {/* Bottom Section - Voice Interaction */}
      <div className="h-32 px-6 pb-6">
        <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden">
          <VoiceInteraction />
        </div>
      </div>
    </div>
  );
}
