import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { MEMBRO_SEGMENTS, sortearComPesoMembro } from "@/config/roulette-membro";
import { NOVO_SEGMENTS, sortearComPesoNovo } from "@/config/roulette-novo";

const WorkingRoulette = () => {
  const navigate = useNavigate();
  const { quizResult } = useQuiz();
  const { canUse, timeUntilReset } = useDailyLimit();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultTipo, setResultTipo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to quiz if no result
  React.useEffect(() => {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-4">Limite Diário Atingido</h2>
          <p className="text-muted-foreground mb-4">Volte em: {timeUntilReset}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Voltar ao Quiz
          </button>
        </div>
      </div>
    );
  }

  const handleSpin = useCallback(() => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    // Get the appropriate segments and function
    const segments = quizResult === 'MEMBRO' ? MEMBRO_SEGMENTS : NOVO_SEGMENTS;
    const sortearComPeso = quizResult === 'MEMBRO' ? sortearComPesoMembro : sortearComPesoNovo;
    
    // Simulate spin delay
    setTimeout(() => {
      try {
        const resultado = sortearComPeso();
        setResult(resultado.label);
        setResultTipo(resultado.tipo);
        setSpinning(false);
        console.log('Spin result:', resultado);
      } catch (error) {
        console.error('Spin error:', error);
        setSpinning(false);
      }
    }, 3000);
  }, [spinning, quizResult]);

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center bg-background">
      <div className="mobile-container relative w-full max-w-[375px] mx-auto min-h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/90" />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-6">
          
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase leading-none text-foreground">
              <span className="text-primary">QUIZ PREMIADO</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Gire e concorra a prêmios exclusivos agora!
            </p>
            <p className="text-xs text-muted-foreground">
              Tipo: {quizResult}
            </p>
          </div>

          {/* Simple Wheel */}
          <div className="relative">
            <div style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: '4px solid hsl(var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'hsl(var(--card))',
              transform: spinning ? 'rotate(1800deg)' : 'rotate(0deg)',
              transition: spinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
              position: 'relative'
            }}>
              {/* Pointer */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '24px solid hsl(var(--destructive))',
                zIndex: 10
              }} />
              
              {/* Center content */}
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {spinning ? '🎰' : '🎯'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {spinning ? 'Girando...' : 'Clique para girar'}
                </div>
              </div>
            </div>

            {/* Center spin button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black text-xs sm:text-sm uppercase tracking-wide transition-all duration-300 ${
                !spinning
                  ? "bg-primary text-primary-foreground hover:scale-110 active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {spinning ? "..." : "GIRAR"}
            </button>
          </div>

          {/* Result Display */}
          {result && !spinning && (
            <div className="text-center space-y-4 max-w-sm">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {resultTipo === 'vazio' ? 'Tente Novamente!' : 'PARABÉNS! VOCÊ GANHOU:'}
                </h3>
                <p className="text-foreground font-medium">{result}</p>
                
                {resultTipo !== 'vazio' && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-muted-foreground">INFORME SEUS DADOS E RESGATE AGORA!</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nome Completo"
                        className="w-full px-3 py-2 rounded bg-background border border-border text-foreground text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 rounded bg-background border border-border text-foreground text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        className="w-full px-3 py-2 rounded bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <button className="w-full py-2 bg-primary text-primary-foreground rounded font-bold text-sm">
                      RESGATAR PRÊMIO
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  setResult(null);
                  setResultTipo('');
                }}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                {resultTipo === 'vazio' ? 'TENTAR NOVAMENTE' : 'Fechar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingRoulette;