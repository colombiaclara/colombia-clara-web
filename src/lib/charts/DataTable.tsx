import type { Column } from '../../generated/content';
import type { Row } from './model';
import { formatNumber, formatDate } from '../formatting/format';
export function DataTable({
  title,
  columns,
  rows,
  decimals = 1,
}: {
  title: string;
  columns: Column[];
  rows: Row[];
  decimals?: number;
}) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={`Tabla: ${title}`}>
      <table>
        <caption>{title}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th scope="col" key={c.id}>
                {c.label}
                {c.unit && <span className="column-unit"> ({c.unit})</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c, j) => {
                const Tag = j === 0 ? 'th' : 'td';
                const value = r[c.id];
                return (
                  <Tag key={c.id} scope={j === 0 ? 'row' : undefined}>
                    {value === null
                      ? 'Sin dato'
                      : c.type === 'number'
                        ? formatNumber(Number(value), '', decimals)
                        : c.type === 'date'
                          ? formatDate(String(value))
                          : String(value)}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p>Sin datos para esta selección.</p>}
    </div>
  );
}
