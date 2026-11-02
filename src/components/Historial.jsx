import { useState } from "react";
import { api } from "../lib/api";
import { Aviso, Boton, Campo, campo, useCarga } from "./ui";

export default function Historial({ sesion, pacienteId }) {
  const { datos, error, cargando, recargar } = useCarga(
    () => (pacienteId ? api(`/historiales/${pacienteId}`) : Promise.resolve([])),
    pacienteId
  );
  const [errorNota, setErrorNota] = useState("");

  if (!pacienteId) {
    return <p className="text-tenue">Elige “Ver historial” en una cita para abrir el historial de ese paciente.</p>;
  }

  async function guardar(e) {
    e.preventDefault();
    const formulario = e.currentTarget;
    setErrorNota("");
    try {
      await api(`/historiales/${pacienteId}`, { metodo: "POST", cuerpo: { nota: new FormData(formulario).get("nota") } });
      formulario.reset();
      recargar();
    } catch (err) {
      setErrorNota(err.message);
    }
  }

  return (
    <div className="space-y-8">
      {sesion.rol === "medico" && (
        <form onSubmit={guardar} className="space-y-4 border-b-2 border-pino/20 pb-8">
          <h2 className="text-xl font-bold">Agregar una nota</h2>
          <Campo etiqueta="Nota de la consulta">
            <textarea name="nota" rows="4" required maxLength="5000" className={campo} />
          </Campo>
          <Aviso>{errorNota}</Aviso>
          <Boton type="submit">Guardar nota</Boton>
        </form>
      )}
      <section>
        <h2 className="mb-4 text-xl font-bold">Historial clínico</h2>
        <Aviso>{error}</Aviso>
        {cargando && <p className="text-tenue">Cargando…</p>}
        {datos?.length === 0 && <p className="text-tenue">Todavía no hay notas en este historial.</p>}
        <ol className="divide-y-2 divide-pino/15">
          {datos?.map((n) => (
            <li key={n.fecha} className="py-4">
              <p className="font-bold">
                {new Date(n.fecha).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-tenue">Atendió {n.medico}</p>
              <p className="mt-2 whitespace-pre-wrap">{n.nota}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
