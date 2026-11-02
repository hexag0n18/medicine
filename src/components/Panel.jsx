import { useEffect, useState } from "react";
import { salir, sesion as leerSesion } from "../lib/auth";
import Citas from "./Citas";
import Documentos from "./Documentos";
import Historial from "./Historial";

const SECCIONES = [
  { id: "citas", nombre: "Citas" },
  { id: "historial", nombre: "Historial" },
  { id: "documentos", nombre: "Documentos" },
];

export default function Panel() {
  const [sesion] = useState(leerSesion);
  const [seccion, setSeccion] = useState("citas");
  // El paciente siempre ve lo suyo; el medico elige un paciente desde sus citas
  const [elegido, setElegido] = useState(null);

  useEffect(() => {
    if (!sesion) location.href = "/";
  }, [sesion]);
  if (!sesion) return null;

  const pacienteId = sesion.rol === "paciente" ? sesion.id : elegido;

  function verHistorial(id) {
    setElegido(id);
    setSeccion("historial");
  }

  return (
    <div className="md:grid md:min-h-dvh md:grid-cols-[14rem_1fr]">
      <header className="flex items-center justify-between gap-4 bg-pino px-5 py-4 text-papel md:flex-col md:items-start md:justify-start md:gap-8 md:py-8">
        <div>
          <p className="text-lg font-bold">Telemedicina rural</p>
          <p className="text-sm">
            {sesion.usuario} · {sesion.rol === "medico" ? "Médico" : "Paciente"}
          </p>
        </div>
        <nav aria-label="Secciones" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-3 border-t-2 border-pino bg-papel text-pino md:static md:grid-cols-1 md:border-0 md:bg-transparent md:text-papel md:w-full">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeccion(s.id)}
              aria-current={seccion === s.id ? "page" : undefined}
              className={`min-h-14 px-3 font-bold md:rounded-lg md:text-left ${
                seccion === s.id ? "bg-flor text-pino" : ""
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </nav>
        <button onClick={salir} className="min-h-12 rounded-lg border-2 border-papel px-4 font-bold md:mt-auto">
          Salir
        </button>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-8 md:pb-12">
        {seccion === "citas" && <Citas sesion={sesion} verHistorial={verHistorial} />}
        {seccion === "historial" && <Historial sesion={sesion} pacienteId={pacienteId} />}
        {seccion === "documentos" && <Documentos pacienteId={pacienteId} />}
      </main>
    </div>
  );
}
