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
    machineX: 10.8,
    log: { en: 'Git push: commit received', pt: 'Git push: commit recebido' },
  },
  {
    key: 'build',
    label: 'Build',
    icon: Package,
    iconClass: 'text-white/85',
    machineX: 23,
    log: { en: 'Build: docker image built', pt: 'Build: imagem docker criada' },
  },
  {
    key: 'tests',
    label: 'Tests',
    icon: CheckCircle2,
    iconClass: 'text-emerald-300',
    machineX: 35.2,
    log: { en: 'Tests: all checks passed', pt: 'Tests: checks aprovados' },
  },
  {
    key: 'plan',
    label: 'Terraform Plan',
    icon: TerraformIcon,
    iconClass: 'text-violet-300',
    machineX: 47,
    log: { en: 'Terraform: 3 to add, 0 to change', pt: 'Terraform: 3 to add, 0 to change' },
  },
  {
    key: 'aws',
    label: 'AWS Provision',
    icon: AwsIcon,
    iconClass: 'text-[#ff9900]',
    machineX: 59.5,
    log: { en: 'AWS: compute and network ready', pt: 'AWS: rede e compute prontos' },
  },
  {
    key: 'ansible',
    label: 'Ansible Config',
    icon: AnsibleIcon,
    iconClass: 'text-white',
    machineX: 70.5,
    log: { en: 'Ansible: playbook applied', pt: 'Ansible: playbook aplicado' },
  },
  {
    key: 'deploy',
    label: 'Deploy',
    icon: Rocket,
    iconClass: 'text-cyan-100',
    machineX: 81,
    log: { en: 'Deploy: service updated', pt: 'Deploy: serviço atualizado' },
  },
  {
    key: 'monitor',
    label: 'Monitoring',
    icon: BarChart3,
    iconClass: 'text-sky-300',
    machineX: 90.8,
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

function StageCard({
  stage,
  state,
  positioned,
}: {
  stage: DeploymentStage;
  state: StageState;
  positioned?: boolean;
}) {
  const Icon = stage.icon;

  return (
    <div
      className={
        positioned
          ? 'stage-card absolute top-0 h-[64px] w-16 -translate-x-1/2 xl:h-[68px] xl:w-[74px]'
          : 'stage-card'
      }
      style={positioned ? { left: `${stage.machineX}%` } : undefined}
      data-state={state}
    >
      <div className="stage-card__icon">
        <Icon size={15} className={stage.iconClass} />
      </div>
      <p className="text-center text-[10px] font-semibold leading-[1.2] text-white/88">
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
        gsap.set(root, { '--sweep-x': `${stages.at(-1)?.machineX ?? 90.8}%` });
        return;
      }

      setActiveIndex(-1);
      setLogLine(text.queued);

      const segment = 0.78;
      const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

      stages.forEach((stage, index) => {
        const position = index * segment;

        timeline.call(
          () => {
            setActiveIndex(index);
            setLogLine(stage.log[locale]);
          },
          [],
          Math.max(0, position - 0.08),
        );

        timeline.to(root, { '--sweep-x': `${stage.machineX}%`, duration: segment }, position);
      });

      timeline.call(
        () => {
          setActiveIndex(stages.length);
          setLogLine(text.complete);
        },
        [],
        stages.length * segment + 0.2,
      );
      timeline.to({}, { duration: 1.2 });
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

      {/* Mobile/tablet: even grid of stage cards above the artwork. */}
      <div className="relative z-20 mt-4 grid grid-cols-4 gap-1.5 lg:hidden">
        {stages.map((stage, index) => (
          <StageCard key={stage.key} stage={stage} state={getStageState(activeIndex, index)} />
        ))}
      </div>

      {/*
        Desktop: one coordinate space for cards + machines so each card sits
        exactly above its machine, and the artwork bleeds past the panel edges.
      */}
      <div className="relative mt-3 lg:-mb-1 lg:-ml-8 lg:-mr-16 lg:mt-4">
        <div className="relative z-20 mx-0 hidden h-[64px] lg:block xl:h-[68px]">
          {stages.map((stage, index) => (
            <StageCard
              key={stage.key}
              stage={stage}
              state={getStageState(activeIndex, index)}
              positioned
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="factory-floor-glow" aria-hidden="true" />
          <img
            src="/assets/factory/deployment-factory.webp"
            alt=""
            width={1942}
            height={809}
            draggable={false}
            className="pointer-events-none relative z-10 w-full select-none"
            aria-hidden="true"
          />
          <div className="factory-sweep" aria-hidden="true" />
          <div className="absolute bottom-[7%] left-[88%] z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-md border border-emerald-300/40 bg-emerald-950/70 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-300" />
            live
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-3 flex flex-col gap-3 lg:-mt-4 lg:flex-row lg:items-center">
        <div className="min-w-0 px-1 lg:max-w-[38%]">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/38">
            {text.handoff}
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-300" />
            <motion.p
              key={logLine}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="truncate text-[13px] font-medium text-white/85"
            >
              {logLine}
            </motion.p>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 lg:flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
            {text.latestCommit}
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-2.5">
            <code className="shrink-0 rounded-md border border-cyan-200/25 bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-200">
              a7c9e2b
            </code>
            <span className="truncate font-mono text-[11px] text-white/72">
              {text.commitMessage}
            </span>
            <span className="ml-auto shrink-0 text-[11px] text-white/40">{text.commitTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
