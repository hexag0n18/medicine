import { useCallback, useEffect, useState } from "react";

export const campo =
  "block w-full min-h-12 rounded-lg border-2 border-pino/30 bg-white px-3 py-2 text-pino placeholder:text-tenue/70 focus:border-rio";

export function Boton({ secundario, className = "", ...props }) {
  const color = secundario ? "border-2 border-pino bg-transparent text-pino" : "bg-flor text-pino";
  return (
    <button
      className={`min-h-12 rounded-lg px-5 font-bold disabled:opacity-50 ${color} ${className}`}
      {...props}
    />
  );
}

export function Campo({ etiqueta, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-bold">{etiqueta}</span>
      {children}
    </label>
  );
}

export function Aviso({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border-2 border-alerta bg-white px-3 py-2 font-bold text-alerta">
      {children}
    </p>
  );
}

// Carga datos al montar y cuando cambia `clave`; devuelve { datos, error, cargando, recargar }
export function useCarga(cargar, clave) {
  const [estado, setEstado] = useState({ datos: null, error: "", cargando: true });
  const recargar = useCallback(() => {
    setEstado((e) => ({ ...e, cargando: true, error: "" }));
    cargar().then(
      (datos) => setEstado({ datos, error: "", cargando: false }),
      (err) => setEstado({ datos: null, error: err.message, cargando: false })
    );
  }, [clave]);
  useEffect(recargar, [recargar]);
  return { ...estado, recargar };
}

// La hoja de calendario: el motivo visual de la app
export function Fecha({ fecha, className = "" }) {
  const d = new Date(fecha);
  const valida = !Number.isNaN(d.getTime());
  return (
    <div className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-lg bg-flor text-pino ${className}`} aria-hidden="true">
      <span className="text-2xl font-bold leading-none">{valida ? d.getDate() : "?"}</span>
      <span className="text-sm">{valida ? d.toLocaleDateString("es", { month: "short" }).replace(".", "") : ""}</span>
    </div>
  );
}

export const hora = (fecha) =>
  new Date(fecha).toLocaleString("es", { weekday: "long", hour: "2-digit", minute: "2-digit" });
