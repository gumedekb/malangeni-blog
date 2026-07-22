"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, AUTH_ENDPOINTS } from "@/lib/api";
import type {
  AuthResponse,
  AuthStatus,
  LoginInput,
  SignupInput,
  User,
} from "./types";

const TOKEN_KEY = "malangeni.token";
const USER_KEY = "malangeni.user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function pickToken(data: AuthResponse): string | undefined {
  return data.token ?? data.accessToken ?? data.jwt;
}

function pickUser(data: AuthResponse): User | undefined {
  if (data.user) return data.user;
  if (data.email) {
    return {
      id: data.id,
      name: data.name ?? data.email,
      email: data.email,
      roles: data.roles,
    };
  }
  return undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const persist = useCallback((nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authenticated");
    try {
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } catch {
      /* storage may be unavailable (private mode) — session-only auth is fine */
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Hydrate from storage on first load, then revalidate against the backend.
  useEffect(() => {
    let cachedToken: string | null = null;
    let cachedUser: User | null = null;
    try {
      cachedToken = localStorage.getItem(TOKEN_KEY);
      const rawUser = localStorage.getItem(USER_KEY);
      cachedUser = rawUser ? (JSON.parse(rawUser) as User) : null;
    } catch {
      /* ignore */
    }

    if (!cachedToken) {
      setStatus("unauthenticated");
      return;
    }

    // Show the cached identity immediately to avoid a login flash…
    setToken(cachedToken);
    if (cachedUser) setUser(cachedUser);
    setStatus("authenticated");

    // …then confirm the token is still valid.
    apiFetch<User>(AUTH_ENDPOINTS.me, { token: cachedToken })
      .then((fresh) => {
        setUser(fresh);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        } catch {
          /* ignore */
        }
      })
      .catch((err) => {
        // Only force logout when the server actively rejects the token.
        if (err && typeof err === "object" && "status" in err) {
          const status = (err as { status: number }).status;
          if (status === 401 || status === 403) logout();
        }
      });
  }, [logout]);

  const login = useCallback(
    async (input: LoginInput) => {
      const data = await apiFetch<AuthResponse>(AUTH_ENDPOINTS.login, {
        method: "POST",
        body: JSON.stringify(input),
      });
      const nextToken = pickToken(data);
      if (!nextToken) throw new Error("The server did not return an auth token.");
      const nextUser =
        pickUser(data) ??
        (await apiFetch<User>(AUTH_ENDPOINTS.me, { token: nextToken }));
      persist(nextToken, nextUser);
    },
    [persist],
  );

  const signup = useCallback(
    async (input: SignupInput) => {
      const data = await apiFetch<AuthResponse>(AUTH_ENDPOINTS.register, {
        method: "POST",
        body: JSON.stringify(input),
      });
      // Some backends log the user in on register (return a token); others
      // just create the account. Handle both.
      const nextToken = pickToken(data);
      if (nextToken) {
        const nextUser =
          pickUser(data) ??
          (await apiFetch<User>(AUTH_ENDPOINTS.me, { token: nextToken }));
        persist(nextToken, nextUser);
        return;
      }
      // No token on register → sign the new user straight in.
      await login({ usernameOrEmail: input.email, password: input.password });
    },
    [persist, login],
  );

  const value = useMemo(
    () => ({ user, token, status, login, signup, logout }),
    [user, token, status, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
