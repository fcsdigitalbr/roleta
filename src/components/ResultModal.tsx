import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Gift, Trophy, Frown, Loader2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuiz } from "@/contexts/QuizContext";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
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
    title: "PARABÉNS! 🎉",
    description: "INFORME SEUS E RESGATE SEU PRÊMIO!",
    iconColor: "text-accent",
  },
  vantagem: {
    icon: Trophy,
    title: "PARABÉNS! 🎉",
    description: "INFORME SEUS E RESGATE SEU PRÊMIO!",
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
  const { getWebhookUrl, quizResult } = useQuiz();
  const config = tipoConfig[tipo] || tipoConfig.vazio;
  const Icon = config.icon;
  const isRetry = tipo === "vazio";

  // Customize messages based on quiz result
  const getCustomTitle = () => {
    if (isRetry) return config.title;
    return "PARABÉNS! VOCÊ GANHOU:";
  };

  const getCustomDescription = () => {
    if (isRetry) return config.description;
    return "INFORME SEUS DADOS E RESGATE AGORA!";
  };

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [termos, setTermos] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const parsed = formSchema.safeParse({ nome, whatsapp, termos });

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
      const webhookUrl = getWebhookUrl();
      
      // Skip webhook call if URL is empty (testing mode)
      if (!webhookUrl) {
        console.log('Webhook disabled for testing - skipping API call');
        toast.success("Dados enviados com sucesso! 🎉 (Modo de teste)");
        setNome("");
        setWhatsapp("");
        setTermos(false);
        onOpenChange(false);
        return;
      }

      const payload = {
        nome: parsed.data.nome,
        whatsapp: parsed.data.whatsapp,
        premio: result,
        tipo_premio: tipo,
        quiz_result: quizResult,
        timestamp: new Date().toISOString(),
      };

      console.log('Sending payload to:', webhookUrl);
      console.log('Quiz result:', quizResult);
      console.log('Payload:', payload);

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText || 'Falha ao enviar'}`);
      }

      const responseData = await res.text();
      console.log('Success response:', responseData);

      toast.success("Dados enviados com sucesso! 🎉");
      setNome("");
      setWhatsapp("");
      setTermos(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error(`Erro ao enviar: ${error instanceof Error ? error.message : 'Tente novamente.'}`);
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  // Check if form has data or is being submitted
  const hasFormData = nome.trim() || whatsapp.trim() || termos;
  const shouldPreventClose = !isRetry && (hasFormData || sending);

  // Handle modal close with prevention logic
  const handleOpenChange = (open: boolean) => {
    if (!open && shouldPreventClose) {
      // Prevent closing if form has data or is sending
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="bg-card border-border max-w-sm mx-auto p-6 gap-4"
        aria-describedby="result-description"
      >
        <DialogTitle className="sr-only">
          {config.title}
        </DialogTitle>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-muted flex items-center justify-center ${config.iconColor}`}>
            <Icon className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black uppercase text-foreground text-center">
            {getCustomTitle()}
          </h2>

          {!isRetry && (
            <div className="py-2 px-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-lg font-bold text-primary">{result}</p>
            </div>
          )}

          {isRetry && (
            <div className="py-2 px-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-lg font-bold text-primary">{result}</p>
            </div>
          )}

          <p id="result-description" className="text-sm text-muted-foreground text-center">{getCustomDescription()}</p>

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
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={whatsapp}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
                    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
                    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
                    else if (v.length > 0) v = `(${v}`;
                    setWhatsapp(v);
                  }}
                  className={inputClass}
                  maxLength={16}
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
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
