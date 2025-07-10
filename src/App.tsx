import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AllRecords from "./components/AllRecords";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthPage from "./pages/Auth";
import TeamPage from "./pages/Team";
import AppLayout from "./components/AppLayout";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <AuthPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider user={user}>
            <AppLayout user={user}>
              <Routes>
                {/* Route for provider detail pages with NPI parameter */}
                <Route path="/:npi" element={<AllRecords />} />
                {/* Route for the main page (all providers view) - now at /all-records */}
                <Route path="/all-records" element={<AllRecords />} />
                {/* New Team route */}
                <Route path="/team" element={<TeamPage />} />
                {/* Catch-all route: redirect to /all-records */}
                <Route path="/*" element={<Navigate to="/all-records" replace />} />
              </Routes>
            </AppLayout>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
