// hooks/useAuth.tsx
// ═══════════════════════════════════════════════════════════════
// AUTH STORE
//
// KEY FEATURE: Users CANNOT log in unless they have registered.
// An in-memory `userRegistry` Map stores all registered accounts.
//
// login()    → checks if email exists in registry + password matches
//              returns error: "No account found" if not registered
//              returns error: "Incorrect password" if wrong password
//
// register() → adds email+password to registry, sets isNewUser=true
//
// Replace the in-memory Map with your real backend (Supabase, etc.)
// when ready. The shape of the functions stays the same.
// ═══════════════════════════════════════════════════════════════

import React, {
    createContext,
    ReactNode,
    useContext,
    useRef,
    useState,
} from "react";

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  setupProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── In-memory user registry ──────────────────────────────────────
// Map<email, hashedPassword>
// In production: replace with Supabase/Firebase/your own API.
// We use useRef so the registry persists across re-renders
// but resets on app restart (as expected for in-memory storage).
type Registry = Map<string, string>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Persists across renders without causing re-renders itself
  const registry = useRef<Registry>(new Map());

  // Simulates API latency — remove when using a real backend
  const delay = () => new Promise<void>((r) => setTimeout(r, 800));

  // ── LOGIN ──────────────────────────────────────────────────────
  // Step 1: Check if email exists in registry
  // Step 2: Check if password matches
  // Step 3: If both pass → set user → NavigationGuard → /home
  const login = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    await delay();

    const normalised = email.toLowerCase().trim();

    // ① No account found — must register first
    if (!registry.current.has(normalised)) {
      return {
        error: "No account found with this email. Please register first.",
      };
    }

    // ② Wrong password
    if (registry.current.get(normalised) !== password) {
      return { error: "Incorrect password. Please try again." };
    }

    // ③ Success
    setUser({ email: normalised });
    setIsNewUser(false);
    return {};
  };

  // ── REGISTER ──────────────────────────────────────────────────
  // Step 1: Check if email already registered
  // Step 2: Add to registry
  // Step 3: Set user + isNewUser=true → NavigationGuard → /setup
  const register = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    await delay();

    const normalised = email.toLowerCase().trim();

    // Already registered
    if (registry.current.has(normalised)) {
      return {
        error: "This email is already registered. Please sign in instead.",
      };
    }

    // Store credentials
    registry.current.set(normalised, password);

    setUser({ email: normalised });
    setIsNewUser(true); // → triggers redirect to /setup
    return {};
  };

  // ── SETUP PROFILE ─────────────────────────────────────────────
  const setupProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev!, ...data }));
    setIsNewUser(false); // → triggers redirect to /home
  };

  // ── LOGOUT ────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setIsNewUser(false);
    // Note: registry persists — user can still log back in
  };

  return (
    <AuthContext.Provider
      value={{ user, isNewUser, login, register, setupProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
