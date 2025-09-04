import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AllRecords from "./components/AllRecords";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthPage from "./pages/Auth";
import TeamPage from "./pages/Team";
import AppLayout from "./components/AppLayout";
import { UserProvider } from "./contexts/UserContext";
import { FeatureFlagProvider, useFeatureFlag } from "./contexts/FeatureFlagContext";
import SingleProvider from "./components/SingleProvider";
import { faker } from '@faker-js/faker';
import { useAnnotationMode } from "./hooks/useAnnotationMode";
import { AnnotationController } from "./components/AnnotationController";

const AuthWrapper = ({ user, loading, isAnnotationMode, setAnnotationMode }: { 
  user: any, 
  loading: boolean,
  isAnnotationMode: boolean,
  setAnnotationMode: (value: boolean) => void
}) => {
  const { value: requireAuth, isLoading: flagLoading } = useFeatureFlag("user_authentication");

  // Helper to get or create a dummy user for the session
  function getOrCreateDummyUser() {
    const key = 'oneview_dummy_user';
    const existing = sessionStorage.getItem(key);
    if (existing) return JSON.parse(existing);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'oneview.local' });
    const dummy = {
      id: faker.string.uuid(),
      email,
      user_metadata: { full_name: `${firstName} ${lastName}` }
    };
    sessionStorage.setItem(key, JSON.stringify(dummy));
    return dummy;
  }

  // Inject dummy user if auth is off and no real user
  const effectiveUser = (!requireAuth && !user) ? getOrCreateDummyUser() : user;

  if (loading || flagLoading) return <div>Loading...</div>;

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !effectiveUser) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Login route always accessible */}
      <Route path="/login" element={<AuthPage />} />
      {/* Redirect home to /team */}
      <Route path="/" element={<Navigate to="/team" replace />} />
      {/* Main app layout and routes */}
              <Route element={<AppLayout user={effectiveUser} isAnnotationMode={isAnnotationMode} setAnnotationMode={setAnnotationMode} />}>
        <Route path=":provider_id" element={<SingleProvider />} />
        <Route path="/all-records" element={<AllRecords />} />
        <Route path="/team" element={<TeamPage />} />
        {/* Catch-all route: redirect to /all-records */}
        <Route path="/*" element={<Navigate to="/all-records" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requireAuth, setRequireAuth] = useState(true);
  const [flagLoading, setFlagLoading] = useState(true);
  const { isAnnotationMode, toggleAnnotationMode, setAnnotationMode, clearAnnotationMode } = useAnnotationMode();

  // Helper to get or create a dummy user for the session
  function getOrCreateDummyUser() {
    const key = 'oneview_dummy_user';
    const existing = sessionStorage.getItem(key);
    if (existing) return JSON.parse(existing);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'oneview.local' });
    const dummy = {
      id: faker.string.uuid(),
      email,
      user_metadata: { full_name: `${firstName} ${lastName}` }
    };
    sessionStorage.setItem(key, JSON.stringify(dummy));
    return dummy;
  }

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

  // Fetch the user_authentication feature flag at the top level
  useEffect(() => {
    let cancelled = false;
    async function fetchFlag() {
      setFlagLoading(true);
      try {
        const { data, error } = await supabase
          .from('feature_settings')
          .select('setting_value')
          .eq('setting_key', 'user_authentication')
          .single();
        if (!cancelled) {
          const newRequireAuth = data ? data.setting_value : true;
          setRequireAuth(newRequireAuth);
          
          // If authentication is now required, clear any dummy user
          if (newRequireAuth) {
            sessionStorage.removeItem('oneview_dummy_user');
          }
        }
      } catch {
        if (!cancelled) setRequireAuth(true);
      } finally {
        if (!cancelled) setFlagLoading(false);
      }
    }
    fetchFlag();
    return () => { cancelled = true; };
  }, []);

  // Add keyboard shortcut for annotation mode (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAnnotationMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAnnotationMode]);

  // Inject dummy user if auth is off and no real user
  const effectiveUser = (!requireAuth && !user) ? getOrCreateDummyUser() : user;

  if (loading || flagLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnnotationController isAnnotationMode={isAnnotationMode} toggleAnnotationMode={toggleAnnotationMode}>
        <BrowserRouter>
          <UserProvider user={effectiveUser}>
            <FeatureFlagProvider>
              <AuthWrapper user={effectiveUser} loading={false} isAnnotationMode={isAnnotationMode} setAnnotationMode={setAnnotationMode} />
            </FeatureFlagProvider>
          </UserProvider>
        </BrowserRouter>
      </AnnotationController>
    </TooltipProvider>
  );
};

export default App;
