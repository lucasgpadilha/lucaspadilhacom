import type { Localized } from '../lib/locale';

type L = Localized<string>;

export const meta = {
  title: {
    en: 'Lucas Padilha — software, websites and the infrastructure behind them',
    pt: 'Lucas Padilha — software, sites e a infraestrutura por trás deles',
  } satisfies L,
  description: {
    en: 'Full-stack and DevOps engineer in Brazil. I build products, websites and the infrastructure that keeps them online, and I operate what I ship.',
    pt: 'Engenheiro full-stack e DevOps no Brasil. Construo produtos, sites e a infraestrutura que os mantém no ar, e opero o que entrego.',
  } satisfies L,
};

export const nav: Localized<{ href: string; label: string }[]> = {
  en: [
    { href: '#work', label: 'Work' },
    { href: '#shipping', label: 'How I ship' },
    { href: '/sites/', label: 'Websites' },
    { href: '#contact', label: 'Contact' },
  ],
  pt: [
    { href: '#work', label: 'Trabalho' },
    { href: '#shipping', label: 'Como entrego' },
    { href: '/sites/', label: 'Sites' },
    { href: '#contact', label: 'Contato' },
  ],
};

export const hero = {
  kicker: { en: 'Full-stack · DevOps · Web — Brazil', pt: 'Full-stack · DevOps · Web — Brasil' } satisfies L,
  title: {
    en: 'I build software, websites and the infrastructure that keeps them online.',
    pt: 'Construo software, sites e a infraestrutura que os mantém no ar.',
  } satisfies L,
  lede: {
    en: 'TypeScript products on PostgreSQL, deployed and operated on Linux with Docker, Caddy and GitHub Actions. I ship them, run them and answer for them when something breaks.',
    pt: 'Produtos em TypeScript sobre PostgreSQL, publicados e operados em Linux com Docker, Caddy e GitHub Actions. Eu entrego, opero e respondo por eles quando algo quebra.',
  } satisfies L,
  primary: { en: 'See the work', pt: 'Ver o trabalho' } satisfies L,
  secondary: { en: 'I need a website', pt: 'Preciso de um site' } satisfies L,
};

export interface Project {
  slug: string;
  kind: L;
  title: L;
  pitch: L;
  role: L;
  evidence: Localized<string[]>;
  stack: string[];
  link: { href: string; label: L } | null;
  /** Shown instead of a link for private work. */
  note?: L;
  stats?: Localized<{ value: string; label: string }[]>;
  image?: { src: string; srcset: string; width: number; height: number; alt: L };
  layout: 'feature' | 'tall' | 'std' | 'half';
}

export const projects: Project[] = [
  {
    slug: 'erp',
    layout: 'feature',
    kind: { en: 'Case study · client work', pt: 'Estudo de caso · cliente' },
    title: { en: 'Legacy ERP to multi-tenant SaaS', pt: 'De ERP legado a SaaS multi-tenant' },
    pitch: {
      en: 'A Brazilian services company ran its whole operation on a desktop VB6/Access system. I rebuilt it as a multi-tenant web SaaS, migrated the live data and cut over with about 80 seconds of downtime.',
      pt: 'Uma empresa de serviços brasileira rodava a operação inteira num sistema desktop em VB6/Access. Reconstruí como um SaaS web multi-tenant, migrei os dados reais e fiz a virada com cerca de 80 segundos de indisponibilidade.',
    },
    role: { en: 'Sole engineer, working with AI agents', pt: 'Engenheiro único, trabalhando com agentes de IA' },
    stats: {
      en: [
        { value: '~80 s', label: 'production cutover' },
        { value: '1,459', label: 'automated tests' },
        { value: '85', label: 'merged pull requests' },
      ],
      pt: [
        { value: '~80 s', label: 'virada em produção' },
        { value: '1.459', label: 'testes automatizados' },
        { value: '85', label: 'pull requests integrados' },
      ],
    },
    evidence: {
      en: [
        'Mapped the legacy data and wrote an idempotent, reconciled import',
        'PostgreSQL row-level security per tenant, least-privilege roles',
        'Nightly backups with restore drills, smoke tests and a rollback plan',
      ],
      pt: [
        'Mapeamento dos dados legados e importação idempotente com reconciliação',
        'Row-level security no PostgreSQL por cliente e papéis com privilégio mínimo',
        'Backups diários com teste de restauração, smoke tests e plano de rollback',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'BullMQ', 'Docker', 'GitHub Actions'],
    link: null,
    note: { en: 'Private client project · in production since Oct 2026', pt: 'Projeto privado de cliente · em produção desde out/2026' },
  },
  {
    slug: 'comboio',
    layout: 'tall',
    kind: { en: 'Product · Nexora Games', pt: 'Produto · Nexora Games' },
    title: { en: 'Comboio Bruto', pt: 'Comboio Bruto' },
    pitch: {
      en: 'A truck-convoy game for TikTok LIVE. Viewers join the road from the chat, vote on events and keep their progress between streams.',
      pt: 'Um jogo de comboio de caminhões para TikTok LIVE. O público entra na estrada pelo chat, vota nos eventos e mantém o progresso entre lives.',
    },
    role: { en: 'Founder and developer', pt: 'Fundador e desenvolvedor' },
    evidence: {
      en: ['Godot 4 game, TypeScript bridge, SQLite progression', 'Tested in a real livestream', 'CI on Ubuntu and Windows with headless Godot'],
      pt: ['Jogo em Godot 4, ponte em TypeScript, progresso em SQLite', 'Testado em uma live real', 'CI em Ubuntu e Windows com Godot headless'],
    },
    stack: ['Godot', 'GDScript', 'TypeScript', 'SQLite', 'Svelte'],
    link: { href: '/startup/', label: { en: 'Studio page', pt: 'Página do estúdio' } },
    image: {
      src: '/startup/serra-720.webp',
      srcset: '/startup/serra-360.webp 360w, /startup/serra-720.webp 720w',
      width: 720,
      height: 1280,
      alt: {
        en: 'Comboio Bruto prototype: trucks on a winding mountain road with the chat invitation on screen.',
        pt: 'Protótipo do Comboio Bruto: caminhões numa estrada de serra com o convite do chat na tela.',
      },
    },
  },
  {
    slug: 'pynoc',
    layout: 'std',
    kind: { en: 'Open source · SRE', pt: 'Open source · SRE' },
    title: { en: 'PyNOC', pt: 'PyNOC' },
    pitch: {
      en: 'A self-hosted NOC layer that turns noisy Zabbix alerts into deduplicated, auditable incidents in Discord.',
      pt: 'Uma camada de NOC self-hosted que transforma alertas ruidosos do Zabbix em incidentes deduplicados e auditáveis no Discord.',
    },
    role: { en: 'Author', pt: 'Autor' },
    evidence: {
      en: ['349 pytest tests', 'Optional LLM behind a data-masking policy, with a deterministic fallback'],
      pt: ['349 testes com pytest', 'LLM opcional atrás de uma política de mascaramento, com fallback determinístico'],
    },
    stack: ['Python', 'FastAPI', 'RabbitMQ', 'PostgreSQL', 'React'],
    link: { href: 'https://github.com/lucasgpadilha/pynoc', label: { en: 'Repository', pt: 'Repositório' } },
  },
  {
    slug: 'milkontrol',
    layout: 'std',
    kind: { en: 'Product · live', pt: 'Produto · no ar' },
    title: { en: 'MilKontrol', pt: 'MilKontrol' },
    pitch: {
      en: 'Dairy-farm management: herd, milk production, breeding, the milk tank and medication withdrawal periods.',
      pt: 'Gestão de fazenda leiteira: rebanho, produção de leite, reprodução, tanque e carência de medicamentos.',
    },
    role: { en: 'Built and operates it', pt: 'Construí e opero' },
    evidence: {
      en: ['61 API routes on Prisma and PostgreSQL', 'Deployed and run with PM2 behind Caddy'],
      pt: ['61 rotas de API com Prisma e PostgreSQL', 'Publicado e operado com PM2 atrás do Caddy'],
    },
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Auth.js'],
    link: { href: 'https://milkontrol.cloud/', label: { en: 'Live product', pt: 'Produto no ar' } },
  },
  {
    slug: 'floci',
    layout: 'half',
    kind: { en: 'Lab · cloud', pt: 'Lab · cloud' },
    title: { en: 'Floci Cloud Lab', pt: 'Floci Cloud Lab' },
    pitch: {
      en: 'A zero-cost AWS lab: S3, DynamoDB, Lambda and API Gateway provisioned with Terraform and tested against a local AWS emulator. Emulated, not production.',
      pt: 'Laboratório AWS sem custo: S3, DynamoDB, Lambda e API Gateway provisionados com Terraform e testados contra um emulador local. Emulado, não é produção.',
    },
    role: { en: 'Author', pt: 'Autor' },
    evidence: {
      en: ['111 tests and 18 Terraform files', 'Runbooks and architecture decision records'],
      pt: ['111 testes e 18 arquivos Terraform', 'Runbooks e registros de decisão de arquitetura'],
    },
    stack: ['Terraform', 'Python', 'boto3', 'pytest', 'Docker'],
    link: { href: 'https://github.com/lucasgpadilha/floci-cloud-lab', label: { en: 'Repository', pt: 'Repositório' } },
  },
  {
    slug: 'tuildap',
    layout: 'half',
    kind: { en: 'Open source · tooling', pt: 'Open source · ferramenta' },
    title: { en: 'tuildap', pt: 'tuildap' },
    pitch: {
      en: 'A read-only terminal UI in Go for browsing LDAP, Active Directory and FreeIPA directories, with mouse support.',
      pt: 'Uma interface de terminal em Go, somente leitura, para navegar em diretórios LDAP, Active Directory e FreeIPA, com suporte a mouse.',
    },
    role: { en: 'Author', pt: 'Autor' },
    evidence: {
      en: ['About 7,000 lines of Go', 'CI with gofmt, vet and staticcheck'],
      pt: ['Cerca de 7.000 linhas de Go', 'CI com gofmt, vet e staticcheck'],
    },
    stack: ['Go', 'Bubble Tea', 'go-ldap'],
    link: { href: 'https://github.com/lucasgpadilha/tuildap', label: { en: 'Repository', pt: 'Repositório' } },
  },
];

export const sections = {
  work: {
    label: { en: '01 — Work', pt: '01 — Trabalho' } satisfies L,
    title: { en: 'Things I built and run', pt: 'O que construí e opero' } satisfies L,
    intro: {
      en: 'Products in production, a game tested live and open-source tools. Private client work is described without names or data.',
      pt: 'Produtos em produção, um jogo testado ao vivo e ferramentas open source. Trabalho privado de cliente aparece sem nomes nem dados.',
    } satisfies L,
  },
  shipping: {
    label: { en: '02 — How I ship', pt: '02 — Como entrego' } satisfies L,
    title: { en: 'This site is its own example', pt: 'Este site é o próprio exemplo' } satisfies L,
    intro: {
      en: 'Every push to main runs the same short pipeline. The receipt at the top of the page shows the build that produced what you are reading.',
      pt: 'Todo push na main passa pelo mesmo pipeline curto. O recibo no topo da página mostra o build que gerou o que você está lendo.',
    } satisfies L,
    steps: [
      { key: 'push', title: { en: 'Push', pt: 'Push' }, body: { en: 'Pull requests and pushes to main run the same checks.', pt: 'Pull requests e pushes na main passam pelas mesmas checagens.' } },
      { key: 'build', title: { en: 'Build', pt: 'Build' }, body: { en: 'npm ci and a static Astro build on GitHub Actions.', pt: 'npm ci e build estático do Astro no GitHub Actions.' } },
      { key: 'check', title: { en: 'Check', pt: 'Checagem' }, body: { en: 'Playwright and axe run against a production preview.', pt: 'Playwright e axe rodam contra um preview de produção.' } },
      { key: 'deploy', title: { en: 'Deploy', pt: 'Deploy' }, body: { en: 'Static files go to the server over SCP.', pt: 'Os arquivos estáticos vão ao servidor por SCP.' } },
      { key: 'health', title: { en: 'Healthcheck', pt: 'Healthcheck' }, body: { en: 'The live URLs must answer 200, or the run fails.', pt: 'As URLs no ar precisam responder 200, ou o run falha.' } },
    ] satisfies { key: string; title: L; body: L }[],
    workflow: { en: 'Read the workflow', pt: 'Ver o workflow' } satisfies L,
    aiTitle: { en: 'AI agents, with gates', pt: 'Agentes de IA, com portões' } satisfies L,
    aiBody: {
      en: 'I build with AI coding agents and treat them like a fast team that needs review. That is how a 481-commit ERP migration shipped in nine days without skipping tests.',
      pt: 'Desenvolvo com agentes de IA e trato eles como um time rápido que precisa de revisão. Foi assim que uma migração de ERP com 481 commits saiu em nove dias sem pular testes.',
    } satisfies L,
    aiGates: {
      en: ['A written spec and plan before any code', 'Tests and CI decide what ships', 'I review and own every change'],
      pt: ['Spec e plano escritos antes de qualquer código', 'Testes e CI decidem o que vai ao ar', 'Eu reviso e respondo por toda mudança'],
    } satisfies Localized<string[]>,
  },
  stack: {
    label: { en: '03 — Stack', pt: '03 — Stack' } satisfies L,
    title: { en: 'Tools, with the evidence', pt: 'Ferramentas, com a evidência' } satisfies L,
    intro: {
      en: 'Only what shows up in real repositories. The level says how far I have taken each one.',
      pt: 'Só o que aparece em repositórios reais. O nível diz até onde levei cada uma.',
    } satisfies L,
    levels: {
      core: { en: 'Core — daily, in production', pt: 'Core — diário, em produção' },
      'hands-on': { en: 'Hands-on — used in real projects', pt: 'Hands-on — usado em projetos reais' },
      exposure: { en: 'Explored — labs and study', pt: 'Explorado — labs e estudo' },
    } satisfies Record<string, L>,
    more: { en: 'Also explored', pt: 'Também explorei' } satisfies L,
  },
  sites: {
    label: { en: '04 — Websites', pt: '04 — Sites' } satisfies L,
    title: { en: 'Websites for businesses', pt: 'Sites para negócios' } satisfies L,
    body: {
      en: 'I also build websites for small businesses: fast, easy to find on Google, with WhatsApp one tap away. You see a working preview before you commit.',
      pt: 'Também faço sites para pequenos negócios: rápidos, fáceis de achar no Google e com o WhatsApp a um toque. Você vê uma prévia funcionando antes de fechar.',
    } satisfies L,
    cta: { en: 'See the examples (in Portuguese)', pt: 'Ver os exemplos' } satisfies L,
  },
  path: {
    label: { en: '05 — Path', pt: '05 — Trajetória' } satisfies L,
    title: { en: 'How I got here', pt: 'Como cheguei aqui' } satisfies L,
    items: [
      {
        when: { en: '2025', pt: '2025' },
        text: {
          en: 'Back to building, at university: Systems Analysis and Development at UTFPR. Java networking, Node without frameworks, a first client CRM and plenty of automation experiments.',
          pt: 'De volta a construir, na faculdade: Análise e Desenvolvimento de Sistemas na UTFPR. Redes em Java, Node sem framework, o primeiro CRM para cliente e muitos experimentos de automação.',
        },
      },
      {
        when: { en: '2026 · H1', pt: '2026 · 1º sem.' },
        text: {
          en: 'Products and a deliberate move into DevOps: MilKontrol goes live, public labs for AWS, Go tooling and SRE, and this site gets its own pipeline.',
          pt: 'Produtos e uma virada deliberada para DevOps: o MilKontrol entra no ar, labs públicos de AWS, ferramentas em Go e SRE, e este site ganha pipeline próprio.',
        },
      },
      {
        when: { en: '2026 · Sep', pt: '2026 · set' },
        text: {
          en: 'Comboio Bruto: a Godot game for TikTok LIVE, tested in a real livestream.',
          pt: 'Comboio Bruto: um jogo em Godot para TikTok LIVE, testado numa live real.',
        },
      },
      {
        when: { en: '2026 · Oct', pt: '2026 · out' },
        text: {
          en: 'A legacy ERP migrated to a multi-tenant SaaS and put into production. The Nexora Games studio page. This site, version 2.',
          pt: 'Um ERP legado migrado para SaaS multi-tenant e colocado em produção. A página do estúdio Nexora Games. Este site, versão 2.',
        },
      },
    ] satisfies { when: L; text: L }[],
  },
  contact: {
    label: { en: '06 — Contact', pt: '06 — Contato' } satisfies L,
    title: { en: 'Let’s talk', pt: 'Vamos conversar' } satisfies L,
    body: {
      en: 'Hiring for full-stack, platform or DevOps work, or need a system built and run? Email is the fastest way to reach me.',
      pt: 'Contratando para full-stack, plataforma ou DevOps, ou precisa de um sistema construído e operado? E-mail é o jeito mais rápido de falar comigo.',
    } satisfies L,
  },
};

export const email = 'lucasgpadilhatec@gmail.com';
