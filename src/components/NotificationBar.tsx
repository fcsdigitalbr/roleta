import { useState, useEffect } from "react";
import { Gift } from "lucide-react";

const names = [
  "Camila", "Lucas", "Fernanda", "João", "Ana Paula",
  "Pedro", "Mariana", "Rafael", "Juliana", "Bruno",
];

const prizes = [
  "ganhou créditos extras!",
  "ganhou bônus de 50!",
  "ganhou uma rodada grátis!",
  "ganhou créditos extras!",
  "ganhou bônus especial!",
];

const NotificationBar = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % names.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-2 pointer-events-none">
      <div
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Gift className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-foreground">
          {names[index]} {prizes[index % prizes.length]}
        </span>
      </div>
    </div>
  );
};

export default NotificationBar;
