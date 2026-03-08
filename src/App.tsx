import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "@/contexts/QuizContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import TestRoulettes from "./pages/TestRoulettes";
import TestPage from "./pages/TestPage";
import SimpleIndex from "./pages/SimpleIndex";
import BasicTest from "./pages/BasicTest";
import SimpleRoulette from "./pages/SimpleRoulette";
import WorkingRoulette from "./pages/WorkingRoulette";
import ProfessionalIndex from "./pages/ProfessionalIndex";
import TestReactRoulette from "./pages/TestReactRoulette";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Test if JavaScript is working at all
  console.log('App component loaded');
  
  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Quiz />} />
              <Route path="/roulette" element={<ProfessionalIndex />} />
              <Route path="/test" element={<TestRoulettes />} />
              {/* Testing routes - remove in production */}
              <Route path="/basic-test" element={<BasicTest />} />
              <Route path="/simple-roulette" element={<SimpleIndex />} />
              <Route path="/simple-wheel" element={<SimpleRoulette />} />
              <Route path="/working-roulette" element={<WorkingRoulette />} />
              <Route path="/professional-roulette" element={<ProfessionalIndex />} />
              <Route path="/test-react-roulette" element={<TestReactRoulette />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </QueryClientProvider>
  );
};

export default App;
