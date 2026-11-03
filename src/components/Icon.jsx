export default function Icon({ name = 'heart', size = 22, ...props }) {
  const paths = {
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 10h2m4 0h2m-8 4h2',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h6',
    history: 'M3 11a9 9 0 1 1 2.7 7M3 4v7h7m2-4v5l3 2',
    shield: 'm12 3 9 4v5c0 5-9 10-9 10S3 17 3 12V7Zm-4 9 3 3 5-6',
    arrow: 'M5 12h14m-6-6 6 6-6 6', logout: 'M9 4H4v16h5m5-13 5 5-5 5m-6-5h13', plus: 'M12 5v14M5 12h14',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', upload: 'M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', check: 'm5 12 4 4L19 6', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.heart} /></svg>;
}
export function Brand() {
  return <a className="brand" href="/" aria-label="Medirural, inicio"><span className="brand-symbol">m<span>+</span></span><span>medirural<span className="brand-caption">SALUD MÁS CERCA</span></span></a>;
}
