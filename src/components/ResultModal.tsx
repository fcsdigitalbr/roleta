import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gift, Trophy, Frown, Loader2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

const WEBHOOK_URL = "https://n8n.clubemkt.digital/webhook-test/roleta-hot";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  idCasalBet: z.string().trim().min(1, "ID é obrigatório").max(50),
  termos: z.literal(true, { errorMap: () => ({ message: "Aceite os termos" }) }),
});

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
  iconColor: string;
}> = {
  isca: {
    icon: Gift,
    title: "Parabéns! 🎉",
    description: "Preencha seus dados para resgatar seu prêmio!",
    iconColor: "text-accent",
  },
  vantagem: {
    icon: Trophy,
    title: "Você ganhou! 🏆",
    description: "Preencha o formulário para receber sua vantagem exclusiva.",
    iconColor: "text-primary",
  },
  vazio: {
    icon: Frown,
    title: "Quase lá! 😔",
    description: "Não foi dessa vez, mas não desista!",
    iconColor: "text-muted-foreground",
  },
};

const ResultModal = ({ open, onOpenChange, result, tipo }: ResultModalProps) => {
  const config = tipoConfig[tipo] || tipoConfig.vazio;
  const Icon = config.icon;
  const isRetry = tipo === "vazio";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [idCasalBet, setIdCasalBet] = useState("");
  const [termos, setTermos] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const parsed = formSchema.safeParse({ nome, email, whatsapp, idCasalBet, termos });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const key = String(e.path[0]);
        fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSending(true);

    try {
      const payload = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        id_casal_bet: parsed.data.idCasalBet,
        premio: result,
        tipo_premio: tipo,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha ao enviar");

      toast.success("Dados enviados com sucesso! 🎉");
      setNome("");
      setEmail("");
      setWhatsapp("");
      setIdCasalBet("");
      setTermos(false);
      onOpenChange(false);
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto p-6 gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-muted flex items-center justify-center ${config.iconColor}`}>
            <Icon className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black uppercase text-foreground text-center">
            {config.title}
          </h2>

          <div className="py-2 px-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-lg font-bold text-primary">{result}</p>
          </div>

          <p className="text-sm text-muted-foreground text-center">{config.description}</p>

          {isRetry ? (
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-4 rounded-lg font-extrabold text-lg tracking-wide uppercase bg-primary text-primary-foreground cta-glow hover:brightness-110 active:scale-[0.98] transition-all duration-300"
            >
              TENTAR NOVAMENTE
            </button>
          ) : (
            <div className="w-full space-y-3 mt-1">
              <div>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputClass}
                  maxLength={100}
                />
                {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  maxLength={255}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={inputClass}
                  maxLength={20}
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Seu ID no Casal da Bet"
                  value={idCasalBet}
                  onChange={(e) => setIdCasalBet(e.target.value)}
                  className={inputClass}
                  maxLength={50}
                />
                {errors.idCasalBet && <p className="text-xs text-destructive mt-1">{errors.idCasalBet}</p>}
              </div>

              <div className="flex items-start gap-3 py-2">
                <Checkbox
                  checked={termos}
                  onCheckedChange={(checked) => setTermos(checked === true)}
                  className="mt-0.5"
                />
                <label className="text-sm text-muted-foreground leading-tight">
                  Aceite os termos para conseguir girar a roleta —{" "}
                  <a href="#" className="text-primary font-medium hover:underline">
                    Ler termos completos
                  </a>
                </label>
                <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              {errors.termos && <p className="text-xs text-destructive -mt-1">{errors.termos}</p>}

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full py-4 rounded-lg font-extrabold text-lg tracking-wide uppercase bg-primary text-primary-foreground cta-glow hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    ENVIANDO...
                  </>
                ) : (
                  "RESGATAR PRÊMIO"
                )}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
