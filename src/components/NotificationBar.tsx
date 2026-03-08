import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";

const names = [
  "Camila", "Lucas", "Fernanda", "João", "Ana Paula",
  "Pedro", "Mariana", "Rafael", "Juliana", "Bruno",
];

const membroPrizes = [
  "ganhou PROMO VIP!",
  "ganhou desconto VIP exclusivo!",
  "conquistou oferta especial!",
  "ganhou acesso VIP!",
  "vai tentar novamente!",
  "quase conseguiu, tente mais!",
];

const novoPrizes = [
  "ganhou 100 giros 🐅!",
  "ganhou 50 giros 🐰!",
  "ganhou 30 giros 🐂!",
  "entrou no Grupo VIP!",
  "ganhou gorjeta de R$30!",
  "dobrou a banca!",
];

const NotificationBar = () => {
  const { quizResult } = useQuiz();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const prizes = quizResult === 'MEMBRO' ? membroPrizes : novoPrizes;

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % names.length);
          setVisible(true);
        }, 600); // Increased from 400ms to 600ms for smoother transition
      }, 6000); // Increased from 3500ms to 6000ms (6 seconds)
      return () => clearInterval(interval);
    } catch (error) {
      console.warn('NotificationBar animation failed:', error);
    }
  }, []);

  // Safety check for array bounds
  const currentName = names[index] || names[0];
  const currentPrize = prizes[index % prizes.length] || prizes[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-2 pointer-events-none">
      <div
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Gift className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-foreground">
          {currentName} {currentPrize}
        </span>
      </div>
    </div>
  );
};

export default NotificationBar;
