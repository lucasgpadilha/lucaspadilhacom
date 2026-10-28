import type { Localized } from '../lib/locale';

type L = Localized<string>;

// FinOps chapter. Same rule as home.ts: only relative numbers from the CV, no money
// amounts, no employer, host or repository names.

export const finops = {
  title: { en: 'The bill, from the bottom up', pt: 'A conta, de baixo para cima' } satisfies L,
  lede: {
    en: 'After the move to Kubernetes on OCI, I read the cloud bill line by line and matched every CPU request to what the pods really used.',
    pt: 'Depois da migração para Kubernetes na OCI, li a fatura da nuvem linha por linha e comparei cada request de CPU com o que os pods usavam de fato.',
  } satisfies L,
  body: {
    en: 'Cost tags gave every line of the bill an owner. I rightsized nodes and requests, and node pools are recycled blue/green: the new pool is up before the old one drains. I also built a FinOps MVP for OCI.',
    pt: 'Com tags de custo, cada linha da fatura ganhou dono. Fiz rightsizing de nodes e requests, e os node pools são reciclados em blue/green: o pool novo sobe antes de o antigo ser drenado. Também construí um MVP de FinOps para OCI.',
  } satisfies L,
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: {
    en: ['cost tags', 'rightsizing', 'blue/green node-pool recycling', 'Cluster Autoscaler', 'FinOps MVP for OCI', 'E5, E6, A1 and A4 shapes', 'OCPU vs vCPU'],
    pt: ['tags de custo', 'rightsizing', 'reciclagem blue/green de node pools', 'Cluster Autoscaler', 'MVP de FinOps para OCI', 'shapes E5, E6, A1 e A4', 'OCPU vs vCPU'],
  } satisfies Localized<string[]>,

  figure: {
    en: 'CPU requested versus CPU used at p95, and what changed on the bill',
    pt: 'CPU pedida versus CPU usada no p95, e o que mudou na fatura',
  } satisfies L,
  // Labels over the cube plate. 128 cubes of 0.1 core; 0.86 is drawn as 8 full cubes
  // and 60% of a ninth.
  grid: {
    requested: { value: { en: '12.8', pt: '12,8' }, text: { en: 'cores requested', pt: 'cores pedidos' } },
    unit: { en: 'each cell = 0.1 core', pt: 'cada célula = 0,1 core' },
    used: { value: { en: '0.86', pt: '0,86' }, text: { en: 'used at p95', pt: 'usados no p95' } },
    ratio: { value: { en: '~15×', pt: '~15×' }, text: { en: 'more requested than used', pt: 'mais pedido que usado' } },
    rightsizing: { en: 'what rightsizing gives back', pt: 'o que o rightsizing devolve' },
  } satisfies Record<string, L | { value: L; text: L }>,
  // Text alternative for the drawing: every number, in reading order.
  alt: [
    { en: '128 cells of 0.1 core each: 12.8 cores requested.', pt: '128 células de 0,1 core cada: 12,8 cores pedidos.' },
    {
      en: '0.86 cores used at p95, drawn as 8 full cells and 60% of a ninth.',
      pt: '0,86 core usado no p95, desenhado como 8 células cheias e 60% de uma nona.',
    },
    { en: 'Requests were about 15× the real use.', pt: 'O pedido era cerca de 15× o uso real.' },
    {
      en: 'Rightsizing gives back the requested cores above real use: the flat cells in the drawing.',
      pt: 'O rightsizing devolve os cores pedidos acima do uso real: as células planas do desenho.',
    },
  ] satisfies L[],

  // Part of a whole: the track is the whole, the fill the share.
  findings: {
    title: { en: 'Also on the bill', pt: 'Também na fatura' } satisfies L,
    scale: { en: 'share of the total', pt: 'parcela do total' } satisfies L,
    items: [
      { name: { en: 'Backups, of the whole bill', pt: 'Backups, do total da fatura' }, value: { en: '≈ 28%', pt: '≈ 28%' }, share: 28 },
      {
        name: { en: 'Internet egress from 2 servers', pt: 'Egress de internet de 2 servidores' },
        value: { en: '86%', pt: '86%' },
        share: 86,
      },
    ] satisfies { name: L; value: L; share: number }[],
  },
  // Before = 100. The outlined track is the cost before, the solid bar the cost after;
  // `after` is a range when the saving is.
  results: {
    title: { en: 'Results', pt: 'Resultados' } satisfies L,
    scale: { en: 'before = 100', pt: 'antes = 100' } satisfies L,
    before: { en: 'before', pt: 'antes' } satisfies L,
    after: { en: 'after', pt: 'depois' } satisfies L,
    items: [
      { name: { en: 'One VM', pt: 'Uma VM' }, value: { en: '−84%', pt: '−84%' }, after: [16, 16] },
      { name: { en: 'A legacy cluster', pt: 'Um cluster legado' }, value: { en: '−63%', pt: '−63%' }, after: [37, 37] },
      { name: { en: 'Compute, mapped', pt: 'Compute mapeado' }, value: { en: '−26 to −30%', pt: '−26 a −30%' }, after: [70, 74] },
    ] satisfies { name: L; value: L; after: [number, number] }[],
  },
  replay: { en: 'Play again', pt: 'Ver de novo' } satisfies L,
};
