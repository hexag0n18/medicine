import { parseSession } from './session';

const COGNITO = import.meta.env.PUBLIC_COGNITO_URL;
const CLIENT = import.meta.env.PUBLIC_CLIENT_ID;
const CLAVE = "token";

export async function login(usuario, clave) {
  let r;
  try {
    r = await fetch(COGNITO, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT,
        AuthParameters: { USERNAME: usuario, PASSWORD: clave },
      }),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.");
  }
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(
      r.status === 400 ? "Usuario o contraseña incorrectos. Revísalos e intenta de nuevo." : "No pudimos iniciar tu sesión. Intenta de nuevo en unos minutos."
    );
  }
  // sessionStorage: se borra al cerrar la pestaña. En produccion usar Hosted UI con PKCE y cookie HttpOnly
  if (!datos.AuthenticationResult?.IdToken) throw new Error("Tu cuenta requiere completar un paso adicional. Comunícate con tu centro de salud.");
  if (!parseSession(datos.AuthenticationResult.IdToken)) {
    throw new Error('La cuenta no tiene un perfil válido. Comunícate con tu centro de salud.');
  }
  sessionStorage.setItem(CLAVE, datos.AuthenticationResult.IdToken);
}

// SignUp / ForgotPassword y similares: llamadas publicas de Cognito (sin token)
async function cognito(accion, cuerpo, errores = {}) {
  let r;
  try {
    r = await fetch(COGNITO, {
      method: "POST",
      headers: { "Content-Type": "application/x-amz-json-1.1", "X-Amz-Target": `AWSCognitoIdentityProviderService.${accion}` },
      body: JSON.stringify({ ClientId: CLIENT, ...cuerpo }),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.");
  }
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(errores[datos.__type?.split("#").pop()] || datos.message || "No se pudo completar la acción. Intenta de nuevo.");
  return datos;
}
const ERRORES = {
  UsernameExistsException: "Ese usuario ya existe. Elige otro.",
  InvalidPasswordException: "La contraseña debe tener al menos 12 caracteres.",
  CodeMismatchException: "El código no es correcto.",
  ExpiredCodeException: "El código venció. Solicita uno nuevo.",
};
export const registrar = (usuario, email, clave) => cognito("SignUp", { Username: usuario, Password: clave, UserAttributes: [{ Name: "email", Value: email }] }, ERRORES);
export const confirmarRegistro = (usuario, codigo) => cognito("ConfirmSignUp", { Username: usuario, ConfirmationCode: codigo }, ERRORES);
export const olvidePassword = (usuario) => cognito("ForgotPassword", { Username: usuario }, ERRORES);
export const confirmarPassword = (usuario, codigo, clave) => cognito("ConfirmForgotPassword", { Username: usuario, ConfirmationCode: codigo, Password: clave }, ERRORES);

export const token = () => typeof sessionStorage === "undefined" ? null : sessionStorage.getItem(CLAVE);

// Datos del usuario leidos del token (el servidor vuelve a validarlo en cada llamada)
export function sesion() {
  const t = token();
  if (!t) return null;
  const current = parseSession(t);
  if (!current) sessionStorage.removeItem(CLAVE);
  return current;
}

export function salir() {
  sessionStorage.removeItem(CLAVE);
  location.href = "/";
}
