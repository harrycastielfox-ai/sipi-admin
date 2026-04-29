import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import Modulos from "@/pages/Modulos";
import Dashboard from "@/pages/Dashboard";
import Inqueritos from "@/pages/Inqueritos";
import InqueritoDetalhe from "@/pages/InqueritoDetalhe";
import NovoCaso from "@/pages/NovoCaso";
import Representacoes from "@/pages/Representacoes";
import Alertas from "@/pages/Alertas";
import Auditoria from "@/pages/Auditoria";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/modulos" element={<ProtectedRoute><Modulos /></ProtectedRoute>} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inqueritos" element={<Inqueritos />} />
            <Route path="/inqueritos/:ppe" element={<InqueritoDetalhe />} />
            <Route path="/novo-caso" element={<NovoCaso />} />
            <Route path="/representacoes" element={<Representacoes />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/auditoria" element={<Auditoria />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
