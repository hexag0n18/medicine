import { useEffect, useState } from 'react';
import { confirmarPassword, confirmarRegistro, login, olvidePassword, registrar, sesion } from '../lib/auth';
import { Aviso, Boton, Campo, campo } from './ui';
const TITULOS = { login: 'Qué bueno tenerte aquí.', registro: 'Crea tu cuenta de paciente.', confirmar: 'Confirma tu correo.', olvide: 'Recupera tu acceso.', nueva: 'Elige una contraseña nueva.' };
import Icon, { Brand } from './Icon';
export default function Login() {
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modo, setModo] = useState('login'); const [usuario, setUsuario] = useState(''); const [exito, setExito] = useState('');
  const ir = m => { setModo(m); setError(''); setExito(''); };
  useEffect(() => { if (sesion()) location.href = '/app'; }, []);
  async function enviar(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget); setEnviando(true); setError('');
    const u = (f.get('usuario') ?? usuario).trim(); setUsuario(u);
    try {
      if (modo === 'login') { await login(u, f.get('clave')); location.href = '/app'; return; }
      if (modo === 'registro') { await registrar(u, f.get('email').trim(), f.get('clave')); ir('confirmar'); setExito('Te enviamos un código por correo.'); }
      else if (modo === 'confirmar') { await confirmarRegistro(u, f.get('codigo').trim()); ir('login'); setExito('Cuenta confirmada. Ya puedes ingresar.'); }
      else if (modo === 'olvide') { await olvidePassword(u); ir('nueva'); setExito('Te enviamos un código por correo.'); }
      else { await confirmarPassword(u, f.get('codigo').trim(), f.get('clave')); ir('login'); setExito('Contraseña actualizada. Ya puedes ingresar.'); }
    } catch (err) { setError(err.message); }
    setEnviando(false);
  }
  return <main className="login-page">
    <section className="login-story"><Brand />
      <div className="story-copy"><span className="eyebrow light"><span className="status-dot" /> TELEMEDICINA PARA TU COMUNIDAD</span>
        <h1>La distancia cambia.<br /> El cuidado <em>permanece.</em></h1>
        <p>Tu salud merece estar cerca. Conecta con tu médico y lleva tus citas, tu historia y tus documentos contigo.</p>
        <div className="care-illustration" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="care-cross">+</div><div className="care-chip chip-one"><Icon name="calendar" /><span>Tu próxima cita<br /><strong>Más cerca de ti</strong></span></div><div className="care-chip chip-two"><span className="mini-avatar"><Icon name="user" /></span><span>Un espacio para<br /><strong>cuidar de tu salud</strong></span><span className="small-check"><Icon name="check" size={14} /></span></div><svg className="landscape" viewBox="0 0 600 160"><path d="M0 130 110 50l100 60L330 15l150 100 120-60v105H0Z" fill="currentColor" /></svg></div>
      </div><div className="story-bottom"><Icon name="heart" size={18} /> Atención que conecta personas y comunidades.</div>
    </section>
    <section className="login-form-side"><div className="login-top"><span>Portal de atención</span><span className="secure-label"><Icon name="shield" size={16} /> Acceso privado</span></div>
      <form onSubmit={enviar} className="login-form"><span className="form-icon"><Icon name="heart" size={28} /></span><span className="eyebrow">BIENVENIDO A MEDIRURAL</span><h2>{TITULOS[modo]}</h2><p className="intro">{modo === 'login' ? 'Ingresa a tu cuenta para continuar con tu cuidado.' : 'Sigue los pasos para continuar.'}</p>
        {modo !== 'confirmar' && modo !== 'nueva' || !usuario ? <Campo etiqueta="Usuario"><input name="usuario" required defaultValue={usuario} autoComplete="username" autoCapitalize="none" spellCheck="false" placeholder="Escribe tu usuario" className={campo} /></Campo> : null}
        {modo === 'registro' && <Campo etiqueta="Correo electrónico"><input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={campo} /></Campo>}
        {(modo === 'confirmar' || modo === 'nueva') && <Campo etiqueta="Código recibido por correo"><input name="codigo" required inputMode="numeric" autoComplete="one-time-code" className={campo} /></Campo>}
        {(modo === 'login' || modo === 'registro' || modo === 'nueva') && <Campo etiqueta={modo === 'login' ? 'Contraseña' : 'Contraseña nueva (mín. 12 caracteres)'}><span className="password-field"><input name="clave" type={visible ? 'text' : 'password'} required minLength={modo === 'login' ? undefined : 12} autoComplete={modo === 'login' ? 'current-password' : 'new-password'} placeholder="Escribe tu contraseña" className={campo} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible}><Icon name="eye" size={20} /></button></span></Campo>}
        <Aviso>{error}</Aviso><Aviso exito>{exito}</Aviso><Boton type="submit" disabled={enviando} className="login-submit">{enviando ? 'Enviando…' : { login: 'Ingresar a mi cuenta', registro: 'Crear cuenta', confirmar: 'Confirmar correo', olvide: 'Enviar código', nueva: 'Cambiar contraseña' }[modo]}<Icon name="arrow" size={19} /></Boton>
        <div className="account-help">{modo === 'login' ? <><button type="button" className="text-button" onClick={() => ir('registro')}>Crear cuenta de paciente</button> · <button type="button" className="text-button" onClick={() => ir('olvide')}>Olvidé mi contraseña</button></> : <button type="button" className="text-button" onClick={() => ir('login')}>Volver a ingresar</button>}<br />Las cuentas de médicos las crea tu centro de salud.</div><div className="login-privacy"><Icon name="shield" size={20} /><p>Un espacio personal para pacientes y profesionales de la salud.</p></div>
      </form><footer className="login-footer">Medirural <span>Tu salud, sin importar la distancia.</span></footer>
    </section>
  </main>;
}
