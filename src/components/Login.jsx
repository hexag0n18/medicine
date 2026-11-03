import { useEffect, useState } from 'react';
import { login, sesion } from '../lib/auth';
import { Aviso, Boton, Campo, campo } from './ui';
import Icon, { Brand } from './Icon';
export default function Login() {
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (sesion()) location.href = '/app'; }, []);
  async function enviar(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget); setEnviando(true); setError('');
    try { await login(f.get('usuario').trim(), f.get('clave')); location.href = '/app'; }
    catch (err) { setError(err.message); setEnviando(false); }
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
      <form onSubmit={enviar} className="login-form"><span className="form-icon"><Icon name="heart" size={28} /></span><span className="eyebrow">BIENVENIDO A MEDIRURAL</span><h2>Qué bueno tenerte aquí.</h2><p className="intro">Ingresa a tu cuenta para continuar con tu cuidado.</p>
        <Campo etiqueta="Usuario"><input name="usuario" required autoComplete="username" autoCapitalize="none" spellCheck="false" placeholder="Escribe tu usuario" className={campo} /></Campo>
        <Campo etiqueta="Contraseña"><span className="password-field"><input name="clave" type={visible ? 'text' : 'password'} required autoComplete="current-password" placeholder="Escribe tu contraseña" className={campo} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible}><Icon name="eye" size={20} /></button></span></Campo>
        <Aviso>{error}</Aviso><Boton type="submit" disabled={enviando} className="login-submit">{enviando ? 'Ingresando…' : 'Ingresar a mi cuenta'}<Icon name="arrow" size={19} /></Boton>
        <div className="account-help">¿Necesitas una cuenta o recuperar tu acceso?<br /><strong>Comunícate con tu centro de salud.</strong></div><div className="login-privacy"><Icon name="shield" size={20} /><p>Un espacio personal para pacientes y profesionales de la salud.</p></div>
      </form><footer className="login-footer">Medirural <span>Tu salud, sin importar la distancia.</span></footer>
    </section>
  </main>;
}
