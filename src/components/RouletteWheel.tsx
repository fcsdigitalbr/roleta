import { useRef, useState, useCallback, useEffect } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { MEMBRO_SEGMENTS, sortearComPesoMembro, WheelSegment } from "@/config/roulette-membro";
import { NOVO_SEGMENTS, sortearComPesoNovo } from "@/config/roulette-novo";

interface RouletteWheelProps {
  onSpinEnd?: (segment: string, tipo: string) => void;
  spinning: boolean;
  onSpin: () => void;
}

const RouletteWheel = ({ spinning, onSpin, onSpinEnd }: RouletteWheelProps) => {
  const { quizResult } = useQuiz();
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isSpinning = useRef(false);

  // Get the appropriate segments based on quiz result (fallback to NOVO for testing)
  const segments = quizResult === 'MEMBRO' ? MEMBRO_SEGMENTS : NOVO_SEGMENTS;
  const sortearComPeso = quizResult === 'MEMBRO' ? sortearComPesoMembro : sortearComPesoNovo;

  // Add safety check for segments
  if (!segments || segments.length === 0) {
    console.error('No segments available for roulette');
    return <div>Error: No roulette segments available</div>;
  }

  const handleSpin = useCallback(() => {
    if (isSpinning.current) return;
    
    try {
      isSpinning.current = true;

      // 1. Backend decides the winner
      const resultado = sortearComPeso();
      if (!resultado) {
        console.error('No result from sortearComPeso');
        isSpinning.current = false;
        return;
      }
      
      const indiceVencedor = segments.findIndex(seg => seg.label === resultado.label);
      if (indiceVencedor === -1) {
        console.error('Winner segment not found in segments array');
        isSpinning.current = false;
        return;
      }

      // 2. Calculate angle to land on winning segment
      const grausPorFatia = 360 / segments.length;
      const anguloAlvo = 360 - (indiceVencedor * grausPorFatia);
      
      // Add more random variation to land within the segment, not at edges
      const segmentCenter = grausPorFatia / 2; // Center of the segment
      const maxVariation = grausPorFatia * 0.3; // 30% of segment width
      const variacaoAleatoria = (Math.random() - 0.5) * maxVariation; // Random within ±30% of segment
      const anguloFinal = anguloAlvo - segmentCenter + variacaoAleatoria;
      
      const girosDeSuspense = 5 * 360;

      const totalRotation = girosDeSuspense + anguloFinal;

      setRotation(prev => prev + totalRotation);
      onSpin();

      // 3. Wait for animation to finish
      setTimeout(() => {
        isSpinning.current = false;
        onSpinEnd?.(resultado.label, resultado.tipo);
      }, 5000);
    } catch (error) {
      console.error('Error in handleSpin:', error);
      isSpinning.current = false;
    }
  }, [onSpin, onSpinEnd, segments, sortearComPeso]);

  // Allow external spin trigger
  useEffect(() => {
    if (spinning && !isSpinning.current) {
      handleSpin();
    }
  }, [spinning, handleSpin]);

  const segmentAngle = 360 / segments.length;

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px]">
      {/* Outer glow ring */}
      <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-secondary/40 to-accent/20 blur-xl" />

      {/* Wheel border */}
      <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-accent via-secondary to-accent p-1">
        <div className="w-full h-full rounded-full bg-background" />
      </div>

      {/* Pointer */}
      <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div
          className="w-0 h-0 animate-pulse-ring"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "30px solid hsl(0, 80%, 50%)",
            filter: "drop-shadow(0 0 8px hsl(0 80% 50% / 0.6))",
          }}
        />
        <div className="w-3 h-3 rounded-full bg-accent shadow-lg -mt-1" />
      </div>

      {/* Wheel SVG */}
      <div
        ref={wheelRef}
        className="absolute inset-1 rounded-full overflow-hidden"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "none",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {segments.map((seg, i) => {
            const startAngle = i * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 100 + 98 * Math.cos(startRad);
            const y1 = 100 + 98 * Math.sin(startRad);
            const x2 = 100 + 98 * Math.cos(endRad);
            const y2 = 100 + 98 * Math.sin(endRad);
            const largeArc = segmentAngle > 180 ? 1 : 0;
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle * Math.PI) / 180;
            const textX = 100 + 60 * Math.cos(midRad);
            const textY = 100 + 60 * Math.sin(midRad);

            return (
              <g key={i}>
                <path
                  d={`M100,100 L${x1},${y1} A98,98 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={seg.color}
                  stroke="hsl(240 30% 8%)"
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                  fill="white"
                  fontSize="6"
                  fontWeight="700"
                  fontFamily="Montserrat, sans-serif"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {seg.label.length > 16
                    ? seg.label.substring(0, 16) + "..."
                    : seg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center hub - now just a transparent area for the external button */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
      </div>
    </div>
  );
};

export default RouletteWheel;
