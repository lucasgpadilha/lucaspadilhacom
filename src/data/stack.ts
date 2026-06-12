import type { Locale } from '../lib/i18n';

export interface StackCategory {
  title: string;
  icon: 'cloud' | 'code' | 'settings' | 'box' | 'workflow' | 'terminal' | 'file' | 'activity';
  items: string[];
}

export const stackCategoriesByLocale: Record<Locale, StackCategory[]> = {
  en: [
    { title: 'Cloud', icon: 'cloud', items: ['AWS', 'OCI'] },
    { title: 'IaC', icon: 'code', items: ['Terraform'] },
    { title: 'Configuration', icon: 'settings', items: ['Ansible'] },
    { title: 'Containers', icon: 'box', items: ['Docker'] },
    { title: 'CI/CD', icon: 'workflow', items: ['GitHub Actions', 'GitOps'] },
    { title: 'System', icon: 'terminal', items: ['Linux', 'Bash'] },
    { title: 'Scripting', icon: 'file', items: ['Python', 'Shell'] },
    { title: 'Observability', icon: 'activity', items: ['CloudWatch', 'Prometheus', 'Grafana'] },
  ],
  pt: [
    { title: 'Cloud', icon: 'cloud', items: ['AWS', 'OCI'] },
    { title: 'IaC', icon: 'code', items: ['Terraform'] },
    { title: 'Configuração', icon: 'settings', items: ['Ansible'] },
    { title: 'Containers', icon: 'box', items: ['Docker'] },
    { title: 'CI/CD', icon: 'workflow', items: ['GitHub Actions', 'GitOps'] },
    { title: 'Sistema', icon: 'terminal', items: ['Linux', 'Bash'] },
    { title: 'Scripting', icon: 'file', items: ['Python', 'Shell'] },
    { title: 'Observabilidade', icon: 'activity', items: ['CloudWatch', 'Prometheus', 'Grafana'] },
  ],
};
