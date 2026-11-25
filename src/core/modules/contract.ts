/** Contrato de manifiesto v1: no depende del CRM ni de proveedores. */
export const MODULE_CONTRACT_VERSION = 1 as const;
export type Permission = 'leer' | 'escribir';
export interface ModuleManifest {
  readonly id: string;
  readonly nombre: string;
  readonly version: string;
  readonly contrato_version: number;
  readonly depende_de: readonly string[];
  readonly rutas: readonly string[];
  readonly entidades: readonly string[];
  readonly eventos_que_emite: readonly string[];
  readonly eventos_que_escucha: readonly string[];
  readonly permisos: readonly Permission[];
}
export interface RegisteredModule { readonly manifest: ModuleManifest; readonly enabled: boolean; }