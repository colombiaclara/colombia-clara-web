import type { Publication, Author } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
import { AuthorByline } from './AuthorByline';
import { formatDate, labels, sectionNames } from '../formatting/format';
export function PublicationHeader({
  publication,
  authors,
  minutes,
  context,
}: {
  publication: Publication;
  authors: Author[];
  minutes: number;
  context: ContentContext;
}) {
  return (
    <header className="publication-header" data-section={publication.section}>
      <div className="kicker">
        <a href={`${context.base}lineas/${publication.section}/`}>
          {sectionNames[publication.section]}
        </a>
        <span> / {labels[publication.type]}</span>
      </div>
      <h1>{publication.title}</h1>
      <div className="lead" id="entrada">
        <Inline content={publication.lead.content} context={context} />{' '}
        <SourceReference citations={publication.lead.citations} context={context} />
      </div>
      <div className="publication-meta">
        <AuthorByline authors={authors} />
        <time dateTime={publication.publishedAt}>{formatDate(publication.publishedAt)}</time>
        <span>{minutes} min de lectura estimada</span>
        {publication.updatedAt && <span>Actualizado: {formatDate(publication.updatedAt)}</span>}
      </div>
    </header>
  );
}
