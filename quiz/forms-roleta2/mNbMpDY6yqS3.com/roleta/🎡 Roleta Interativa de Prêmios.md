# 🎡 Roleta Interativa de Prêmios

Uma aplicação web moderna e interativa para uma roleta de prêmios com animações suaves, configuração flexível de ganhos e interface responsiva.

## 📋 Características

✅ **Roleta Funcional**: Giro suave com animação de easing  
✅ **Delimitador Vermelho**: Indicador visual do prêmio no topo  
✅ **Mapeamento Completo**: 12 segmentos com cores precisas da arte original  
✅ **Configuração Flexível**: Prêmios fixos facilmente configuráveis  
✅ **Histórico de Ganhos**: Rastreamento automático de todos os resultados  
✅ **Interface Responsiva**: Funciona em desktop, tablet e mobile  
✅ **Sem Dependências Externas**: Construído com React + TypeScript  

## 🛠️ Requisitos Técnicos

### Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React | 19.2.1 | Framework UI |
| TypeScript | 5.6.3 | Type safety |
| Tailwind CSS | 4.1.14 | Styling |
| Vite | 7.1.7 | Build tool |
| Node.js | 22.13.0 | Runtime |
| pnpm | 10.15.1 | Package manager |

### Requisitos do Sistema

- **Node.js**: 18.0.0 ou superior
- **npm/pnpm**: Versão recente
- **Navegador**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Memória**: 512MB mínimo
- **Espaço em Disco**: 500MB para dependências

## 📦 Instalação

### 1. Clonar ou Acessar o Projeto

```bash
cd /home/ubuntu/roulette-app
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor iniciará em `http://localhost:3000`

### 4. Construir para Produção

```bash
pnpm build
```

## 🎯 Como Usar

### Girar a Roleta

1. Abra a aplicação no navegador
2. Clique no botão **"Girar Roleta"**
3. Aguarde a animação completar (5 segundos)
4. O segmento alinhado com o delimitador vermelho é seu prêmio
5. O resultado aparecerá na seção ao lado

### Configurar Prêmios

Veja o arquivo `CONFIGURATION_GUIDE.md` para instruções detalhadas.

**Resumo rápido:**

1. Abra `client/src/lib/winnings.config.ts`
2. Modifique o campo `prize` em cada segmento
3. Salve o arquivo
4. Recarregue a página

## 📁 Estrutura do Projeto

```
roulette-app/
├── client/
│   ├── public/              # Assets estáticos
│   ├── src/
│   │   ├── components/
│   │   │   └── RouletteWheel.tsx    # Componente principal da roleta
│   │   ├── lib/
│   │   │   └── winnings.config.ts   # Configuração de prêmios
│   │   ├── pages/
│   │   │   └── Home.tsx             # Página inicial
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   └── index.html
├── server/                  # Placeholder (não utilizado em static)
├── ROULETTE_MAP.md         # Mapeamento detalhado dos segmentos
├── CONFIGURATION_GUIDE.md  # Guia de configuração
└── README_ROULETTE.md      # Este arquivo
```

## 🎨 Mapeamento da Roleta

A roleta contém **12 segmentos** com as seguintes cores (conforme arte original):

| ID | Segmento | Cor | Prêmio Padrão |
|----|----------|-----|---------------|
| 0 | Azul Escuro | #4169E1 | R$ 100 |
| 1 | Azul Médio | #4682B4 | R$ 100 |
| 2 | Roxo | #BA55D3 | Tente novamente |
| 3 | Rosa | #FF69B4 | R$ 100 |
| 4 | Laranja Coral | #FF7F50 | Quase lá! |
| 5 | Laranja | #FFA500 | R$ 100 |
| 6 | Amarelo Ouro | #FFD700 | Sem prêmio |
| 7 | Amarelo Claro | #FFFF00 | R$ 100 |
| 8 | Verde Claro | #ADFF2F | R$ 100 |
| 9 | Verde Médio | #3CB371 | Tente novamente |
| 10 | Teal | #008080 | R$ 100 |
| 11 | Azul Cornflower | #6495ED | Tente novamente |

Para detalhes completos, veja `ROULETTE_MAP.md`.

## 🔧 Configuração Avançada

### Modificar Duração da Animação

Em `client/src/pages/Home.tsx`:

```typescript
<RouletteWheel 
  onWin={handleWin} 
  spinDuration={5}  // Tempo em segundos
/>
```

### Acessar Histórico de Ganhos

```typescript
import { winningsTracker } from "@/lib/winnings.config";

// Obter todos os ganhos
const history = winningsTracker.getHistory();

// Obter último ganho
const lastWin = winningsTracker.getLastWin();

// Limpar histórico
winningsTracker.clearHistory();
```

### Funções Utilitárias

```typescript
import {
  getWinningPrize,
  getSegmentByRotation,
  getRotationForSegment,
} from "@/lib/winnings.config";

// Obter prêmio de um segmento
const prize = getWinningPrize(0);

// Obter segmento por ângulo
const segment = getSegmentByRotation(45);

// Obter rotação para um segmento
const rotation = getRotationForSegment(0);
```

## 🚀 Deploy

### Opção 1: Manus Hosting (Recomendado)

1. Clique no botão **"Publish"** na interface Manus
2. A aplicação será automaticamente hospedada em `*.manus.space`
3. Suporte a domínios customizados disponível

### Opção 2: Vercel

```bash
pnpm build
vercel deploy
```

### Opção 3: Netlify

```bash
pnpm build
netlify deploy --prod --dir=dist
```

## 📊 Variáveis de Ambiente

Nenhuma variável de ambiente é necessária para a versão static. Todas as configurações estão em `winnings.config.ts`.

## 🐛 Troubleshooting

### A roleta não gira

- Verifique se o JavaScript está habilitado
- Abra o console (F12) e procure por erros
- Recarregue a página (Ctrl+F5)

### Prêmios não aparecem

- Verifique se `winnings.config.ts` foi salvo
- Recarregue a página no navegador
- Verifique o console para erros de TypeScript

### Cores incorretas

- As cores estão mapeadas conforme a arte original
- Se precisar modificar, edite o campo `color` em `winnings.config.ts`

### Performance lenta

- Feche abas desnecessárias
- Limpe o cache do navegador
- Verifique a conexão de internet

## 📝 Notas Importantes

1. **Delimitador**: Sempre no topo (0°) - não modificar
2. **Segmentos**: 12 segmentos fixos de 30° cada
3. **Rotação**: Sentido horário
4. **Animação**: Usa easing cubic para suavidade
5. **Histórico**: Armazenado em memória (limpo ao recarregar)

## 🔐 Segurança

- Nenhum dado é enviado para servidores
- Tudo funciona localmente no navegador
- Seguro para usar em qualquer ambiente

## 📄 Licença

MIT

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte `CONFIGURATION_GUIDE.md` para configuração
2. Consulte `ROULETTE_MAP.md` para mapeamento
3. Verifique o console do navegador (F12) para erros
4. Revise o código em `client/src/components/RouletteWheel.tsx`

## ✨ Próximos Passos

- [ ] Testar em diferentes navegadores
- [ ] Ajustar cores conforme necessário
- [ ] Configurar prêmios finais
- [ ] Deploy em produção
- [ ] Monitorar uso e feedback

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-04  
**Status**: ✅ Pronto para uso
