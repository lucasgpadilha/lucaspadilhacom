export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: { label: string; color: string }[];
  status: 'production' | 'development' | 'live';
  link: string;
  architecture: string;
}

export const projects: Project[] = [
  {
    title: 'Floci Cloud Lab',
    description: 'AWS learning lab local — Terraform, Python, Docker, boto3',
    longDescription:
      'Laboratório de cloud engineering que usa Floci (emulador AWS local) para validar arquiteturas sem custo de cloud. Terraform gerencia S3, DynamoDB, Lambda, API Gateway. Testes com pytest. Pipeline local com Makefile. Documentação, runbooks e ADRs.',
    tags: [
      { label: 'Terraform', color: '#818cf8' },
      { label: 'AWS (Floci)', color: '#FF9900' },
      { label: 'Python', color: '#06b6d4' },
      { label: 'Docker', color: '#527FFF' },
      { label: 'boto3', color: '#f59e0b' },
      { label: 'pytest', color: '#22c55e' },
    ],
    status: 'development',
    link: 'https://github.com/lucasgpadilha/floci-cloud-lab',
    architecture: 'Floci (localhost:4566) ← Terraform → S3, DynamoDB, Lambda, CloudWatch',
  },
  {
    title: 'Infra AWS + Terraform',
    description: 'Provisionamento AWS real com Terraform, CI/CD e Ansible',
    longDescription:
      'Infraestrutura como código para ambientes AWS reais. Terraform para provisionamento (EC2, S3, IAM). Ansible para configuração de servidores. GitHub Actions para CI/CD com deploy automático via SCP. Certificados SSL automáticos com Let\'s Encrypt.',
    tags: [
      { label: 'AWS EC2', color: '#FF9900' },
      { label: 'Terraform', color: '#818cf8' },
      { label: 'Ansible', color: '#ef4444' },
      { label: 'GitHub Actions', color: '#8b5cf6' },
    ],
    status: 'production',
    link: 'https://github.com/lucasgpadilha/terraform',
    architecture: 'GitHub → Actions → Terraform → AWS EC2 + S3 + IAM → Ansible → Deploy',
  },
  {
    title: 'lucaspadilha.com',
    description: 'Portfolio DevOps — Astro 5, Framer Motion, animações premium',
    longDescription:
      'Site estático com build automatizado. Astro 5 + React 19 + Framer Motion + GSAP + Tailwind. Design system próprio com animações cinematográficas. Deploy automático via GitHub Actions para servidor EC2.',
    tags: [
      { label: 'Astro 5', color: '#f59e0b' },
      { label: 'React 19', color: '#06b6d4' },
      { label: 'Framer Motion', color: '#8b5cf6' },
      { label: 'GSAP', color: '#22c55e' },
      { label: 'Tailwind', color: '#06b6d4' },
    ],
    status: 'live',
    link: 'https://github.com/lucasgpadilha/lucaspadilhacom',
    architecture: 'Astro → Static HTML → GitHub Actions → SCP → EC2 (Nginx)',
  },
];
