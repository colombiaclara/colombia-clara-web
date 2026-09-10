import type { Site } from '../../generated/content';
import { MobileNavigation } from './MobileNavigation';
export function Header({ site, base }: { site: Site; base: string }) {
  const links = site.navigation.map((n) => ({
    label: n.label,
    href: base + n.path.replace(/^\//, ''),
  }));
  return (
    <header className="site-header">
      <div className="masthead">
        <a className="wordmark" href={base} aria-label="Colombia Clara · inicio">
          colombia<span>clara</span>
          <b aria-hidden="true">.</b>
        </a>
        <span className="masthead-line">
          Periodismo cívico
          <br />
          para comprender y actuar.
        </span>
        <MobileNavigation links={links} />
      </div>
      <div className="nav-line">
        <nav aria-label="Navegación principal">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <span className="nav-note">La evidencia, a la vista.</span>
      </div>
    </header>
  );
}
