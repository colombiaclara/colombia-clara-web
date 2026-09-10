export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <span className="evidence-rule" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
