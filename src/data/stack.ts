import type { Localized } from '../lib/locale';

/**
 * Evidence-based tiers. Every tool must point to at least one repository.
 * core      = daily, running in production
 * hands-on  = used in real projects
 * exposure  = labs, coursework and study
 */
export type ToolLevel = 'core' | 'hands-on' | 'exposure';

export interface StackTool {
  name: string;
  level: ToolLevel;
  /** Where the evidence lives: project names only, language-neutral, no links to private code. */
  evidence: string;
}

export interface StackGroup {
  id: string;
  title: Localized<string>;
  tools: StackTool[];
}

export const stackGroups: StackGroup[] = [
  {
    id: 'product',
    title: { en: 'Product engineering', pt: 'Engenharia de produto' },
    tools: [
      { name: 'TypeScript', level: 'core', evidence: 'ERP, MilKontrol, Comboio Bruto' },
      { name: 'Next.js', level: 'core', evidence: 'ERP, MilKontrol' },
      { name: 'PostgreSQL', level: 'core', evidence: 'ERP, MilKontrol, PyNOC' },
      { name: 'React', level: 'hands-on', evidence: 'ERP, PyNOC' },
      { name: 'NestJS', level: 'hands-on', evidence: 'CRM (2025)' },
      { name: 'Prisma / Drizzle', level: 'hands-on', evidence: 'MilKontrol, ERP' },
    ],
  },
  {
    id: 'ops',
    title: { en: 'Operations', pt: 'Operação' },
    tools: [
      { name: 'Linux', level: 'core', evidence: 'ERP, MilKontrol, lucaspadilha.com' },
      { name: 'Docker Compose', level: 'core', evidence: 'ERP, PyNOC, Floci' },
      { name: 'Caddy', level: 'core', evidence: 'lucaspadilha.com, ERP, MilKontrol' },
      { name: 'Backups & restore drills', level: 'hands-on', evidence: 'ERP' },
      { name: 'PM2 / systemd', level: 'hands-on', evidence: 'MilKontrol' },
    ],
  },
  {
    id: 'delivery',
    title: { en: 'CI/CD & quality', pt: 'CI/CD e qualidade' },
    tools: [
      { name: 'GitHub Actions', level: 'hands-on', evidence: 'ERP, Comboio Bruto, lucaspadilha.com' },
      { name: 'Vitest', level: 'hands-on', evidence: 'ERP' },
      { name: 'pytest', level: 'hands-on', evidence: 'PyNOC, Floci' },
      { name: 'Playwright + axe', level: 'hands-on', evidence: 'ERP, lucaspadilha.com' },
    ],
  },
  {
    id: 'cloud',
    title: { en: 'Cloud & IaC', pt: 'Cloud e IaC' },
    tools: [
      { name: 'Terraform', level: 'hands-on', evidence: 'Floci, AWS, OCI' },
      { name: 'AWS (EC2, S3)', level: 'hands-on', evidence: 'lucaspadilha.com v1, Floci' },
      { name: 'Oracle Cloud', level: 'hands-on', evidence: 'ERP (ARM64), oci-mail' },
      { name: 'Ansible', level: 'exposure', evidence: 'aws-ansible' },
      { name: 'AWS Lambda / DynamoDB', level: 'exposure', evidence: 'Floci' },
    ],
  },
  {
    id: 'languages',
    title: { en: 'Other languages', pt: 'Outras linguagens' },
    tools: [
      { name: 'Python', level: 'hands-on', evidence: 'PyNOC, Floci' },
      { name: 'Go', level: 'hands-on', evidence: 'tuildap' },
      { name: 'GDScript', level: 'hands-on', evidence: 'Comboio Bruto' },
      { name: 'Java', level: 'exposure', evidence: 'NewPix (UTFPR)' },
    ],
  },
  {
    id: 'observability',
    title: { en: 'Observability & systems', pt: 'Observabilidade e sistemas' },
    tools: [
      { name: 'Prometheus / Grafana', level: 'exposure', evidence: 'Go + Prometheus lab' },
      { name: 'Zabbix', level: 'exposure', evidence: 'PyNOC' },
      { name: 'Kubernetes', level: 'exposure', evidence: 'Floci (kustomize)' },
      { name: 'LDAP / Active Directory', level: 'exposure', evidence: 'tuildap' },
      { name: 'Postfix / Dovecot', level: 'exposure', evidence: 'oci-mail' },
    ],
  },
];
