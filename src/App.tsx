import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NotificationProvider } from "@/context/NotificationProvider";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import CreateProgram from "./pages/CreateProgram";
import Notifications from "./pages/Notifications";
import Volunteers from "./pages/Volunteers";
import NGOProfile from "./pages/NGOProfile";
import NGOs from "./pages/NGOs";
import NotFound from "./pages/NotFound";

import AppLayout from "@/components/AppLayout";

import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED / MAIN APP ROUTES */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/program/:id" element={<ProgramDetail />} />
                <Route path="/create-program" element={<CreateProgram />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/ngo/:id" element={<NGOProfile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ngos" element={<NGOs />} />
              </Route>

              {/* CATCH ALL */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
