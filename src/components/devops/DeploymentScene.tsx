import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  CodeXml,
  Package,
  Play,
  Rocket,
} from 'lucide-react';
import { AnsibleIcon, AwsIcon, TerraformIcon } from './brand-icons';
import { useLocale, type Locale } from '../../lib/i18n';

type StageState = 'waiting' | 'running' | 'success';

interface DeploymentStage {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  /** Measured horizontal center (%) of the matching machine inside the factory artwork. */
  machineX: number;
  log: Record<Locale, string>;
}

const stages: DeploymentStage[] = [
  {
    key: 'commit',
    label: 'Commit',
    icon: CodeXml,
    iconClass: 'text-cyan-200',
    machineX: 5.6,
    log: { en: 'Git push: commit received', pt: 'Git push: commit recebido' },
  },
  {
    key: 'build',
    label: 'Build',
    icon: Package,
    iconClass: 'text-white/95',
    machineX: 18.9,
    log: { en: 'Build: docker image built', pt: 'Build: imagem docker criada' },
  },
  {
    key: 'tests',
    label: 'Tests',
    icon: CheckCircle2,
    iconClass: 'text-emerald-300',
    machineX: 32.2,
    log: { en: 'Tests: all checks passed', pt: 'Tests: checks aprovados' },
  },
  {
    key: 'plan',
    label: 'Terraform Plan',
    icon: TerraformIcon,
    iconClass: 'text-violet-300',
    machineX: 45.1,
    log: { en: 'Terraform: 3 to add, 0 to change', pt: 'Terraform: 3 to add, 0 to change' },
  },
  {
    key: 'aws',
    label: 'AWS Provision',
    icon: AwsIcon,
    iconClass: 'text-[#ff9900]',
    machineX: 59.3,
    log: { en: 'AWS: compute and network ready', pt: 'AWS: rede e compute prontos' },
  },
  {
    key: 'ansible',
    label: 'Ansible Config',
    icon: AnsibleIcon,
    iconClass: 'text-white/90',
    machineX: 69,
    log: { en: 'Ansible: playbook applied', pt: 'Ansible: playbook aplicado' },
  },
  {
    key: 'deploy',
    label: 'Deploy',
    icon: Rocket,
    iconClass: 'text-cyan-100',
    machineX: 80,
    log: { en: 'Deploy: service updated', pt: 'Deploy: serviço atualizado' },
  },
  {
    key: 'monitor',
    label: 'Monitoring',
    icon: BarChart3,
    iconClass: 'text-sky-300',
    machineX: 92.3,
    log: { en: 'Monitoring: healthcheck 200 OK', pt: 'Monitoring: healthcheck 200 OK' },
  },
];

const copy: Record<Locale, {
  button: string;
  running: string;
  healthy: string;
  queued: string;
  complete: string;
  handoff: string;
  latestCommit: string;
  commitMessage: string;
  commitTime: string;
}> = {
  en: {
    button: 'Run pipeline',
    running: 'Pipeline running',
    healthy: 'Deploy healthy',
    queued: 'Waiting for commit',
    complete: 'Monitoring: healthcheck 200 OK',
    handoff: 'handoff',
    latestCommit: 'Latest commit',
    commitMessage: 'feat(pipeline): improve deploy flow',
    commitTime: '2m ago',
  },
  pt: {
    button: 'Run pipeline',
    running: 'Pipeline em execução',
    healthy: 'Deploy saudável',
    queued: 'Aguardando commit',
    complete: 'Monitoring: healthcheck 200 OK',
    handoff: 'handoff',
    latestCommit: 'Último commit',
    commitMessage: 'feat(pipeline): improve deploy flow',
    commitTime: 'há 2 min',
  },
};

const getStageState = (activeIndex: number, index: number): StageState => {
  if (activeIndex > index) return 'success';
  if (activeIndex === index) return 'running';
  return 'waiting';
};

function StageCard({ stage, state }: { stage: DeploymentStage; state: StageState }) {
  const Icon = stage.icon;

  return (
    <div className="stage-card h-full min-h-[64px]" data-state={state}>
      <div className="stage-card__icon">
        <Icon size={15} className={stage.iconClass} />
      </div>
      <p className="text-center text-[10px] font-semibold leading-[1.15] text-white/92">
        {stage.label}
      </p>
    </div>
  );
}

export default function DeploymentScene() {
  const { locale } = useLocale();
  const text = copy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [runId, setRunId] = useState(0);
  const [logLine, setLogLine] = useState(text.queued);

  const runPipeline = useCallback(() => {
    setRunId((value) => value + 1);
  }, []);

  useEffect(() => {
    setLogLine(text.queued);
  }, [text.queued]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const context = gsap.context(() => {
      gsap.set(root, { '--sweep-x': `${stages[0].machineX}%` });

      if (prefersReducedMotion) {
        setActiveIndex(stages.length);
        setLogLine(text.complete);
        gsap.set(root, { '--sweep-x': `${stages.at(-1)?.machineX ?? 90.9}%` });
        return;
      }

      setActiveIndex(-1);
      setLogLine(text.queued);

      // One deliberate pass: a single travelling accent, ~1s per stage,
      // then the scene settles into a calm idle. Replays only via the button.
      const segment = 1;
      const timeline = gsap.timeline({
        delay: 0.7,
        defaults: { ease: 'sine.inOut' },
      });

      stages.forEach((stage, index) => {
        const position = index * segment;

        timeline.call(
          () => {
            setActiveIndex(index);
            setLogLine(stage.log[locale]);
          },
          [],
          position,
        );

        timeline.to(root, { '--sweep-x': `${stage.machineX}%`, duration: segment }, position);
      });

      timeline.call(
        () => {
          setActiveIndex(stages.length);
          setLogLine(text.complete);
        },
        [],
        stages.length * segment + 0.3,
      );
    }, root);

    return () => context.revert();
  }, [runId, locale, text.complete, text.queued]);

  const isHealthy = activeIndex >= stages.length;
  const isRunning = activeIndex >= 0 && !isHealthy;

  const deckStatus = useMemo(() => {
    if (isHealthy) return text.healthy;
    if (activeIndex < 0) return text.queued;
    return text.running;
  }, [activeIndex, isHealthy, text.healthy, text.queued, text.running]);

  return (
    <motion.article
      id="pipeline"
      ref={rootRef}
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      data-flow={isRunning ? 'running' : isHealthy ? 'healthy' : 'idle'}
      className="deployment-scene-shell relative w-full min-w-0 max-w-full scroll-mt-28 rounded-[30px] p-4 sm:p-5"
    >
      <div className="relative z-20 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={runPipeline}
          className="liquid-glass inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:text-emerald-100"
        >
          <Play size={12} fill="currentColor" className="relative z-10" />
          <span className="relative z-10">{text.button}</span>
        </button>
        <div className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/85">
          <span
            className={
              isHealthy || isRunning
                ? 'relative z-10 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300'
                : 'relative z-10 h-1.5 w-1.5 rounded-full bg-white/35'
            }
          />
          <span className="relative z-10">{deckStatus}</span>
          <Activity size={13} className="relative z-10 text-emerald-300/85" />
        </div>
      </div>

      {/*
        Stage cards as an even row: a clean, uniform stepper that reads aligned.
        The detected machine centers sit within ~3% of an 8-column grid, so the
        even row also lands over its machines without looking crooked.
      */}
      <div className="relative z-20 mt-4 grid grid-cols-4 gap-1.5 sm:gap-2 lg:grid-cols-8">
        {stages.map((stage, index) => (
          <StageCard key={stage.key} stage={stage} state={getStageState(activeIndex, index)} />
        ))}
      </div>

      <div className="relative -mx-1 mt-3 sm:-mx-2 lg:-mx-5 lg:mt-3.5">
        <div className="factory-stage relative z-10">
          <div className="factory-floor-glow" aria-hidden="true" />
          <div className="factory-sweep" aria-hidden="true" />
          <div className="factory-pool" aria-hidden="true" />
          <img
            src="/assets/factory/deployment-factory.webp"
            alt=""
            width={1894}
            height={518}
            draggable={false}
            className="factory-img pointer-events-none relative z-10 w-full select-none"
            aria-hidden="true"
          />
          <div className="factory-ambiance" aria-hidden="true" />
        </div>
      </div>

      <div className="status-bar relative z-20 mt-4 flex min-w-0 items-center gap-3 rounded-2xl px-4 py-2.5">
        <span
          className={
            isHealthy
              ? 'h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_10px_2px_rgba(110,231,183,0.6)]'
              : isRunning
                ? 'h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(103,232,249,0.6)]'
                : 'h-2 w-2 shrink-0 rounded-full bg-white/30'
          }
        />
        <motion.span
          key={logLine}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-white/88"
        >
          {logLine}
        </motion.span>
        <span className="hidden shrink-0 items-center gap-2 font-mono text-[11px] sm:flex">
          <code className="rounded-md border border-cyan-200/25 bg-cyan-400/[0.08] px-1.5 py-0.5 text-cyan-200">
            a7c9e2b
          </code>
          <span className="text-white/40">{text.commitTime}</span>
        </span>
      </div>
    </motion.article>
  );
}
