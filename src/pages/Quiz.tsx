import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { playTickSound } from "@/hooks/useSoundEffects";
import casaldabetLogo from "@/assets/casaldabet-logo.webp";

interface QuizOption {
  texto: string;
  ramo?: "MEMBRO" | "NOVO";
}

interface QuizStep {
  id: number;
  pergunta: string;
  opcoes: QuizOption[];
  ramificacao?: boolean;
}

const QUIZ_STEPS: QuizStep[] = [
  {
    id: 1,
    pergunta: "Qual tipo de jogo você mais curte?",
    opcoes: [
      { texto: "Slots" },
      { texto: "Cassino ao vivo" },
      { texto: "Apostas esportivas" },
      { texto: "Um pouco de tudo" },
    ],
  },
  {
    id: 2,
    pergunta: "Com que frequência você joga?",
    opcoes: [
      { texto: "Todo dia" },
      { texto: "Algumas vezes na semana" },
      { texto: "De vez em quando" },
      { texto: "Só para experimentar" },
    ],
  },
  {
    id: 3,
    pergunta: "O que mais importa para você numa casa de apostas?",
    opcoes: [
      { texto: "Bônus e promoções" },
      { texto: "Variedade de jogos" },
      { texto: "Segurança e confiança" },
      { texto: "Atendimento e suporte" },
    ],
  },
  {
    id: 4,
    pergunta: "Você costuma seguir dicas de influenciadores?",
    opcoes: [
      { texto: "Sim, sempre" },
      { texto: "Às vezes" },
      { texto: "Raramente" },
      { texto: "Não" },
    ],
  },
  {
    id: 5,
    pergunta: "Já participou de promoções exclusivas com criadores de conteúdo?",
    opcoes: [
      { texto: "Sim, várias vezes" },
      { texto: "Uma ou duas vezes" },
      { texto: "Nunca, mas tenho interesse" },
      { texto: "Não me interessa" },
    ],
  },
  {
    id: 6,
    ramificacao: true,
    pergunta: "Você já acompanha o CasaldaBet e joga slots com a gente?",
    opcoes: [
      { texto: "Sim, já jogo com vocês", ramo: "MEMBRO" },
      { texto: "Não, ainda não conheço", ramo: "NOVO" },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const { setQuizResult } = useQuiz();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuizStep = QUIZ_STEPS.find(step => step.id === currentStep);
  const progress = (currentStep / QUIZ_STEPS.length) * 100;

  const handleOptionClick = (option: QuizOption) => {
    try {
      playTickSound();
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
    
    // Store the answer
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = option.texto;
    setAnswers(newAnswers);

    // If this is the branching question, redirect to roulette
    if (currentQuizStep?.ramificacao && option.ramo) {
      setQuizResult(option.ramo);
      navigate("/roulette", { replace: true });
      return;
    }

    // Move to next step
    if (currentStep < QUIZ_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!currentQuizStep) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" 
         style={{ 
           background: "linear-gradient(135deg, hsl(260 70% 15%), hsl(240 50% 10%), hsl(280 60% 12%))" 
         }}>
      <div className="w-full max-w-[375px] mx-auto">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 border border-border shadow-2xl">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Logo */}
          <div className="text-center mb-6">
            <img 
              src={casaldabetLogo} 
              alt="Casal da Bet" 
              className="w-32 h-auto mx-auto mb-4"
            />
            <h1 className="text-xl font-black text-primary">QUIZ PREMIADO</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Etapa {currentStep} de {QUIZ_STEPS.length}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground text-center leading-relaxed">
              {currentQuizStep.pergunta}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuizStep.opcoes.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full p-4 text-left rounded-xl border-2 border-primary/20 bg-primary/5 text-foreground font-medium transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                {option.texto}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                Voltar
              </button>
            ) : (
              <div />
            )}
            
            <div className="text-xs text-muted-foreground">
              {currentStep}/{QUIZ_STEPS.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;