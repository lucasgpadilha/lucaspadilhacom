# lucaspadilhacom

Site pessoal de Lucas Padilha em [lucaspadilha.com](https://lucaspadilha.com). Reúne três coisas:

- `/` e `/pt/`: portfólio (full-stack, DevOps, web), em inglês e português.
- `/sites/`: vitrine para vender sites a pequenos negócios (só PT), com três sites conceito em `/sites/exemplos/`.
- `/startup/`: página do estúdio Nexora Games (independente do resto, com layout e CSS próprios).

## Stack

- Astro 5, saída estática. Sem React e sem Tailwind: componentes `.astro`, CSS com tokens em `src/styles/site.css` e alguns KB de JS inline.
- Fontes self-hosted via Fontsource (Bricolage Grotesque e JetBrains Mono no site; Newsreader, Manrope, Plus Jakarta Sans, Fraunces e DM Sans nos sites conceito).
- Playwright e axe-core para QA; sharp para imagens.

## Estrutura

```text
src/
  layouts/Base.astro          head, SEO, OG, script de idioma
  layouts/DemoLayout.astro    layout dos sites conceito (noindex, faixa e créditos)
  components/site/            portfólio: Header, Receipt, Work, Shipping, Stack...
  components/sites/           vitrine /sites/
  components/demos/<slug>/    um diretório por site conceito
  data/home.ts                textos e projetos do portfólio (en/pt)
  data/stack.ts               ferramentas por nível, sempre com evidência
  data/sites.ts               oferta, planos, FAQ e contato da vitrine
  lib/build-info.ts           commit, data e run do build (usados no recibo)
```

## Idiomas

`/` é inglês e `/pt/` é português, ambos estáticos. Um script inline no `<head>` de `/` manda para `/pt/` antes da primeira pintura quando:

- a URL tem `?lang=pt`;
- a preferência salva é `pt`;
- não há preferência salva e o idioma principal do navegador começa com `pt`.

Em `/pt/`, `?lang=en` volta para `/`. A preferência fica em `localStorage` (`lucaspadilha.locale`) e é compartilhada com `/startup/`. Sem JavaScript, cada URL mostra seu próprio idioma.

## Conteúdo

- Projetos: `src/data/home.ts`. Repositórios privados nunca ganham link.
- Stack: `src/data/stack.ts`, com níveis `core`, `hands-on` e `exposure`. Toda ferramenta aponta para onde está a evidência.
- Vitrine: `src/data/sites.ts`. O número de WhatsApp fica em `contact.whatsapp`. Enquanto ele for `null`, os botões usam e-mail com assunto preenchido.

## Rodar localmente

```bash
npm ci
npm run dev                 # http://localhost:4321
```

## Verificar

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321 &
npm run test:site           # rotas, idioma, overflow, metadados, a11y, sites conceito
STARTUP_PREVIEW_URL=http://127.0.0.1:4321 npm run test:startup
```

`SITE_WIDTHS=390 npm run test:site` roda só uma largura. `SITE_DEMO=cafe npm run test:site` testa só um site conceito.

Para regerar as imagens de compartilhamento depois de mudar textos ou visual, rode `node scripts/make-og.mjs`.

## Deploy

```text
PR      → build → Playwright + axe contra o preview
main    → build → checks → SCP para o servidor → healthcheck
```

O healthcheck pede `/`, `/pt/`, `/sites/` e `/startup/` com retry e confirma que a home servida traz o commit do build. Segredos usados pelo workflow: `SERVER_IP` e `SSH_PRIVATE_KEY`. O servidor de produção é Caddy, que precisa de `handle_errors` para servir o `404.html` gerado.
