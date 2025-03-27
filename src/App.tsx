
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Audit from "./pages/Audit";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import ClientProfile from "./pages/ClientProfile";
import Pricing from "./pages/Pricing";
import PositionPricing from "./pages/PositionPricing";
import About from "./pages/About";
import PositionTracker from "./pages/PositionTracker";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/position-pricing" element={<PositionPricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/position-tracker" element={<PositionTracker />} />
              <Route path="/demo" element={<Demo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
