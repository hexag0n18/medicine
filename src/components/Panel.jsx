import { useEffect, useState } from 'react';
import { salir, sesion as leerSesion } from '../lib/auth';
import Citas from './Citas';
import Documentos from './Documentos';
import Historial from './Historial';
import Icon, { Brand } from './Icon';
const SECCIONES = [{ id: 'citas', nombre: 'Mis citas', icon: 'calendar', descripcion: 'Organiza tus próximas consultas y mantén tu salud al día.' }, { id: 'historial', nombre: 'Historial clínico', icon: 'history', descripcion: 'Cada consulta es parte de tu historia. Encuéntrala aquí.' }, { id: 'documentos', nombre: 'Documentos', icon: 'file', descripcion: 'Tus archivos de salud, organizados en un solo lugar.' }];
export default function Panel() {
  const [sesion] = useState(leerSesion); const [seccion, setSeccion] = useState('citas'); const [elegido, setElegido] = useState(null); const [online, setOnline] = useState(true);
  useEffect(() => { if (!sesion) location.href = '/'; }, [sesion]);
  useEffect(() => { const update = () => setOnline(navigator.onLine); update(); window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; }, []);
  if (!sesion) return <p className="loading">Comprobando tu sesión…</p>;
  const medico = sesion.rol === 'medico'; const pacienteId = medico ? elegido : sesion.id; const actual = SECCIONES.find(s => s.id === seccion);
  function verHistorial(id) { setElegido(id); setSeccion('historial'); }
  return <div className="app-shell"><aside className="sidebar"><Brand /><div className="workspace-label">{medico ? 'ESPACIO DEL MÉDICO' : 'MI ESPACIO DE SALUD'}</div>
    <nav aria-label="Secciones">{SECCIONES.map(s => <button key={s.id} onClick={() => setSeccion(s.id)} aria-current={seccion === s.id ? 'page' : undefined}><Icon name={s.icon} /><span>{medico && s.id === 'citas' ? 'Agenda de citas' : s.nombre}</span>{seccion === s.id && <span className="nav-dot" />}</button>)}</nav>
    <div className="sidebar-note"><span className="note-icon"><Icon name="heart" /></span><h3>Cuidarte empieza aquí</h3><p>Tu información de salud, a mano cuando la necesitas.</p></div>
    <div className="sidebar-user"><span className="avatar">{sesion.usuario?.slice(0, 2).toUpperCase()}</span><div><strong>{sesion.usuario}</strong><span>{medico ? 'Profesional de salud' : 'Paciente'}</span></div></div><button className="logout" onClick={salir}><Icon name="logout" size={19} /> Cerrar sesión</button>
    </aside><div className="app-body"><header className="topbar"><span>Mi espacio <span className="breadcrumb-slash">/</span> <strong>{medico && seccion === 'citas' ? 'Agenda de citas' : actual.nombre}</strong></span><span className="topbar-right"><Icon name="shield" size={16} /> Portal de salud <span className="avatar small">{sesion.usuario?.slice(0, 2).toUpperCase()}</span></span></header>
    <main id="contenido" className="dashboard"><div className="page-heading"><div><span className="eyebrow">{medico ? 'CUIDADO QUE CONECTA' : `HOLA, ${sesion.usuario}`}</span><h1>{medico && seccion === 'citas' ? 'Tu agenda de atención' : actual.nombre}</h1><p>{medico ? 'Acompaña a tus pacientes y consulta su información de salud.' : actual.descripcion}</p></div><span className="date-label"><Icon name="calendar" size={17} />{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
    {!online && <p className="notice" role="status">Estás sin conexión. Vuelve a conectarte para consultar o guardar información.</p>}
    {medico && elegido && <div className="patient-context"><Icon name="user" size={18} /><span>Paciente seleccionado: <strong>{elegido}</strong></span><button onClick={() => { setElegido(null); setSeccion('citas'); }}>Cambiar paciente</button></div>}
    {seccion === 'citas' && <Citas sesion={sesion} verHistorial={verHistorial} />}{seccion === 'historial' && <Historial key={pacienteId} sesion={sesion} pacienteId={pacienteId} />}{seccion === 'documentos' && <Documentos key={pacienteId} pacienteId={pacienteId} />}
    <footer className="dashboard-footer"><span>Medirural · Salud más cerca</span><span><Icon name="shield" size={14} /> Tu espacio personal de atención</span></footer></main></div></div>;
}
