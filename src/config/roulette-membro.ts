/**
 * Configuração da Roleta para MEMBRO (quem já joga)
 * Roleta de Retenção/Monetização - Foco em upsell VIP e perdas
 */

export interface WheelSegment {
  label: string;
  color: string;
  probabilidade: number;
  tipo: "isca" | "vantagem" | "vazio" | "apenas_ilustracao";
}

export const MEMBRO_SEGMENTS: WheelSegment[] = [
  // 70% Chance - The Upsell - WINNABLE
  { label: "PROMO VIP", color: "#10B981", probabilidade: 35, tipo: "vantagem" }, // Green - 35%
  { label: "PROMO VIP", color: "#3B82F6", probabilidade: 35, tipo: "vantagem" }, // Blue - 35%
  
  // 30% Chance - The Blanks - WINNABLE
  { label: "Tente +", color: "#EF4444", probabilidade: 20, tipo: "vazio" }, // Red - 20%
  { label: "Quase!", color: "#F59E0B", probabilidade: 10, tipo: "vazio" }, // Orange - 10%
  
  // 0% Chance - Visual Only (NEVER WIN)
  { label: "100 giros 🐅", color: "#8B5CF6", probabilidade: 0, tipo: "apenas_ilustracao" }, // Purple - 0%
  { label: "50 giros 🐰", color: "#06B6D4", probabilidade: 0, tipo: "apenas_ilustracao" }, // Cyan - 0%
  { label: "30 giros 🐂", color: "#7C3AED", probabilidade: 0, tipo: "apenas_ilustracao" }, // Violet - 0%
  { label: "BANCA R$30", color: "#EC4899", probabilidade: 0, tipo: "apenas_ilustracao" }, // Pink - 0%
  { label: "Banca de R$100", color: "#DC2626", probabilidade: 0, tipo: "apenas_ilustracao" }, // Dark Red - 0%
  { label: "Gorjeta de R$30", color: "#22C55E", probabilidade: 0, tipo: "apenas_ilustracao" }, // Emerald - 0%
  { label: "Grupo de sinais", color: "#A855F7", probabilidade: 0, tipo: "apenas_ilustracao" }, // Light Purple - 0%
];

export function sortearComPesoMembro(): WheelSegment {
  const pesoTotal = MEMBRO_SEGMENTS.reduce((acc, s) => acc + s.probabilidade, 0);
  const rand = Math.random() * pesoTotal;
  let soma = 0;
  for (const seg of MEMBRO_SEGMENTS) {
    soma += seg.probabilidade;
    if (rand <= soma) return seg;
  }
  return MEMBRO_SEGMENTS[0];
}