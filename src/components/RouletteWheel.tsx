import { useRef, useState, useCallback } from "react";

interface WheelSegment {
  label: string;
  color: string;
}

const segments: WheelSegment[] = [
  { label: "BANQUINHA DE 100", color: "#7C3AED" },
  { label: "Faltou pouco", color: "#F59E0B" },
  { label: "BANQUINHA DE 100", color: "#10B981" },
  { label: "Não foi dessa vez", color: "#EC4899" },
  { label: "BANQUINHA DE 100", color: "#3B82F6" },
  { label: "Foi quase!", color: "#EF4444" },
  { label: "Sem sorte", color: "#F59E0B" },
  { label: "BANQUINHA DE 100", color: "#8B5CF6" },
  { label: "Sem prêmio", color: "#06B6D4" },
  { label: "BANQUINHA DE 100", color: "#22C55E" },
];

interface RouletteWheelProps {
  onSpinEnd?: (segment: string) => void;
  spinning: boolean;
  onSpin: () => void;
}

const RouletteWheel = ({ spinning, onSpin, onSpinEnd }: RouletteWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const hasSpun = useRef(false);

  const handleSpin = useCallback(() => {
    if (spinning || hasSpun.current) return;
    hasSpun.current = true;
    
    const extraSpins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = extraSpins * 360 + randomAngle;
    
    setRotation(prev => prev + totalRotation);
    onSpin();

    setTimeout(() => {
      const finalAngle = (rotation + totalRotation) % 360;
      const segmentAngle = 360 / segments.length;
      const index = Math.floor((360 - finalAngle) / segmentAngle) % segments.length;
      onSpinEnd?.(segments[index].label);
    }, 4500);
  }, [spinning, rotation, onSpin, onSpinEnd]);

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
            ? "transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
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
                  fontSize="5.5"
                  fontWeight="700"
                  fontFamily="Montserrat, sans-serif"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {seg.label.length > 14
                    ? seg.label.substring(0, 14) + "..."
                    : seg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center hub */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-accent to-primary shadow-lg border-2 border-accent/50" />
      </div>
    </div>
  );
};

export default RouletteWheel;
