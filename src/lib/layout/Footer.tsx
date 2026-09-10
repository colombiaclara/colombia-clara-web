import type { Site } from '../../generated/content';
export function Footer({ site, base }: { site: Site; base: string }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="wordmark" href={base}>
          colombia<span>clara</span>
          <b aria-hidden="true">.</b>
        </a>
        <p>{site.tagline}</p>
      </div>
      <nav aria-label="Al pie">
        {site.navigation.map((n) => (
          <a key={n.path} href={base + n.path.replace(/^\//, '')}>
            {n.label}
          </a>
        ))}
        <a href={base + 'rss.xml'}>RSS</a>
        {site.contact && <a href={`mailto:${site.contact}`}>{site.contact}</a>}
      </nav>
      <div className="footer-bottom">
        <span>{site.descriptor}</span>
        <span>Comprender · comprobar · participar</span>
      </div>
    </footer>
  );
}
