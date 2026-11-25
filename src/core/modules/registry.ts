import { MODULE_CONTRACT_VERSION } from './contract.ts';
import type { ModuleManifest, RegisteredModule } from './contract.ts';

const VALID_ID = /^[a-z][a-z0-9_-]*$/;
const VALID_ROUTE = /^\/[a-z0-9_/:\-]+$/;

export function validateManifest(m: ModuleManifest): string[] {
  const errors: string[] = [];
  if (!VALID_ID.test(m.id)) errors.push('id inválido');
  if (!m.nombre.trim()) errors.push('nombre vacío');
  if (!/^\d+\.\d+\.\d+$/.test(m.version)) errors.push('versión inválida');
  if (m.contrato_version !== MODULE_CONTRACT_VERSION) errors.push('versión de contrato incompatible');
  if (!m.depende_de.includes('nucleo') || m.depende_de.some(d => d !== 'nucleo')) errors.push('dependencias no admitidas');
  if (!m.rutas.length || m.rutas.some(r => !VALID_ROUTE.test(r))) errors.push('rutas inválidas');
  if (new Set(m.rutas).size !== m.rutas.length) errors.push('rutas duplicadas');
  if (m.permisos.some(p => p !== 'leer' && p !== 'escribir')) errors.push('permisos inválidos');
  if (new Set(m.entidades).size !== m.entidades.length) errors.push('entidades duplicadas');
  return errors;
}

/** Un manifiesto incorrecto se rechaza sin impedir iniciar la aplicación. */
export class ModuleRegistry {
  private readonly entries = new Map<string, RegisteredModule>();
  readonly rejected: string[] = [];

  constructor(manifests: readonly ModuleManifest[]) {
    const reservedRoutes = new Set<string>();
    for (const manifest of manifests) {
      const errors = validateManifest(manifest);
      if (this.entries.has(manifest.id)) errors.push('id duplicado');
      if (manifest.rutas.some(route => reservedRoutes.has(route))) errors.push('ruta ya registrada');
      if (errors.length) {
        this.rejected.push(`${manifest.id || '(sin id)'}: ${errors.join(', ')}`);
        continue;
      }
      this.entries.set(manifest.id, { manifest, enabled: true });
      manifest.rutas.forEach(route => reservedRoutes.add(route));
    }
  }

  list(): RegisteredModule[] { return [...this.entries.values()]; }
  get(id: string): RegisteredModule | undefined { return this.entries.get(id); }
  setEnabled(id: string, enabled: boolean): boolean {
    const current = this.entries.get(id);
    if (!current) return false;
    this.entries.set(id, { ...current, enabled });
    return true;
  }
  routes(): string[] { return this.list().filter(e => e.enabled).flatMap(e => [...e.manifest.rutas]); }
}