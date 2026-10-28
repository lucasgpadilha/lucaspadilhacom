import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Public site rule: say what was done, never where. No employer names, no internal
// hostnames, repositories, bill amounts or incident dates — only relative numbers.

export const meta = {
  title: {
    en: 'Lucas Padilha — DevOps and cloud engineer, websites for businesses',
    pt: 'Lucas Padilha — engenheiro DevOps e cloud, sites para negócios',
  } satisfies L,
  description: {
    en: 'DevOps and cloud engineer: Kubernetes on OCI, Terraform, GitOps with Argo CD, DevSecOps pipelines and FinOps. I also build fast websites and run digital marketing for small businesses.',
    pt: 'Engenheiro DevOps e de cloud: Kubernetes na OCI, Terraform, GitOps com Argo CD, pipelines DevSecOps e FinOps. Também faço sites rápidos e marketing digital para pequenos negócios.',
  } satisfies L,
};

export const nav: Localized<{ href: string; label: string }[]> = {
  en: [
    { href: '#kubernetes', label: 'Kubernetes' },
    { href: '#cloud', label: 'Cloud' },
    { href: '#finops', label: 'FinOps' },
    { href: '#ops', label: 'Operations' },
    { href: '#websites', label: 'Websites' },
    { href: '#contact', label: 'Contact' },
  ],
  pt: [
    { href: '#kubernetes', label: 'Kubernetes' },
    { href: '#cloud', label: 'Cloud' },
    { href: '#finops', label: 'FinOps' },
    { href: '#ops', label: 'Operação' },
    { href: '#websites', label: 'Sites' },
    { href: '#contact', label: 'Contato' },
  ],
};

export const hero = {
  lines: {
    en: ['From commit to cluster,', 'with no manual steps.'],
    pt: ['Do commit ao cluster,', 'sem passo manual.'],
  } satisfies Localized<string[]>,
  lede: {
    en: 'I’m Lucas Padilha, a DevOps and cloud engineer. I move systems to Kubernetes on OCI, describe the infrastructure in Terraform, ship through GitOps with Argo CD and cut what the cloud overcharges.',
    pt: 'Sou Lucas Padilha, engenheiro DevOps e de cloud. Levo sistemas para Kubernetes na OCI, descrevo a infraestrutura em Terraform, entrego por GitOps com Argo CD e corto o que a nuvem cobra a mais.',
  } satisfies L,
  proof: {
    en: 'Latest project: about 250 services moved from VMs to OKE in three weeks, and 26–30% compute savings mapped.',
    pt: 'Último projeto: cerca de 250 serviços saíram de VMs para o OKE em três semanas, com 26–30% de economia em compute mapeada.',
  } satisfies L,
  primary: { en: 'See the work', pt: 'Ver o trabalho' } satisfies L,
  secondary: { en: 'I need a website', pt: 'Quero um site' } satisfies L,
  sites: { en: 'Need a website for your business? See the offer', pt: 'Precisa de um site para o seu negócio? Ver a oferta' } satisfies L,
};

export interface MigrationStep {
  key: 'vms' | 'migrate' | 'off';
  title: L;
  body: L;
}

export const migration = {
  title: { en: 'From five VMs to one Kubernetes cluster', pt: 'De cinco VMs a um cluster Kubernetes' } satisfies L,
  lede: {
    en: 'About 250 Docker Compose services, spread over five virtual machines, moved in phases to OKE and delivered through GitOps. Scroll to run it.',
    pt: 'Cerca de 250 serviços em Docker Compose, espalhados em cinco máquinas virtuais, levados em fases para o OKE e entregues por GitOps. Role para rodar.',
  } satisfies L,
  counter: { en: 'workloads on the cluster', pt: 'workloads no cluster' } satisfies L,
  steps: [
    {
      key: 'vms',
      title: { en: 'About 250 services on five VMs', pt: 'Cerca de 250 serviços em cinco VMs' },
      body: {
        en: 'Docker Compose stacks over five virtual machines: hard to scale, harder to patch and impossible to see as a whole.',
        pt: 'Stacks de Docker Compose em cinco máquinas virtuais: difíceis de escalar, mais difíceis de atualizar e impossíveis de enxergar como um todo.',
      },
    },
    {
      key: 'migrate',
      title: { en: 'Moved in phases', pt: 'Migrados em fases' },
      body: {
        en: 'Each service was read from the key-value store, registered behind the load balancer and only then stopped on Docker. The cluster went from 10 to 258 workloads in under three weeks.',
        pt: 'Cada serviço foi lido do key-value store, registrado atrás do load balancer e só então parado no Docker. O cluster foi de 10 para 258 workloads em menos de três semanas.',
      },
    },
    {
      key: 'off',
      title: { en: 'VMs switched off or emptied', pt: 'VMs desligadas ou esvaziadas' },
      body: {
        en: 'As each VM ran out of services it was emptied, and switched off where it could be. Service discovery now points at the cluster.',
        pt: 'Conforme cada VM ficava sem serviços, era esvaziada e, quando possível, desligada. O service discovery agora aponta para o cluster.',
      },
    },
  ] satisfies MigrationStep[],
  facts: [
    { value: '10 → 258', text: { en: 'workloads on the cluster in under three weeks', pt: 'workloads no cluster em menos de três semanas' } },
    { value: '234', text: { en: 'service discovery records now pointing at it', pt: 'registros de service discovery apontando para ele' } },
    { value: '73', text: { en: 'Argo CD applications over 4 release namespaces', pt: 'aplicações no Argo CD em 4 namespaces de release' } },
    { value: '12', text: { en: 'platform services moved along: Kafka, MongoDB, MinIO, Consul, Sentry, Strapi on PostgreSQL 17', pt: 'serviços de plataforma levados junto: Kafka, MongoDB, MinIO, Consul, Sentry, Strapi com PostgreSQL 17' } },
  ] satisfies { value: string; text: L }[],
  tools: ['Kubernetes', 'OKE', 'Argo CD', 'Image Updater', 'Helm', 'Kyverno', 'External Secrets', 'Vault', 'NetworkPolicies', 'Ansible', 'AWX'],
};

/** Square brackets mark the number in each line; the page sets it in the signal colour. */
export const ops = {
  title: { en: 'Operations at scale', pt: 'Operação em escala' } satisfies L,
  lede: {
    en: 'Before the cluster, the groundwork: a Linux fleet, branches, network and identity, standardized and automated.',
    pt: 'Antes do cluster, a base: frota Linux, filiais, rede e identidade padronizadas e automatizadas.',
  } satisfies L,
  items: [
    {
      title: { en: 'Linux fleet', pt: 'Frota Linux' },
      body: { en: '[1,100+] hosts standardized with AWX, Uyuni, FOG and FreeIPA, against configuration drift.', pt: '[1.100+] hosts padronizados com AWX, Uyuni, FOG e FreeIPA, contra divergência de configuração.' },
    },
    {
      title: { en: 'Branches and network', pt: 'Filiais e rede' },
      body: { en: '[230+] branches provisioned automatically; [300+] access points onboarded into Zabbix through its API.', pt: '[230+] filiais com provisionamento automatizado; [300+] access points cadastrados no Zabbix pela API.' },
    },
    {
      title: { en: 'Identity', pt: 'Identidade' },
      body: { en: 'FreeIPA integrated with Active Directory, and the Microsoft 365 account lifecycle automated.', pt: 'FreeIPA integrado ao Active Directory e ciclo de vida de contas do Microsoft 365 automatizado.' },
    },
    {
      title: { en: 'Kubernetes, day 0 to day 2', pt: 'Kubernetes do dia 0 ao dia 2' },
      body: { en: 'OKE and Rancher: provisioning, cluster import, upgrades, registry, ingress and certificates.', pt: 'OKE e Rancher: provisionamento, importação de clusters, upgrades, registry, ingress e certificados.' },
    },
    {
      title: { en: 'Platform services', pt: 'Serviços de plataforma' },
      body: { en: 'Harbor, Traefik, cert-manager, Vault and Infisical, HAProxy and CI runners kept healthy.', pt: 'Harbor, Traefik, cert-manager, Vault e Infisical, HAProxy e runners de CI mantidos saudáveis.' },
    },
    {
      title: { en: 'CI/CD', pt: 'CI/CD' },
      body: { en: 'Self-hosted GitHub Actions runners on OKE; GitLab CI and Jenkins pipelines tuned for builds, runners and secrets.', pt: 'Runners self-hosted do GitHub Actions no OKE; pipelines de GitLab CI e Jenkins otimizados em builds, runners e segredos.' },
    },
    {
      title: { en: 'Databases', pt: 'Bancos de dados' },
      body: { en: 'SQL Server 2022 to 2025 upgrade prepared: runbook, inventory and login control. Replication and CDC.', pt: 'Atualização do SQL Server 2022 para 2025 preparada: runbook, inventário e controle de logins. Replicação e CDC.' },
    },
    {
      title: { en: 'Automation', pt: 'Automação' },
      body: { en: 'Python, AWX, n8n and APIs for health checks, auto-healing, alerts, incident response and disaster recovery on OCI.', pt: 'Python, AWX, n8n e APIs para health checks, auto-healing, alertas, resposta a incidentes e disaster recovery na OCI.' },
    },
    {
      title: { en: 'Written down', pt: 'Tudo por escrito' },
      body: { en: '[~880] commits over 12 repositories in 4 months; [~60] tickets led, each with a record and a handoff. Runbooks and ADRs become AGENTS.md files and skills for people and AI agents.', pt: '[~880] commits em 12 repositórios em 4 meses; [~60] tickets conduzidos, cada um com registro e handoff. Runbooks e ADRs viram AGENTS.md e skills para pessoas e agentes de IA.' },
    },
  ] satisfies { title: L; body: L }[],
};

export const websites = {
  title: { en: 'Websites and marketing for small businesses', pt: 'Sites e marketing para pequenos negócios' } satisfies L,
  body: {
    en: 'Fast websites, built and hosted with the same care as production infrastructure, plus the marketing that brings people to them. Three concept sites show the range.',
    pt: 'Sites rápidos, feitos e hospedados com o mesmo cuidado de uma infraestrutura de produção, e o marketing que leva gente até eles. Três sites conceito mostram o alcance.',
  } satisfies L,
  marketing: {
    en: 'Instagram and social media management, paid traffic on Meta, Google, TikTok and Kwai Ads, TikTok Shop and content automation.',
    pt: 'Gestão de Instagram e redes sociais, tráfego pago no Meta, Google, TikTok e Kwai Ads, TikTok Shop e automação de conteúdo.',
  } satisfies L,
  cta: { en: 'See the offer (in Portuguese)', pt: 'Ver a oferta' } satisfies L,
  monthly: { en: 'a month', pt: 'por mês' } satisfies L,
};

export const side = {
  title: { en: 'Side projects', pt: 'Projetos paralelos' } satisfies L,
  items: [
    { name: 'PyNOC', href: 'https://github.com/lucasgpadilha/pynoc', body: { en: 'Self-hosted NOC that turns noisy Zabbix alerts into incidents in Discord.', pt: 'NOC self-hosted que transforma alertas do Zabbix em incidentes no Discord.' } },
    { name: 'Floci Cloud Lab', href: 'https://github.com/lucasgpadilha/floci-cloud-lab', body: { en: 'AWS lab with Terraform and tests against a local emulator.', pt: 'Lab de AWS com Terraform e testes contra um emulador local.' } },
    { name: 'tuildap', href: 'https://github.com/lucasgpadilha/tuildap', body: { en: 'Terminal UI in Go for LDAP, Active Directory and FreeIPA.', pt: 'Interface de terminal em Go para LDAP, Active Directory e FreeIPA.' } },
    { name: 'MilKontrol', href: 'https://milkontrol.cloud/', body: { en: 'Dairy-farm management SaaS, live.', pt: 'SaaS de gestão de fazenda leiteira, no ar.' } },
  ] satisfies { name: string; href: string; body: L }[],
};

export const about = {
  education: {
    en: 'Systems Analysis and Development (technologist degree), UTFPR, 2023–2026',
    pt: 'Tecnólogo em Análise e Desenvolvimento de Sistemas, UTFPR, 2023–2026',
  } satisfies L,
  languages: {
    en: 'Portuguese (native) · English (upper-intermediate)',
    pt: 'Português (nativo) · Inglês (intermediário-avançado)',
  } satisfies L,
  place: { en: 'Ponta Grossa, Paraná, Brazil', pt: 'Ponta Grossa, Paraná' } satisfies L,
};

export const contact = {
  title: { en: 'Let’s talk', pt: 'Vamos conversar' } satisfies L,
  sideTitle: { en: 'Side projects', pt: 'Projetos paralelos' } satisfies L,
  body: {
    en: 'Hiring for DevOps, cloud or platform work, or need a website for your business? Email is the fastest way.',
    pt: 'Contratando para DevOps, cloud ou plataforma, ou precisa de um site para o seu negócio? E-mail é o caminho mais rápido.',
  } satisfies L,
};

export const email = 'ceo@lucaspadilha.com';

export const deploy = {
  figure: {
    en: 'An automated deploy, from commit to the cluster, with a security gate on the way',
    pt: 'Um deploy automatizado, do commit ao cluster, com um portão de segurança no caminho',
  } satisfies L,
  stages: [
    { key: 'commit', name: { en: 'Commit', pt: 'Commit' }, tools: { en: 'git push to main', pt: 'git push na main' } },
    {
      key: 'ci',
      name: { en: 'CI', pt: 'CI' },
      tools: { en: 'GitHub Actions on runners inside the cluster', pt: 'GitHub Actions em runners no cluster' },
      proof: { en: '111 test files · 4 IaC suites', pt: '111 arquivos de teste · 4 suítes de IaC' },
    },
    {
      key: 'policy',
      name: { en: 'Policy and secrets', pt: 'Política e segredos' },
      tools: { en: 'Kyverno · External Secrets from Vault', pt: 'Kyverno · External Secrets do Vault' },
    },
    { key: 'image', name: { en: 'Image', pt: 'Imagem' }, tools: { en: 'OCIR registry', pt: 'registry OCIR' } },
    {
      key: 'sync',
      name: { en: 'GitOps', pt: 'GitOps' },
      tools: { en: 'Argo CD · Image Updater · sync windows', pt: 'Argo CD · Image Updater · sync windows' },
      proof: { en: '73 applications', pt: '73 aplicações' },
    },
    {
      key: 'prod',
      name: { en: 'Production', pt: 'Produção' },
      tools: { en: 'OKE · rolling update', pt: 'OKE · rolling update' },
      proof: { en: '258 workloads', pt: '258 workloads' },
    },
  ] satisfies { key: string; name: L; tools: L; proof?: L }[],
  status: {
    clean: { en: 'Synced · Healthy', pt: 'Synced · Healthy' },
    blocked: {
      en: 'Stopped by Kyverno: the container ran as root. Nothing reached the cluster.',
      pt: 'Barrado pelo Kyverno: o container rodava como root. Nada chegou ao cluster.',
    },
  } satisfies Record<string, L>,
  controls: {
    label: { en: 'Deploy simulation', pt: 'Simulação de deploy' },
    clean: { en: 'Run the deploy', pt: 'Rodar o deploy' },
    blocked: { en: 'Try a policy violation', pt: 'Tentar uma violação de política' },
  } satisfies Record<string, L>,
};
