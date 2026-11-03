import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
export const campo = 'field-input';
export function Boton({ secundario, className = '', ...props }) { return <button className={`button ${secundario ? 'button-secondary' : 'button-primary'} ${className}`} {...props} />; }
export function Campo({ etiqueta, children }) { return <label className="field"><span>{etiqueta}</span>{children}</label>; }
export function Aviso({ children, exito = false }) { if (!children) return null; return <p role={exito ? 'status' : 'alert'} className={`notice ${exito ? 'success' : 'error'}`}>{children}</p>; }
export function Empty({ icon = 'calendar', title, children }) { return <div className="empty-state"><span><Icon name={icon} size={28} /></span><h3>{title}</h3><p>{children}</p></div>; }
export function Loading() { return <div className="loading" role="status"><span className="spinner" /> Cargando tu información…</div>; }
export function useCarga(cargar, clave) {
  const loader = useRef(cargar); loader.current = cargar;
  const sequence = useRef(0);
  const [estado, setEstado] = useState({ datos: null, error: '', cargando: true });
  const recargar = useCallback(() => {
    const current = ++sequence.current;
    setEstado({ datos: null, cargando: true, error: '' });
    Promise.resolve().then(() => loader.current()).then(datos => { if (current === sequence.current) setEstado({ datos, error: '', cargando: false }); }, err => { if (current === sequence.current) setEstado({ datos: null, error: err.message, cargando: false }); });
  }, [clave]);
  useEffect(() => { recargar(); return () => { sequence.current++; }; }, [recargar]);
  return { ...estado, recargar };
}
export function Fecha({ fecha, className = '' }) {
  const d = new Date(fecha); const valida = !Number.isNaN(d.getTime());
  return <div className={`date-tile ${className}`} aria-hidden="true"><strong>{valida ? d.getDate() : '—'}</strong><span>{valida ? d.toLocaleDateString('es', { month: 'short' }).replace('.', '') : ''}</span></div>;
}
export const hora = fecha => new Date(fecha).toLocaleString('es-PE', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
