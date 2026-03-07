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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end lg:justify-center lg:flex-row gap-6 lg:gap-16 px-4 pb-8 pt-[55vh] sm:pt-[45vh] lg:py-20">
        {/* Wheel Section */}
        <div className="flex-shrink-0 order-2 lg:order-1">
          <RouletteWheel
            spinning={spinning}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
          />
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md space-y-4 order-1 lg:order-2">
          {/* Title */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase leading-tight text-foreground text-glow">
              Roleta Casal da Bet
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base max-w-sm mx-auto lg:mx-0">
              Cadastre-se, gire a roleta e concorra a prêmios. Tempo limitado!
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-4 sm:p-6 box-glow">
            <RegistrationForm onSubmit={handleSpin} disabled={spinning} />
          </div>

          {/* Result */}
          {result && (
            <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-lg font-bold text-primary">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
