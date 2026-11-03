import { useState } from 'react';
import { api } from '../lib/api';
import { uploadDestination } from '../lib/upload';
import { Aviso, Boton, Empty, Loading, useCarga } from './ui';
import Icon from './Icon';
const MAX_MB = 10;
export default function Documentos({ pacienteId }) {
  const { datos, error, cargando, recargar } = useCarga(() => pacienteId ? api(`/documentos/${encodeURIComponent(pacienteId)}`) : Promise.resolve([]), pacienteId);
  const [errorSubida, setErrorSubida] = useState(''); const [subiendo, setSubiendo] = useState(false); const [exito, setExito] = useState(''); const [archivo, setArchivo] = useState(null);
  if (!pacienteId) return <section className="card"><Empty icon="user" title="Selecciona un paciente">En tu agenda, elige «Ver historial» para acceder también a los documentos de ese paciente.</Empty></section>;
  async function subir(e) {
    e.preventDefault(); const formulario = e.currentTarget; setErrorSubida(''); setExito('');
    if (!archivo?.size) { setErrorSubida('Selecciona un archivo con contenido.'); return; }
    if (archivo.size > MAX_MB * 1024 * 1024) { setErrorSubida('El archivo supera los 10 MB. Elige uno más liviano.'); return; }
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) { setErrorSubida('Elige un PDF o una imagen JPG, PNG o WebP.'); return; }
    setSubiendo(true);
    try { const { url } = await api('/documentos', { metodo: 'POST', cuerpo: { paciente_id: pacienteId, nombre: archivo.name } }); const r = await fetch(uploadDestination(url, import.meta.env.DEV), { method: 'PUT', body: archivo }); if (!r.ok) throw new Error('No se pudo completar la carga. Intenta de nuevo.'); formulario.reset(); setArchivo(null); setExito('Documento subido correctamente.'); recargar(); } catch (err) { setErrorSubida(err instanceof TypeError ? 'No se pudo conectar con el almacenamiento. Revisa tu conexión o la configuración CORS e intenta de nuevo.' : err.message); } finally { setSubiendo(false); }
  }
  return <div className="records-layout"><section className="card"><div className="card-heading"><span className="icon-box"><Icon name="file" /></span><div><h2>Documentos de salud</h2><p>Resultados, informes y archivos de tus consultas.</p></div><button className="text-button" onClick={recargar} disabled={cargando}>Actualizar</button></div><Aviso>{error}</Aviso>{cargando ? <Loading /> : !error && (!datos?.length ? <Empty icon="file" title="Todo en un mismo lugar">Sube tu primer documento para tenerlo disponible cuando lo necesites.</Empty> : <ul className="document-list">{datos.map(d => <li key={d.clave || d.nombre}><span className="document-icon"><Icon name="file" /></span><div><h3>{d.nombre}</h3><span>Documento clínico</span></div>{/^https:\/\//i.test(d.url || '') ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-button" aria-label={`Abrir ${d.nombre} en otra pestaña`}>Abrir <Icon name="arrow" size={17} /></a> : <span>Sin enlace disponible</span>}</li>)}</ul>)}</section>
    <form onSubmit={subir} className="card upload-form"><div className="card-heading"><span className="icon-box"><Icon name="upload" /></span><div><h2>Agregar documento</h2><p>Comparte información para tu atención.</p></div></div><label className="upload-zone"><Icon name="upload" size={34} /><strong>{archivo ? archivo.name : 'Selecciona tu archivo'}</strong><span>{archivo ? `${(archivo.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, JPG, PNG o WebP · Hasta 10 MB'}</span><input name="archivo" type="file" required accept="application/pdf,image/jpeg,image/png,image/webp" onChange={e => { setArchivo(e.target.files[0] || null); setErrorSubida(''); setExito(''); }} disabled={subiendo} /></label><Aviso>{errorSubida}</Aviso><Aviso exito>{exito}</Aviso><Boton type="submit" disabled={subiendo || !archivo}><Icon name="upload" size={18} />{subiendo ? 'Subiendo documento…' : 'Subir documento'}</Boton><p className="form-footnote">Espera la confirmación antes de cerrar esta pantalla.</p></form>
  </div>;
}
