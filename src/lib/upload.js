const DOCUMENTS_ORIGIN = 'https://s3.us-east-2.amazonaws.com';
const DOCUMENTS_PREFIX = '/telemedicina-documentos-968579693864/';

// El proxy de desarrollo está limitado al bucket existente. Conserva la ruta
// y query firmadas: no es un proxy abierto ni modifica los permisos de S3.
export function uploadDestination(signedUrl, development = false) {
  const url = new URL(signedUrl);
  if (url.origin !== DOCUMENTS_ORIGIN || !url.pathname.startsWith(DOCUMENTS_PREFIX) || url.username || url.password) {
    throw new Error('El servidor devolvió un destino de carga no permitido.');
  }
  return development ? `/s3-upload${url.pathname}${url.search}` : url.href;
}
