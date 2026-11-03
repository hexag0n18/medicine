import { useState } from 'react';
import { api } from '../lib/api';
import { Aviso, Boton, Campo, Empty, Loading, Fecha, campo, hora, useCarga } from './ui';
import Icon from './Icon';
function Acciones({ cita, alCambiar }) {
  const [editando, setEditando] = useState(false); const [error, setError] = useState(''); const [ocupado, setOcupado] = useState(false);
  async function cambiar(cuerpo) {
    setOcupado(true); setError('');
    try { await api(`/citas/${encodeURIComponent(cita.paciente_id)}/${encodeURIComponent(cita.id)}`, { metodo: 'PATCH', cuerpo }); setEditando(false); alCambiar(); } catch (err) { setError(err.message); } finally { setOcupado(false); }
  }
  function reprogramar(e) { e.preventDefault(); const fecha = new FormData(e.currentTarget).get('fecha'); if (new Date(fecha).getTime() <= Date.now()) { setError('Elige una fecha y hora futura.'); return; } cambiar({ fecha }); }
  return <div className="appointment-actions">{editando ? <form onSubmit={reprogramar}><input name="fecha" type="datetime-local" required className={campo} aria-label="Nueva fecha y hora" /><Boton type="submit" disabled={ocupado}>Guardar</Boton><Boton secundario type="button" onClick={() => setEditando(false)}>Cerrar</Boton></form> : <><button className="text-button" onClick={() => setEditando(true)}>Reprogramar</button><button className="text-button" disabled={ocupado} onClick={() => confirm('¿Cancelar esta cita?') && cambiar({ estado: 'cancelada' })}>Cancelar cita</button></>}<Aviso>{error}</Aviso></div>;
}
function NuevaCita({ alCrear }) {
  const [error, setError] = useState(''); const [exito, setExito] = useState(''); const [enviando, setEnviando] = useState(false);
  async function enviar(e) {
    e.preventDefault(); const formulario = e.currentTarget; const f = new FormData(formulario); setError(''); setExito('');
    if (new Date(f.get('fecha')).getTime() <= Date.now()) { setError('Elige una fecha y hora futura para tu cita.'); return; }
    if (!f.get('medico').trim() || !f.get('motivo').trim()) { setError('Completa el usuario del médico y el motivo de la consulta.'); return; }
    setEnviando(true);
    try { await api('/citas', { metodo: 'POST', cuerpo: { fecha: f.get('fecha'), medico: f.get('medico').trim(), motivo: f.get('motivo').trim() } }); formulario.reset(); setExito('Tu cita se guardó correctamente. Ya puedes consultarla en tu agenda.'); alCrear(); } catch (err) { setError(err.message); } finally { setEnviando(false); }
  }
  const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  return <form onSubmit={enviar} className="card appointment-form"><div className="card-heading"><span className="icon-box"><Icon name="plus" /></span><div><h2>Programa una cita</h2><p>Da el siguiente paso para cuidar de ti.</p></div></div>
    <Campo etiqueta="Día y hora de tu consulta"><input name="fecha" type="datetime-local" min={local} required className={campo} /><small>Hora local de tu dispositivo.</small></Campo>
    <Campo etiqueta="Usuario de tu médico"><input name="medico" required maxLength={128} autoCapitalize="none" spellCheck="false" placeholder="Ej. medico1" className={campo} /><small>Utiliza el usuario indicado por tu centro de salud.</small></Campo>
    <Campo etiqueta="Motivo de la consulta"><textarea name="motivo" rows="3" required maxLength="500" placeholder="Cuéntanos brevemente qué necesitas consultar…" className={campo} /><small>Máximo 500 caracteres.</small></Campo>
    <Aviso>{error}</Aviso><Aviso exito>{exito}</Aviso><Boton type="submit" disabled={enviando}><Icon name="calendar" size={18} />{enviando ? 'Guardando cita…' : 'Solicitar cita'}<Icon name="arrow" size={18} /></Boton><p className="form-footnote"><Icon name="shield" size={14} /> Revisa los datos antes de enviar tu solicitud.</p>
  </form>;
}
export default function Citas({ sesion, verHistorial }) {
  const { datos, error, cargando, recargar } = useCarga(() => api('/citas'), sesion.id);
  const [filtro, setFiltro] = useState('proximas'); const esMedico = sesion.rol !== 'paciente'; const hoy = new Date();
  const citas = Array.isArray(datos) ? datos : [];
  const proximas = citas.filter(c => c.estado !== 'cancelada' && new Date(c.fecha) >= new Date()).sort((a,b) => new Date(a.fecha)-new Date(b.fecha));
  const lista = filtro === 'proximas' ? proximas : [...citas].sort((a,b) => new Date(b.fecha)-new Date(a.fecha));
  return <><section className="welcome-banner"><div><span className="eyebrow light">{esMedico ? 'CADA CONSULTA IMPORTA' : 'TU BIENESTAR, PASO A PASO'}</span><h2>{esMedico ? 'Más conexión. Mejor acompañamiento.' : 'Hoy es un buen día para cuidarte.'}</h2><p>{esMedico ? 'Revisa tu agenda y accede al historial de tus pacientes.' : 'Agenda tu consulta y mantén cerca a quienes cuidan de tu salud.'}</p></div><span className="banner-art" aria-hidden="true"><Icon name="heart" size={68} /><span>+</span></span></section>
    <div className={`appointments-layout ${esMedico ? 'doctor-layout' : ''}`}><div className="agenda-column"><section className="card agenda"><div className="card-heading"><span className="icon-box"><Icon name="calendar" /></span><div><h2>{esMedico ? 'Citas con tus pacientes' : 'Tu agenda'}</h2><p>{cargando || error ? 'Consulta tus citas registradas.' : `${proximas.length} ${proximas.length === 1 ? 'cita próxima' : 'citas próximas'}`}</p></div><button className="text-button" onClick={recargar} disabled={cargando}>Actualizar</button></div>
    <div className="tabs" aria-label="Filtrar citas"><button aria-pressed={filtro === 'proximas'} onClick={() => setFiltro('proximas')}>Próximas</button><button aria-pressed={filtro === 'todas'} onClick={() => setFiltro('todas')}>Todas las citas</button></div>
    <Aviso>{error}</Aviso>{cargando ? <Loading /> : !error && (lista.length ? <ul className="appointments-list">{lista.map(c => <li key={c.id}><Fecha fecha={c.fecha} /><div className="appointment-details"><span className="appointment-time">{hora(c.fecha)} · {new Date(c.fecha).getFullYear()}</span><h3>{esMedico ? `Paciente ${c.paciente_id?.slice(0,8) || 'sin identificar'}` : `Consulta con ${c.medico}`}</h3><p>{c.motivo || 'Sin motivo registrado'}</p>{sesion.rol === 'medico' && <button className="text-button" onClick={() => verHistorial(c.paciente_id)}>Ver historial <Icon name="arrow" size={16} /></button>}{c.estado !== 'cancelada' && new Date(c.fecha) >= hoy && <Acciones cita={c} alCambiar={recargar} />}</div><span className={`badge ${c.estado === 'cancelada' || new Date(c.fecha) < hoy ? 'past' : ''}`}>{c.estado === 'cancelada' ? 'Cancelada' : new Date(c.fecha) < hoy ? 'Pasada' : 'Próxima'}</span></li>)}</ul> : <Empty title={filtro === 'proximas' ? 'Tu próxima consulta empieza aquí' : 'Todavía no hay citas'}>{esMedico ? 'Las citas solicitadas por tus pacientes aparecerán en este espacio.' : 'Cuando solicites una cita, podrás encontrar aquí todos los detalles.'}</Empty>)}</section>
    <section className="preparation"><span className="icon-box"><Icon name="file" /></span><div><h3>Antes de tu consulta</h3><p>Ten a mano tus documentos y anota lo que deseas conversar con tu médico.</p></div></section></div>{sesion.rol === 'paciente' && <NuevaCita alCrear={recargar} />}</div></>;
}
