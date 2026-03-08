import { useState } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import RouletteWheel from "@/components/RouletteWheel";
import { MEMBRO_SEGMENTS } from "@/config/roulette-membro";
import { NOVO_SEGMENTS } from "@/config/roulette-novo";

const TestRoulettes = () => {
  const { quizResult, setQuizResult } = useQuiz();
  const { canUse, usageCount, maxUses, timeUntilReset, resetUsage } = useDailyLimit();
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
  };

  const handleSpinEnd = (segment: string, tipo: string) => {
    setSpinning(false);
    console.log('Resultado:', segment, tipo);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Test Roulettes</h1>
        <p className="text-center text-muted-foreground mb-4">
          Images in source-roulette folder are for development reference only
        </p>
        
        {/* Daily Limit Status */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8">
          <h3 className="font-semibold mb-2">Daily Limit Status</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Usage: {usageCount}/{maxUses} • Can use: {canUse ? 'Yes' : 'No'}
          </p>
          {timeUntilReset && (
            <p className="text-sm text-muted-foreground mb-2">
              Reset in: {timeUntilReset}
            </p>
          )}
          <button
            onClick={resetUsage}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
          >
            Reset Daily Limit (Dev Only)
          </button>
        </div>
        
        {/* Quiz Result Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setQuizResult('MEMBRO')}
            className={`px-6 py-3 rounded-lg font-bold ${
              quizResult === 'MEMBRO' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Existing User (High VIP Chance)
          </button>
          <button
            onClick={() => setQuizResult('NOVO')}
            className={`px-6 py-3 rounded-lg font-bold ${
              quizResult === 'NOVO' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            New User (High Free Spins)
          </button>
        </div>

        {/* Current Configuration Display */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Current Configuration: {quizResult === 'MEMBRO' ? 'Existing User Wheel' : 'New User Wheel'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Segments List */}
            <div>
              <h3 className="text-lg font-medium mb-4">Wheel Segments:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(quizResult === 'MEMBRO' ? MEMBRO_SEGMENTS : NOVO_SEGMENTS).map((segment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded border"
                    style={{ borderColor: segment.color }}
                  >
                    <span className="text-sm">{segment.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {segment.probabilidade}%
                      </span>
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: segment.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roulette Wheel */}
            <div className="flex flex-col items-center">
              <RouletteWheel
                spinning={spinning}
                onSpin={handleSpin}
                onSpinEnd={handleSpinEnd}
              />
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50"
              >
                {spinning ? 'Girando...' : 'Girar Roleta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRoulettes;