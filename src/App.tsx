import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bookmarks from './pages/Bookmarks';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import ChapterDetail from './pages/ChapterDetail';
import MobileNavigation from './components/MobileNavigation';
import NetworkStatus from './components/NetworkStatus';
import React, { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { initializeCapacitorFeatures } from '@/utils/capacitorUtils';

const queryClient = new QueryClient();

function useAndroidBackButton() {
  const navigate = useNavigate();
  useEffect(() => {
    let handler: any;
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
      } else {
        CapacitorApp.exitApp();
      }
    }).then((listener) => {
      handler = listener;
    });
    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [navigate]);
}

const AppWithBackButton = () => {
  useAndroidBackButton();
  
  // Initialize Capacitor features
  useEffect(() => {
    initializeCapacitorFeatures();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
      <NetworkStatus />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/chapter/:number" element={<ChapterDetail />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppWithBackButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
