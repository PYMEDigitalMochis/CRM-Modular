export interface AuthIdentity { readonly id: string; readonly email: string | null; }
export type AuthStatus =
  | { readonly kind: 'loading' }
  | { readonly kind: 'unconfigured' }
  | { readonly kind: 'signed-out' }
  | { readonly kind: 'denied' }
  | { readonly kind: 'signed-in'; readonly identity: AuthIdentity };
export interface AuthPort {
  subscribe(listener: (status: AuthStatus) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
