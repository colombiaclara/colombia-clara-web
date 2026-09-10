import { scaleLinear, scaleLog, scaleBand } from 'd3-scale';
import { line, area, pie, arc, type PieArcDatum } from 'd3-shape';
import type { ChartBlock } from '../../generated/content';
import type { ChartModel, Row } from './model';
import { formatNumber } from '../formatting/format';
const colors = [
  '#006d77',
  '#bd4f23',
  '#75449a',
  '#2457a7',
  '#28734f',
  '#8a5700',
  '#ac3674',
  '#46546f',
  '#875e39',
  '#237e89',
  '#713755',
  '#536522',
];
export function ChartCanvas({
  block,
  model,
  width = 320,
}: {
  block: ChartBlock;
  model: ChartModel;
  width?: number;
}) {
  const kind = block.kind,
    e = block.encoding;
  const rows = model.rows;
  const W = Math.max(280, width),
    H = 300,
    L = 54,
    R = 16,
    T = 16,
    B = 50;
  const iw = W - L - R,
    ih = H - T - B;
  const color = (s: string) =>
    colors[(e.series ?? model.series).indexOf(s) % colors.length] ?? colors[0];
  if (!rows.length || !model.series.length)
    return <div className="chart-empty">Sin datos para esta selección.</div>;
  const allValues = rows
    .flatMap((r) => model.series.map((s) => r[s]))
    .filter((v): v is number => typeof v === 'number');
  if (!allValues.length)
    return (
      <div className="chart-empty">
        Datos incompletos: no hay valores observados para representar.
      </div>
    );
  if (['pie', 'donut'].includes(kind) && model.missing)
    return (
      <div className="chart-empty">
        Composición incompleta. Faltan datos para establecer un total; consulta la tabla.
      </div>
    );
  const Svg = ({ children }: { children: React.ReactNode }) => (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label={`${block.title}. ${rows.length} registros. Los valores exactos están en la tabla.`}
    >
      <title>{block.title}</title>
      {children}
    </svg>
  );
  const label = (v: unknown) =>
    typeof v === 'number' ? formatNumber(v, '', block.options?.decimals ?? 1) : String(v);
  const numeric = (v: unknown) => (typeof v === 'number' ? v : 0);
  if ((kind === 'bar' && block.options?.orientation !== 'vertical') || kind === 'histogram') {
    const cat = kind === 'histogram' ? 'intervalo' : e.category!,
      value = kind === 'histogram' ? 'frecuencia' : e.value!;
    const max = Math.max(0, ...rows.map((r) => numeric(r[value]))),
      min = Math.min(0, ...rows.map((r) => numeric(r[value])));
    const span = max - min || 1;
    const zero = ((0 - min) / span) * 100;
    return (
      <div className="horizontal-bars" role="img" aria-label={block.title}>
        {rows.map((r, i) => (
          <div className="bar-row" key={i}>
            <span className="bar-label">{label(r[cat])}</span>
            <div className="bar-track">
              <i className="bar-zero" style={{ left: zero + '%' }} />
              <span
                className="bar-fill"
                style={{
                  left: Math.min(zero, ((numeric(r[value]) - min) / span) * 100) + '%',
                  width: (Math.abs(numeric(r[value])) / span) * 100 + '%',
                  background: colors[0],
                }}
              />
            </div>
            <span className="bar-value">{r[value] === null ? 'Sin dato' : label(r[value])}</span>
          </div>
        ))}
        <p className="axis-note">
          Base cero · {model.columns.find((c) => c.id === value)?.unit ?? 'valor'}
        </p>
      </div>
    );
  }
  if (kind === 'pie' || kind === 'donut') {
    const total = allValues.reduce((n, v) => n + v, 0);
    if (total <= 0) return <div className="chart-empty">El total debe ser positivo.</div>;
    const radius = Math.min(iw, ih) / 2;
    const segments = pie<Row>()
      .sort(null)
      .value((r) => numeric(r[e.value!]))(rows);
    const path = arc<PieArcDatum<Row>>()
      .innerRadius(kind === 'donut' ? radius * 0.61 : 0)
      .outerRadius(radius);
    return (
      <>
        <Svg>
          <g transform={`translate(${W / 2},${T + ih / 2})`}>
            {segments.map((s, i) => (
              <path
                key={i}
                d={path(s) ?? ''}
                fill={colors[i % colors.length]}
                stroke="white"
                strokeWidth="2"
              >
                <title>
                  {label(s.data[e.category!])}: {label(s.value)} (
                  {formatNumber((s.value / total) * 100)} %)
                </title>
              </path>
            ))}
            {kind === 'donut' && (
              <>
                <text className="donut-total" textAnchor="middle" y="0">
                  {label(total)}
                </text>
                <text textAnchor="middle" y="24">
                  Total
                </text>
              </>
            )}
          </g>
        </Svg>
        <ul className="chart-legend">
          {rows.map((r, i) => (
            <li key={i}>
              <span style={{ background: colors[i % colors.length] }} />
              {label(r[e.category!])}: {label(r[e.value!])} (
              {formatNumber((numeric(r[e.value!]) / total) * 100)} %)
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (kind === 'heatmap') {
    const xs = [...new Set(rows.map((r) => String(r[e.x!])))],
      ys = [...new Set(rows.map((r) => String(r[e.y!])))];
    const x = scaleBand<string>()
        .domain(xs)
        .range([L, W - R])
        .padding(0.06),
      y = scaleBand<string>()
        .domain(ys)
        .range([T, H - B])
        .padding(0.08);
    const lo = Math.min(...allValues),
      hi = Math.max(...allValues);
    const fill = scaleLinear<string>()
      .domain([lo, hi || 1])
      .range(['#edf2f4', '#006d77']);
    return (
      <>
        <Svg>
          {rows.map((r, i) => (
            <g key={i}>
              <rect
                x={x(String(r[e.x!]))}
                y={y(String(r[e.y!]))}
                width={x.bandwidth()}
                height={y.bandwidth()}
                fill={r[e.value!] === null ? '#e7e7e7' : fill(numeric(r[e.value!]))}
              />
              <text
                x={x(String(r[e.x!]))! + x.bandwidth() / 2}
                y={y(String(r[e.y!]))! + y.bandwidth() / 2 + 5}
                textAnchor="middle"
                fill={
                  r[e.value!] !== null && numeric(r[e.value!]) > (lo + hi) / 2 ? 'white' : '#17252b'
                }
              >
                {r[e.value!] === null ? '—' : label(r[e.value!])}
              </text>
            </g>
          ))}
          {xs.map((s) => (
            <text key={s} x={x(s)! + x.bandwidth() / 2} y={H - 22} textAnchor="middle">
              {s}
            </text>
          ))}
          {ys.map((s) => (
            <text key={s} x={L - 10} y={y(s)! + y.bandwidth() / 2 + 5} textAnchor="end">
              {s}
            </text>
          ))}
        </Svg>
        <p className="axis-note">
          Escala: {label(lo)} a {label(hi)} · Gris / —: sin dato.
        </p>
      </>
    );
  }
  const stacked = ['stacked-bar', 'stacked-bar-100'].includes(kind);
  const totals = rows.map((r) =>
    model.series.some((s) => r[s] === null)
      ? null
      : model.series.reduce((n, s) => n + numeric(r[s]), 0),
  );
  const domain = block.options?.domain ?? [
    Math.min(0, ...allValues),
    Math.max(1, ...(stacked ? totals.filter((n): n is number => n !== null) : allValues)),
  ];
  const y =
    block.options?.scale === 'log'
      ? scaleLog()
          .domain([Math.min(...allValues), Math.max(...allValues) * 1.1])
          .range([H - B, T])
      : scaleLinear()
          .domain(domain)
          .nice()
          .range([H - B, T]);
  const x = scaleBand<string>()
    .domain(rows.map((r, i) => (e.category ? String(r[e.category]) : String(i))))
    .range([L, W - R])
    .padding(0.25);
  const axes = (
    <>
      {y.ticks(W < 400 ? 3 : 5).map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#dce2e2" />
          <text x={L - 9} y={y(v) + 5} textAnchor="end">
            {formatNumber(v, '', block.options?.decimals ?? 1)}
          </text>
        </g>
      ))}
      {kind !== 'scatter' &&
        rows
          .filter((_, i) => i % Math.max(1, Math.ceil(rows.length / (W < 400 ? 3 : 7))) === 0)
          .map((r, i) => {
            const key = e.category ? String(r[e.category]) : String(i);
            return (
              <text
                key={key}
                x={
                  ['line', 'area'].includes(kind)
                    ? scaleLinear()
                        .domain([
                          Math.min(...rows.map((r) => Date.parse(String(r[e.category!])))),
                          Math.max(...rows.map((r) => Date.parse(String(r[e.category!])))),
                        ])
                        .range([L, W - R])(Date.parse(key))
                    : x(key)! + x.bandwidth() / 2
                }
                y={H - 22}
                textAnchor="middle"
              >
                {key.length > 10 ? key.slice(0, 9) + '…' : key}
              </text>
            );
          })}
    </>
  );
  if (kind === 'line' || kind === 'area') {
    const times = rows.map((r) => Date.parse(String(r[e.category!])));
    const tx = scaleLinear()
      .domain([Math.min(...times), Math.max(...times)])
      .range([L, W - R]);
    return (
      <>
        <Svg>
          {axes}
          {model.series.map((s) => {
            const gen = line<Row>()
              .defined((r) => r[s] !== null)
              .x((r) => tx(Date.parse(String(r[e.category!]))))
              .y((r) => y(numeric(r[s])));
            const fill = area<Row>()
              .defined((r) => r[s] !== null)
              .x((r) => tx(Date.parse(String(r[e.category!]))))
              .y0(y(0))
              .y1((r) => y(numeric(r[s])));
            return (
              <g key={s}>
                {kind === 'area' && <path d={fill(rows) ?? ''} fill={color(s)} fillOpacity=".15" />}
                <path d={gen(rows) ?? ''} stroke={color(s)} strokeWidth="2.6" fill="none" />
                {rows
                  .filter((r) => r[s] !== null)
                  .map((r, i) => (
                    <circle
                      key={i}
                      cx={tx(Date.parse(String(r[e.category!])))}
                      cy={y(numeric(r[s]))}
                      r="4"
                      fill={color(s)}
                    >
                      <title>
                        {label(r[e.category!])} · {s}: {label(r[s])}
                      </title>
                    </circle>
                  ))}
              </g>
            );
          })}
        </Svg>
        <ul className="chart-legend">
          {model.series.map((s) => (
            <li key={s}>
              <span style={{ background: color(s) }} />
              {model.columns.find((c) => c.id === s)?.label}
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (kind === 'scatter') {
    const xv = rows.map((r) => r[e.x!]).filter((v): v is number => typeof v === 'number'),
      yv = rows.map((r) => r[e.y!]).filter((v): v is number => typeof v === 'number');
    const sx = scaleLinear()
      .domain([Math.min(0, ...xv), Math.max(1, ...xv)])
      .nice()
      .range([L, W - R]);
    const sy = scaleLinear()
      .domain([Math.min(0, ...yv), Math.max(1, ...yv)])
      .nice()
      .range([H - B, T]);
    return (
      <>
        <Svg>
          {sy.ticks(4).map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="#dce2e2" />
              <text x={L - 8} y={sy(v) + 4} textAnchor="end">
                {label(v)}
              </text>
            </g>
          ))}
          {sx.ticks(4).map((v) => (
            <text key={v} x={sx(v)} y={H - 24} textAnchor="middle">
              {label(v)}
            </text>
          ))}
          {rows
            .filter((r) => r[e.x!] !== null && r[e.y!] !== null)
            .map((r, i) => (
              <circle
                key={i}
                cx={sx(numeric(r[e.x!]))}
                cy={sy(numeric(r[e.y!]))}
                r="6"
                fill={colors[0]}
              >
                <title>
                  {label(r[e.x!])}, {label(r[e.y!])}
                </title>
              </circle>
            ))}
        </Svg>
        <p className="axis-note">
          X: {model.columns.find((c) => c.id === e.x)?.label} · Y:{' '}
          {model.columns.find((c) => c.id === e.y)?.label}
        </p>
      </>
    );
  }
  if (kind === 'dumbbell') {
    const sx = scaleLinear()
      .domain([Math.min(0, ...allValues), Math.max(1, ...allValues)])
      .nice()
      .range([L + 70, W - R]);
    const sy = scaleBand<string>()
      .domain(rows.map((r) => String(r[e.category!])))
      .range([T, H - B])
      .padding(0.5);
    return (
      <>
        <Svg>
          {rows.map((r, i) => {
            const yy = sy(String(r[e.category!]))! + sy.bandwidth() / 2;
            return (
              <g key={i}>
                <text x={L + 60} y={yy + 5} textAnchor="end">
                  {label(r[e.category!])}
                </text>
                {r[e.start!] !== null && r[e.end!] !== null && (
                  <line
                    x1={sx(numeric(r[e.start!]))}
                    x2={sx(numeric(r[e.end!]))}
                    y1={yy}
                    y2={yy}
                    stroke="#78888e"
                    strokeWidth="3"
                  />
                )}
                {[e.start!, e.end!].map((s, j) =>
                  r[s] !== null ? (
                    <circle key={s} cx={sx(numeric(r[s]))} cy={yy} r="6" fill={colors[j]}>
                      <title>
                        {s}: {label(r[s])}
                      </title>
                    </circle>
                  ) : null,
                )}
              </g>
            );
          })}
          {sx.ticks(4).map((v) => (
            <text key={v} x={sx(v)} y={H - 22} textAnchor="middle">
              {label(v)}
            </text>
          ))}
        </Svg>
        <ul className="chart-legend">
          {[e.start!, e.end!].map((s, i) => (
            <li key={s}>
              <span style={{ background: colors[i] }} />
              {model.columns.find((c) => c.id === s)?.label}
            </li>
          ))}
        </ul>
        <p className="axis-note">
          Diferencias:{' '}
          {rows
            .map(
              (r) =>
                `${label(r[e.category!])}: ${r[e.start!] === null || r[e.end!] === null ? 'sin dato' : label(numeric(r[e.end!]) - numeric(r[e.start!]))}`,
            )
            .join('; ')}
          .
        </p>
      </>
    );
  }
  return (
    <>
      <Svg>
        {axes}
        {rows.map((r, i) => {
          const xpos = x(String(r[e.category!]))!;
          let offset = 0;
          return (
            <g key={i}>
              {(e.series ? model.series : [e.value!]).map((s, j) => {
                if (r[s] === null || (stacked && totals[i] === null)) return null;
                const value = numeric(r[s]);
                const start = stacked ? offset : 0;
                offset += value;
                const w = stacked
                  ? x.bandwidth()
                  : x.bandwidth() / (e.series ? model.series.length : 1);
                return (
                  <rect
                    key={s}
                    x={xpos + (stacked ? 0 : j * w)}
                    y={Math.min(y(start), y(start + value))}
                    width={Math.max(1, w - 1)}
                    height={Math.abs(y(start) - y(start + value))}
                    fill={color(s)}
                  >
                    <title>
                      {label(r[e.category!])} · {s}: {label(value)}
                    </title>
                  </rect>
                );
              })}
            </g>
          );
        })}
      </Svg>
      {e.series && (
        <ul className="chart-legend">
          {model.series.map((s) => (
            <li key={s}>
              <span style={{ background: color(s) }} />
              {model.columns.find((c) => c.id === s)?.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
