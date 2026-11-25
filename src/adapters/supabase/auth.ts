import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { evaluateIdentity } from '../../core/auth/policy';
import type { AuthPort, AuthStatus } from '../../core/auth/contract';

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
const allowedId = import.meta.env.VITE_ALLOWED_USER_ID?.trim() ?? '';
const validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const configured = /^https:\/\/[a-z0-9.-]+$/i.test(url) && publicKey.length > 10 && validUuid.test(allowedId);

/** No se crea cliente sin configuración pública completa. Nunca usar service_role en el navegador. */
export const supabase: SupabaseClient | null = configured
  ? createClient(url, publicKey, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })
  : null;

export function createAuthPort(): AuthPort {
  if (!supabase) {
    return { subscribe: (notify) => { notify({ kind: 'unconfigured' }); return () => {}; },
      signIn: async () => { throw new Error('Supabase no está configurado.'); },
      signOut: async () => {} };
  }
  const client = supabase;
  return {
    subscribe(notify: (status: AuthStatus) => void) {
      let active = true;
      notify({ kind: 'loading' });
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        const user = session?.user;
        notify(evaluateIdentity(user ? { id: user.id, email: user.email ?? null } : null, allowedId));
      });
      return () => { active = false; data.subscription.unsubscribe(); };
    },
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new Error('No se pudo iniciar sesión. Verifica las credenciales.');
      if (data.user?.id !== allowedId) {
        await client.auth.signOut();
        throw new Error('Esta cuenta no está autorizada.');
      }
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw new Error('No se pudo cerrar la sesión.');
    },
  };
}
