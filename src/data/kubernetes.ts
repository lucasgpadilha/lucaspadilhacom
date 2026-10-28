import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Kubernetes chapter: the capability and its method first; the real project only shows up
// as numbers. Same rule as home.ts: no employer, host or repository names.

export const kubernetes = {
  title: { en: 'Docker to Kubernetes migration', pt: 'Migração de Docker para Kubernetes' } satisfies L,
  lede: {
    en: 'I take services off Docker Compose and VMs and onto Kubernetes in phases, through GitOps, always with a way back.',
    pt: 'Tiro serviços do Docker Compose e de VMs e levo para Kubernetes em fases, por GitOps, sempre com caminho de volta.',
  } satisfies L,
  methodTitle: { en: 'How I do it', pt: 'Como eu faço' } satisfies L,
  method: [
    {
      title: { en: 'Inventory', pt: 'Inventário' },
      body: { en: 'Each service read from the key-value store and its Compose stack: ports, volumes, secrets and who depends on whom.', pt: 'Cada serviço lido do key-value store e do seu Compose: portas, volumes, segredos e quem depende de quem.' },
    },
    {
      title: { en: 'Package', pt: 'Empacotamento' },
      body: { en: 'Helm charts in Git, secrets through External Secrets from Vault, Kyverno policies.', pt: 'Helm charts no Git, segredos pelo External Secrets a partir do Vault, políticas no Kyverno.' },
    },
    {
      title: { en: 'Deliver', pt: 'Entrega' },
      body: { en: 'Argo CD applies what is in Git, with sync windows and selective sync.', pt: 'O Argo CD aplica o que está no Git, com sync windows e sync seletivo.' },
    },
    {
      title: { en: 'Switch in phases', pt: 'Virada em fases' },
      body: { en: 'Each service is registered behind the load balancer before Docker stops; until then, going back is a re-point.', pt: 'Cada serviço entra no load balancer antes de o Docker parar; até lá, voltar atrás é só reapontar.' },
    },
    {
      title: { en: 'Switch off', pt: 'Desligamento' },
      body: { en: 'Emptied VMs are switched off, and what runs is described in Git.', pt: 'VMs vazias são desligadas, e o que roda fica descrito no Git.' },
    },
  ] satisfies { title: L; body: L }[],
  facts: [
    { value: '~250', text: { en: 'services moved from Docker on VMs to OKE', pt: 'serviços levados do Docker em VMs para o OKE' } },
    { value: '10 → 258', text: { en: 'workloads on the cluster in under three weeks', pt: 'workloads no cluster em menos de três semanas' } },
    { value: '234', text: { en: 'service discovery records pointing at the cluster', pt: 'registros de service discovery apontando para o cluster' } },
    { value: '12', text: { en: 'platform services moved too, including Kafka, MongoDB, MinIO and Consul', pt: 'serviços de plataforma levados junto, entre eles Kafka, MongoDB, MinIO e Consul' } },
  ] satisfies { value: string; text: L }[],
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: ['Kubernetes', 'OKE', 'Docker', 'Helm', 'Argo CD', 'Image Updater', 'Kyverno', 'External Secrets', 'Vault', 'NetworkPolicies', 'Ansible', 'AWX'],

  figure: {
    en: 'A phased migration: Argo CD deploys each service to the cluster, the load balancer moves to it, and only then the Docker container stops',
    pt: 'Uma migração em fases: o Argo CD sobe cada serviço no cluster, o load balancer passa a apontar para ele e só então o container no Docker para',
  } satisfies L,
  labels: {
    docker: { name: { en: 'Docker on VMs', pt: 'Docker em VMs' }, detail: { en: 'Compose stacks', pt: 'stacks do Compose' } },
    lb: { name: { en: 'Load balancer', pt: 'Load balancer' }, detail: { en: 'service discovery', pt: 'service discovery' } },
    argo: { name: { en: 'Argo CD', pt: 'Argo CD' }, detail: { en: 'GitOps', pt: 'GitOps' } },
    oke: { name: { en: 'OKE', pt: 'OKE' }, detail: { en: 'one node pool per phase', pt: 'um node pool por fase' } },
  } satisfies Record<string, { name: L; detail: L }>,
  status: {
    clean: { en: 'Every phase on the cluster · VMs switched off', pt: 'Todas as fases no cluster · VMs desligadas' },
    rollback: {
      en: 'Phase 3 failed its health check: traffic went back to Docker and nothing was switched off.',
      pt: 'A fase 3 falhou no health check: o tráfego voltou para o Docker e nada foi desligado.',
    },
  } satisfies Record<string, L>,
  controls: {
    label: { en: 'Migration simulation', pt: 'Simulação da migração' },
    clean: { en: 'Run the migration', pt: 'Rodar a migração' },
    rollback: { en: 'Simulate a rollback', pt: 'Simular um rollback' },
  } satisfies Record<string, L>,
};
