# Mapeamento da Roleta de Prêmios

## Análise da Imagem e Configuração dos Segmentos

A roleta contém **12 segmentos** distribuídos em 360°, cada um com 30° de amplitude.

### Segmentos Mapeados (Ordem Horária a partir do topo)

| # | Prêmio | Cor | Ângulo Inicial | Ângulo Final | RGB | Hex | Notas |
|---|--------|-----|----------------|--------------|-----|-----|-------|
| 0 | BANQUINHA DE 100 | Azul Escuro | 0° | 30° | (65, 105, 225) | #4169E1 | Segmento superior |
| 1 | ENQUINHO DE 100 | Azul Médio | 30° | 60° | (70, 130, 180) | #4682B4 | Transição azul-roxo |
| 2 | Não desses vez | Roxo/Magenta | 60° | 90° | (186, 85, 211) | #BA55D3 | Roxo vibrante |
| 3 | BANQUINHA DE 100 | Rosa/Vermelho | 90° | 120° | (255, 105, 180) | #FF69B4 | Rosa quente |
| 4 | Foi quase! | Laranja/Vermelho | 120° | 150° | (255, 127, 80) | #FF7F50 | Laranja coral |
| 5 | BANQUINHA DE 100 | Laranja | 150° | 180° | (255, 165, 0) | #FFA500 | Laranja puro |
| 6 | Sem prêmio | Amarelo Ouro | 180° | 210° | (255, 215, 0) | #FFD700 | Amarelo quente |
| 7 | BANQUINHA DE 100 | Amarelo Claro | 210° | 240° | (255, 255, 0) | #FFFF00 | Amarelo brilhante |
| 8 | BANQUINHA DE 100 | Verde Claro | 240° | 270° | (173, 255, 47) | #ADFF2F | Verde-amarelo |
| 9 | Petição noitou | Verde Médio | 270° | 300° | (60, 179, 113) | #3CB371 | Verde floresta |
| 10 | ENQUINHO DE 100 | Verde Escuro/Azul | 300° | 330° | (0, 128, 128) | #008080 | Teal |
| 11 | Não desses vez | Azul Claro | 330° | 360° | (100, 149, 237) | #6495ED | Azul cornflower |

### Delimitador (Indicador de Prêmio)

- **Posição**: Topo da roleta (0°)
- **Cor**: Vermelho vibrante
- **Formato**: Triângulo apontando para baixo ou linha vertical
- **RGB**: (255, 0, 0)
- **Hex**: #FF0000

### Estrutura do Centro

- **Raio Externo**: Círculo completo
- **Centro**: Círculo branco (ponto de rotação)
- **Raio do Centro**: Aproximadamente 15-20% do raio total

### Configuração Técnica

**Cálculo de Ângulos:**
- Cada segmento ocupa: 360° / 12 = 30°
- Rotação para ganhar um segmento: `rotation = (segmentIndex * 30) + 15` (para centralizar no segmento)
- Delimitador em: 0° (topo)

**Mapeamento para Configuração de Ganhos:**

```javascript
const segments = [
  { id: 0, label: "BANQUINHA DE 100", color: "#4169E1", angle: 0 },
  { id: 1, label: "ENQUINHO DE 100", color: "#4682B4", angle: 30 },
  { id: 2, label: "Não desses vez", color: "#BA55D3", angle: 60 },
  { id: 3, label: "BANQUINHA DE 100", color: "#FF69B4", angle: 90 },
  { id: 4, label: "Foi quase!", color: "#FF7F50", angle: 120 },
  { id: 5, label: "BANQUINHA DE 100", color: "#FFA500", angle: 150 },
  { id: 6, label: "Sem prêmio", color: "#FFD700", angle: 180 },
  { id: 7, label: "BANQUINHA DE 100", color: "#FFFF00", angle: 210 },
  { id: 8, label: "BANQUINHA DE 100", color: "#ADFF2F", angle: 240 },
  { id: 9, label: "Petição noitou", color: "#3CB371", angle: 270 },
  { id: 10, label: "ENQUINHO DE 100", color: "#008080", angle: 300 },
  { id: 11, label: "Não desses vez", color: "#6495ED", angle: 330 }
];
```

## Notas Importantes

1. **Delimitador**: Posicionado no topo (0°) para indicar qual segmento ganhou
2. **Rotação**: A roleta gira no sentido horário
3. **Parada**: O segmento que ficar alinhado com o delimitador é o prêmio
4. **Cores**: Mapeadas com precisão para corresponder à imagem fornecida
5. **Configuração de Ganhos**: Cada segmento pode ser configurado com um prêmio específico usando o script de ganhos

## Script de Ganhos Recomendado

O script de ganhos permite:
- Definir prêmios fixos para cada segmento
- Configurar probabilidades de ganho
- Armazenar histórico de ganhos
- Validar resultados antes de exibir

Veja `winnings.config.ts` para detalhes de configuração.
