import { salir, token } from "./auth";

const BASE = import.meta.env.PUBLIC_API_URL;

export async function api(ruta, { metodo = "GET", cuerpo } = {}) {
  let r;
  try {
    r = await fetch(BASE + ruta, {
      method: metodo,
      headers: { Authorization: token(), ...(cuerpo && { "Content-Type": "application/json" }) },
      body: cuerpo && JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.");
  }
  if (r.status === 401) {
    salir();
    throw new Error("Tu sesión terminó. Ingresa de nuevo.");
  }
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(datos.error || "No se pudo completar la acción. Intenta de nuevo.");
  return datos;
}
