import type { AuthIdentity, AuthStatus } from './contract';
/** Barrera de presentación exclusivamente; el servidor debe aplicar RLS. */
export function evaluateIdentity(identity: AuthIdentity | null, allowedId: string): AuthStatus {
  if (!identity) return { kind: 'signed-out' };
  return identity.id === allowedId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(allowedId)
    ? { kind: 'signed-in', identity }
    : { kind: 'denied' };
}
