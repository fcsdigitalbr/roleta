/**
 * Configuração da Roleta para NOVO (quem não joga ainda)
 * Roleta de Aquisição - Foco em conversão com alta probabilidade de giros grátis
 */

export interface WheelSegment {
  label: string;
  color: string;
  probabilidade: number;
  tipo: "isca" | "vantagem" | "vazio" | "apenas_ilustracao";
}

export const NOVO_SEGMENTS: WheelSegment[] = [
  // 70% Chance - The Hook (Free Spins) - WINNABLE
  { label: "100 giros 🐅", color: "#10B981", probabilidade: 30, tipo: "isca" }, // Green - 30%
  { label: "50 giros 🐰", color: "#EF4444", probabilidade: 20, tipo: "isca" }, // Red - 20%
  { label: "30 giros 🐂", color: "#3B82F6", probabilidade: 20, tipo: "isca" }, // Blue - 20%
  
  // 15% Chance - The Perks - WINNABLE
  { label: "Grupo VIP do Casal", color: "#F59E0B", probabilidade: 5, tipo: "vantagem" }, // Orange - 5%
  { label: "Gorjeta de R$30,00", color: "#8B5CF6", probabilidade: 5, tipo: "vantagem" }, // Purple - 5%
  { label: "Dobra de banca", color: "#06B6D4", probabilidade: 5, tipo: "vantagem" }, // Cyan - 5%
  
  // 15% Chance - The Blanks - WINNABLE
  { label: "Tente outra vez", color: "#EC4899", probabilidade: 5, tipo: "vazio" }, // Pink - 5%
  { label: "Você está sem sorte", color: "#22C55E", probabilidade: 5, tipo: "vazio" }, // Emerald - 5%
  { label: "Grupo de sinais", color: "#7C3AED", probabilidade: 5, tipo: "vazio" }, // Violet - 5%
  
  // 0% Chance - Visual Only (NEVER WIN)
  { label: "Banca de R$100", color: "#DC2626", probabilidade: 0, tipo: "apenas_ilustracao" }, // Dark Red - 0%
];

export function sortearComPesoNovo(): WheelSegment {
  const pesoTotal = NOVO_SEGMENTS.reduce((acc, s) => acc + s.probabilidade, 0);
  const rand = Math.random() * pesoTotal;
  let soma = 0;
  for (const seg of NOVO_SEGMENTS) {
    soma += seg.probabilidade;
    if (rand <= soma) return seg;
  }
  return NOVO_SEGMENTS[0];
}