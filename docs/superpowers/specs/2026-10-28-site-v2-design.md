# Site v2: portfólio + vitrine de sites (design)

Data: 2026-10-28 · Branch: `feat/site-v2` · Status: aprovado por delegação

## 1. Entendimento

**O que o dono pediu.** Reformular lucaspadilha.com para servir ao mesmo tempo como portfólio
profissional e como exemplo para vender sites, usando um quadro de referências no Figma
e a experiência real
mostrada no GitHub. O dono pediu explicitamente que nenhuma pergunta fosse feita e delegou as
decisões. Merge na `main` dispara deploy em produção e continua dependendo da aprovação dele.

**O que o Figma traz.** Referências de venda e de qualidade, não um layout:
- o público são negócios locais (advocacia, clínicas, comércio);
- a ideia central é mostrar ao cliente uma prévia do site antes da contratação;
- alguns sites de exemplo bastam para mostrar a capacidade de entrega;
- barra de qualidade: boas animações, botões, imagens, ícones, bento grid; referências
  Awwwards (landonorris.com, huly.io, buttermax.net).

**Dois públicos.**
1. Recrutadores e líderes técnicos (vagas de DevOps/Cloud/dev), em EN ou PT. Querem evidência:
   projetos, stack, trajetória, código.
2. Donos de pequenos negócios no Brasil, em PT. Querem ver resultado, entender o processo, saber
   quanto custa e falar no WhatsApp.

**Critérios de sucesso.**
- Cada público entende em 5 segundos o que encontra ali e qual é o próximo passo.
- O site prova o que vende: Lighthouse mobile ≥ 95 em Performance, Accessibility, Best Practices
  e SEO nas páginas novas, medido e reportado.
- Corrige os problemas da análise anterior: vídeo de 26 MB, og:image 404, erro de hidratação
  #418 em PT, conteúdo invisível sem JS, ausência de canonical/robots/sitemap/404, mockup de
  referência publicado, healthcheck alegado mas inexistente.
- `/startup/` continua idêntica.
- Nada inventado: sem depoimentos, números, clientes ou empregos falsos. Os sites de exemplo são
  de empresas fictícias e dizem isso.

## 2. Abordagens consideradas

1. **Home híbrida única** que fala com os dois públicos. Descartada: as mensagens competem e o
   dono de negócio se perde em Terraform.
2. **Hub pessoal + vitrine separada no mesmo domínio** (escolhida). `/` é o portfólio (EN, com
   `/pt/`); `/sites/` é a página de vendas em PT, e `/sites/exemplos/*` são os sites conceito. A
   home tem uma seção que leva à vitrine, e a vitrine linka o portfólio como prova técnica.
3. **Marca separada para o serviço**, com domínio próprio. Descartada: exige DNS e marca nova, e
   desperdiça a autoridade do domínio atual.

**Direção visual.** Duas direções avaliadas:
- A. *Escuro cinematográfico* (o atual + referências Awwwards): vídeo, glass, 3D. Parece com
  qualquer portfólio dev de 2026 e é pesado, o que contradiz o argumento de velocidade.
- B. *Editorial de engenharia* (escolhida): papel claro, tinta preta, um laranja de sinalização,
  tipografia grande, réguas finas de desenho técnico, metadados em monoespaçada. Destaca-se entre
  portfólios dev escuros, funciona para dono de negócio (menos "hacker", mais confiável) e é leve
  por natureza. Modo escuro automático via `prefers-color-scheme`.

## 3. Sistema visual

- **Cores (claro):** papel `#F2EFE8`, superfície `#FBFAF6`, tinta `#141413`, tinta-2 `#55534D`,
  linha `#D8D3C8`, sinal `#FF5A1F` (só preenchimentos, texto grande e marcas, nunca texto
  pequeno), texto sobre sinal `#1C0B02`. **Escuro:** fundo `#11110F`, superfície `#191917`, tinta
  `#ECE9E1`, tinta-2 `#A29F97`, linha `#2E2D29`, sinal `#FF6B35`.
- **Tipografia:** Bricolage Grotesque Variable (títulos e texto, com eixo óptico) e JetBrains
  Mono Variable (rótulos, metadados, código). Self-hosted via Fontsource, sem Google Fonts.
- **Grade:** largura máx. 1320px, margem lateral 16px no celular e 32px no desktop, 12 colunas.
  Réguas de 1px como estrutura visível.
- **Assinatura: o recibo de build.** Um cartão estilo recibo (monoespaçado, borda picotada) com
  dados **reais**: commit do build, data/hora, link do run no GitHub Actions, destino do deploy, e
  o peso e o tempo de carregamento **medidos no navegador do visitante** via Performance API. Na
  home ele prova o DevOps; na vitrine prova a velocidade. Sem dados de mentira.
- **Movimento:** revelação sutil ao rolar (opacidade + 8px), com CSS e IntersectionObserver,
  desligada em `prefers-reduced-motion`. O conteúdo é visível sem JS (o estado oculto só se aplica
  quando `html.js` existe). Sem preloader, sem vídeo de fundo.
- **Acessibilidade:** WCAG 2.2 AA, foco visível, alvos ≥ 44px, skip link, hierarquia de títulos
  correta, contraste verificado.

## 4. Arquitetura

- Astro 5 estático. **React, Framer Motion, GSAP, Lucide, Tailwind e @astrojs/node saem**: a
  `/startup/` já não depende deles e a nova home é HTML + CSS + ~3 KB de JS.
- **i18n em build:** `/` (en) e `/pt/` (pt-BR) são páginas estáticas geradas do mesmo componente
  com conteúdo em `src/data/home.ts`. Um script inline no `<head>` de `/` redireciona para `/pt/`
  antes da pintura quando há `?lang=pt`, preferência salva ou idioma do navegador em português
  sem preferência salva; `/pt/` respeita `?lang=en`. O seletor EN/PT é um link e grava a
  preferência. Isso elimina o erro #418 e corrige `<html lang>`. `hreflang` nos dois.
- **Arquivos:**
  - `src/layouts/Base.astro` — head, SEO, OG, fontes, tema, script de idioma opcional.
  - `src/styles/site.css` — tokens e base; estilos de componente ficam em `<style>` do próprio
    componente.
  - `src/lib/build-info.ts` — commit, data, run URL (env do GitHub Actions ou `git`), com
    fallback.
  - `src/components/site/*` — Header, Footer, Receipt, Section, ProjectCard, etc.
  - `src/data/home.ts`, `src/data/sites.ts` (oferta, planos, FAQ, contato em um só lugar).
  - `src/pages/index.astro`, `src/pages/pt/index.astro`, `src/pages/sites/index.astro`,
    `src/pages/sites/exemplos/{advocacia,odontologia,cafe}/index.astro`, `src/pages/404.astro`,
    `src/pages/sitemap.xml.ts`, `public/robots.txt`.
  - Sites conceito: `src/components/demos/<slug>/*` e `public/sites/exemplos/<slug>/img/*`, cada
    um com identidade visual própria e independente do sistema principal.
- **SEO:** title/description únicos, canonical absoluto, OG/Twitter com imagem absoluta 1200×630
  gerada por script (Playwright) e versionada em `public/og/`, JSON-LD `Person` na home e
  `ProfessionalService` na vitrine. Sites conceito com `noindex` para não competirem com
  empresas reais.
- **Deploy:** o workflow ganha `concurrency` e um passo de healthcheck real (`curl` com retry em
  `/`, `/pt/`, `/sites/` e `/startup/`). Removido o mockup `public/reference/hero-target.png`.

## 5. Conteúdo

**Home (`/`, `/pt/`)**
1. Cabeçalho: nome, navegação (Trabalho, Como entrego, Sites, Contato), EN/PT.
2. Hero: frase de posicionamento ("Construo sites e a infraestrutura que os mantém no ar"),
   subtítulo factual, CTAs "Ver trabalho" e "Preciso de um site" (para `/sites/`), recibo de build.
3. Trabalho selecionado: bento grid com 6–8 projetos do ranking da análise do GitHub. Cada um
   com papel, stack, evidência e link para o repositório quando público. Privados aparecem só se
   marcados como seguros, sem link para o código.
4. Como eu entrego: o pipeline real deste site (commit → Actions → build → deploy → healthcheck),
   com links para o workflow e para os repositórios de Terraform e Ansible.
5. Stack: categorias compactas, com níveis core / hands-on; o nível lab fica em um `<details>`.
6. Sites para negócios: teaser da vitrine com os três sites conceito.
7. Trajetória: linha do tempo por ano baseada no GitHub, sem empregadores inventados.
8. Contato: e-mail, GitHub, LinkedIn.

**Vitrine (`/sites/`, só PT)**
1. Hero: "Sites rápidos e bonitos para negócios que querem ser encontrados." Promessa central do
   quadro: "Você vê a prévia do seu site antes de fechar." CTA para WhatsApp (se configurado) ou
   e-mail com assunto preenchido.
2. Exemplos: três sites conceito em moldura de navegador, com nicho e o que cada um demonstra.
3. Por que comigo: velocidade medida (o recibo ao vivo), hospedagem e manutenção por quem opera
   servidores, SEO local e Google, WhatsApp, celular primeiro.
4. Como funciona: conversa → prévia → ajustes → no ar no seu domínio → cuidado mensal.
5. Planos: valores em `src/data/sites.ts`. **Os valores iniciais são sugestões baseadas nos
   referências de mercado e precisam da confirmação do dono antes do merge.**
6. Perguntas frequentes.
7. Contato.

**Sites conceito.** Três empresas fictícias, cada uma com estilo próprio para mostrar alcance:
- `advocacia` — Lacerda & Viana Advocacia: sóbrio, editorial, serifado (Newsreader + Manrope).
- `odontologia` — Aurora Odontologia: claro, limpo, arredondado (Plus Jakarta Sans).
- `cafe` — Casa Jabuticaba, café e padaria: quente, apetitoso, expressivo (Fraunces + DM Sans).

Regras: faixa fixa "Site conceito · empresa fictícia · feito por Lucas Padilha → quero um assim";
`noindex`; sem telefone, endereço numerado, depoimentos ou números inventados; CTAs levam à
vitrine; fotos do Wikimedia Commons com licença livre e créditos na página; JS mínimo; cada página
abaixo de 300 KB sem contar as imagens, com imagens responsivas e lazy.

## 6. Verificação

- `npm run build` sem erros; `scripts/check-startup.mjs` continua passando.
- Novo `scripts/check-site.mjs` (Playwright) em todas as rotas novas, em 360, 390, 768, 1440 e
  1920: status 200, sem erros de console, sem rolagem horizontal, `lang` correto, metadados e OG
  presentes, links internos válidos, redirecionamento de idioma, `prefers-reduced-motion` e axe-core.
- Lighthouse mobile nas rotas novas; os valores medidos vão para o PR.
- Inspeção visual de capturas em celular e desktop, com ciclos de correção.

## 7. Fora do escopo

Ferramentas de prospecção, formulário com
backend, blog, CMS, mudanças de DNS ou do servidor Caddy, e alterações na `/startup/`.
