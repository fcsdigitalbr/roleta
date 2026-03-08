# Integrated Quiz and Two-Roulette System with Daily Limits

## Overview

This implementation creates a fully integrated React application with proper iGaming funnel logic and daily usage controls:

- **Acquisition Wheel (New Users)**: High probability (70%) of free spins to convert new leads
- **Retention Wheel (Existing Users)**: Focus on VIP upsell (50%) or losses (50%) for existing players
- **Daily Usage Limit**: Prevents users from spinning more than once per day
- **Clean UI**: No user type labels shown to users (LIDER/NOVO only used internally)
- **Integrated Quiz**: React-based quiz component with 6 steps

## Daily Limit System

### Features
- **1 spin per day limit** per device/browser
- **Automatic reset** at midnight
- **Persistent storage** using localStorage
- **Time countdown** showing when next spin is available
- **Graceful handling** with dedicated limit reached screen

### Implementation
- `useDailyLimit()` hook manages all limit logic
- `DailyLimitReached` component shows when limit is reached
- Usage recorded when user clicks spin button
- Automatic cleanup and reset for new days

### User Experience
1. User completes quiz and gets to roulette
2. If they haven't used it today: normal roulette experience
3. If they've already used it: shows "Daily Limit Reached" screen with:
   - Countdown to next available spin
   - Option to retake quiz
   - Clear messaging about 1-per-day limit

## Prize Logic Implementation

### 1. New User Wheel - "Acquisition Funnel"
**Goal**: Convert new leads with high-value free spins

**Probability Distribution**:
- **70% Chance (The Hook - Free Spins)**:
  - 100 giros no tigre (25%)
  - 50 giros no coelho (25%) 
  - 30 giros no touro (20%)

- **15% Chance (The Perks)**:
  - Grupo VIP do Casal (5%)
  - Gorjeta R$30,00 (5%)
  - Dobra de banca (5%)

- **15% Chance (The Blanks)**:
  - Tente outra vez (5%)
  - Você está sem sorte (5%)
  - Grupo de sinais (3%)
  - Cadastre-se grátis (2%)

- **0% Chance (Visual Only)**:
  - Banca de R$100 (illustration only)

### 2. Existing User Wheel - "Retention/Monetization"
**Goal**: Upsell VIP or yield losses for active players

**Probability Distribution**:
- **50% Chance (The Upsell)**:
  - Promo VIP do Casal (50%)

- **50% Chance (The Blanks)**:
  - Tente outra vez (20%)
  - Você está sem sorte (15%)
  - Sem sorte (15%)

- **0% Chance (Visual Only - Impossible to land)**:
  - 100 giros no tigre
  - 50 giros no coelho
  - 30 giros no touro
  - Banca de R$100
  - Grupo de sinais
  - Gorjeta R$30,00

## Technical Implementation

### 1. Clean User Interface
- **No user type labels**: Users never see "LIDER" or "NOVO" terminology
- **Unified branding**: All users see "Roleta Casal da Bet"
- **Same visual design**: Consistent experience regardless of user type
- **Internal classification**: User types only used for backend logic

### 2. Daily Limit System
```typescript
// Usage tracking
interface DailyUsage {
  date: string;
  count: number;
  lastUsed: string;
}

// Hook provides:
const { canUse, timeUntilReset, recordUsage } = useDailyLimit();
```

### 3. Route Structure
- **`/`** - Integrated 6-step quiz (default)
- **`/roulette`** - Main roulette experience with daily limits
- **`/quiz-result`** - Invisible redirect handler
- **`/test`** - Development testing interface with limit reset

### 4. Data Flow
1. User completes quiz → classified internally as existing/new user
2. Redirected to roulette → daily limit check performed
3. If limit not reached → normal roulette experience
4. If limit reached → dedicated limit screen with countdown
5. Usage recorded on spin → prevents additional spins until reset

## Security & Fairness

### 1. Daily Limits
- **Browser-based**: Uses localStorage for persistence
- **Automatic reset**: Clears at midnight local time
- **Tamper detection**: Validates date strings and usage counts
- **Graceful degradation**: Falls back to allowing usage if storage fails

### 2. Prize Distribution
- **Weighted random**: Uses proper probability calculations
- **No manipulation**: Results determined by configured percentages
- **Transparent logic**: All probabilities clearly defined in config files

## Benefits of This Implementation

1. **Industry Best Practices**: Follows iGaming funnel optimization
2. **User Retention**: Daily limits encourage return visits
3. **Clean UX**: No confusing labels or technical terminology
4. **Conversion Focused**: High win rates for new users, VIP upsells for existing
5. **Maintainable**: TypeScript configurations, modular components
6. **Mobile Optimized**: Responsive design, touch-friendly interactions
7. **Performance**: Single-page app, no external dependencies

## Key Components

### 1. Roulette Configurations

#### `src/config/roulette-lider.ts`
- Exclusive roulette for existing players
- Higher value prizes (R$200 bank, Premium VIP, 20% cashback)
- Lower probability for empty segments (11% vs 15%)

#### `src/config/roulette-novo.ts`
- Welcome roulette for new users
- Entry-level prizes (R$50 bank, basic bonuses, free spins)
- Higher probability for winning segments to encourage new users

### 2. Updated Components

#### `src/components/RouletteWheel.tsx`
- Dynamically loads segments based on `quizResult`
- Uses appropriate sorting function for each roulette type
- Maintains same visual appearance but different content

#### `src/pages/Index.tsx`
- Customized titles and descriptions based on quiz result
- Dynamic color schemes (primary for LIDER, secondary for NOVO)
- Same background image for both roulette types

#### `src/components/ResultModal.tsx`
- Customized congratulations messages
- Different form validation (ID optional for NOVO users)
- Contextual prize descriptions

#### `src/components/NotificationBar.tsx`
- Different notification messages based on roulette type
- LIDER: Premium prizes notifications
- NOVO: Welcome prizes notifications

### 3. Reference Assets

#### Source Images (Development Reference Only)
- `source-roulette/quemjoga.jpg` - Reference image showing LIDER roulette concept
- `source-roulette/quemnjoga.jpg` - Reference image showing NOVO roulette concept
- `source-roulette/roleta1.jpg` - Roulette wheel reference image 1
- `source-roulette/roleta2.jpg` - Roulette wheel reference image 2

*Note: These images are for development reference only and are not used in the frontend.*

## How It Works

1. **Quiz Start**: User arrives at quiz (`/`)
2. **Quiz Flow**: 6 interactive steps with progress tracking
3. **Branching Question**: Step 6 determines user type (internal classification)
4. **Daily Limit Check**: System checks if user can spin today
5. **Roulette Experience**: If allowed, shows appropriate wheel configuration
6. **Usage Recording**: Records spin attempt to prevent additional uses
7. **Prize Logic**: Different probability distributions based on user type
8. **Webhook Integration**: Sends data to different endpoints for tracking

## Development & Testing

### Test Interface (`/test`)
- Switch between user types for testing
- View probability distributions
- Reset daily limits (development only)
- Test both wheel configurations

### Daily Limit Testing
```typescript
// Reset limits for testing
const { resetUsage } = useDailyLimit();
resetUsage(); // Clears today's usage count
```

### Configuration Files
- `src/config/roulette-lider.ts` - Existing user wheel
- `src/config/roulette-novo.ts` - New user wheel
- `src/hooks/useDailyLimit.ts` - Daily limit logic
- `src/components/DailyLimitReached.tsx` - Limit reached screen

## Deployment Considerations

1. **Environment Variables**: Configure webhook URLs for production
2. **Analytics**: Track conversion rates by user type
3. **A/B Testing**: Easy to modify probabilities for optimization
4. **Monitoring**: Log daily usage patterns and limit effectiveness
5. **Backup Strategy**: Consider server-side usage tracking for critical applications

This implementation provides a complete, production-ready iGaming funnel with proper user segmentation, daily limits, and conversion optimization.

## Testing

Visit `/test` route to:
- Switch between LIDER and NOVO modes
- See different segment configurations
- Test both roulette wheels
- Verify probability distributions

## Configuration

### Webhook URLs (in QuizContext)
- LIDER: `https://n8n.clubemkt.digital/webhook-test/roleta-hot`
- NOVO: `https://n8n.clubemkt.digital/webhook-test/roleta-cold`

### Segment Probabilities

#### LIDER Segments (Total: 100%)
- High-value prizes: 54%
- Medium prizes: 35%
- Empty segments: 11%

#### NOVO Segments (Total: 100%)
- Welcome prizes: 70%
- Medium prizes: 15%
- Empty segments: 15%

## Development Notes

- All components are responsive and mobile-first
- Maintains existing design system and animations
- Backward compatible with existing quiz system
- TypeScript strict mode compliant
- No breaking changes to existing APIs

## Future Enhancements

1. **A/B Testing**: Easy to modify probabilities for optimization
2. **Seasonal Campaigns**: Can add time-based segment modifications
3. **User Analytics**: Track conversion rates by roulette type
4. **Prize Inventory**: Connect to real prize management system