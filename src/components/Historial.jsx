import { useState } from 'react';
import { api } from '../lib/api';
import { Aviso, Boton, Campo, Empty, Loading, campo, useCarga } from './ui';
import Icon from './Icon';
export default function Historial({ sesion, pacienteId }) {
  const { datos, error, cargando, recargar } = useCarga(() => pacienteId ? api(`/historiales/${encodeURIComponent(pacienteId)}`) : Promise.resolve([]), pacienteId);
  const [errorNota, setErrorNota] = useState(''); const [guardando, setGuardando] = useState(false); const [exito, setExito] = useState('');
  if (!pacienteId) return <section className="card"><Empty icon="user" title="Selecciona un paciente">En tu agenda, elige «Ver historial» en una cita para consultar sus notas clínicas.</Empty></section>;
  async function guardar(e) {
    e.preventDefault(); const formulario = e.currentTarget; const nota = new FormData(formulario).get('nota').trim(); setErrorNota(''); setExito('');
    if (!nota) { setErrorNota('Escribe una nota antes de guardarla.'); return; } setGuardando(true);
    try { await api(`/historiales/${encodeURIComponent(pacienteId)}`, { metodo: 'POST', cuerpo: { nota } }); formulario.reset(); setExito('Nota clínica guardada correctamente.'); recargar(); } catch (err) { setErrorNota(err.message); } finally { setGuardando(false); }
  }
  async function borrar(n) {
    if (!confirm('¿Eliminar esta nota clínica?')) return; setErrorNota(''); setExito('');
    try { await api(`/historiales/${encodeURIComponent(pacienteId)}/${encodeURIComponent(n.fecha)}`, { metodo: 'DELETE' }); recargar(); } catch (err) { setErrorNota(err.message); }
  }
  return <div className="records-layout"><section className="card"><div className="card-heading"><span className="icon-box"><Icon name="history" /></span><div><h2>Historial de consultas</h2><p>El registro de tus atenciones de salud.</p></div><button className="text-button" onClick={recargar} disabled={cargando}>Actualizar</button></div><Aviso>{error}</Aviso>{cargando ? <Loading /> : !error && (!datos?.length ? <Empty icon="history" title="Una historia por comenzar">Las notas registradas por tu médico aparecerán aquí después de tus consultas.</Empty> : <ol className="timeline">{[...datos].sort((a,b) => new Date(b.fecha)-new Date(a.fecha)).map((n,i) => <li key={`${n.fecha}-${i}`}><span className="timeline-dot" /><span className="eyebrow">{new Date(n.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span><h3>Nota de consulta</h3><span className="record-doctor"><Icon name="user" size={16} /> Registrada por {n.medico}</span><p className="clinical-note">{n.nota}</p>{sesion.rol === 'medico' && n.medico === sesion.usuario && <button className="text-button" onClick={() => borrar(n)}>Eliminar nota</button>}</li>)}</ol>)}</section>
    {sesion.rol === 'medico' ? <form onSubmit={guardar} className="card note-form"><div className="card-heading"><span className="icon-box"><Icon name="plus" /></span><div><h2>Nueva nota clínica</h2><p>Registra la atención de este paciente.</p></div></div><Campo etiqueta="Nota de la consulta"><textarea name="nota" rows="8" required maxLength="5000" placeholder="Escribe los detalles de la atención…" className={campo} /><small>Máximo 5000 caracteres. Revisa la nota antes de guardarla.</small></Campo><Aviso>{errorNota}</Aviso><Aviso exito>{exito}</Aviso><Boton type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar nota'}<Icon name="check" size={18} /></Boton></form> : <aside className="information-card"><Icon name="shield" size={30} /><h3>Tu historia importa</h3><p>Este espacio reúne las notas de tus consultas. Si tienes dudas sobre un registro, conversa con tu médico.</p></aside>}
  </div>;
}
