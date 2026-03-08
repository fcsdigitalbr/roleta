import { useQuiz } from "@/contexts/QuizContext";

const SimpleIndex = () => {
  const { quizResult, setQuizResult } = useQuiz();

  const handleTestButton = () => {
    console.log('Button clicked!');
    alert('Button works! Quiz result: ' + (quizResult || 'None'));
  };

  const handleSetMembro = () => {
    setQuizResult('MEMBRO');
  };

  const handleSetNovo = () => {
    setQuizResult('NOVO');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Simple Roulette Test</h1>
        <p className="text-muted-foreground mb-4">Quiz Result: {quizResult || 'None'}</p>
        
        <div className="space-y-2">
          <button 
            onClick={handleTestButton}
            className="block mx-auto px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Test Button
          </button>
          
          <button 
            onClick={handleSetMembro}
            className="block mx-auto px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Set MEMBRO
          </button>
          
          <button 
            onClick={handleSetNovo}
            className="block mx-auto px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90"
          >
            Set NOVO
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;