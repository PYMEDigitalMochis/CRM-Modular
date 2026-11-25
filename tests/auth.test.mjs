import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateIdentity } from '../src/core/auth/policy.ts';
const id = 'd2f53a2a-9429-45b6-8325-f6f608f225ee';
test('sin sesión devuelve signed-out', () => assert.equal(evaluateIdentity(null, id).kind, 'signed-out'));
test('solo el UUID permitido obtiene acceso a la UI', () => {
  assert.equal(evaluateIdentity({ id, email: null }, id).kind, 'signed-in');
  assert.equal(evaluateIdentity({ id: '7ee9ba12-cac7-4386-8a0e-dc033f255be4', email: null }, id).kind, 'denied');
});
test('configuración de identificador inválida rechaza toda sesión', () => {
  assert.equal(evaluateIdentity({ id, email: null }, '').kind, 'denied');
  assert.equal(evaluateIdentity({ id, email: null }, 'not-a-uuid').kind, 'denied');
});
