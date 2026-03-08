import React, { useState } from 'react';
import { useQuiz } from "@/contexts/QuizContext";

const SimpleRoulette = () => {
  const { quizResult } = useQuiz();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleSpin = () => {
    console.log('Spin button clicked');
    setSpinning(true);
    setResult('');

    // Simple random result for testing
    const prizes = quizResult === 'MEMBRO' 
      ? ['Promo vip do casal 50%', 'Tente outra vez', 'Quase lá! Tente novamente']
      : ['100 giros no tigre', '50 giros no coelho', 'Grupo VIP do Casal'];
    
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(randomPrize);
      setSpinning(false);
      console.log('Spin result:', randomPrize);
    }, 2000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '20px' }}>QUIZ PREMIADO</h1>
      <p style={{ marginBottom: '20px' }}>
        Tipo: {quizResult || 'Nenhum'} | Status: {spinning ? 'Girando...' : 'Pronto'}
      </p>
      
      {/* Simple wheel representation */}
      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: '4px solid #4CAF50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        backgroundColor: '#333',
        transform: spinning ? 'rotate(720deg)' : 'rotate(0deg)',
        transition: spinning ? 'transform 2s ease-out' : 'none'
      }}>
        <div style={{ textAlign: 'center' }}>
          {spinning ? '🎰' : '🎯'}
        </div>
      </div>

      <button 
        onClick={handleSpin}
        disabled={spinning}
        style={{
          padding: '15px 30px',
          backgroundColor: spinning ? '#666' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: spinning ? 'not-allowed' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        {spinning ? 'GIRANDO...' : 'GIRAR'}
      </button>

      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#4CAF50',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>RESULTADO:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleRoulette;