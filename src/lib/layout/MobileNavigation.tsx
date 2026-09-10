export function MobileNavigation({ links }: { links: { label: string; href: string }[] }) {
  return (
    <details className="mobile-menu">
      <summary>
        Menú <span aria-hidden="true">☰</span>
      </summary>
      <nav aria-label="Navegación móvil">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
