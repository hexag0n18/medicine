import { useEffect, useState } from "react";
import { login, sesion } from "../lib/auth";
import { Aviso, Boton, Campo, Fecha, campo } from "./ui";

export default function Login() {
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (sesion()) location.href = "/app";
  }, []);

  async function enviar(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError("");
    try {
      await login(f.get("usuario").trim(), f.get("clave"));
      location.href = "/app";
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <main className="grid min-h-dvh md:grid-cols-2">
      <section className="flex flex-col justify-center gap-8 bg-pino px-6 py-12 text-papel md:px-14">
        <h1 className="max-w-md text-4xl font-bold leading-tight md:text-5xl">
          Tu consulta médica, sin viajar horas.
        </h1>
        <p className="max-w-md text-lg">
          Pide una cita, revisa tu historial y guarda tus documentos desde el celular.
        </p>
        <div className="flex max-w-md items-center gap-4 border-t border-papel/30 pt-6" aria-hidden="true">
          <Fecha fecha="2026-11-10T09:00" />
          <p>
            Martes, 9:00
            <br />
            Control con tu médico
          </p>
        </div>
      </section>

      <section className="flex items-center px-6 py-12 md:px-14">
        <form onSubmit={enviar} className="w-full max-w-sm space-y-5">
          <h2 className="text-2xl font-bold">Ingresa a tu cuenta</h2>
          <Campo etiqueta="Usuario">
            <input name="usuario" required autoComplete="username" autoCapitalize="none" className={campo} />
          </Campo>
          <Campo etiqueta="Contraseña">
            <input name="clave" type="password" required autoComplete="current-password" className={campo} />
          </Campo>
          <Aviso>{error}</Aviso>
          <Boton type="submit" disabled={enviando} className="w-full">
            {enviando ? "Ingresando…" : "Ingresar"}
          </Boton>
        </form>
      </section>
    </main>
  );
}
