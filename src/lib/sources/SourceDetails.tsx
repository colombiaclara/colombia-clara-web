import type { Source } from '../../generated/content';
import { formatDate, labels } from '../formatting/format';
export function SourceDetails({ source, asset }: { source: Source; asset?: string }) {
  return (
    <section className="source-details">
      <span className="kicker">
        {labels[source.kind]} · {source.language}
      </span>
      <h1>{source.title}</h1>
      <p className="lead">{source.description}</p>
      <dl>
        <dt>Autoría</dt>
        <dd>{source.creators.map((c) => c.name).join(', ')}</dd>
        {source.publisher && (
          <>
            <dt>Publicado por</dt>
            <dd>{source.publisher}</dd>
          </>
        )}
        <dt>Fecha de publicación</dt>
        <dd>{source.publishedAt ? formatDate(source.publishedAt) : 'No conocida'}</dd>
        <dt>Fecha de consulta</dt>
        <dd>{formatDate(source.accessedAt)}</dd>
        {source.edition && (
          <>
            <dt>Edición</dt>
            <dd>{source.edition}</dd>
          </>
        )}
      </dl>
      <div className="source-actions">
        {source.url ? (
          <a className="button primary" href={source.url}>
            Consultar documento original ↗
          </a>
        ) : (
          <p>Esta fuente no tiene una URL pública.</p>
        )}
        {source.archivedUrl && (
          <a className="button" href={source.archivedUrl}>
            Ver copia archivada ↗
          </a>
        )}
        {asset && (
          <a className="button" href={asset}>
            Descargar documento
          </a>
        )}
      </div>
    </section>
  );
}
