import { useState } from 'react';
import { registry } from './composition';
import { ContactosPlaceholder } from '../modules/contactos/ContactosPlaceholder';
import './styles.css';

export function App() {
  const [enabled, setEnabled] = useState(registry.get('contactos')?.enabled ?? false);
  const [page, setPage] = useState<'inicio' | 'contactos'>('inicio');
  const toggle = () => {
    const next = !enabled;
    registry.setEnabled('contactos', next);
    setEnabled(next);
    if (!next) setPage('inicio');
  };
  return <div className="layout">
    <header><div className="brand">Agencia <span>· Núcleo</span></div><span className="version">Prototipo 0.1</span></header>
    <main>
      <div className="banner" role="status">Prototipo de arquitectura. No dispone de inicio de sesión ni guarda datos.</div>
      <nav aria-label="Principal"><button aria-current={page === 'inicio' ? 'page' : undefined} onClick={() => setPage('inicio')}>Inicio</button>
        {enabled && <button aria-current={page === 'contactos' ? 'page' : undefined} onClick={() => setPage('contactos')}>Contactos</button>}
      </nav>
      {page === 'inicio' ? <section className="panel"><h1>Núcleo mínimo</h1>
        <p>Verificación del contrato modular y de la independencia de la interfaz.</p>
        <div className="module-row"><div><strong>Contactos y prospectos</strong><small>Contrato v1 · Módulo compilado</small></div>
        <button onClick={toggle} aria-pressed={enabled}>{enabled ? 'Desactivar' : 'Activar'}</button></div>
        <p className="hint">Al desactivar el módulo, desaparece del menú. La configuración de esta demo se reinicia al recargar.</p>
      </section> : enabled ? <ContactosPlaceholder/> : null}
      {!!registry.rejected.length && <div role="alert" className="banner">Módulos rechazados: {registry.rejected.join('; ')}</div>}
    </main><footer>Etapa de estructura · Sin despliegue ni acceso a datos</footer>
  </div>;
}