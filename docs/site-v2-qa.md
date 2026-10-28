# Site v2: QA

Data: 2026-10-28 · Branch: `feat/site-v2` · Medido contra `astro preview` do build de produção.

## Suítes automatizadas

| Suíte | Resultado |
|---|---|
| `npm run build` | ok, 8 páginas e o sitemap |
| `npm run test:site` (todas as rotas novas em 320, 360, 390, 768, 1440 e 1920) | PASS |
| `npm run test:startup` (regressão da `/startup/`) | PASS |

`test:site` cobre:
- status 200, zero erros de console e zero respostas ≥ 400;
- sem rolagem horizontal, `html[lang]` correto e um único `h1`;
- canonical e `og:image` absolutos, `og:image` com 1200×630 de verdade;
- robots, sitemap (sem os sites conceito) e 404 com `noindex`;
- JSON-LD `Person` na home e `ProfessionalService` + `FAQPage` na `/sites/`;
- redirecionamento de idioma: navegador PT, `?lang=` com hash, preferência salva e `localStorage` bloqueado;
- conteúdo visível sem JS e com `prefers-reduced-motion`;
- links só para repositórios públicos, e nenhum `wa.me` enquanto o WhatsApp não estiver configurado;
- nos sites conceito: `noindex`, faixa de site conceito, nenhum link `tel:`, toda imagem com `alt`/`width`/`height` e menos de 300 KB sem imagens;
- axe-core (WCAG 2.0/2.1/2.2 A e AA) em 390 e 1440: zero violações `serious` ou `critical`.

## Lighthouse 12.8.2, mobile (throttling padrão)

| Rota | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | Peso |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1,6 s | 0 | 193 KiB |
| `/pt/` | 100 | 100 | 100 | 100 | 1,6 s | 0 | 193 KiB |
| `/sites/` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 305 KiB |
| `/sites/exemplos/advocacia/` | 92 | 100 | 100 | 69* | 3,3 s | 0,036 | 424 KiB |
| `/sites/exemplos/odontologia/` | 100 | 100 | 100 | 69* | 1,6 s | 0 | 118 KiB |
| `/sites/exemplos/cafe/` | 98 | 100 | 100 | 69* | 2,5 s | 0 | 302 KiB |
| `/startup/` (sem mudanças) | 99 | 100 | 100 | 100 | 2,3 s | 0 | 333 KiB |

\* O SEO dos sites conceito perde pontos só por `is-crawlable`: eles têm `noindex` de propósito, para não competir com empresas reais.

Antes, a home pesava cerca de 27 MB (vídeo de fundo de 26,6 MB) e tinha erro de hidratação React em PT.

## Correções vindas do QA

- O axe apontou contraste insuficiente nos rótulos sobre o laranja e nomes acessíveis divergentes na marca e nas miniaturas. Os três foram corrigidos.
- A `/sites/` tinha 24px de rolagem horizontal em 390px, causada pela URL com `nowrap` na moldura do navegador. Corrigido com `minmax(0, 1fr)`.
- A odontologia tinha CLS de 0,129 por causa da troca de fonte. Com preload da fonte, o CLS foi a 0.
- O passo 2 de "Como funciona" tinha texto invisível (especificidade do seletor). Corrigido.
- As setas `↗` saíam como caixinha porque a fonte não tem o glyph. Viraram SVG.
- A chave de idioma divergia da `/startup/`. Agora as duas usam `lucaspadilha.locale`.
- `trailingSlash: 'always'` fazia o preview responder 404 para `/startup`. A opção foi removida.

## Limitações conhecidas

- A advocacia tem LCP de 3,3 s sob 4G lento simulado, por causa do Newsreader com eixo óptico (132 KB) e do itálico no h1. A troca pelo arquivo menor pioraria o título, e a nota fica em 92 (meta ≥ 90).
- O Chromium do Playwright não reproduz H.264. Como não há mais vídeo, isso não afeta nada.
- O `404.html` só é servido em produção se o Caddy tiver `handle_errors` configurado.

Capturas de página inteira (390 e 1440, todas as rotas) ficam em `../artifacts/site-v2/`, fora do repositório.

## Revisão final independente

Um revisor que não escreveu o código avaliou a branch inteira e não encontrou nada crítico. Os itens importantes e os reclassificados pelo efeito foram corrigidos, cada um com um teste que falhou antes da correção:

- **Deploy:** o SCP nunca apagava arquivos, e o mockup antigo continuaria público. Agora um passo por SSH remove, por caminho explícito, o que deixou de existir, e o healthcheck confirma o 404.
- **Textos públicos:** "nunca direto na main" não era verdade, porque a `main` não é protegida. O texto do pipeline e do ERP foi ajustado ao que o histórico comprova.
- **Idioma sem `localStorage`:** a escolha de EN não sobrevivia ao reload. O `?lang` agora só sai da URL quando a preferência foi salva, e os outros parâmetros (`utm_*`, `ref`) são preservados.
- **WhatsApp:** configurar o número quebraria o CI. O número agora é sanitizado, e os CTAs declaram o canal (`data-contact`).
- **Faixa dos sites conceito:** "empresa fictícia" passou a aparecer também no celular.
- **Café:** a faixa animada e o selo giravam sem parar (WCAG 2.2.2). Agora são estáticos.
- **Créditos:** as miniaturas da `/sites/` ganharam linha de crédito das fotos do Commons (CC BY/BY-SA).
- **Advocacia:** ganhou o espaço para a inscrição na OAB/SP, e o FAQ deixou de citar formas de honorários.
- **Odontologia:** deixou de anunciar modalidades de pagamento (CFO).
- **Impressão / "Salvar como PDF":** saía em branco. Agora sai completo.
- **Menu do celular:** passou a fechar ao escolher uma seção e com Esc.
- **Recibo:** contava JSON-LD como JavaScript e repetia o total. Agora mede só o código executável e mostra o HTML à parte.
