import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadDestination } from '../src/lib/upload.js';

const url = 'https://s3.us-east-2.amazonaws.com/telemedicina-documentos-968579693864/test/file.png?X-Amz-Signature=test%2Bsignature';

test('conserva exactamente ruta y query firmadas en desarrollo', () => {
  assert.equal(uploadDestination(url, true), '/s3-upload/telemedicina-documentos-968579693864/test/file.png?X-Amz-Signature=test%2Bsignature');
});
test('en producción conserva el destino S3 directo', () => {
  assert.equal(uploadDestination(url), url);
});
test('rechaza destinos externos, HTTP y buckets ajenos', () => {
  for (const value of ['https://example.com/file', url.replace('https:', 'http:'), url.replace('telemedicina-documentos-968579693864', 'otro-bucket'), 'https://user:password@s3.us-east-2.amazonaws.com/telemedicina-documentos-968579693864/file']) {
    assert.throws(() => uploadDestination(value, true));
  }
});
