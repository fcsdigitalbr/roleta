import { createContext, useContext, useState, ReactNode } from 'react';

type QuizResult = 'MEMBRO' | 'NOVO' | null;

interface QuizContextType {
  quizResult: QuizResult;
  setQuizResult: (result: QuizResult) => void;
  getWebhookUrl: () => string;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [quizResult, setQuizResult] = useState<QuizResult>(() => {
    // Check URL params or localStorage for quiz result
    const urlParams = new URLSearchParams(window.location.search);
    const urlResult = urlParams.get('quiz') as QuizResult;
    const storedResult = localStorage.getItem('quizResult') as QuizResult;
    
    return urlResult || storedResult || null;
  });

  const getWebhookUrl = () => {
    // Return appropriate webhook URL based on quiz result
    if (quizResult === 'MEMBRO') {
      return 'https://n8n.clubemkt.digital/webhook-test/roleta-hot';
    } else {
      return 'https://n8n.clubemkt.digital/webhook-test/roleta-cold';
    }
  };

  const handleSetQuizResult = (result: QuizResult) => {
    setQuizResult(result);
    if (result) {
      localStorage.setItem('quizResult', result);
    } else {
      localStorage.removeItem('quizResult');
    }
  };

  return (
    <QuizContext.Provider value={{
      quizResult,
      setQuizResult: handleSetQuizResult,
      getWebhookUrl
    }}>
      {children}
    </QuizContext.Provider>
  );
};