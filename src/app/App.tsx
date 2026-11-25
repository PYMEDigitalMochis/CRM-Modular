import { useEffect, useState, type FormEvent } from 'react';
import { registry, auth } from './composition';
import type { AuthStatus } from '../core/auth/contract';
import { ContactosPlaceholder } from '../modules/contactos/ContactosPlaceholder';
import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setBusy(true);
    try { await auth.signIn(email.trim(), password); setPassword(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Error de acceso.'); }
    finally { setBusy(false); }
  };
  return <section className="panel"><h1>Acceso privado</h1>
    <p>Solo la cuenta autorizada puede utilizar este prototipo.</p>
    <form onSubmit={submit} className="login-form">
      <label htmlFor="email">Correo electrónico</label>
      <input id="email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" disabled={busy}>{busy ? 'Comprobando...' : 'Iniciar sesión'}</button>
    </form>
    {error && <p role="alert" className="error">{error}</p>}
  </section>;
}

export function App() {
  const [status, setStatus] = useState<AuthStatus>({ kind: 'loading' });
  const [enabled, setEnabled] = useState(registry.get('contactos')?.enabled ?? false);
  const [page, setPage] = useState<'inicio' | 'contactos'>('inicio');
  const [logoutError, setLogoutError] = useState('');
  useEffect(() => auth.subscribe(setStatus), []);
  const toggle = () => {
    const next = !enabled; registry.setEnabled('contactos', next); setEnabled(next);
    if (!next) setPage('inicio');
  };
  const loggedIn = status.kind === 'signed-in';
  return <div className="layout">
    <header><div className="brand">Agencia <span>· Núcleo</span></div><span className="version">Prototipo 0.2</span></header>
    <main>
      {status.kind === 'unconfigured' && <section className="panel"><h1>Configuración pendiente</h1><p role="alert">Falta configurar Supabase y el identificador de la cuenta permitida. El acceso está bloqueado.</p></section>}
      {status.kind === 'loading' && <p role="status">Comprobando sesión…</p>}
      {status.kind === 'signed-out' && <Login />}
      {status.kind === 'denied' && <section className="panel"><h1>Acceso no autorizado</h1><p>La sesión no corresponde a la cuenta permitida.</p><button onClick={() => { void auth.signOut().catch(() => setLogoutError('No fue posible cerrar la sesión.')); }}>Cerrar sesión</button></section>}
      {loggedIn && <><div className="banner" role="status">Prototipo: no guarda contactos ni protege tablas de datos. Las políticas RLS siguen pendientes.</div>
        <div className="session-bar"><span>{status.identity.email ?? 'Cuenta autorizada'}</span> <button onClick={() => { setLogoutError(''); void auth.signOut().catch(() => setLogoutError('No fue posible cerrar la sesión.')); }}>Cerrar sesión</button></div>
        <nav aria-label="Principal"><button aria-current={page === 'inicio' ? 'page' : undefined} onClick={() => setPage('inicio')}>Inicio</button>
          {enabled && <button aria-current={page === 'contactos' ? 'page' : undefined} onClick={() => setPage('contactos')}>Contactos</button>}
        </nav>
        {page === 'inicio' ? <section className="panel"><h1>Núcleo mínimo</h1>
          <p>Autenticación Supabase y contrato modular. Los datos todavía no se almacenan.</p>
          <div className="module-row"><div><strong>Contactos y prospectos</strong><small>Contrato v1 · Módulo compilado</small></div>
            <button onClick={toggle} aria-pressed={enabled}>{enabled ? 'Desactivar' : 'Activar'}</button></div>
        </section> : enabled ? <ContactosPlaceholder/> : null}</>}
      {logoutError && <p role="alert" className="error">{logoutError}</p>}
      {!!registry.rejected.length && <div role="alert" className="banner">Módulos rechazados: {registry.rejected.join('; ')}</div>}
    </main><footer>Etapa de autenticación · Sin despliegue ni datos reales</footer>
  </div>;
}
