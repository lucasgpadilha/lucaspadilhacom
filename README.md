# lucaspadilhacom

Portfólio DevOps de Lucas Padilha, construído como uma landing page estática com foco em Cloud, Infrastructure as Code, automação e deploy reproduzível.

## Visão

O site comunica projetos práticos em AWS, Terraform, Ansible, Docker, CI/CD e operação Linux. A direção visual usa uma hero com vídeo 16:9 em loop, UI glass discreta e um command deck DevOps para representar o fluxo Commit -> Build -> Tests -> Terraform -> AWS -> Ansible -> Deploy -> Monitoring.

## Idiomas

O site é bilíngue:

- inglês como idioma padrão
- português quando o idioma principal do navegador indicar `pt`, `BR`, `PT` ou quando não houver preferência por inglês e a timezone for lusófona
- seletor manual `EN/PT` na navbar
- preferência manual persistida em `localStorage`
- override por URL com `?lang=en` ou `?lang=pt`

A detecção fica em `src/lib/i18n.ts`. Como o projeto é estático, a detecção acontece no navegador e não depende de serviço externo de IP.

## Stack

- Astro
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lucide React

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

A visualização da pipeline usa uma abordagem blueprint/command deck:

- visual base em SVG/HTML
- timeline GSAP para pulso contínuo e progresso da linha
- labels, ícones, status e log em React
- Framer Motion apenas para entrada/reveal

A decisão técnica está documentada em `docs/motion-strategy.md`. Os assets em `public/assets/factory/` ficam como referência/fallback futuro, mas não são a peça principal da hero atual.

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

Arquitetura simples:

```text
GitHub Actions -> Astro build -> SCP/SSH -> EC2/Nginx
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
