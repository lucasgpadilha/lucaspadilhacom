import type { Locale } from '../lib/i18n';

export interface Project {
  title: string;
  description: string;
  demonstrates: string[];
  stack: string[];
  status: string;
  link: string;
}

export const projectsByLocale: Record<Locale, Project[]> = {
  en: [
    {
      title: 'Floci Cloud Lab',
      description:
        'Local cloud lab for validating AWS architecture without real cloud cost, using Floci, Terraform, boto3 and pytest.',
      demonstrates: [
        'local validation of AWS services',
        'infrastructure as code',
        'automated tests',
      ],
      stack: ['Terraform', 'AWS local', 'Python', 'boto3', 'pytest', 'Docker'],
      status: 'Active lab',
      link: 'https://github.com/lucasgpadilha/floci-cloud-lab',
    },
    {
      title: 'AWS Infra + Terraform',
      description:
        'Infrastructure as code for provisioning AWS resources in a reproducible and documented way.',
      demonstrates: [
        'Terraform applied to AWS environments',
        'organized variables and outputs',
        'baseline for consistent environments',
      ],
      stack: ['AWS', 'Terraform', 'EC2', 'S3', 'IAM', 'GitHub Actions'],
      status: 'Provisioning',
      link: 'https://github.com/lucasgpadilha/terraform',
    },
    {
      title: 'AWS Ansible',
      description:
        'Server configuration automation with reusable playbooks, reducing manual setup after provisioning.',
      demonstrates: [
        'automated configuration',
        'server standardization',
        'reusable playbooks',
      ],
      stack: ['Ansible', 'Linux', 'AWS EC2', 'SSH', 'Nginx'],
      status: 'Configuration',
      link: 'https://github.com/lucasgpadilha/aws-ansible',
    },
    {
      title: 'lucaspadilha.com',
      description:
        'Personal portfolio with static build, automated deploy and a DevOps-focused visual narrative.',
      demonstrates: [
        'Astro and React',
        'deploy with GitHub Actions',
        'EC2 server with Nginx',
      ],
      stack: ['Astro', 'React', 'Tailwind', 'GitHub Actions', 'EC2', 'Nginx'],
      status: 'Live',
      link: 'https://github.com/lucasgpadilha/lucaspadilhacom',
    },
  ],
  pt: [
    {
      title: 'Floci Cloud Lab',
      description:
        'Laboratório cloud local para validar arquitetura AWS sem custo real, usando Floci, Terraform, boto3 e pytest.',
      demonstrates: [
        'validação local de serviços AWS',
        'infraestrutura como código',
        'testes automatizados',
      ],
      stack: ['Terraform', 'AWS local', 'Python', 'boto3', 'pytest', 'Docker'],
      status: 'Lab ativo',
      link: 'https://github.com/lucasgpadilha/floci-cloud-lab',
    },
    {
      title: 'Infra AWS + Terraform',
      description:
        'Infraestrutura como código para provisionar recursos AWS de forma reproduzível e documentada.',
      demonstrates: [
        'Terraform aplicado em ambiente AWS',
        'variáveis e outputs organizados',
        'base para ambientes consistentes',
      ],
      stack: ['AWS', 'Terraform', 'EC2', 'S3', 'IAM', 'GitHub Actions'],
      status: 'Provisionamento',
      link: 'https://github.com/lucasgpadilha/terraform',
    },
    {
      title: 'AWS Ansible',
      description:
        'Automação de configuração de servidores com playbooks reutilizáveis, reduzindo configuração manual pós-provisionamento.',
      demonstrates: [
        'configuração automatizada',
        'padronização de servidores',
        'playbooks reutilizáveis',
      ],
      stack: ['Ansible', 'Linux', 'AWS EC2', 'SSH', 'Nginx'],
      status: 'Configuração',
      link: 'https://github.com/lucasgpadilha/aws-ansible',
    },
    {
      title: 'lucaspadilha.com',
      description:
        'Portfólio pessoal com build estático, deploy automatizado e narrativa visual focada em DevOps.',
      demonstrates: [
        'Astro e React',
        'deploy com GitHub Actions',
        'servidor EC2 com Nginx',
      ],
      stack: ['Astro', 'React', 'Tailwind', 'GitHub Actions', 'EC2', 'Nginx'],
      status: 'Live',
      link: 'https://github.com/lucasgpadilha/lucaspadilhacom',
    },
  ],
};
