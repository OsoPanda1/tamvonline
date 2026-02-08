import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SecurityProvider } from "@/hooks/useSecurityContext";
import Index from "./pages/Index";
import WhitepaperMSR from "./pages/WhitepaperMSR";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DreamSpaces from "./pages/DreamSpaces";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import ComingSoon from "./pages/ComingSoon";
import Wallet from "./pages/Wallet";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SecurityProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/whitepaper" element={<WhitepaperMSR />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/dreamspaces" element={<DreamSpaces />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              {/* Social & Content Routes */}
              <Route path="/videos" element={<ComingSoon />} />
              <Route path="/live" element={<ComingSoon />} />
              <Route path="/music" element={<ComingSoon />} />
              <Route path="/social" element={<ComingSoon />} />
              <Route path="/xr" element={<ComingSoon />} />
              <Route path="/concerts" element={<ComingSoon />} />
              <Route path="/gallery" element={<ComingSoon />} />
              <Route path="/auctions" element={<ComingSoon />} />
              <Route path="/isabella" element={<ComingSoon />} />
              <Route path="/utamv" element={<ComingSoon />} />
              <Route path="/puentes" element={<ComingSoon />} />
              <Route path="/premium" element={<ComingSoon />} />
              <Route path="/lottery" element={<ComingSoon />} />
              {/* Post detail route */}
              <Route path="/post/:postId" element={<ComingSoon />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SecurityProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
