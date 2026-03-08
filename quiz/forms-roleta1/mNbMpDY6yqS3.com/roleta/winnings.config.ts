/**
 * Configuração de Ganhos da Roleta
 * 
 * Este arquivo define os prêmios para cada segmento da roleta.
 * Modifique os valores de 'prize' para configurar os ganhos fixos.
 * 
 * Estrutura:
 * - id: Identificador único do segmento (0-11)
 * - label: Texto exibido no segmento
 * - color: Cor hexadecimal do segmento
 * - angle: Ângulo inicial do segmento (em graus)
 * - prize: Prêmio associado (string ou número)
 * - probability: Probabilidade de ganho (0-1, opcional)
 */

export interface WinningSegment {
  id: number;
  label: string;
  color: string;
  angle: number;
  prize: string | number;
  probability?: number;
}

export const ROULETTE_SEGMENTS: WinningSegment[] = [
  {
    id: 0,
    label: "BANQUINHA DE 100",
    color: "#4169E1",
    angle: 0,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 1,
    label: "ENQUINHO DE 100",
    color: "#4682B4",
    angle: 30,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 2,
    label: "Não desses vez",
    color: "#BA55D3",
    angle: 60,
    prize: "R$ 50",
    probability: 1.0,
  },
  {
    id: 3,
    label: "BANQUINHA DE 100",
    color: "#FF69B4",
    angle: 90,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 4,
    label: "Foi quase!",
    color: "#FF7F50",
    angle: 120,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 5,
    label: "BANQUINHA DE 100",
    color: "#FFA500",
    angle: 150,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 6,
    label: "Sem prêmio",
    color: "#FFD700",
    angle: 180,
    prize: "Quase lá!",
    probability: 1.0,
  },
  {
    id: 7,
    label: "BANQUINHA DE 100",
    color: "#FFFF00",
    angle: 210,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 8,
    label: "BANQUINHA DE 100",
    color: "#ADFF2F",
    angle: 240,
    prize: "Sem prêmio",
    probability: 1.0,
  },
  {
    id: 9,
    label: "Petição noitou",
    color: "#3CB371",
    angle: 270,
    prize: "R$ 75",
    probability: 1.0,
  },
  {
    id: 10,
    label: "ENQUINHO DE 100",
    color: "#008080",
    angle: 300,
    prize: "R$ 100",
    probability: 1.0,
  },
  {
    id: 11,
    label: "Não desses vez",
    color: "#6495ED",
    angle: 330,
    prize: "R$ 25",
    probability: 1.0,
  },
];

/**
 * Função para obter o prêmio de um segmento pelo ID
 */
export function getWinningPrize(segmentId: number): string | number | null {
  const segment = ROULETTE_SEGMENTS.find((s) => s.id === segmentId);
  return segment ? segment.prize : null;
}

/**
 * Função para obter o segmento pelo ângulo de rotação
 * @param rotation Ângulo de rotação em graus (0-360)
 */
export function getSegmentByRotation(rotation: number): WinningSegment | null {
  // Normalizar rotação para 0-360
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  // O delimitador está no topo (0°), então encontramos qual segmento está ali
  // Cada segmento ocupa 30°
  const segmentIndex = Math.floor(normalizedRotation / 30) % 12;
  return ROULETTE_SEGMENTS[segmentIndex] || null;
}

/**
 * Função para obter a rotação necessária para ganhar um segmento específico
 * @param segmentId ID do segmento desejado
 */
export function getRotationForSegment(segmentId: number): number {
  const segment = ROULETTE_SEGMENTS.find((s) => s.id === segmentId);
  if (!segment) return 0;

  // Rotação = ângulo do segmento + 15 (para centralizar no meio do segmento)
  // + múltiplos de 360 para dar voltas extras (efeito visual)
  return segment.angle + 15 + 360 * 5; // 5 voltas + centralização
}

/**
 * Histórico de ganhos (para rastreamento)
 */
export interface WinningHistory {
  timestamp: Date;
  segmentId: number;
  prize: string | number;
  rotation: number;
}

/**
 * Classe para gerenciar histórico de ganhos
 */
export class WinningsTracker {
  private history: WinningHistory[] = [];

  addWin(segmentId: number, rotation: number): WinningHistory {
    const prize = getWinningPrize(segmentId);
    const entry: WinningHistory = {
      timestamp: new Date(),
      segmentId,
      prize: prize || "Sem prêmio",
      rotation,
    };
    this.history.push(entry);
    return entry;
  }

  getHistory(): WinningHistory[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getLastWin(): WinningHistory | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }
}

// Instância global do rastreador
export const winningsTracker = new WinningsTracker();
