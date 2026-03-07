import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gift, Trophy, Frown } from "lucide-react";

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: string;
  tipo: string;
}

const tipoConfig: Record<string, {
  icon: typeof Gift;
  title: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
  iconColor: string;
}> = {
  isca: {
    icon: Gift,
    title: "Parabéns! 🎉",
    description: "Resgate seu prêmio agora! Clique no botão abaixo para garantir.",
    buttonLabel: "RESGATAR PRÊMIO",
    buttonUrl: "https://exemplo.com/checkout",
    iconColor: "text-accent",
  },
  vantagem: {
    icon: Trophy,
    title: "Você ganhou! 🏆",
    description: "Preencha o formulário para receber sua vantagem exclusiva.",
    buttonLabel: "PREENCHER FORMULÁRIO",
    buttonUrl: "https://exemplo.com/formulario",
    iconColor: "text-primary",
  },
  vazio: {
    icon: Frown,
    title: "Quase lá! 😔",
    description: "Não foi dessa vez, mas não desista!",
    buttonLabel: "TENTAR NOVAMENTE",
    buttonUrl: "",
    iconColor: "text-muted-foreground",
  },
};

const ResultModal = ({ open, onOpenChange, result, tipo }: ResultModalProps) => {
  const config = tipoConfig[tipo] || tipoConfig.vazio;
  const Icon = config.icon;
  const isRetry = tipo === "vazio";

  const handleClick = () => {
    if (isRetry) {
      onOpenChange(false);
    } else {
      window.open(config.buttonUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto text-center p-6 gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center ${config.iconColor}`}>
            <Icon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black uppercase text-foreground">
            {config.title}
          </h2>

          <div className="py-2 px-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-lg font-bold text-primary">{result}</p>
          </div>

          <p className="text-sm text-muted-foreground">{config.description}</p>

          <button
            onClick={handleClick}
            className="w-full py-4 rounded-lg font-extrabold text-lg tracking-wide uppercase bg-primary text-primary-foreground cta-glow hover:brightness-110 active:scale-[0.98] transition-all duration-300"
          >
            {config.buttonLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
