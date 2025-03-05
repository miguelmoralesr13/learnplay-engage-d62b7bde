import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import GamesPage from "@/pages/GamesPage";
import ProgressPage from "@/pages/ProgressPage";
import NotFound from "@/pages/NotFound";
import WordMatchGame from "./games/WordMatch";
import VerbFormsGame from "./games/VerbForms";
import SentenceBuilder from "./games/SentenceBuilder";
import WordRush from "./games/WordRush";
import SpellingBee from "./games/SpellingBee";
import PaintDrawingGame from "./games/PaintDrawingGame";
import NumberRace from './games/NumberRace';
import MinimalPairsChallenge from '@/games/MinimalPairs';
import TongueTwistersChallenge from '@/games/TongueTwisters';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/games/word-match" element={<WordMatchGame />} />
            <Route path="/games/verb-forms" element={<VerbFormsGame />} />
            <Route path="/games/sentence-builder" element={<SentenceBuilder />} />
            <Route path="/games/word-rush" element={<WordRush />} />
            <Route path="games/spelling-bee" element={<SpellingBee />} />
            <Route path="/games/paint-drawing-game" element={<PaintDrawingGame />} />
            <Route path="/games/number-race" element={<NumberRace />} />
            <Route path="/games/minimal-pairs" element={<MinimalPairsChallenge />} />
            <Route path="/games/tongue-twisters" element={<TongueTwistersChallenge />} />
            {/* Agregar nuevas rutas de juegos aquí */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
