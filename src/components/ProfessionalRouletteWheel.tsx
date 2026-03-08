import React, { useState, useCallback } from "react";
import { Wheel } from 'react-custom-roulette';
import { useQuiz } from "@/contexts/QuizContext";
import { MEMBRO_SEGMENTS, sortearComPesoMembro } from "@/config/roulette-membro";
import { NOVO_SEGMENTS, sortearComPesoNovo } from "@/config/roulette-novo";

interface ProfessionalRouletteWheelProps {
  onSpinEnd?: (segment: string, tipo: string) => void;
  spinning: boolean;
  onSpin: () => void;
}

const ProfessionalRouletteWheel = ({ spinning, onSpin, onSpinEnd }: ProfessionalRouletteWheelProps) => {
  const { quizResult } = useQuiz();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // Get the appropriate segments based on quiz result
  const segments = quizResult === 'MEMBRO' ? MEMBRO_SEGMENTS : NOVO_SEGMENTS;
  const sortearComPeso = quizResult === 'MEMBRO' ? sortearComPesoMembro : sortearComPesoNovo;

  // Convert our segments to react-custom-roulette format with very short text
  const wheelData = segments.map(segment => {
    let displayText = segment.label;
    
    // Create very short abbreviations for better readability
    if (segment.label.includes('Promo vip do casal')) {
      displayText = 'VIP';
    } else if (segment.label.includes('100 giros no tigre')) {
      displayText = '100';
    } else if (segment.label.includes('50 giros no coelho')) {
      displayText = '50';
    } else if (segment.label.includes('30 giros no touro')) {
      displayText = '30';
    } else if (segment.label.includes('Grupo VIP do Casal')) {
      displayText = 'VIP';
    } else if (segment.label.includes('Gorjeta de R$30')) {
      displayText = 'R$30';
    } else if (segment.label.includes('Dobra de banca')) {
      displayText = 'DOBRA';
    } else if (segment.label.includes('Banca de R$100')) {
      displayText = 'R$100';
    } else if (segment.label.includes('Grupo de sinais')) {
      displayText = 'SINAIS';
    } else if (segment.label.includes('Quase lá')) {
      displayText = 'QUASE';
    } else if (segment.label.includes('Próxima vez')) {
      displayText = 'TENTE';
    } else if (segment.label.includes('Tente outra vez')) {
      displayText = 'TENTE';
    }
    
    return {
      option: displayText,
      style: { 
        backgroundColor: segment.color,
        textColor: '#ffffff',
        fontSize: 12
      }
    };
  });

  const handleSpinClick = useCallback(() => {
    if (mustSpin) return;
    
    try {
      // 1. Backend decides the winner
      const resultado = sortearComPeso();
      if (!resultado) {
        console.error('No result from sortearComPeso');
        return;
      }
      
      // 2. Find the index of the winning segment
      const winnerIndex = segments.findIndex(seg => seg.label === resultado.label);
      if (winnerIndex === -1) {
        console.error('Winner segment not found in segments array');
        return;
      }

      // 3. Set the prize number and start spinning
      setPrizeNumber(winnerIndex);
      setMustSpin(true);
      onSpin();
      
      console.log('Spinning to:', resultado.label, 'at index:', winnerIndex);
    } catch (error) {
      console.error('Error in handleSpinClick:', error);
    }
  }, [mustSpin, segments, sortearComPeso, onSpin]);

  const handleStopSpinning = () => {
    setMustSpin(false);
    
    // Get the winning segment
    const winningSegment = segments[prizeNumber];
    if (winningSegment) {
      console.log('Spin ended, winner:', winningSegment.label);
      onSpinEnd?.(winningSegment.label, winningSegment.tipo);
    }
  };

  // Trigger spin when external spinning prop changes
  React.useEffect(() => {
    if (spinning && !mustSpin) {
      handleSpinClick();
    }
  }, [spinning, mustSpin, handleSpinClick]);

  // Safety check
  if (!segments || segments.length === 0) {
    return <div>Error: No segments available</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ 
        width: '240px', 
        height: '240px',
        transform: 'scale(0.9)',
        transformOrigin: 'center'
      }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleStopSpinning}
          backgroundColors={['#1a1a1a', '#2a2a2a']}
          textColors={['#ffffff']}
          outerBorderColor="hsl(var(--accent))"
          outerBorderWidth={2}
          innerBorderColor="hsl(var(--secondary))"
          innerBorderWidth={1}
          innerRadius={30}
          radiusLineColor="hsl(240 30% 8%)"
          radiusLineWidth={1}
          fontSize={10}
          textDistance={45}
          spinDuration={0.4}
        />
      </div>
    </div>
  );
};

export default ProfessionalRouletteWheel;