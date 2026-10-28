import type { Localized } from '../lib/locale';

type L = Localized<string>;

// FinOps chapter. Same rule as home.ts: only relative numbers from the CV, no money
// amounts, no employer, host or repository names.

export const finops = {
  title: { en: 'FinOps: the cloud at the right size', pt: 'FinOps: a nuvem na medida' } satisfies L,
  lede: {
    en: 'I find where the cloud overcharges, like requests far above real use, forgotten backups and concentrated egress, and turn it into a savings plan.',
    pt: 'Encontro onde a nuvem cobra a mais, como requests muito acima do uso, backups esquecidos e egress concentrado, e transformo isso num plano de economia.',
  } satisfies L,
  body: {
    en: 'Cost tags on the infrastructure, requests compared with real p95 use, a rightsizing map for nodes and requests, and blue/green node-pool recycling: the new pool is up before the old one drains. I also built a FinOps MVP for OCI.',
    pt: 'Tags de custo na infraestrutura, requests comparados com o uso real no p95, mapa de rightsizing de nodes e requests e reciclagem blue/green de node pools: o pool novo sobe antes de o antigo ser drenado. Também construí um MVP de FinOps para OCI.',
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
    rightsizing: { en: 'what rightsizing would give back', pt: 'o que o rightsizing devolveria' },
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
      en: 'Rightsizing would give back the requested cores above real use: the flat cells in the drawing.',
      pt: 'O rightsizing devolveria os cores pedidos acima do uso real: as células planas do desenho.',
    },
  ] satisfies L[],

  // Part of a whole: the track is the whole, the fill the share.
  findings: {
    title: { en: 'Also on the bill', pt: 'Também na fatura' } satisfies L,
    scale: { en: 'share', pt: 'parcela' } satisfies L,
    items: [
      { name: { en: 'Backups, of the whole bill', pt: 'Backups, do total da fatura' }, value: { en: '≈ 28%', pt: '≈ 28%' }, share: 28 },
      {
        name: { en: '2 servers, of all internet egress', pt: '2 servidores, do egress de internet' },
        value: { en: '86%', pt: '86%' },
        share: 86,
      },
    ] satisfies { name: L; value: L; share: number }[],
  },
  // Before = 100. The outlined track is the cost before, the solid bar the cost after;
  // `after` is a range when the saving is; an estimate is hatched, not solid.
  results: {
    title: { en: 'Results and estimate', pt: 'Resultados e estimativa' } satisfies L,
    scale: { en: 'before = 100', pt: 'antes = 100' } satisfies L,
    before: { en: 'before', pt: 'antes' } satisfies L,
    after: { en: 'after', pt: 'depois' } satisfies L,
    items: [
      { name: { en: 'One VM', pt: 'Uma VM' }, value: { en: '−84%', pt: '−84%' }, after: [16, 16] },
      { name: { en: 'A legacy cluster', pt: 'Um cluster legado' }, value: { en: '−63%', pt: '−63%' }, after: [37, 37] },
      { name: { en: 'Compute, mapped (estimate)', pt: 'Compute, mapeado (estimativa)' }, value: { en: '−26 to −30%', pt: '−26 a −30%' }, after: [70, 74], estimate: true },
    ] satisfies { name: L; value: L; after: [number, number]; estimate?: boolean }[],
  },
  replay: { en: 'Play again', pt: 'Ver de novo' } satisfies L,
};
