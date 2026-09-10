import type { MetricBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { SourceReference } from '../sources/SourceReference';
import { formatNumber, percentageChange } from '../formatting/format';
export function Metric({ block, context }: { block: MetricBlock; context: ContentContext }) {
  const c = block.comparison;
  const change = c
    ? c.kind === 'percentage-points'
      ? block.value - c.value
      : percentageChange(block.value, c.value)
    : null;
  return (
    <section className="metric" aria-label={block.title}>
      <h3>{block.title}</h3>
      <p className="metric-value">
        {formatNumber(block.value)} <span>{block.unit}</span>
      </p>
      <p>{block.period}</p>
      {c && (
        <p>
          {change === null
            ? 'Variación porcentual no definida (base cero)'
            : `${formatNumber(change)} ${c.kind === 'percentage-points' ? 'puntos porcentuales' : '%'} de cambio`}{' '}
          · Base: {formatNumber(c.value, block.unit)} ({c.period})
        </p>
      )}
      <SourceReference citations={block.citations} context={context} />
    </section>
  );
}
