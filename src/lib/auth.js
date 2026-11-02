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
  sessionStorage.setItem(CLAVE, datos.AuthenticationResult.IdToken);
}

export const token = () => sessionStorage.getItem(CLAVE);

// Datos del usuario leidos del token (el servidor vuelve a validarlo en cada llamada)
export function sesion() {
  const t = token();
  if (!t) return null;
  try {
    const p = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (p.exp * 1000 < Date.now()) return null;
    const grupos = [].concat(p["cognito:groups"] ?? []);
    return { id: p.sub, usuario: p["cognito:username"], rol: grupos.includes("medico") ? "medico" : "paciente" };
  } catch {
    return null;
  }
}

export function salir() {
  sessionStorage.removeItem(CLAVE);
  location.href = "/";
}
