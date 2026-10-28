import type { Localized } from '../lib/locale';

type L = Localized<string>;

// The parts that keep the platform standing, set as compact blocks: pain, what I build, tools.
// Square brackets mark a number; the page sets it in the signal colour.

export const operations = {
  title: { en: 'What keeps it standing', pt: 'O que mantém tudo de pé' } satisfies L,
  lede: {
    en: 'The parts nobody sees until they fail: observability, databases and the automation under it all.',
    pt: 'As partes que ninguém vê até falharem: observabilidade, bancos e a automação por baixo de tudo.',
  } satisfies L,
  items: [
    {
      id: 'observability',
      title: { en: 'Observability', pt: 'Observabilidade' },
      pain: { en: 'We hear about outages from customers.', pt: 'A gente descobre a queda pelo cliente.' },
      body: {
        en: 'Metrics, logs and traces from every cluster in one place, on the management cluster, with alerts, health checks and auto-healing that act before anyone is paged.',
        pt: 'Métricas, logs e traces de todos os clusters num lugar só, no cluster de gerenciamento, com alertas, health checks e auto-healing que agem antes de alguém ser acionado.',
      },
      tools: ['Prometheus', 'VictoriaMetrics', 'Grafana', 'Loki', 'Tempo', 'OpenTelemetry', 'Sentry', 'Zabbix'],
    },
    {
      id: 'data',
      title: { en: 'Databases and stateful services', pt: 'Bancos e serviços com estado' },
      pain: { en: 'The database is the server nobody dares to upgrade.', pt: 'O banco é o servidor que ninguém ousa atualizar.' },
      body: {
        en: 'SQL Server deployed and maintained in the cloud with Terraform and Ansible; the 2022 to 2025 upgrade prepared with runbook, inventory and login control. [12] platform services moved into Kubernetes, including Kafka, MongoDB, MinIO, Consul and PostgreSQL. Replication and CDC.',
        pt: 'SQL Server implantado e mantido na cloud com Terraform e Ansible; a atualização de 2022 para 2025 preparada com runbook, inventário e controle de logins. [12] serviços de plataforma levados para o Kubernetes, entre eles Kafka, MongoDB, MinIO, Consul e PostgreSQL. Replicação e CDC.',
      },
      tools: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Kafka', 'MinIO', 'Consul', 'Terraform', 'Ansible'],
    },
    {
      id: 'automation',
      title: { en: 'Automation, operations and AI agents', pt: 'Automação, operação e agentes de IA' },
      pain: { en: 'The same manual task, on a thousand servers, every week.', pt: 'A mesma tarefa na mão, em mil servidores, toda semana.' },
      body: {
        en: '[1,100+] Linux hosts standardized; [230+] branches provisioned automatically; [300+] access points onboarded into Zabbix through its API; FreeIPA joined to Active Directory and Microsoft 365 / Entra ID accounts with an automated lifecycle. And a dedicated environment for coding agents, with runbooks turned into AGENTS.md files and skills.',
        pt: '[1.100+] hosts Linux padronizados; [230+] filiais com provisionamento automatizado; [300+] access points cadastrados no Zabbix pela API; FreeIPA integrado ao Active Directory e contas do Microsoft 365 / Entra ID com ciclo de vida automatizado. E um ambiente próprio para agentes de código, com runbooks virando AGENTS.md e skills.',
      },
      tools: ['Ansible', 'AWX', 'Python', 'n8n', 'Uyuni', 'FOG', 'FreeIPA', 'Active Directory', 'Entra ID'],
    },
  ] satisfies { id: string; title: L; pain: L; body: L; tools: string[] }[],
};

export const how = {
  title: { en: 'How I work', pt: 'Como eu trabalho' } satisfies L,
  steps: [
    {
      title: { en: 'Diagnose', pt: 'Diagnóstico' },
      body: { en: 'Read what runs, what it costs and what breaks before proposing anything. Production is read without adding load.', pt: 'Leio o que roda, quanto custa e o que quebra antes de propor qualquer coisa. Produção é lida sem gerar carga.' },
    },
    {
      title: { en: 'Build', pt: 'Construção' },
      body: { en: 'Everything as reviewed code: only a checked Terraform plan gets applied, delivery goes through GitOps, runbooks carry rollback guards, secrets never leak.', pt: 'Tudo em código revisado: só se aplica plan conferido, a entrega passa por GitOps, os runbooks têm guarda de rollback e segredo nunca vaza.' },
    },
    {
      title: { en: 'Hand over', pt: 'Entrega' },
      body: { en: 'A record and a handoff for each of the 60-odd tickets I’ve led, and documentation that people and AI agents follow.', pt: 'Registro e handoff para cada um dos cerca de 60 tickets que conduzi, e documentação que pessoas e agentes de IA seguem.' },
    },
  ] satisfies { title: L; body: L }[],
};
