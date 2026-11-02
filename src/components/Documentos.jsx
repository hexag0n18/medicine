import { useState } from "react";
import { api } from "../lib/api";
import { Aviso, Boton, Campo, campo, useCarga } from "./ui";

const MAX_MB = 10;

export default function Documentos({ pacienteId }) {
  const { datos, error, cargando, recargar } = useCarga(
    () => (pacienteId ? api(`/documentos/${pacienteId}`) : Promise.resolve([])),
    pacienteId
  );
  const [errorSubida, setErrorSubida] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  if (!pacienteId) {
    return <p className="text-tenue">Elige “Ver historial” en una cita para ver los documentos de ese paciente.</p>;
  }

  async function subir(e) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const archivo = new FormData(formulario).get("archivo");
    if (archivo.size > MAX_MB * 1024 * 1024) {
      setErrorSubida(`El archivo pesa más de ${MAX_MB} MB. Elige uno más liviano.`);
      return;
    }
    setSubiendo(true);
    setErrorSubida("");
    try {
      const { url } = await api("/documentos", { metodo: "POST", cuerpo: { paciente_id: pacienteId, nombre: archivo.name } });
      // El archivo va directo al almacenamiento, sin pasar por la API
      const r = await fetch(url, { method: "PUT", body: archivo });
      if (!r.ok) throw new Error("No se pudo subir el archivo. Intenta de nuevo.");
      formulario.reset();
      recargar();
    } catch (err) {
      setErrorSubida(err.message);
    }
    setSubiendo(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={subir} className="space-y-4 border-b-2 border-pino/20 pb-8">
        <h2 className="text-xl font-bold">Subir un documento</h2>
        <Campo etiqueta={`Archivo (PDF o foto, hasta ${MAX_MB} MB)`}>
          <input name="archivo" type="file" required accept="application/pdf,image/*" className={campo} />
        </Campo>
        <Aviso>{errorSubida}</Aviso>
        <Boton type="submit" disabled={subiendo}>
          {subiendo ? "Subiendo…" : "Subir documento"}
        </Boton>
      </form>
      <section>
        <h2 className="mb-4 text-xl font-bold">Mis documentos</h2>
        <Aviso>{error}</Aviso>
        {cargando && <p className="text-tenue">Cargando…</p>}
        {datos?.length === 0 && <p className="text-tenue">Todavía no hay documentos guardados.</p>}
        <ul className="divide-y-2 divide-pino/15">
          {datos?.map((d) => (
            <li key={d.clave} className="flex items-center justify-between gap-4 py-4">
              <span className="min-w-0 break-words font-bold">{d.nombre}</span>
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-bold text-rio underline">
                Abrir
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
