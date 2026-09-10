import type { Publication } from '../../generated/content';
import { formatDate, labels, sectionNames } from '../formatting/format';
export function PublicationSummary({
  publication,
  base,
  featured = false,
}: {
  publication: Publication;
  base: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`publication-summary ${featured ? 'featured' : ''}`}
      data-section={publication.section}
    >
      <div className="kicker">
        <span className="section-mark" />
        {sectionNames[publication.section]} <span>· {labels[publication.type]}</span>
      </div>
      <h3>
        <a href={`${base}articulos/${publication.slug}/`}>{publication.title}</a>
      </h3>
      <p>{publication.description}</p>
      <div className="publication-meta">
        <time dateTime={publication.publishedAt}>{formatDate(publication.publishedAt)}</time>
        {publication.status === 'draft' && <strong>Borrador</strong>}
      </div>
    </article>
  );
}
