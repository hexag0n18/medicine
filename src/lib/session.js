// Solo interpreta la sesión para la interfaz. La firma y los permisos deben
// verificarse en Cognito/API Gateway y en cada operación del backend.
export function parseSession(token, now = Date.now()) {
  if (typeof token !== 'string' || token.split('.').length !== 3) return null;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    if (!Number.isFinite(claims.exp) || claims.exp * 1000 <= now) return null;
    if (typeof claims.sub !== 'string' || !claims.sub) return null;
    if (typeof claims['cognito:username'] !== 'string' || !claims['cognito:username']) return null;
    const groups = [].concat(claims['cognito:groups'] ?? []);
    const role = groups.includes('medico') ? 'medico' : groups.includes('paciente') ? 'paciente' : null;
    if (!role) return null;
    return { id: claims.sub, usuario: claims['cognito:username'], rol: role };
  } catch {
    return null;
  }
}
