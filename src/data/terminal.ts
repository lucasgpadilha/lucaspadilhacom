export interface TerminalLine {
  text: string;
  color: string;
  prefix: string;
  delay: number;
}

export const terminalLines: TerminalLine[] = [
  { text: 'terraform plan -out=tfplan', color: '#818cf8', prefix: '$ ', delay: 0 },
  { text: 'Plan: 3 to add, 0 to change, 0 to destroy.', color: '#22c55e', prefix: '  ', delay: 1200 },
  { text: '', color: '', prefix: '', delay: 300 },
  { text: 'terraform apply -auto-approve tfplan', color: '#FF9900', prefix: '$ ', delay: 600 },
  { text: 'aws_s3_bucket.lab: Creating...', color: '#818cf8', prefix: '  ', delay: 1000 },
  { text: 'aws_dynamodb_table.metadata: Creating...', color: '#818cf8', prefix: '  ', delay: 500 },
  { text: 'Apply complete! Resources: 3 added.', color: '#22c55e', prefix: '  ', delay: 600 },
  { text: '', color: '', prefix: '', delay: 300 },
  { text: 'pytest tests/ -v --tb=short', color: '#06b6d4', prefix: '$ ', delay: 600 },
  { text: 'tests/test_api.py::test_health PASSED', color: '#22c55e', prefix: '  ', delay: 400 },
  { text: 'tests/test_s3.py::test_put_object PASSED', color: '#22c55e', prefix: '  ', delay: 300 },
  { text: 'tests/test_dynamo.py::test_scan PASSED', color: '#22c55e', prefix: '  ', delay: 300 },
  { text: '14 passed in 2.34s', color: '#22c55e', prefix: '  ', delay: 400 },
  { text: '', color: '', prefix: '', delay: 300 },
  { text: 'ansible-playbook -i inventory deploy.yml', color: '#ef4444', prefix: '$ ', delay: 600 },
  { text: 'TASK [Docker : Install docker] ***********', color: '#f59e0b', prefix: '  ', delay: 500 },
  { text: 'TASK [App : Deploy container] ************', color: '#f59e0b', prefix: '  ', delay: 400 },
  { text: 'PLAY RECAP: ok=8 changed=2 unreachable=0', color: '#22c55e', prefix: '  ', delay: 500 },
  { text: '', color: '', prefix: '', delay: 300 },
  { text: 'make devops-audit', color: '#818cf8', prefix: '$ ', delay: 600 },
  { text: '[OK] drift detection passed', color: '#22c55e', prefix: '  ', delay: 400 },
  { text: '[OK] docker compose config valid', color: '#22c55e', prefix: '  ', delay: 300 },
  { text: '[OK] forbidden CI guardrails', color: '#22c55e', prefix: '  ', delay: 300 },
  { text: '[OK] local endpoint checks passed', color: '#22c55e', prefix: '  ', delay: 300 },
  { text: '', color: '', prefix: '', delay: 300 },
  { text: 'curl -s localhost:3000/health', color: '#06b6d4', prefix: '$ ', delay: 600 },
  { text: '{"status": "healthy", "uptime": "14d"}', color: '#22c55e', prefix: '  ', delay: 500 },
];
