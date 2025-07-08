import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  // Get the current origin for redirect URL
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback for SSR
    return import.meta.env.VITE_REDIRECT_URL || 'http://localhost:3000';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
        theme="light"
        redirectTo={getRedirectUrl()}
      />
    </div>
  );
} 