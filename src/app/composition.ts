import { ModuleRegistry } from '../core/modules/registry';
import { EventBus } from '../core/events/bus';
import { contactosManifest } from '../modules/contactos/manifest';
/** Único lugar donde la aplicación enlaza el núcleo con módulos concretos. */
export const registry = new ModuleRegistry([contactosManifest]);
export const bus = new EventBus();