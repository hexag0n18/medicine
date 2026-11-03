import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSession } from '../src/lib/session.js';

const now = 1_800_000_000_000;
const claims = { sub: 'patient-test', exp: now / 1000 + 60, 'cognito:username': 'José', 'cognito:groups': ['paciente'] };
const token = (payload) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

test('interpreta identidad UTF-8 y rol del paciente', () => {
  assert.deepEqual(parseSession(token(claims), now), { id: 'patient-test', usuario: 'José', rol: 'paciente' });
});
test('reconoce el grupo médico', () => {
  assert.equal(parseSession(token({ ...claims, 'cognito:groups': ['medico'] }), now).rol, 'medico');
});
test('reconoce el grupo admin', () => {
  assert.equal(parseSession(token({ ...claims, 'cognito:groups': ['admin'] }), now).rol, 'admin');
});
test('rechaza expiración alcanzada, pasada o ausente', () => {
  for (const exp of [now / 1000, now / 1000 - 1, undefined, '9999999999']) {
    assert.equal(parseSession(token({ ...claims, exp }), now), null);
  }
});
test('no concede rol paciente a grupos desconocidos o ausentes', () => {
  for (const groups of [undefined, [], ['superusuario']]) {
    assert.equal(parseSession(token({ ...claims, 'cognito:groups': groups }), now), null);
  }
});
test('rechaza tokens dañados e identidades incompletas', () => {
  for (const value of [null, '', 'broken', 'a.??.c', token({ ...claims, sub: '' }), token({ ...claims, 'cognito:username': null })]) {
    assert.equal(parseSession(value, now), null);
  }
});
