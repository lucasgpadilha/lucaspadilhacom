import type { ComponentType } from 'react';
import {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Container,
  Flame,
  GitBranch,
  Globe,
  KeyRound,
  Lock,
  Network,
  Server,
  TerminalSquare,
} from 'lucide-react';
import {
  AnsibleIcon,
  AwsIcon,
  DockerIcon,
  GithubIcon,
  PythonIcon,
  TerraformIcon,
} from '../components/devops/brand-icons';

type IconCmp = ComponentType<{ size?: number; className?: string }>;

export interface ToolMeta {
  Icon: IconCmp;
  /** Brand accent used for the icon + subtle chip tint. */
  color: string;
}

const DEFAULT: ToolMeta = { Icon: Box, color: '#9aa6b2' };

/*
 * Brand glyph when a clean single-path logo exists, otherwise a tasteful lucide
 * icon — but always paired with the real brand colour, which is what makes the
 * chips read as logos and tie back to the hero palette.
 */
const META: Record<string, ToolMeta> = {
  aws: { Icon: AwsIcon, color: '#ff9900' },
  'aws-local': { Icon: AwsIcon, color: '#ff9900' },
  'aws ec2': { Icon: AwsIcon, color: '#ff9900' },
  ec2: { Icon: Server, color: '#ff9900' },
  s3: { Icon: Box, color: '#e25444' },
  iam: { Icon: KeyRound, color: '#dd344c' },
  cloudwatch: { Icon: Activity, color: '#ff4f8b' },
  oci: { Icon: Cloud, color: '#c74634' },
  terraform: { Icon: TerraformIcon, color: '#7b42bc' },
  ansible: { Icon: AnsibleIcon, color: '#ffffff' },
  docker: { Icon: DockerIcon, color: '#2496ed' },
  python: { Icon: PythonIcon, color: '#7aa6da' },
  boto3: { Icon: PythonIcon, color: '#7aa6da' },
  pytest: { Icon: PythonIcon, color: '#7aa6da' },
  'github actions': { Icon: GithubIcon, color: '#dbe3ea' },
  gitops: { Icon: GitBranch, color: '#f05032' },
  linux: { Icon: TerminalSquare, color: '#f5c542' },
  bash: { Icon: TerminalSquare, color: '#4eaa25' },
  shell: { Icon: TerminalSquare, color: '#89e051' },
  ssh: { Icon: Lock, color: '#7aa6da' },
  nginx: { Icon: Network, color: '#009639' },
  prometheus: { Icon: Flame, color: '#e6522c' },
  grafana: { Icon: BarChart3, color: '#f46800' },
  react: { Icon: Globe, color: '#61dafb' },
  tailwind: { Icon: Globe, color: '#38bdf8' },
  astro: { Icon: Globe, color: '#ff5d01' },
  container: { Icon: Container, color: '#2496ed' },
};

export function getToolMeta(name: string): ToolMeta {
  return META[name.trim().toLowerCase()] ?? DEFAULT;
}

/* Monochrome technical tag — mono text, hairline, no colour (styled in CSS). */
export function ToolChip({ name }: { name: string }) {
  return (
    <span className="tool-chip inline-flex items-center px-2 py-0.5 font-mono text-[11px] lowercase tracking-tight">
      {name}
    </span>
  );
}

/* Greyscale logo for the stack "logo wall" — premium, not sticker soup. */
export function ToolLogo({ name, size = 16 }: { name: string; size?: number }) {
  const { Icon } = getToolMeta(name);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-white/55 transition-colors duration-200 hover:text-white/90"
      title={name}
    >
      <Icon size={size} className="shrink-0" />
      <span className="font-mono text-[11px] tracking-tight">{name}</span>
    </span>
  );
}
