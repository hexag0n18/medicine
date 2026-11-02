import { useState } from "react";
import { api } from "../lib/api";
import { Aviso, Boton, Campo, Fecha, campo, hora, useCarga } from "./ui";

function NuevaCita({ alCrear }) {
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const f = new FormData(formulario);
    setEnviando(true);
    setError("");
    try {
      await api("/citas", {
        metodo: "POST",
        cuerpo: { fecha: f.get("fecha"), medico: f.get("medico").trim(), motivo: f.get("motivo").trim() },
      });
      formulario.reset();
      alCrear();
    } catch (err) {
      setError(err.message);
    }
    setEnviando(false);
  }

  return (
    <form onSubmit={enviar} className="space-y-4 border-b-2 border-pino/20 pb-8">
      <h2 className="text-xl font-bold">Pedir una cita</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Día y hora">
          <input name="fecha" type="datetime-local" required className={campo} />
        </Campo>
        <Campo etiqueta="Usuario del médico">
          <input name="medico" required autoCapitalize="none" className={campo} />
        </Campo>
      </div>
      <Campo etiqueta="¿Qué necesitas consultar?">
        <textarea name="motivo" rows="2" maxLength="500" className={campo} />
      </Campo>
      <Aviso>{error}</Aviso>
      <Boton type="submit" disabled={enviando}>
        {enviando ? "Guardando…" : "Pedir cita"}
      </Boton>
    </form>
  );
}

export default function Citas({ sesion, verHistorial }) {
  const { datos, error, cargando, recargar } = useCarga(() => api("/citas"), sesion.id);
  const esMedico = sesion.rol === "medico";

  return (
    <div className="space-y-8">
      {!esMedico && <NuevaCita alCrear={recargar} />}
      <section>
        <h2 className="mb-4 text-xl font-bold">{esMedico ? "Citas con tus pacientes" : "Mis citas"}</h2>
        <Aviso>{error}</Aviso>
        {cargando && <p className="text-tenue">Cargando…</p>}
        {datos?.length === 0 && (
          <p className="text-tenue">
            {esMedico ? "Aún no tienes citas agendadas." : "Todavía no tienes citas. Pide la primera arriba."}
          </p>
        )}
        <ul className="divide-y-2 divide-pino/15">
          {datos?.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-4">
              <Fecha fecha={c.fecha} />
              <div className="min-w-0 flex-1">
                <p className="font-bold capitalize">{hora(c.fecha)}</p>
                <p>{esMedico ? `Paciente ${c.paciente_id.slice(0, 8)}` : `Con ${c.medico}`}</p>
                {c.motivo && <p className="truncate text-tenue">{c.motivo}</p>}
              </div>
              {esMedico && (
                <Boton secundario onClick={() => verHistorial(c.paciente_id)}>
                  Ver historial
                </Boton>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
