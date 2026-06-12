export interface PipelineStage {
  id: string;
  label: string;
  shortLabel: string;
  status: 'pending' | 'running' | 'success';
  detail: string;
  color: string;
  command: string;
  iconPath: string;
}

export const pipelineStages: PipelineStage[] = [
  {
    id: 'commit',
    label: 'Git Commit',
    shortLabel: 'COMMIT',
    status: 'success',
    detail: '#a3b4f2',
    color: '#f59e0b',
    command: 'git commit -m "feat: add s3 module"',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
  },
  {
    id: 'ci',
    label: 'CI Build',
    shortLabel: 'BUILD',
    status: 'success',
    detail: 'Build #42',
    color: '#06b6d4',
    command: 'docker build -t app:latest .',
    iconPath: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  },
  {
    id: 'test',
    label: 'Tests',
    shortLabel: 'TEST',
    status: 'success',
    detail: '14/14 passed',
    color: '#22c55e',
    command: 'pytest tests/ -v --tb=short',
    iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  },
  {
    id: 'tf-plan',
    label: 'Terraform Plan',
    shortLabel: 'TF PLAN',
    status: 'success',
    detail: '3 to add, 0 to change',
    color: '#818cf8',
    command: 'terraform plan -out=tfplan',
    iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  },
  {
    id: 'aws',
    label: 'AWS Provision',
    shortLabel: 'AWS',
    status: 'success',
    detail: 'EC2 + S3 + DynamoDB',
    color: '#FF9900',
    command: 'terraform apply -auto-approve tfplan',
    iconPath: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
  },
  {
    id: 'ansible',
    label: 'Ansible Config',
    shortLabel: 'ANSIBLE',
    status: 'running',
    detail: 'applying playbook...',
    color: '#ef4444',
    command: 'ansible-playbook -i inventory deploy.yml',
    iconPath: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  },
  {
    id: 'deploy',
    label: 'App Deploy',
    shortLabel: 'DEPLOY',
    status: 'pending',
    detail: 'waiting...',
    color: '#8b5cf6',
    command: 'kubectl apply -f deployment.yaml',
    iconPath: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  },
  {
    id: 'monitor',
    label: 'Monitoring',
    shortLabel: 'MONITOR',
    status: 'pending',
    detail: 'waiting...',
    color: '#22c55e',
    command: 'curl -s localhost:3000/health',
    iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  },
];

export const statusColors: Record<string, { fill: string; glow: string }> = {
  success: { fill: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
  running: { fill: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  pending: { fill: '#52525b', glow: 'rgba(82,82,91,0.3)' },
};
