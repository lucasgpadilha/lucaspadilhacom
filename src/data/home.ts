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
    en: 'I move workloads to Kubernetes, cut cloud bills and automate infrastructure. I also build fast websites and run digital marketing for small businesses.',
    pt: 'Levo workloads para Kubernetes, corto a conta de nuvem e automatizo infraestrutura. Também faço sites rápidos e marketing digital para pequenos negócios.',
  } satisfies L,
};

export const nav: Localized<{ href: string; label: string }[]> = {
  en: [
    { href: '#infra', label: 'Infrastructure' },
    { href: '#feats', label: 'Track record' },
    { href: '#websites', label: 'Websites' },
    { href: '#contact', label: 'Contact' },
  ],
  pt: [
    { href: '#infra', label: 'Infraestrutura' },
    { href: '#feats', label: 'Histórico' },
    { href: '#websites', label: 'Sites' },
    { href: '#contact', label: 'Contato' },
  ],
};

export const hero = {
  lines: {
    en: ['Infrastructure that holds up in production.', 'Websites that bring in customers.'],
    pt: ['Infraestrutura que aguenta produção.', 'Sites que trazem cliente.'],
  } satisfies Localized<string[]>,
  lede: {
    en: 'I’m Lucas Padilha, a DevOps and cloud engineer in Brazil. I move workloads to Kubernetes, cut cloud bills and automate the work nobody should do twice. I also build fast websites for small businesses.',
    pt: 'Sou Lucas Padilha, engenheiro DevOps e de cloud. Levo workloads para Kubernetes, corto a conta de nuvem e automatizo o trabalho que ninguém deveria fazer duas vezes. Também faço sites rápidos para pequenos negócios.',
  } satisfies L,
  primary: { en: 'See the infrastructure work', pt: 'Ver o trabalho de infra' } satisfies L,
  secondary: { en: 'I need a website', pt: 'Quero um site' } satisfies L,
};

export interface MigrationStep {
  key: 'vms' | 'migrate' | 'off' | 'finops' | 'network';
  title: L;
  body: L;
}

export const migration = {
  title: { en: 'From five VMs to one cluster', pt: 'De cinco VMs a um cluster' } satisfies L,
  intro: {
    en: 'A recent platform migration, told by its numbers. Keep scrolling to run it.',
    pt: 'Uma migração de plataforma recente, contada pelos números. Continue rolando para rodar.',
  } satisfies L,
  counter: { en: 'workloads on Kubernetes', pt: 'workloads no Kubernetes' } satisfies L,
  steps: [
    {
      key: 'vms',
      title: { en: 'About 250 services on five VMs', pt: 'Cerca de 250 serviços em cinco VMs' },
      body: {
        en: 'Docker Compose stacks spread over five virtual machines: hard to scale, harder to patch and impossible to see as a whole.',
        pt: 'Stacks de Docker Compose espalhadas em cinco máquinas virtuais: difíceis de escalar, mais difíceis de atualizar e impossíveis de enxergar como um todo.',
      },
    },
    {
      key: 'migrate',
      title: { en: 'Moved in phases to Kubernetes', pt: 'Migrados em fases para Kubernetes' },
      body: {
        en: 'Each service was read from the key-value store, registered behind the load balancer and only then stopped on Docker, all through GitOps with Argo CD. The managed cluster went from 10 to 258 workloads in three weeks.',
        pt: 'Cada serviço foi lido do key-value store, registrado atrás do load balancer e só então parado no Docker, tudo por GitOps com Argo CD. O cluster gerenciado foi de 10 para 258 workloads em três semanas.',
      },
    },
    {
      key: 'off',
      title: { en: 'Five VMs switched off or emptied', pt: 'Cinco VMs desligadas ou esvaziadas' },
      body: {
        en: 'As each VM ran out of services it was emptied, and switched off where it could be. Today 73 Argo CD applications describe what runs on the cluster.',
        pt: 'Conforme cada VM ficava sem serviços, era esvaziada e, quando possível, desligada. Hoje 73 aplicações no Argo CD descrevem o que roda no cluster.',
      },
    },
    {
      key: 'finops',
      title: { en: 'Then the bill', pt: 'Depois, a conta' },
      body: {
        en: 'CPU requests were about 15 times the real p95 usage. Rightsizing nodes and requests mapped 26–30% of savings in compute; one legacy cluster now costs 63% less and one VM 84% less. Backups turned out to be almost 28% of the bill.',
        pt: 'Os requests de CPU estavam cerca de 15 vezes acima do uso real no p95. O rightsizing de nós e requests mapeou 26–30% de economia em compute; um cluster legado passou a custar 63% menos e uma VM, 84% menos. Os backups eram quase 28% da conta.',
      },
    },
    {
      key: 'network',
      title: { en: 'Network and security as code', pt: 'Rede e segurança como código' },
      body: {
        en: 'VCN, DRG, NSGs, NAT with a reserved IP, WAF and public and internal NLBs in Terraform with automated static validation, plus NetworkPolicies per tenant through GitOps.',
        pt: 'VCN, DRG, NSGs, NAT com IP reservado, WAF e NLB público e interno em Terraform com validação estática automatizada, além de NetworkPolicies por tenant via GitOps.',
      },
    },
  ] satisfies MigrationStep[],
};

export const feats = {
  title: { en: 'Other things I’ve shipped', pt: 'Outras entregas' } satisfies L,
  items: [
    {
      title: { en: '1,100+ Linux hosts standardized', pt: 'Mais de 1.100 hosts Linux padronizados' },
      body: { en: 'AWX, Uyuni, FOG and FreeIPA against configuration drift.', pt: 'AWX, Uyuni, FOG e FreeIPA contra divergência de configuração.' },
    },
    {
      title: { en: '230+ branches provisioned automatically', pt: 'Mais de 230 filiais provisionadas automaticamente' },
      body: { en: 'The same setup every time, from the first machine to the last.', pt: 'A mesma configuração sempre, da primeira máquina à última.' },
    },
    {
      title: { en: '300+ access points in production', pt: 'Mais de 300 access points em produção' },
      body: { en: 'Each one onboarded into Zabbix through its API.', pt: 'Cada um cadastrado no Zabbix pela API.' },
    },
    {
      title: { en: 'FreeIPA integrated with Active Directory', pt: 'FreeIPA integrado ao Active Directory' },
      body: { en: 'One identity across Linux and Windows.', pt: 'Uma identidade só entre Linux e Windows.' },
    },
    {
      title: { en: 'Kubernetes on day 0 and day 2', pt: 'Kubernetes do dia 0 ao dia 2' },
      body: { en: 'OKE and Rancher: provisioning, cluster import, upgrades, ingress and certificates.', pt: 'OKE e Rancher: provisionamento, importação de clusters, upgrades, ingress e certificados.' },
    },
    {
      title: { en: 'Platform services kept healthy', pt: 'Serviços de plataforma saudáveis' },
      body: { en: 'Harbor, Traefik, cert-manager, Vault/Infisical and HAProxy.', pt: 'Harbor, Traefik, cert-manager, Vault/Infisical e HAProxy.' },
    },
    {
      title: { en: 'CI runners inside the cluster', pt: 'Runners de CI dentro do cluster' },
      body: { en: 'Self-hosted GitHub Actions runners on Kubernetes; GitLab CI and Jenkins pipelines tuned.', pt: 'Runners self-hosted do GitHub Actions no Kubernetes; pipelines de GitLab CI e Jenkins otimizados.' },
    },
    {
      title: { en: 'Stateful services migrated', pt: 'Serviços com estado migrados' },
      body: { en: 'Kafka, MongoDB, MinIO, Consul and more, moved into the cluster.', pt: 'Kafka, MongoDB, MinIO, Consul e outros, levados para o cluster.' },
    },
    {
      title: { en: '87% of telemetry traffic off the public path', pt: '87% da telemetria fora da rota pública' },
      body: { en: 'Of about 380 thousand events a day, 87% went out through NAT, the public load balancer and WAF; they now take an internal path.', pt: 'De cerca de 380 mil envios por dia, 87% saíam pela NAT, pelo load balancer público e pelo WAF; agora seguem por uma rota interna.' },
    },
    {
      title: { en: 'SQL Server 2022 to 2025, prepared', pt: 'SQL Server 2022 para 2025, preparado' },
      body: { en: 'Runbook, inventory and login control ready for the upgrade.', pt: 'Runbook, inventário e controle de logins prontos para a atualização.' },
    },
    {
      title: { en: 'Day-to-day automation in AWX', pt: 'Automação do dia a dia no AWX' },
      body: { en: 'Service sync with Argo CD and temporary SQL access that even works on Windows Server 2012.', pt: 'Sincronização de serviços com o Argo CD e acesso temporário a SQL que funciona até no Windows Server 2012.' },
    },
    {
      title: { en: 'Python and n8n automations', pt: 'Automações em Python e n8n' },
      body: { en: 'Health checks, auto-healing, alerts and a lot of repetitive work removed.', pt: 'Health checks, auto-healing, alertas e muito trabalho repetitivo eliminado.' },
    },
  ] satisfies { title: L; body: L }[],
};

export const howIWork = {
  title: { en: 'How I work', pt: 'Como eu trabalho' } satisfies L,
  items: [
    {
      title: { en: 'Write it down', pt: 'Tudo por escrito' },
      body: {
        en: 'Runbooks with rollback guards, architecture decision records, and a record and handoff for each of the 60-odd tickets I’ve led.',
        pt: 'Runbooks com guarda de rollback, registros de decisão de arquitetura e um registro e um handoff para cada um dos cerca de 60 tickets que conduzi.',
      },
    },
    {
      title: { en: 'Teach the team and the agents', pt: 'Ensinar o time e os agentes' },
      body: {
        en: 'Lessons become AGENTS.md files and skills that people and AI coding agents follow, so the same mistake is not made twice.',
        pt: 'Os aprendizados viram arquivos AGENTS.md e skills que pessoas e agentes de IA seguem, para o mesmo erro não acontecer duas vezes.',
      },
    },
    {
      title: { en: 'Rules for production', pt: 'Regras para produção' },
      body: {
        en: 'Secrets never leak. Only a reviewed plan gets applied. Production is read without adding load.',
        pt: 'Segredo nunca vaza. Só se aplica plan conferido. Produção é lida sem gerar carga.',
      },
    },
  ] satisfies { title: L; body: L }[],
};

export const websites = {
  title: { en: 'Websites and digital marketing', pt: 'Sites e marketing digital' } satisfies L,
  sitesTitle: { en: 'Websites', pt: 'Sites' } satisfies L,
  sitesBody: {
    en: 'Fast websites for small businesses, built and hosted with the same care as production infrastructure. Three concept sites show the range.',
    pt: 'Sites rápidos para pequenos negócios, feitos e hospedados com o mesmo cuidado de uma infraestrutura de produção. Três sites conceito mostram o alcance.',
  } satisfies L,
  sitesCta: { en: 'See the offer (in Portuguese)', pt: 'Ver a oferta' } satisfies L,
  marketingTitle: { en: 'Digital marketing', pt: 'Marketing digital' } satisfies L,
  marketingBody: {
    en: 'Instagram and social media management, paid traffic on Meta, Google, TikTok and Kwai Ads, TikTok Shop, and content automation.',
    pt: 'Gestão de Instagram e redes sociais, tráfego pago no Meta, Google, TikTok e Kwai Ads, TikTok Shop e automação de conteúdo.',
  } satisfies L,
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
  body: {
    en: 'Hiring for DevOps, cloud or platform work, or need a website for your business? Email is the fastest way.',
    pt: 'Contratando para DevOps, cloud ou plataforma, ou precisa de um site para o seu negócio? E-mail é o caminho mais rápido.',
  } satisfies L,
};

export const email = 'ceo@lucaspadilha.com';
