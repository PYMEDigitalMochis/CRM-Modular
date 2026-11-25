/** Puerto preparado para la etapa CRM; no constituye persistencia implementada. */
export interface EntityRepository<T extends { id: string }> {
  get(id: string): Promise<T | null>;
  list(): Promise<readonly T[]>;
  save(entity: T): Promise<T>;
}