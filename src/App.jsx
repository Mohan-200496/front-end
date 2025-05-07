
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

// Games
import CoinFlipGame from "./components/games/CoinFlipGame";
import DiceRollGame from "./components/games/DiceRollGame";
import CardDrawGame from "./components/games/CardDrawGame";
import WheelSpinGame from "./components/games/WheelSpinGame";
import NumberGuessGame from "./components/games/NumberGuessGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Game routes */}
            <Route path="/games/coinflip" element={<CoinFlipGame />} />
            <Route path="/games/diceroll" element={<DiceRollGame />} />
            <Route path="/games/carddraw" element={<CardDrawGame />} />
            <Route path="/games/wheelspin" element={<WheelSpinGame />} />
            <Route path="/games/numberguess" element={<NumberGuessGame />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
