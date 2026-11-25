import type { ModuleManifest } from '../../core/modules/contract';
export const contactosManifest: ModuleManifest = {
  id: 'contactos', nombre: 'Contactos y prospectos', version: '0.1.0',
  contrato_version: 1, depende_de: ['nucleo'],
  rutas: ['/contactos', '/contactos/:id'],
  entidades: ['contacto', 'interaccion'],
  eventos_que_emite: ['contacto.creado', 'contacto.estado_cambiado'],
  eventos_que_escucha: [], permisos: ['leer', 'escribir']
};