import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { AppState } from "react-native";
import * as Linking from "expo-linking";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

function extractTokensFromUrl(url: string) {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return null;

  const hash = url.substring(hashIndex + 1);
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    return { access_token, refresh_token };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    async function init() {
      // Check deep link for tokens (password reset flow) before resolving session
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const tokens = extractTokensFromUrl(url);
          if (tokens) {
            await supabase.auth.setSession(tokens);
          }
        }
      } catch {
        // Deep link check failed, continue with normal session
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    }

    init();

    // Handle deep links when app is already running (warm start)
    const linkingSub = Linking.addEventListener("url", async ({ url }) => {
      const tokens = extractTokensFromUrl(url);
      if (tokens) {
        await supabase.auth.setSession(tokens);
      }
    });

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state == "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
