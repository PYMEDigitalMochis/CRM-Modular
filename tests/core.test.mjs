import test from 'node:test';
import assert from 'node:assert/strict';
import { ModuleRegistry } from '../src/core/modules/registry.ts';
import { EventBus } from '../src/core/events/bus.ts';
const manifest = { id: 'contactos', nombre: 'Contactos', version: '0.1.0', contrato_version: 1, depende_de: ['nucleo'], rutas: ['/contactos'], entidades: ['contacto'], eventos_que_emite: [], eventos_que_escucha: [], permisos: ['leer'] };
test('registro y desactivación conservan manifiesto pero ocultan rutas', () => {
  const r = new ModuleRegistry([manifest]);
  assert.deepEqual(r.routes(), ['/contactos']);
  assert.equal(r.setEnabled('contactos', false), true);
  assert.deepEqual(r.routes(), []);
  assert.equal(r.get('contactos').manifest.id, 'contactos');
  assert.equal(r.setEnabled('contactos', true), true);
  assert.deepEqual(r.routes(), ['/contactos']);
});
test('un manifiesto inválido no impide registrar otros', () => {
  const r = new ModuleRegistry([{ ...manifest, id: 'malo', contrato_version: 99 }, manifest]);
  assert.equal(r.rejected.length, 1);
  assert.equal(r.list().length, 1);
});
test('rutas duplicadas y dependencias de módulos se rechazan', () => {
  const r = new ModuleRegistry([manifest, { ...manifest, id: 'otro', rutas: ['/contactos'] }, { ...manifest, id: 'dependiente', rutas: ['/otra'], depende_de: ['nucleo', 'contactos'] }]);
  assert.equal(r.list().length, 1);
  assert.equal(r.rejected.length, 2);
});
test('errores de suscriptores aislados; desuscripción funcional', () => {
  const bus = new EventBus();
  let received = 0;
  bus.subscribe('contacto.creado', () => { throw Error('falla simulada'); });
  const unsubscribe = bus.subscribe('contacto.creado', () => { received++; });
  const event = { tipo: 'contacto.creado', version: 1, ocurrido_en: new Date().toISOString(), origen: 'contactos', id_entidad: '123' };
  bus.publish(event);
  assert.equal(received, 1);
  assert.equal(bus.errors.length, 1);
  unsubscribe(); bus.publish(event);
  assert.equal(received, 1);
});
test('bus rechaza evento mal formado', () => {
  assert.throws(() => new EventBus().publish({ tipo: '', version: 0, ocurrido_en: '', origen: '', id_entidad: '' }));
});