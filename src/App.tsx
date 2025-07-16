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

  return (
    <Routes>
      {/* Login route always accessible */}
      <Route path="/login" element={<AuthPage />} />
      {/* Redirect home to /team */}
      <Route path="/" element={<Navigate to="/team" replace />} />
      {/* Main app layout and routes */}
      <Route element={<AppLayout user={user} />}>
        <Route path=":provider_id" element={<SingleProvider />} />
        <Route path="/all-records" element={<AllRecords />} />
        <Route path="/team" element={<TeamPage />} />
        {/* Catch-all route: redirect to /all-records */}
        <Route path="/*" element={<Navigate to="/all-records" replace />} />
      </Route>
      {/* If auth is required and not logged in, redirect to /login */}
      {requireAuth && !user && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
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
