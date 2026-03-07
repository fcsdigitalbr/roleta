import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import heroMobile from "@/assets/hero-mobile.jpeg";
import NotificationBar from "@/components/NotificationBar";
import RouletteWheel from "@/components/RouletteWheel";
import ResultModal from "@/components/ResultModal";

const Index = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultTipo, setResultTipo] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleSpin = useCallback(() => {
    setSpinning(true);
    setResult(null);
    setModalOpen(false);
  }, []);

  const handleSpinEnd = useCallback((segment: string, tipo: string) => {
    setSpinning(false);
    setResult(segment);
    setResultTipo(tipo);
    setModalOpen(true);

    const isWin = tipo === "isca" || tipo === "vantagem";
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
        <div className="text-center space-y-3">
          <p className="text-accent text-xs sm:text-sm font-bold uppercase tracking-[0.3em]">
            ⚡ Tempo Limitado ⚡
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-none text-foreground text-glow">
            Roleta <span className="text-primary">Casal da Bet</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Gire e concorra a prêmios exclusivos agora!
          </p>
        </div>

        {/* Wheel Section with center button */}
        <div className="flex-shrink-0 relative">
          <RouletteWheel
            spinning={spinning}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
          />
          {/* Center spin button */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full font-black text-xs sm:text-sm uppercase tracking-wide transition-all duration-300 ${
              !spinning
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(100_85%_40%/0.6)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] hover:scale-110 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed animate-none"
            }`}
          >
            {spinning ? "..." : "GIRAR"}
          </button>
        </div>

      </div>

      {/* Result Modal */}
      {result && (
        <ResultModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          result={result}
          tipo={resultTipo}
        />
      )}
    </div>
  );
};

export default Index;
