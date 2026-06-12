export interface AwsService {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  connectedTo: string[];
  iconPath: string;
}

export const awsServices: AwsService[] = [
  {
    id: 'vpc',
    label: 'VPC',
    x: 50,
    y: 20,
    color: '#527FFF',
    connectedTo: ['ec2', 's3', 'dynamodb'],
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  },
  {
    id: 'ec2',
    label: 'EC2',
    x: 25,
    y: 50,
    color: '#FF9900',
    connectedTo: ['s3', 'dynamodb'],
    iconPath: 'M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h10v2H4v-2z',
  },
  {
    id: 's3',
    label: 'S3',
    x: 50,
    y: 55,
    color: '#22c55e',
    connectedTo: ['lambda'],
    iconPath: 'M2 6h20v12H2V6zm2 2v2h16V8H4zm0 4v2h16v-2H4z',
  },
  {
    id: 'dynamodb',
    label: 'DynamoDB',
    x: 75,
    y: 50,
    color: '#6366f1',
    connectedTo: ['lambda', 'cloudwatch'],
    iconPath: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z',
  },
  {
    id: 'lambda',
    label: 'Lambda',
    x: 50,
    y: 78,
    color: '#f59e0b',
    connectedTo: ['cloudwatch', 'api-gw'],
    iconPath: 'M12 2l9.5 5.5v11L12 24l-9.5-5.5v-11L12 2z',
  },
  {
    id: 'cloudwatch',
    label: 'CloudWatch',
    x: 80,
    y: 78,
    color: '#ef4444',
    connectedTo: [],
    iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  },
  {
    id: 'api-gw',
    label: 'API GW',
    x: 35,
    y: 90,
    color: '#8b5cf6',
    connectedTo: [],
    iconPath: 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z',
  },
];

export const awsConnections: { from: string; to: string }[] = [];
for (const svc of awsServices) {
  for (const target of svc.connectedTo) {
    awsConnections.push({ from: svc.id, to: target });
  }
}
