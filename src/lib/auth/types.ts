/** Authenticated user as returned by the backend. */
export interface User {
  id?: string | number;
  name: string;
  email: string;
  roles?: string[];
}

export interface LoginInput {
  /** Accepts either the user's email or their username. */
  usernameOrEmail: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Flexible auth response shape. Different Spring setups return the JWT under
 * different keys and may or may not embed the user — the context normalises
 * whichever of these is present.
 */
export interface AuthResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: User;
  // Some backends return the user fields at the top level instead.
  id?: string | number;
  name?: string;
  email?: string;
  roles?: string[];
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
