import React, { useState, useRef } from "react";
import {
  ROULETTE_SEGMENTS,
  getSegmentByRotation,
  winningsTracker,
} from "@/lib/winnings.config";
import { Button } from "@/components/ui/button";

interface RouletteWheelProps {
  onWin?: (segmentId: number, prize: string | number) => void;
  spinDuration?: number;
  imageUrl?: string;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  onWin,
  spinDuration = 5,
  imageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663197515415/JugVXacUrMKFhH9oD48fk7/roulette-wheel_a6addeba.png",
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Selecionar um segmento aleatório
    const randomSegmentId = Math.floor(Math.random() * ROULETTE_SEGMENTS.length);
    const segment = ROULETTE_SEGMENTS[randomSegmentId];
    
    // Calcular rotação padronizada: sempre girar no sentido horário
    const currentRotationNormalized = ((rotation % 360) + 360) % 360;
    const targetAngle = segment.angle + 15;
    
    let fullRotations = Math.ceil((currentRotationNormalized - targetAngle) / 360);
    if (fullRotations <= 0) fullRotations = 1;
    
    const targetRotation = targetAngle + 360 * fullRotations;

    // Animar a rotação
    const startRotation = rotation;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (spinDuration * 1000), 1);

      // Easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Finalizar a animação
        setRotation(targetRotation);
        setIsSpinning(false);

        // Determinar o segmento vencedor
        const winningSegment = getSegmentByRotation(targetRotation);
        if (winningSegment) {
          winningsTracker.addWin(winningSegment.id, targetRotation);
          onWin?.(winningSegment.id, winningSegment.prize);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Container da Roleta */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96">
        {/* Delimitador Vermelho (Topo) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-600"></div>
          <div className="w-1 h-4 bg-red-600"></div>
        </div>

        {/* Imagem da Roleta com Rotação */}
        <div
          ref={wheelRef}
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${imageUrl}')`,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "0ms" : "0ms",
          }}
        />
      </div>

      {/* Botão de Girar */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning}
        size="lg"
        className="px-8 py-3 text-base font-bold mt-4"
      >
        {isSpinning ? "Girando..." : "Girar"}
      </Button>
    </div>
  );
};

export default RouletteWheel;
