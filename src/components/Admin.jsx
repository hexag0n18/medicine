import { useState } from 'react';
import { api } from '../lib/api';
import { Aviso, Boton, Campo, Empty, Loading, campo, useCarga } from './ui';
import Icon from './Icon';
const ROLES = ['paciente', 'medico', 'admin'];
const ruta = u => `/admin/usuarios/${encodeURIComponent(u)}`;
export default function Admin({ sesion }) {
  const { datos, error, cargando, recargar } = useCarga(() => api('/admin/usuarios'), sesion.id);
  const [errorAccion, setErrorAccion] = useState(''); const [exito, setExito] = useState(''); const [ocupado, setOcupado] = useState(false);
  async function ejecutar(promesa, mensaje) {
    setErrorAccion(''); setExito(''); setOcupado(true);
    try { await promesa(); setExito(mensaje); recargar(); } catch (err) { setErrorAccion(err.message); } finally { setOcupado(false); }
  }
  function crear(e) {
    e.preventDefault(); const formulario = e.currentTarget; const f = new FormData(formulario);
    ejecutar(async () => { await api('/admin/usuarios', { metodo: 'POST', cuerpo: { username: f.get('username').trim(), email: f.get('email').trim(), rol: f.get('rol') } }); formulario.reset(); }, 'Usuario creado. Recibirá una contraseña temporal por correo.');
  }
  const usuarios = Array.isArray(datos) ? datos : [];
  return <div className="records-layout"><section className="card"><div className="card-heading"><span className="icon-box"><Icon name="user" /></span><div><h2>Usuarios</h2><p>Administra el acceso a la plataforma.</p></div><button className="text-button" onClick={recargar} disabled={cargando}>Actualizar</button></div>
    <Aviso>{error}</Aviso><Aviso>{errorAccion}</Aviso><Aviso exito>{exito}</Aviso>
    {cargando ? <Loading /> : !error && (usuarios.length ? <ul className="document-list">{usuarios.map(u => { const yo = u.username === sesion.usuario; return <li key={u.username}><span className="document-icon"><Icon name="user" /></span><div><h3>{u.username}{yo && ' (tú)'}</h3><span>{u.email || 'Sin correo'} · {u.habilitado ? u.estado : 'Deshabilitado'}</span></div>
      <select aria-label={`Rol de ${u.username}`} value={u.grupos[0] || ''} disabled={yo || ocupado} className={campo} onChange={e => ejecutar(() => api(`${ruta(u.username)}/rol`, { metodo: 'PUT', cuerpo: { rol: e.target.value } }), 'Rol actualizado.')}>{!u.grupos.length && <option value="">Sin rol</option>}{ROLES.map(r => <option key={r}>{r}</option>)}</select>
      {!yo && <><button className="text-button" disabled={ocupado} onClick={() => ejecutar(() => api(ruta(u.username), { metodo: 'PATCH', cuerpo: { habilitado: !u.habilitado } }), u.habilitado ? 'Usuario deshabilitado.' : 'Usuario habilitado.')}>{u.habilitado ? 'Deshabilitar' : 'Habilitar'}</button>
      <button className="text-button" disabled={ocupado} onClick={() => confirm(`¿Eliminar a ${u.username}? No se puede deshacer.`) && ejecutar(() => api(ruta(u.username), { metodo: 'DELETE' }), 'Usuario eliminado.')}>Eliminar</button></>}</li>; })}</ul> : <Empty icon="user" title="Sin usuarios">Crea el primero con el formulario.</Empty>)}</section>
    <form onSubmit={crear} className="card note-form"><div className="card-heading"><span className="icon-box"><Icon name="plus" /></span><div><h2>Nuevo usuario</h2><p>Médicos, pacientes o administradores.</p></div></div>
      <Campo etiqueta="Usuario"><input name="username" required maxLength={64} autoCapitalize="none" spellCheck="false" className={campo} /></Campo>
      <Campo etiqueta="Correo electrónico"><input name="email" type="email" required className={campo} /></Campo>
      <Campo etiqueta="Rol"><select name="rol" defaultValue="medico" className={campo}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></Campo>
      <Boton type="submit" disabled={ocupado}>Crear usuario<Icon name="check" size={18} /></Boton></form></div>;
}
