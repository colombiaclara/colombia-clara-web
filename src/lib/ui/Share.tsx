import { useState } from 'react';
export function Share({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setStatus('Enlace compartido.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus('Enlace copiado.');
      } else setStatus('Copia el enlace que aparece abajo.');
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setStatus('No se pudo copiar. Puedes seleccionar el enlace.');
    }
  }
  return (
    <details className="share">
      <summary>Compartir publicación</summary>
      <p>
        <a href={url}>{url}</a>
      </p>
      <button type="button" className="js-only" onClick={share}>
        Compartir o copiar enlace
      </button>
      <p role="status">{status}</p>
    </details>
  );
}
