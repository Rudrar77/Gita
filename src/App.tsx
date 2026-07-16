import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bookmarks from './pages/Bookmarks';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import ChapterDetail from './pages/ChapterDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MobileNavigation from './components/MobileNavigation';
import NetworkStatus from './components/NetworkStatus';
import React, { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { initializeCapacitorFeatures } from '@/utils/capacitorUtils';
import { useAuth } from '@/hooks/AuthContext';

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

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-25 to-amber-25">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-orange-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppWithBackButton = () => {
  useAndroidBackButton();
  
  // Initialize Capacitor features
  useEffect(() => {
    initializeCapacitorFeatures();
  }, []);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <Index />
            <MobileNavigation />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <Settings />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/bookmarks" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <Bookmarks />
            <MobileNavigation />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/quiz" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <Quiz />
            <MobileNavigation />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/flashcards" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <Flashcards />
            <MobileNavigation />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/chapter/:number" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
            <NetworkStatus />
            <ChapterDetail />
          </div>
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
