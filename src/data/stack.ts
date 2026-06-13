import type { Locale } from '../lib/i18n';

/**
 * Proficiency tiers — kept honest: not everything carries the same weight.
 * core      = daily, hands-on, what I'd be hired for
 * hands-on  = used in real work, comfortable but not the headline
 * lab       = learned / used in labs and experiments (includes "exploring")
 */
export type ToolLevel = 'core' | 'hands-on' | 'lab';

export interface StackTool {
  name: string;
  level: ToolLevel;
}

export type StackIcon =
  | 'cloud'
  | 'iac'
  | 'config'
  | 'containers'
  | 'kubernetes'
  | 'cicd'
  | 'security'
  | 'secrets'
  | 'observability'
  | 'systems'
  | 'networking'
  | 'registry'
  | 'scripting';

export interface StackCategory {
  id: string;
  /** Technical title kept in English for both locales (consistent terminology). */
  title: string;
  icon: StackIcon;
  description: Record<Locale, string>;
  tools: StackTool[];
}

/*
 * Single source of truth — edit categories/tools/levels here.
 * Tools are listed core → hands-on → lab so the strongest read first.
 */
export const stackCategories: StackCategory[] = [
  {
    id: 'cloud',
    title: 'Cloud',
    icon: 'cloud',
    description: {
      en: 'Cloud providers used across labs, infrastructure experiments and deployment workflows.',
      pt: 'Provedores de cloud usados em labs, experimentos de infraestrutura e fluxos de deploy.',
    },
    tools: [
      { name: 'AWS', level: 'core' },
      { name: 'OCI', level: 'core' },
    ],
  },
  {
    id: 'iac',
    title: 'Infrastructure as Code',
    icon: 'iac',
    description: {
      en: 'Declarative infrastructure for reproducible environments and safer changes.',
      pt: 'Infraestrutura declarativa para ambientes reproduzíveis e mudanças mais seguras.',
    },
    tools: [
      { name: 'Terraform', level: 'core' },
      { name: 'OpenTofu', level: 'lab' },
      { name: 'Terragrunt', level: 'lab' },
    ],
  },
  {
    id: 'config',
    title: 'Configuration Management',
    icon: 'config',
    description: {
      en: 'Server configuration and operational automation after provisioning.',
      pt: 'Configuração de servidores e automação operacional pós-provisionamento.',
    },
    tools: [
      { name: 'Ansible', level: 'core' },
      { name: 'AWX', level: 'lab' },
    ],
  },
  {
    id: 'containers',
    title: 'Containers & Image Builds',
    icon: 'containers',
    description: {
      en: 'Containerized environments, local stacks and image build workflows.',
      pt: 'Ambientes em containers, stacks locais e build de imagens.',
    },
    tools: [
      { name: 'Docker', level: 'core' },
      { name: 'Docker Compose', level: 'hands-on' },
      { name: 'Podman', level: 'lab' },
      { name: 'Kaniko', level: 'lab' },
    ],
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes & Platform',
    icon: 'kubernetes',
    description: {
      en: 'Cluster, ingress and platform tooling explored through labs and deployment patterns.',
      pt: 'Cluster, ingress e ferramentas de plataforma exploradas em labs e padrões de deploy.',
    },
    tools: [
      { name: 'Kubernetes', level: 'lab' },
      { name: 'Helm', level: 'lab' },
      { name: 'Ingress NGINX', level: 'lab' },
      { name: 'Traefik', level: 'lab' },
      { name: 'EKS', level: 'lab' },
      { name: 'OKE', level: 'lab' },
      { name: 'RKE', level: 'lab' },
      { name: 'Rancher', level: 'lab' },
      { name: 'Portainer', level: 'lab' },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD & GitOps',
    icon: 'cicd',
    description: {
      en: 'Pipelines, runners and deployment automation from commit to runtime.',
      pt: 'Pipelines, runners e automação de deploy do commit ao runtime.',
    },
    tools: [
      { name: 'GitHub Actions', level: 'core' },
      { name: 'Argo CD', level: 'lab' },
      { name: 'Jenkins', level: 'lab' },
      { name: 'GitLab Runners', level: 'lab' },
    ],
  },
  {
    id: 'security',
    title: 'Quality & Security Gates',
    icon: 'security',
    description: {
      en: 'Static checks and security scans to catch issues before deployment.',
      pt: 'Checks estáticos e scans de segurança para pegar problemas antes do deploy.',
    },
    tools: [
      { name: 'Trivy', level: 'lab' },
      { name: 'Checkov', level: 'lab' },
      { name: 'Gitleaks', level: 'lab' },
      { name: 'TFLint', level: 'lab' },
      { name: 'Ansible Lint', level: 'lab' },
      { name: 'Hadolint', level: 'lab' },
    ],
  },
  {
    id: 'secrets',
    title: 'Secrets Management',
    icon: 'secrets',
    description: {
      en: 'Secrets and configuration handling for safer infrastructure automation.',
      pt: 'Gestão de secrets e configuração para automação de infraestrutura mais segura.',
    },
    tools: [
      { name: 'AWS SSM Parameter Store', level: 'hands-on' },
      { name: 'AWS Secrets Manager', level: 'hands-on' },
      { name: 'Vault', level: 'lab' },
      { name: 'Infisical', level: 'lab' },
    ],
  },
  {
    id: 'observability',
    title: 'Observability',
    icon: 'observability',
    description: {
      en: 'Metrics, logs and telemetry to understand systems after deployment.',
      pt: 'Métricas, logs e telemetria para entender os sistemas depois do deploy.',
    },
    tools: [
      { name: 'Prometheus', level: 'core' },
      { name: 'Grafana', level: 'core' },
      { name: 'CloudWatch', level: 'hands-on' },
      { name: 'Loki', level: 'lab' },
      { name: 'OpenTelemetry', level: 'lab' },
    ],
  },
  {
    id: 'systems',
    title: 'Systems & Web',
    icon: 'systems',
    description: {
      en: 'Linux, service management and web-serving fundamentals used in real operations.',
      pt: 'Linux, gestão de serviços e fundamentos de web server usados em operação real.',
    },
    tools: [
      { name: 'Linux', level: 'core' },
      { name: 'Bash', level: 'core' },
      { name: 'Nginx', level: 'core' },
      { name: 'systemd', level: 'hands-on' },
      { name: 'Windows Server', level: 'hands-on' },
      { name: 'SysAdmin', level: 'hands-on' },
    ],
  },
  {
    id: 'networking',
    title: 'Networking & Edge',
    icon: 'networking',
    description: {
      en: 'DNS, TLS, proxying, firewalling and traffic routing fundamentals.',
      pt: 'Fundamentos de DNS, TLS, proxy, firewall e roteamento de tráfego.',
    },
    tools: [
      { name: 'DNS', level: 'hands-on' },
      { name: 'TLS', level: 'hands-on' },
      { name: 'Reverse Proxy', level: 'hands-on' },
      { name: 'Firewall', level: 'hands-on' },
      { name: 'Load Balancers', level: 'hands-on' },
      { name: 'Cloudflare', level: 'hands-on' },
      { name: 'Switches', level: 'hands-on' },
      { name: 'WAF', level: 'lab' },
      { name: 'Squid Proxy', level: 'lab' },
      { name: 'Kea DHCP', level: 'lab' },
    ],
  },
  {
    id: 'registry',
    title: 'Registry & Artifacts',
    icon: 'registry',
    description: {
      en: 'Image registries and artifact storage across build and deployment flows.',
      pt: 'Registries de imagem e artefatos ao longo dos fluxos de build e deploy.',
    },
    tools: [
      { name: 'Docker Hub', level: 'hands-on' },
      { name: 'OCIR', level: 'lab' },
      { name: 'Harbor', level: 'lab' },
    ],
  },
  {
    id: 'scripting',
    title: 'Scripting & Automation',
    icon: 'scripting',
    description: {
      en: 'Scripts and small tools to automate repetitive infrastructure tasks.',
      pt: 'Scripts e pequenas ferramentas para automatizar tarefas repetitivas de infraestrutura.',
    },
    tools: [
      { name: 'Python', level: 'hands-on' },
      { name: 'Shell Scripting', level: 'hands-on' },
    ],
  },
];

export const levelLabels: Record<ToolLevel, Record<Locale, string>> = {
  core: { en: 'Core', pt: 'Core' },
  'hands-on': { en: 'Hands-on', pt: 'Hands-on' },
  lab: { en: 'Lab', pt: 'Lab' },
};
