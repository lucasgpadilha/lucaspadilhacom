import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Platform chapter: one management cluster plus one cluster per environment, on managed
// Kubernetes. Same public-site rule as home.ts: no employer, host or repository names,
// no money amounts, no dates.

export const platform = {
  title: { en: 'Multi-cluster Kubernetes platform', pt: 'Plataforma Kubernetes multicluster' } satisfies L,
  pain: {
    en: 'One cluster for everything: a mistake in dev takes production down.',
    pt: 'Um cluster para tudo: um erro em dev derruba produção.',
  } satisfies L,
  lede: {
    en: 'I build managed Kubernetes platforms with one management cluster and one cluster per environment. MGMT delivers to every cluster through GitOps and watches all of them, so a failure stays where it started. Most of my hours are on OKE; the same design applies to EKS and AKS.',
    pt: 'Monto plataformas Kubernetes gerenciadas com um cluster de gestão e um cluster por ambiente. O MGMT entrega em todos os clusters por GitOps e observa todos eles, e uma falha fica onde começou. A maior parte da minha experiência é no OKE; o mesmo desenho vale para EKS e AKS.',
  } satisfies L,
  body: {
    en: 'MGMT runs Argo CD, the observability stack (Prometheus, VictoriaMetrics, Grafana, Loki, Tempo, OpenTelemetry, Sentry), the GitHub Actions runners on a virtual node pool, and the policies. Day 0 to day 2 on OKE and Rancher: provisioning, cluster import, upgrades, registry, ingress and certificates, with Harbor, Traefik, cert-manager, Vault, Infisical and HAProxy kept healthy.',
    pt: 'O MGMT roda o Argo CD, a stack de observabilidade (Prometheus, VictoriaMetrics, Grafana, Loki, Tempo, OpenTelemetry, Sentry), os runners do GitHub Actions num virtual node pool e as políticas. Do dia 0 ao dia 2 no OKE e no Rancher: provisionamento, importação de clusters, upgrades, registry, ingress e certificados, com Harbor, Traefik, cert-manager, Vault, Infisical e HAProxy saudáveis.',
  } satisfies L,
  facts: [
    {
      value: '73',
      text: {
        en: 'Argo CD applications in 4 release namespaces, with sync windows and selective sync per commit',
        pt: 'aplicações no Argo CD em 4 namespaces de release, com sync windows e sync seletivo por commit',
      },
    },
    { value: '258', text: { en: 'workloads on the production cluster', pt: 'workloads no cluster de produção' } },
    { value: '500+', text: { en: 'services migrated to Kubernetes', pt: 'serviços migrados para Kubernetes' } },
  ] satisfies { value: string; text: L }[],
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: ['Kubernetes', 'OKE', 'Rancher', 'Argo CD', 'Helm', 'Kyverno', 'NetworkPolicies', 'Cluster Autoscaler', 'cert-manager', 'Traefik', 'Harbor', 'Vault', 'External Secrets', 'ARC'],

  figure: {
    en: 'A management cluster runs Argo CD, observability and the CI runners; Argo CD syncs three environment clusters, dev, staging and production, and their telemetry comes back to it. In one shared cluster, a bad deploy in dev takes production pods down with it; with one cluster per environment, it stays in dev.',
    pt: 'Um cluster de gestão roda o Argo CD, a observabilidade e os runners de CI; o Argo CD sincroniza três clusters de ambiente, dev, homologação e produção, e a telemetria deles volta para ele. Num cluster compartilhado, um deploy ruim em dev derruba pods de produção junto; com um cluster por ambiente, ele fica em dev.',
  } satisfies L,
  // Drawing labels, keyed by the piece they name. `detail` is dropped below 1080px.
  labels: {
    mgmt: { name: { en: 'MGMT', pt: 'MGMT' }, detail: { en: 'management cluster', pt: 'cluster de gestão' } },
    argo: { name: { en: 'Argo CD', pt: 'Argo CD' }, detail: { en: 'GitOps for every cluster', pt: 'GitOps de todos os clusters' } },
    obs: { name: { en: 'Observability', pt: 'Observabilidade' }, detail: { en: 'metrics, logs and traces', pt: 'métricas, logs e traces' } },
    arc: { name: { en: 'ARC runners', pt: 'Runners ARC' }, detail: { en: 'CI on a virtual node pool', pt: 'CI num virtual node pool' } },
    dev: { name: { en: 'DEV', pt: 'DEV' }, detail: { en: 'development', pt: 'desenvolvimento' } },
    hml: { name: { en: 'STAGING', pt: 'HML' }, detail: { en: 'pre-production', pt: 'homologação' } },
    prod: { name: { en: 'PROD', pt: 'PROD' }, detail: { en: '258 workloads', pt: '258 workloads' } },
    shared: { name: { en: 'One shared cluster', pt: 'Um cluster só' }, detail: { en: 'dev, staging and prod on the same nodes', pt: 'dev, homologação e produção nos mesmos nós' } },
  } satisfies Record<string, { name: L; detail: L }>,
  // Pod colours in the drawing, for the key.
  legend: {
    prod: { en: 'prod', pt: 'prod' },
    hml: { en: 'staging', pt: 'hml' },
    dev: { en: 'dev', pt: 'dev' },
  } satisfies Record<string, L>,
  status: {
    split: {
      en: 'MGMT delivers to dev, staging and prod through GitOps, and watches all three.',
      pt: 'O MGMT entrega em dev, homologação e produção por GitOps, e observa os três.',
    },
    shared: {
      en: 'A bad deploy in dev fought prod for the same nodes and took it down too.',
      pt: 'Um deploy ruim em dev disputou os mesmos nós e derrubou produção junto.',
    },
    isolated: {
      en: 'The same failure stayed in dev. Production never noticed.',
      pt: 'O mesmo erro ficou em dev. Produção nem percebeu.',
    },
  } satisfies Record<string, L>,
  controls: {
    label: { en: 'A bad deploy in dev, with', pt: 'Um deploy ruim em dev, com' },
    shared: { en: 'One cluster for everything', pt: 'Um cluster para tudo' },
    split: { en: 'MGMT + one per environment', pt: 'MGMT + um por ambiente' },
  } satisfies Record<string, L>,
};
