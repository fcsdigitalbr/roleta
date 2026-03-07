import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import heroMobile from "@/assets/hero-mobile.jpeg";
import NotificationBar from "@/components/NotificationBar";
import RouletteWheel from "@/components/RouletteWheel";

const Index = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSpin = useCallback(() => {
    setSpinning(true);
    setResult(null);
  }, []);

  const handleSpinEnd = useCallback((segment: string) => {
    setSpinning(false);
    setResult(segment);

    const isWin = segment.includes("BANQUINHA");
    if (isWin) {
      const end = Date.now() + 3000;
      const colors = ["#7C3AED", "#F59E0B", "#10B981", "#EC4899", "#3B82F6"];
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${heroMobile})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/90" />

      {/* Glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px]" />

      <NotificationBar />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-4 px-4 py-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-foreground text-glow">
            Roleta Casal da Bet
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto">
            Gire a roleta e concorra a prêmios. Tempo limitado!
          </p>
        </div>

        {/* Wheel Section */}
        <div className="flex-shrink-0">
          <RouletteWheel
            spinning={spinning}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
          />
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className={`w-full max-w-xs py-4 rounded-lg font-extrabold text-lg tracking-wide uppercase transition-all duration-300 ${
            !spinning
              ? "bg-primary text-primary-foreground cta-glow hover:brightness-110 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {spinning ? "GIRANDO..." : "GIRAR A ROLETA!"}
        </button>

        {/* Result */}
        {result && (
          <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-bottom-4 w-full max-w-xs">
            <p className="text-lg font-bold text-primary">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
