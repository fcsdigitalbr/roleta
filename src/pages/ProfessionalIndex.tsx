import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import heroMobile from "@/assets/hero-mobile.jpeg";
import NotificationBar from "@/components/NotificationBar";
import CountdownTimer from "@/components/CountdownTimer";
import RouletteWheel from "@/components/RouletteWheel";
import ResultModal from "@/components/ResultModal";
import DailyLimitReached from "@/components/DailyLimitReached";
import { playSpinSound, playWinSound, playLoseSound } from "@/hooks/useSoundEffects";
import { useQuiz } from "@/contexts/QuizContext";
import { useDailyLimit } from "@/hooks/useDailyLimit";

const ProfessionalIndex = () => {
  const navigate = useNavigate();
  const { quizResult } = useQuiz();
  const { canUse, timeUntilReset, recordUsage } = useDailyLimit();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultTipo, setResultTipo] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // All hooks must be called before any early returns
  const handleSpin = useCallback(() => {
    // Record usage before spinning
    const usageRecorded = recordUsage();
    if (!usageRecorded) {
      return;
    }

    setSpinning(true);
    setResult(null);
    setModalOpen(false);
    
    try {
      playSpinSound();
    } catch (error) {
      console.warn('Spin sound failed:', error);
    }
  }, [recordUsage]);

  const handleSpinEnd = useCallback((segment: string, tipo: string) => {
    setSpinning(false);
    setResult(segment);
    setResultTipo(tipo);
    setModalOpen(true);

    const isWin = tipo === "isca" || tipo === "vantagem";
    
    // Only show confetti if user can still use the roulette (not at daily limit)
    if (isWin && canUse) {
      try {
        playWinSound();
      } catch (error) {
        console.warn('Win sound failed:', error);
      }
      
      const end = Date.now() + 1200;
      const colors = ["#7C3AED", "#F59E0B", "#10B981", "#EC4899", "#3B82F6", "#22C55E"];
      
      const frame = () => {
        try {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 45,
            origin: { x: 0.2, y: 0.6 },
            colors,
            scalar: 0.7,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 45,
            origin: { x: 0.8, y: 0.6 },
            colors,
            scalar: 0.7,
          });
          confetti({
            particleCount: 2,
            angle: 90,
            spread: 35,
            origin: { x: 0.5, y: 0.4 },
            colors,
            scalar: 0.6,
          });
        } catch (error) {
          console.warn('Confetti failed:', error);
        }
        
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else if (isWin && !canUse) {
      // Play win sound but no confetti when daily limit reached
      try {
        playWinSound();
      } catch (error) {
        console.warn('Win sound failed:', error);
      }
    } else {
      try {
        playLoseSound();
      } catch (error) {
        console.warn('Lose sound failed:', error);
      }
    }
  }, [canUse]);

  const handleReturnToQuiz = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Redirect to quiz if no result
  useEffect(() => {
    if (!quizResult) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [quizResult, navigate]);

  // Show loading state while checking quiz result
  if (isLoading || !quizResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show daily limit screen if user can't use roulette
  if (!canUse) {
    return <DailyLimitReached timeUntilReset={timeUntilReset} onReturnToQuiz={handleReturnToQuiz} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center bg-background">
      {/* Constrained container for mobile-sized layout */}
      <div className="mobile-container relative w-full max-w-[375px] mx-auto min-h-screen overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${heroMobile})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/90" />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px]" />

        <NotificationBar />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-3 px-6 py-6">
          {/* Countdown */}
          <CountdownTimer />

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase leading-none text-foreground text-glow">
              <span className="text-primary">QUIZ PREMIADO</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Gire e concorra a prêmios exclusivos agora!
            </p>
          </div>

          {/* Original Custom Wheel - Properly Sized */}
          <div className="flex-shrink-0 relative" style={{ marginTop: '10px' }}>
            <RouletteWheel
              spinning={spinning}
              onSpin={handleSpin}
              onSpinEnd={handleSpinEnd}
            />
            
            {/* Center spin button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black text-xs sm:text-sm uppercase tracking-wide transition-all duration-300 ${
                !spinning
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-2xl animate-smooth-pulse hover:scale-110 active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed animate-none"
              }`}
              style={{
                filter: !spinning 
                  ? "drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 40px rgba(251, 191, 36, 0.4))"
                  : "none"
              }}
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
    </div>
  );
};

export default ProfessionalIndex;