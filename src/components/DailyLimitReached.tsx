import { Clock, RotateCcw } from "lucide-react";

interface DailyLimitReachedProps {
  timeUntilReset: string;
  onReturnToQuiz: () => void;
}

const DailyLimitReached = ({ timeUntilReset, onReturnToQuiz }: DailyLimitReachedProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center bg-background">
      <div className="mobile-container relative w-full max-w-[375px] mx-auto min-h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/90" />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px]" />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
            <Clock className="w-10 h-10 text-muted-foreground" />
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase leading-none text-foreground">
              Limite Diário <span className="text-primary">Atingido</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
              Você já usou a roleta hoje. Volte amanhã para uma nova chance de ganhar prêmios incríveis!
            </p>
          </div>

          {/* Time until reset */}
          {timeUntilReset && (
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Próxima tentativa em:</p>
              <p className="text-xl font-bold text-primary">{timeUntilReset}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={onReturnToQuiz}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Refazer Quiz
            </button>
            
            <p className="text-xs text-muted-foreground text-center">
              Refaça o quiz para descobrir novos prêmios disponíveis amanhã
            </p>
          </div>

          {/* Footer message */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground opacity-75">
              Limite: 1 tentativa por dia • Redefine à meia-noite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLimitReached;