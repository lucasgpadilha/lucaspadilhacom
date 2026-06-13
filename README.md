# lucaspadilhacom

Portfólio DevOps de Lucas Padilha, construído como uma landing page estática com foco em Cloud, Infrastructure as Code, automação e deploy reproduzível.

## Visão

O site comunica projetos práticos em AWS, Terraform, Ansible, Docker, CI/CD e operação Linux. A direção visual é sóbria (superfícies hairline, tipografia Space Grotesk/JetBrains Mono, um único acento âmbar) com uma hero em vídeo 16:9 e um command deck DevOps representando o fluxo Commit -> Build -> Tests -> Terraform -> AWS -> Ansible -> Deploy -> Monitoring.

## Idiomas

O site é bilíngue:

- inglês como idioma padrão
- português quando o idioma principal do navegador indicar `pt`, `BR`, `PT` ou quando não houver preferência por inglês e a timezone for lusófona
- seletor manual `EN/PT` na navbar
- preferência manual persistida em `localStorage`
- override por URL com `?lang=en` ou `?lang=pt`

A detecção fica em `src/lib/i18n.ts`. Como o projeto é estático, a detecção acontece no navegador e não depende de serviço externo de IP.

## Stack do site (build)

- Astro
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lucide React

## Stack operacional (conteúdo da página)

A seção "Operational Stack" do site é orientada a dados e fácil de editar em
`src/data/stack.ts`. Cada categoria tem `title`, `description` (en/pt) e uma
lista de `tools`, onde cada ferramenta declara um nível de proficiência:

```ts
{ name: 'Terraform', level: 'core' }     // core | hands-on | lab
```

- `core` — uso diário, hands-on
- `hands-on` — usado em trabalho real, confortável
- `lab` — labs e experimentos (inclui o que está em exploração)

No visual, apenas `core` recebe o acento âmbar; `hands-on` e `lab` se diferenciam
por peso/opacidade, evitando uma lista chapada de buzzwords. Para adicionar uma
categoria, inclua um objeto novo no array e (se precisar de ícone próprio) um
mapeamento em `icons` dentro de `src/components/sections/StackSection.tsx`.

## Rodar localmente

```bash
npm ci
npm run dev
```

Servidor local padrão:

```text
http://localhost:4321
```

## Configurar vídeo da hero

Edite a constante em `src/components/sections/Hero.tsx`:

```ts
export const HERO_VIDEO_URL = 'https://pub-cee283bbed284d29826195df8d5a2571.r2.dev/202606121059.mp4';
```

Use uma URL pública de CDN para um vídeo 16:9 em loop. O elemento `video` já está configurado com `autoPlay`, `muted`, `loop`, `playsInline`, `preload="auto"` e `object-cover`.

## Deployment Scene

A visualização da pipeline (command deck da hero) combina:

- arte 3D da "fábrica" em `public/assets/factory/deployment-factory-v2.webp` (8 módulos, um por estágio)
- timeline GSAP movendo um foco de luz (`--sweep-x`) entre os módulos
- cards de estágio fixados no centro medido de cada módulo (`machineX` em `src/components/devops/DeploymentScene.tsx`)
- labels, status e log em React; Framer Motion apenas para o reveal

A decisão de motion está documentada em `docs/motion-strategy.md`.

## Visual QA

Com o dev server rodando:

```bash
npm run dev
npm run screenshot:hero
```

Para usar outra porta:

```bash
SCREENSHOT_URL=http://localhost:4322 npm run screenshot:hero
```

O screenshot é salvo em:

```text
screenshots/hero-1440x900.png
```

## Build

```bash
npm run build
```

O build estático será gerado em:

```text
dist/
```

## Deploy

Arquitetura simples (o mesmo fluxo mostrado no card "How this site is deployed"):

```text
push to main -> GitHub Actions -> Astro build -> SCP/SSH -> EC2 -> Nginx -> healthcheck
```

Use secrets ou variáveis do pipeline para dados sensíveis:

```text
SERVER_IP=<SERVER_IP>
SERVER_USER=<SERVER_USER>
DEPLOY_PATH=<DEPLOY_PATH>
SSH_PRIVATE_KEY=<SSH_PRIVATE_KEY>
```

Não exponha IP real do servidor, usuário SSH ou caminho interno do deploy no repositório.

## Preview de produção

```bash
npm run build
npm run preview
```
