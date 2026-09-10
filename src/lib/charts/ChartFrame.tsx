import { useState, useEffect, useRef, useMemo } from 'react';
import type { ChartBlock, Dataset } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { transformChart, modelCSV } from './model';
import { ChartCanvas } from './ChartCanvas';
import { DataTable } from './DataTable';
import { SourceReference } from '../sources/SourceReference';
export function ChartFrame({
  block,
  dataset,
  datasetUrl,
  context,
}: {
  block: ChartBlock;
  dataset: Dataset;
  datasetUrl: string;
  context: ContentContext;
}) {
  const [rowIndex, setRowIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState(block.encoding.series ?? []);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [width, setWidth] = useState(320);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHydrated(true);
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) =>
      setWidth(Math.max(280, entries[0].contentRect.width)),
    );
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const model = useMemo(
    () =>
      transformChart(block, dataset, {
        ...(block.encoding.series ? { series: selected } : {}),
        from,
        to,
      }),
    [block, dataset, selected, from, to],
  );
  const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff' + modelCSV(model));
  return (
    <figure className="chart-frame" aria-labelledby={`${block.id}-title`}>
      <div className="chart-title">
        <span className="kicker">LOS DATOS</span>
        <h3 id={`${block.id}-title`}>{block.title}</h3>
        <p>{block.description}</p>
      </div>
      {(dataset.period || dataset.geography) && (
        <p className="chart-scope">
          {[dataset.period, dataset.geography].filter(Boolean).join(' · ')}
        </p>
      )}
      <p className="chart-units">
        {dataset.columns
          .filter((c) => c.type === 'number')
          .map((c) => `${c.label}: ${c.unit ?? 'valor sin unidad'}`)
          .join(' · ')}
      </p>
      {(block.options?.seriesFilter || block.options?.periodFilter) && (
        <div className="chart-controls js-only">
          {block.options.seriesFilter && (
            <fieldset disabled={!hydrated}>
              <legend>Series</legend>
              {block.encoding.series?.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={selected.includes(s)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? [...selected, s] : selected.filter((x) => x !== s),
                      )
                    }
                  />
                  {dataset.columns.find((c) => c.id === s)?.label}
                </label>
              ))}
            </fieldset>
          )}
          {block.options.periodFilter && (
            <fieldset disabled={!hydrated}>
              <legend>Periodo</legend>
              <label>
                Desde
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label>
                Hasta
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <button
                type="button"
                onClick={() => {
                  setFrom('');
                  setTo('');
                }}
              >
                Restablecer periodo
              </button>
            </fieldset>
          )}
        </div>
      )}
      <div ref={ref} className="chart-canvas">
        <ChartCanvas block={block} model={model} width={width} />
      </div>
      {model.rows.length > 0 && (
        <details className="data-explorer js-only">
          <summary>Explorar los valores</summary>
          <label htmlFor={`${block.id}-record`}>Consultar un registro</label>
          <select
            disabled={!hydrated}
            id={`${block.id}-record`}
            value={Math.min(rowIndex, model.rows.length - 1)}
            onChange={(e) => setRowIndex(Number(e.target.value))}
          >
            {model.rows.map((r, i) => (
              <option key={i} value={i}>
                {i + 1}. {String(r[model.columns[0].id] ?? 'Sin dato')}
              </option>
            ))}
          </select>
          <dl aria-live="polite">
            {model.columns.map((c) => (
              <div key={c.id}>
                <dt>
                  {c.label}
                  {c.unit ? ` (${c.unit})` : ''}
                </dt>
                <dd>
                  {String(
                    model.rows[Math.min(rowIndex, model.rows.length - 1)][c.id] ?? 'Sin dato',
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      <p className="chart-status" role="status">
        {model.rows.length} {model.rows.length === 1 ? 'registro' : 'registros'} en la selección ·{' '}
        {model.missing} {model.missing === 1 ? 'valor ausente' : 'valores ausentes'}
        {block.encoding.series
          ? ` · ${selected.length} ${selected.length === 1 ? 'serie visible' : 'series visibles'}`
          : ''}
        {from || to ? ` · periodo ${from || 'inicio'} a ${to || 'final'}` : ''}.
      </p>
      <details className="chart-data">
        <summary>Ver tabla y descargar datos</summary>
        <DataTable
          title={block.title}
          columns={model.columns}
          rows={model.rows}
          decimals={block.options?.decimals ?? 1}
        />
        <div className="download-links">
          <a href={csv} download={`${dataset.id}-${block.kind}.csv`}>
            Descargar esta tabla (CSV)
          </a>
          <a href={datasetUrl} download>
            Dataset original (JSON)
          </a>
        </div>
      </details>
      <figcaption>
        <p>{model.note}</p>
        <p>
          Visualización redondeada a {block.options?.decimals ?? 1} decimales como máximo. El CSV
          conserva la precisión del dataset.
        </p>
        <p>{dataset.methodology}</p>
        {dataset.calculation && (
          <p>
            Fórmula: {dataset.calculation.formula}. Entradas:{' '}
            {dataset.calculation.inputs.join(', ')}. {dataset.calculation.rounding}
          </p>
        )}
        <SourceReference citations={dataset.citations} context={context} />
        <SourceReference citations={block.citations} context={context} />
      </figcaption>
    </figure>
  );
}
