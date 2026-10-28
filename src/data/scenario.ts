import type { Localized } from '../lib/locale';

type L = Localized<string>;

// The hero: one reference platform, composed from real work, with every part linking to
// the section that details it. Pains are written the way a visitor would say them.

export const scenario = {
  title: {
    en: ['Cloud platforms', 'your team can run.'],
    pt: ['Plataformas de nuvem', 'que o seu time consegue operar.'],
  } satisfies Localized<string[]>,
  lede: {
    en: 'I’m Lucas Padilha, a DevOps and platform engineer with over four years in IT. I design the network, the Kubernetes clusters and the path from code to production, with observability and cost under control. Deepest on OCI; also AWS and Azure.',
    pt: 'Sou Lucas Padilha, engenheiro DevOps e de plataforma com mais de quatro anos em TI. Desenho a rede, os clusters Kubernetes e o caminho do código até produção, com observabilidade e custo sob controle. Mais experiência em OCI; também AWS e Azure.',
  } satisfies L,
  project: { en: 'Have a project? Talk to me', pt: 'Tem um projeto? Fale comigo' } satisfies L,
  hiring: { en: 'Hiring? LinkedIn', pt: 'Contratando? LinkedIn' } satisfies L,
  sites: { en: 'Need a website for your business? See the offer', pt: 'Precisa de um site para o seu negócio? Ver a oferta' } satisfies L,
  legend: { en: 'The scenario, part by part', pt: 'O cenário, parte por parte' } satisfies L,
  hint: {
    en: 'A reference platform composed from real work. Open a part to see the problem it solves.',
    pt: 'Uma plataforma de referência montada a partir de trabalhos reais. Abra uma parte para ver o problema que ela resolve.',
  } satisfies L,
  more: { en: 'See how', pt: 'Ver como' } satisfies L,
  figure: {
    en: 'Reference platform: networks per environment joined by a hub, a management cluster and one cluster per environment, delivery from commit to cluster, observability, databases, cost and an environment for AI agents',
    pt: 'Plataforma de referência: redes por ambiente ligadas por um hub, um cluster de gerenciamento e um por ambiente, entrega do commit ao cluster, observabilidade, bancos, custo e um ambiente para agentes de IA',
  } satisfies L,
  parts: [
    {
      key: 'network',
      href: '#cloud',
      name: { en: 'Cloud and network architecture', pt: 'Arquitetura de cloud e rede' },
      pain: { en: 'Environments built by hand; nobody knows what talks to what.', pt: 'Ambientes criados na mão; ninguém sabe o que fala com o quê.' },
      build: { en: 'Compartments, one network per environment around a hub, rules per role. All in Terraform.', pt: 'Compartments, uma rede por ambiente em volta de um hub, regras por função. Tudo em Terraform.' },
    },
    {
      key: 'clusters',
      href: '#platform',
      name: { en: 'Multi-cluster Kubernetes', pt: 'Kubernetes multicluster' },
      pain: { en: 'One cluster for everything: a mistake in dev takes production down.', pt: 'Um cluster para tudo: um erro em dev derruba produção.' },
      build: { en: 'A management cluster and one cluster per environment, all delivered through GitOps.', pt: 'Um cluster de gerenciamento e um por ambiente, todos entregues por GitOps.' },
    },
    {
      key: 'migration',
      href: '#kubernetes',
      name: { en: 'Migration to Kubernetes', pt: 'Migração para Kubernetes' },
      pain: { en: 'Services stuck on VMs with Docker Compose, every deploy a ritual.', pt: 'Serviços presos em VMs com Docker Compose, cada deploy um ritual.' },
      build: { en: 'Phased migration with a way back. 500+ services moved.', pt: 'Migração em fases, com caminho de volta. Mais de 500 serviços migrados.' },
    },
    {
      key: 'delivery',
      href: '#delivery',
      name: { en: 'Delivery and DevSecOps', pt: 'Entrega e DevSecOps' },
      pain: { en: 'Only one person knows how to deploy, and the runner queue stalls the team.', pt: 'Só uma pessoa sabe fazer deploy, e a fila de runner trava o time.' },
      build: { en: 'Commit, CI on ephemeral runners, policies and secrets, then Argo CD. No manual steps.', pt: 'Commit, CI em runners efêmeros, políticas e segredos, depois Argo CD. Sem passo manual.' },
    },
    {
      key: 'finops',
      href: '#finops',
      name: { en: 'Cost (FinOps)', pt: 'Custo (FinOps)' },
      pain: { en: 'The bill arrives and nobody knows who spent it.', pt: 'A fatura chega e ninguém sabe quem gastou.' },
      build: { en: 'Cost tags, requests against real use, node pools at the right size.', pt: 'Tags de custo, requests contra o uso real, node pools na medida.' },
    },
    {
      key: 'observability',
      href: '#observability',
      name: { en: 'Observability', pt: 'Observabilidade' },
      pain: { en: 'We hear about outages from customers.', pt: 'A gente descobre a queda pelo cliente.' },
      build: { en: 'Metrics, logs and traces from every cluster in one place, with alerts.', pt: 'Métricas, logs e traces de todos os clusters num lugar só, com alertas.' },
    },
    {
      key: 'data',
      href: '#data',
      name: { en: 'Databases and stateful services', pt: 'Bancos e serviços com estado' },
      pain: { en: 'The database is the server nobody dares to upgrade.', pt: 'O banco é o servidor que ninguém ousa atualizar.' },
      build: { en: 'SQL Server provisioned and maintained with Terraform and Ansible.', pt: 'SQL Server provisionado e mantido com Terraform e Ansible.' },
    },
    {
      key: 'agents',
      href: '#automation',
      name: { en: 'AI agents and automation', pt: 'Agentes de IA e automação' },
      pain: { en: 'Coding agents with no isolated place to run and no rules to follow.', pt: 'Agentes de código sem ambiente isolado nem regras para seguir.' },
      build: { en: 'A dedicated environment for coding agents, with runbooks as AGENTS.md and skills.', pt: 'Um ambiente próprio para agentes de código, com runbooks em AGENTS.md e skills.' },
    },
  ] satisfies { key: string; href: string; name: L; pain: L; build: L }[],
  labels: {
    mgmt: 'MGMT',
    dev: 'DEV',
    hml: { en: 'STAGING', pt: 'HML' },
    prod: 'PROD',
    drg: { en: 'network hub', pt: 'hub de rede' },
    ci: 'CI/CD',
    argo: 'Argo CD',
    obs: { en: 'observability', pt: 'observabilidade' },
    runners: { en: 'ARC runners', pt: 'runners ARC' },
    sql: 'SQL Server',
    agents: { en: 'AI agents', pt: 'agentes de IA' },
    vms: { en: 'Docker VMs', pt: 'VMs com Docker' },
    cost: { en: 'cost', pt: 'custo' },
  },
  proof: [
    { value: '4+', text: { en: 'years in IT', pt: 'anos em TI' } },
    { value: '500+', text: { en: 'services migrated to Kubernetes', pt: 'serviços migrados para Kubernetes' } },
    { value: '10 → 258', text: { en: 'workloads in under three weeks', pt: 'workloads em menos de três semanas' } },
    { value: '1,100+', pt: '1.100+', text: { en: 'Linux hosts standardized', pt: 'hosts Linux padronizados' } },
    { value: '26–30%', text: { en: 'compute savings mapped', pt: 'de economia em compute mapeada' } },
  ] satisfies { value: string; pt?: string; text: L }[],
};
