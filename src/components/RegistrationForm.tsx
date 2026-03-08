import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";

interface RegistrationFormProps {
  onSubmit: () => void;
  disabled: boolean;
}

const RegistrationForm = ({ onSubmit, disabled }: RegistrationFormProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [userId, setUserId] = useState("");
  const [accepted, setAccepted] = useState(false);

  const isValid = name && whatsapp && userId && accepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !disabled) onSubmit();
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 font-medium text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nome Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        type="tel"
        placeholder="WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        className={inputClass}
      />
      <input
        type="text"
        placeholder="Seu ID no Casal da Bet"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className={inputClass}
      />

      {/* Terms checkbox */}
      <label className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border cursor-pointer group hover:bg-muted/50 transition-colors">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              accepted
                ? "bg-primary border-primary"
                : "border-muted-foreground/40 group-hover:border-muted-foreground"
            }`}
          >
            {accepted && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
        </div>
        <span className="text-sm text-muted-foreground flex-1">
          Aceito os termos e condições da promoção
        </span>
        <HelpCircle className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid || disabled}
        className={`w-full py-4 rounded-lg font-extrabold text-lg tracking-wide uppercase transition-all duration-300 ${
          isValid && !disabled
            ? "bg-primary text-primary-foreground cta-glow hover:brightness-110 active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {disabled ? "GIRANDO..." : "GIRAR A ROLETA!"}
      </button>
    </form>
  );
};

export default RegistrationForm;
