import { useRef, useState, useCallback, useEffect } from "react";

interface WheelSegment {
  label: string;
  color: string;
  probabilidade: number;
  tipo: "isca" | "vantagem" | "vazio" | "apenas_ilustracao";
}

const segments: WheelSegment[] = [
  { label: "30 giros no touro", color: "#10B981", probabilidade: 20, tipo: "isca" },
  { label: "50 giros no coelho", color: "#F59E0B", probabilidade: 20, tipo: "isca" },
  { label: "100 giros no tigre", color: "#7C3AED", probabilidade: 30, tipo: "isca" },
  { label: "Grupo de sinais", color: "#06B6D4", probabilidade: 5, tipo: "vazio" },
  { label: "Banca de R$100", color: "#EF4444", probabilidade: 0, tipo: "apenas_ilustracao" },
  { label: "Você está sem sorte", color: "#EC4899", probabilidade: 5, tipo: "vazio" },
  { label: "Tente outra vez", color: "#F59E0B", probabilidade: 5, tipo: "vazio" },
  { label: "Dobra de banca", color: "#3B82F6", probabilidade: 5, tipo: "vantagem" },
  { label: "Gorjeta R$30,00", color: "#8B5CF6", probabilidade: 5, tipo: "vantagem" },
  { label: "Grupo VIP do Casal", color: "#22C55E", probabilidade: 5, tipo: "vantagem" },
];

function sortearComPeso(): WheelSegment {
  const pesoTotal = segments.reduce((acc, s) => acc + s.probabilidade, 0);
  const rand = Math.random() * pesoTotal;
  let soma = 0;
  for (const seg of segments) {
    soma += seg.probabilidade;
    if (rand <= soma) return seg;
  }
  return segments[0];
}

interface RouletteWheelProps {
  onSpinEnd?: (segment: string, tipo: string) => void;
  spinning: boolean;
  onSpin: () => void;
}

const RouletteWheel = ({ spinning, onSpin, onSpinEnd }: RouletteWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isSpinning = useRef(false);

  const handleSpin = useCallback(() => {
    if (isSpinning.current) return;
    isSpinning.current = true;

    // 1. Backend decides the winner
    const resultado = sortearComPeso();
    const indiceVencedor = segments.indexOf(resultado);

    // 2. Calculate angle to land on winning segment
    const grausPorFatia = 360 / segments.length;
    const anguloAlvo = 360 - (indiceVencedor * grausPorFatia);
    const variacaoAleatoria = Math.floor(Math.random() * 30) - 15;
    const girosDeSuspense = 5 * 360;

    const totalRotation = girosDeSuspense + anguloAlvo + variacaoAleatoria;

    setRotation(prev => prev + totalRotation);
    onSpin();

    // 3. Wait for animation to finish
    setTimeout(() => {
      isSpinning.current = false;
      onSpinEnd?.(resultado.label, resultado.tipo);
    }, 5000);
  }, [onSpin, onSpinEnd]);

  // Allow external spin trigger
  useEffect(() => {
    if (spinning && !isSpinning.current) {
      handleSpin();
    }
  }, [spinning, handleSpin]);

  const segmentAngle = 360 / segments.length;

  return (
    <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px]">
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
                  fontSize="5"
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
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
      </div>
    </div>
  );
};

export default RouletteWheel;
