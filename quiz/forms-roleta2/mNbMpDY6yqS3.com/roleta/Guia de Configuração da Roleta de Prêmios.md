# Guia de Configuração da Roleta de Prêmios

## 📋 Visão Geral

Este guia explica como configurar os prêmios fixos para cada segmento da roleta. Todos os prêmios são definidos no arquivo `client/src/lib/winnings.config.ts`.

## 🎯 Configuração Rápida

### 1. Abrir o Arquivo de Configuração

Abra o arquivo: `client/src/lib/winnings.config.ts`

### 2. Modificar os Prêmios

Localize o array `ROULETTE_SEGMENTS` e modifique o campo `prize` para cada segmento:

```typescript
export const ROULETTE_SEGMENTS: WinningSegment[] = [
  {
    id: 0,
    label: "BANQUINHA DE 100",
    color: "#4169E1",
    angle: 0,
    prize: "R$ 100",  // ← MODIFIQUE AQUI
    probability: 1.0,
  },
  // ... mais segmentos
];
```

## 📊 Estrutura de Cada Segmento

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | number | ID único (0-11) | `0` |
| `label` | string | Texto exibido na roleta | `"BANQUINHA DE 100"` |
| `color` | string | Cor hexadecimal | `"#4169E1"` |
| `angle` | number | Ângulo inicial em graus | `0` |
| `prize` | string \| number | Prêmio associado | `"R$ 100"` ou `100` |
| `probability` | number | Probabilidade (0-1) | `1.0` |

## 🎁 Exemplos de Configuração

### Exemplo 1: Prêmios em Reais

```typescript
{
  id: 0,
  label: "BANQUINHA DE 100",
  color: "#4169E1",
  angle: 0,
  prize: "R$ 100",
  probability: 1.0,
}
```

### Exemplo 2: Prêmios em Pontos

```typescript
{
  id: 1,
  label: "ENQUINHO DE 100",
  color: "#4682B4",
  angle: 30,
  prize: "1000 pontos",
  probability: 1.0,
}
```

### Exemplo 3: Prêmios Textuais

```typescript
{
  id: 2,
  label: "Não desses vez",
  color: "#BA55D3",
  angle: 60,
  prize: "Tente novamente",
  probability: 1.0,
}
```

### Exemplo 4: Prêmios Numéricos

```typescript
{
  id: 3,
  label: "BANQUINHA DE 100",
  color: "#FF69B4",
  angle: 90,
  prize: 500,  // Número puro
  probability: 1.0,
}
```

## 🔄 Mapeamento Completo da Roleta

A roleta contém **12 segmentos**, cada um com 30° de amplitude:

```
Posição 0 (Topo - 0°):   Segmento 0
Posição 1 (30°):         Segmento 1
Posição 2 (60°):         Segmento 2
Posição 3 (90°):         Segmento 3
Posição 4 (120°):        Segmento 4
Posição 5 (150°):        Segmento 5
Posição 6 (180°):        Segmento 6
Posição 7 (210°):        Segmento 7
Posição 8 (240°):        Segmento 8
Posição 9 (270°):        Segmento 9
Posição 10 (300°):       Segmento 10
Posição 11 (330°):       Segmento 11
```

## 🎨 Cores dos Segmentos (Não Modificar)

As cores já estão mapeadas conforme a arte original:

| ID | Cor | Hex | RGB |
|----|-----|-----|-----|
| 0 | Azul Escuro | #4169E1 | (65, 105, 225) |
| 1 | Azul Médio | #4682B4 | (70, 130, 180) |
| 2 | Roxo | #BA55D3 | (186, 85, 211) |
| 3 | Rosa | #FF69B4 | (255, 105, 180) |
| 4 | Laranja Coral | #FF7F50 | (255, 127, 80) |
| 5 | Laranja | #FFA500 | (255, 165, 0) |
| 6 | Amarelo Ouro | #FFD700 | (255, 215, 0) |
| 7 | Amarelo Claro | #FFFF00 | (255, 255, 0) |
| 8 | Verde Claro | #ADFF2F | (173, 255, 47) |
| 9 | Verde Médio | #3CB371 | (60, 179, 113) |
| 10 | Teal | #008080 | (0, 128, 128) |
| 11 | Azul Cornflower | #6495ED | (100, 149, 237) |

## 🛠️ Funções Utilitárias Disponíveis

### `getWinningPrize(segmentId: number)`

Obtém o prêmio de um segmento pelo ID:

```typescript
import { getWinningPrize } from "@/lib/winnings.config";

const prize = getWinningPrize(0); // Retorna: "R$ 100"
```

### `getSegmentByRotation(rotation: number)`

Obtém o segmento baseado no ângulo de rotação:

```typescript
import { getSegmentByRotation } from "@/lib/winnings.config";

const segment = getSegmentByRotation(45); // Retorna o segmento em 45°
```

### `getRotationForSegment(segmentId: number)`

Obtém a rotação necessária para ganhar um segmento específico:

```typescript
import { getRotationForSegment } from "@/lib/winnings.config";

const rotation = getRotationForSegment(0); // Retorna a rotação para o segmento 0
```

## 📈 Histórico de Ganhos

O sistema rastreia automaticamente todos os ganhos usando a classe `WinningsTracker`:

```typescript
import { winningsTracker } from "@/lib/winnings.config";

// Obter histórico completo
const history = winningsTracker.getHistory();

// Obter último ganho
const lastWin = winningsTracker.getLastWin();

// Limpar histórico
winningsTracker.clearHistory();
```

## 🎬 Modificar Duração da Animação

Para alterar o tempo de giro da roleta, modifique o componente `RouletteWheel`:

```typescript
// Em client/src/pages/Home.tsx
<RouletteWheel 
  onWin={handleWin} 
  spinDuration={5}  // ← Tempo em segundos (padrão: 5)
/>
```

## ✅ Checklist de Implementação

- [ ] Abrir `client/src/lib/winnings.config.ts`
- [ ] Modificar os valores de `prize` para cada segmento
- [ ] Salvar o arquivo
- [ ] Testar a roleta no navegador
- [ ] Verificar se os prêmios aparecem corretamente
- [ ] Ajustar conforme necessário

## 🐛 Troubleshooting

### Prêmio não aparece após girar

1. Verifique se o arquivo foi salvo
2. Recarregue a página no navegador (Ctrl+F5)
3. Verifique o console do navegador para erros (F12)

### Cores estão erradas

As cores estão mapeadas conforme a arte original. Se precisar modificar, edite o campo `color` em `winnings.config.ts`.

### A roleta não gira

Verifique se o JavaScript está habilitado no navegador e se não há erros no console.

## 📞 Suporte

Para dúvidas sobre a configuração, consulte:
- `ROULETTE_MAP.md` - Mapeamento completo dos segmentos
- `client/src/lib/winnings.config.ts` - Código da configuração
- `client/src/components/RouletteWheel.tsx` - Componente da roleta
