import type { Author } from '../../generated/content';
export function AuthorByline({ authors }: { authors: Author[] }) {
  return (
    <span className="byline">
      {authors.map((a, i) => (
        <span key={a.id}>
          {i > 0 ? ', ' : ''}
          {a.url ? <a href={a.url}>{a.name}</a> : a.name}
        </span>
      ))}
    </span>
  );
}
