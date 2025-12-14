import React, { createContext, useContext, useState } from "react";

export type VoiceCommand =
  | { domain: "climate"; action: "temperature"; delta: number }
  | { domain: "seat"; action: string; delta?: number }
  | { domain: "navigation"; action: "set"; destination: string };

const VoiceCommandContext = createContext<{
  command: VoiceCommand | null;
  emit: (cmd: VoiceCommand) => void;
} | null>(null);

export const VoiceCommandProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [command, setCommand] = useState<VoiceCommand | null>(null);

  return (
    <VoiceCommandContext.Provider value={{ command, emit: setCommand }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};

export function useVoiceCommand() {
  const ctx = useContext(VoiceCommandContext);
  if (!ctx) throw new Error("useVoiceCommand must be used within provider");
  return ctx;
}
