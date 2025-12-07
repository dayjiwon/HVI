import React from "react";
import { SeatVisualizationUser2 }  from '../../components/SeatVisualizationUser2';
import { ClimateControlUser2 }  from '../../components/ClimateControlUser2';
import { DestinationCardsUser2 }  from '../../components/DestinationCardsUser2';
import { VoiceAssistant } from '../../components/VoiceAssistant';

export default function MainMom() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-6 flex flex-col gap-6">
      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SeatVisualizationUser2 />
        <ClimateControlUser2 />
        <DestinationCardsUser2 />
      </div>
      <VoiceAssistant />
    </div>
  );
}
