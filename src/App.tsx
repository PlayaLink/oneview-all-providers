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
import { FeatureFlagProvider, useFeatureFlag } from "./contexts/FeatureFlagContext";
import MainContent from "./components/MainContent";
import SingleProvider from "./components/SingleProvider";

const queryClient = new QueryClient();

const AuthWrapper = ({ user, loading }: { user: any, loading: boolean }) => {
  const { value: requireAuth, isLoading: flagLoading } = useFeatureFlag("user_authentication");

  if (loading || flagLoading) return <div>Loading...</div>;
  if (requireAuth && !user) return <AuthPage />;

  return (
    <AppLayout user={user}>
      <Routes>
        {/* Route for provider detail pages with provider_id parameter */}
        <Route path="/:provider_id" element={<SingleProvider />} />
        {/* Route for the main page (all providers view) - now at /all-records */}
        <Route path="/all-records" element={<AllRecords />} />
        {/* New Team route */}
        <Route path="/team" element={<TeamPage />} />
        {/* Catch-all route: redirect to /all-records */}
        <Route path="/*" element={<Navigate to="/all-records" replace />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    })();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider user={user}>
            <FeatureFlagProvider>
              <AuthWrapper user={user} loading={loading} />
            </FeatureFlagProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
