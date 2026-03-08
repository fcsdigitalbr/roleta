import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';

const QuizResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setQuizResult } = useQuiz();

  useEffect(() => {
    const result = searchParams.get('result') as 'MEMBRO' | 'NOVO';
    
    if (result && (result === 'MEMBRO' || result === 'NOVO')) {
      setQuizResult(result);
      // Immediate redirect to roulette page
      navigate('/roulette', { replace: true });
    } else {
      // If no valid result, redirect to landing
      navigate('/', { replace: true });
    }
  }, [searchParams, setQuizResult, navigate]);

  // Return null to avoid showing any content during redirect
  return null;
};

export default QuizResult;