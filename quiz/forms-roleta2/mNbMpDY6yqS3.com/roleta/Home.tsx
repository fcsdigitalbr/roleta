import React, { useState } from "react";
import RouletteWheel from "@/components/RouletteWheel";

export default function Home() {
  const [lastWinner, setLastWinner] = useState<{
    segmentId: number;
    prize: string | number;
  } | null>(null);

  const handleWin = (segmentId: number, prize: string | number) => {
    setLastWinner({ segmentId, prize });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RouletteWheel onWin={handleWin} spinDuration={5} />
      </div>
    </div>
  );
}
