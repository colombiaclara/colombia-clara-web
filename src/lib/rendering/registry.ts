import type { Block } from '../../generated/content';
export const blockRegistry: Record<
  Block['type'],
  { render: 'static' | 'chart' | 'table'; label: string }
> = {
  paragraph: { render: 'static', label: 'Párrafo' },
  heading: { render: 'static', label: 'Subtítulo' },
  list: { render: 'static', label: 'Lista' },
  quote: { render: 'static', label: 'Cita' },
  image: { render: 'static', label: 'Imagen' },
  context: { render: 'static', label: 'Contexto' },
  timeline: { render: 'static', label: 'Cronología' },
  methodology: { render: 'static', label: 'Metodología' },
  metric: { render: 'static', label: 'Indicador' },
  chart: { render: 'chart', label: 'Gráfico' },
  table: { render: 'table', label: 'Tabla' },
};
