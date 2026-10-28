import type { Localized } from '../lib/locale';

// Tools from real work (current and past roles, side projects). Names only: the
// track record above is the evidence.
export interface StackGroup {
  id: string;
  title: Localized<string>;
  tools: string[];
}

export const stackGroups: StackGroup[] = [
  { id: 'cloud', title: { en: 'Cloud and platform', pt: 'Cloud e plataforma' }, tools: ['OCI', 'OKE', 'Kubernetes', 'Rancher', 'Terraform', 'AWS'] },
  { id: 'delivery', title: { en: 'GitOps and delivery', pt: 'GitOps e entrega' }, tools: ['Argo CD', 'Argo CD Image Updater', 'Helm', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Docker'] },
  { id: 'security', title: { en: 'Security and secrets', pt: 'Segurança e segredos' }, tools: ['Vault', 'External Secrets', 'Infisical', 'Kyverno', 'NetworkPolicies', 'cert-manager', 'WAF'] },
  { id: 'automation', title: { en: 'Automation', pt: 'Automação' }, tools: ['Ansible', 'AWX', 'Python', 'n8n', 'Bash'] },
  { id: 'data', title: { en: 'Data', pt: 'Dados' }, tools: ['PostgreSQL', 'SQL Server', 'Kafka', 'MongoDB', 'MinIO', 'Consul'] },
  { id: 'observability', title: { en: 'Observability', pt: 'Observabilidade' }, tools: ['Zabbix', 'Prometheus', 'Grafana'] },
  { id: 'network', title: { en: 'Networking and identity', pt: 'Redes e identidade' }, tools: ['FreeIPA', 'Active Directory', 'HAProxy', 'Traefik', 'Nginx', 'Load balancers'] },
];
