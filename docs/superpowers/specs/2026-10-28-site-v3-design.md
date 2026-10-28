# Site v3: portfólio de infraestrutura em movimento (design)

Data: 2026-10-28 · Branch: `feat/site-v3` · Status: aprovado pelo dono em conversa

## 1. Entendimento

**O que o dono pediu.**
- Um site dinâmico e animado, com 3D, no nível das referências que ele trouxe.
- Um portfólio forte em infraestrutura/DevOps, além de sites.
- Experiência em marketing digital também aparece.
- O conteúdo vem do currículo e do resumo dos últimos meses.
- Os três sites conceito são refeitos com movimento e 3D.
- Contato: `ceo@lucaspadilha.com`.
- Preços: página única a partir de R$ 470, site completo a partir de R$ 960, cuidado mensal a partir de R$ 87.
- O mínimo possível de "AI slop".

**Restrições que ele fixou.**
- O site mostra **o que ele já fez**, nunca **onde** fez: nenhum empregador é citado, nem anonimizado como "empresa de ERP SaaS". Nomes de empresas ficam só no currículo, fora deste repositório público.
- Nada de valores internos de fatura, nomes de servidores, repositórios internos ou datas de incidente. Só números relativos (percentuais, contagens, antes/depois).
- Saem o Comboio Bruto, o card do ERP legado e o link da Nexora. A `/startup/` continua no ar, sem links e fora do sitemap.
- PyNOC, Floci, tuildap e MilKontrol ficam como elementos secundários.

**Critérios de sucesso.**
- Um recrutador de infraestrutura entende em segundos que ele migra, opera e barateia plataformas Kubernetes, e vê a prova.
- Um dono de negócio chega à vitrine em um clique.
- A animação conta a história real dele, não decora.
- Lighthouse mobile ≥ 90 na home e na vitrine e ≥ 85 nos demos, medido e reportado.
- A suíte de testes cobre o conteúdo novo, a troca de tema, a cena 3D, o fallback e a regra de movimento.

## 2. Direção escolhida: "papel que vira noite"

A página abre clara e editorial, com papel, tinta e o laranja de sinal da identidade atual. Ao entrar no capítulo de infraestrutura, ela "apaga a luz": o fundo vai para a noite e uma cena 3D fixa conta a migração. Ao sair, volta ao papel para sites, marketing e contato. Os dois públicos ganham dois climas.

Alternativas descartadas pelo dono: tudo claro em desenho técnico, que é mais leve e menos dramático, e tudo escuro cinematográfico, que é mais pesado e igual a todo mundo.

## 3. Regras de ofício (das skills Impeccable, Taste e GSAP)

- **Proibidos:**
  - rótulo/eyebrow acima de título;
  - numeração de seção que não carrega sequência real;
  - cards iguais de ícone + título + texto como estrutura;
  - template de "número gigante + label";
  - texto em gradiente;
  - vidro/blur decorativo;
  - borda lateral colorida;
  - monoespaçada como fantasia (só para dados e medições);
  - emoji ou glyph unicode no lugar de ícone.
- **Um momento autoral por página.** No portfólio é a migração. O resto do movimento só dá feedback, estado ou continuidade.
- **Animação:**
  - parte de um estado já visível;
  - usa easing de desaceleração (`cubic-bezier(0.16, 1, 0.3, 1)`);
  - a saída é mais rápida que a entrada;
  - sem bounce.
- **Movimento contínuo:** nada se move sozinho por mais de 5 s (WCAG 2.2.2). Animações ambientes param, ou só reagem a rolagem e cursor.
- **`prefers-reduced-motion`:** tira o movimento espacial e mantém mudanças de estado.
- **Superfícies do navegador:** seleção, foco, caret e scrollbar são tematizados.

## 4. Conteúdo do portfólio (`/` e `/pt/`)

Cada seção é uma afirmação com prova. A ordem segue o argumento.

1. **Abertura (papel).**
   - "Infraestrutura que aguenta produção. Sites que trazem cliente." (EN: "Infrastructure that holds up in production. Websites that bring in customers.")
   - Uma frase de apoio e dois botões: ver o trabalho de infraestrutura; quero um site.
   - O título é revelado linha a linha (SplitText) uma única vez.
2. **Capítulo noturno: a migração (momento autoral).** Uma cena fixa com texto em cinco passos:
   1. ~250 serviços espalhados em 5 VMs com Docker.
   2. Migrados em fases para Kubernetes gerenciado (OKE) via GitOps com Argo CD. O contador vai de 10 a 258 workloads em três semanas.
   3. As 5 VMs são desligadas ou esvaziadas.
   4. FinOps:
      - requests de CPU cerca de 15× acima do uso real (p95);
      - 26–30% de economia mapeada em compute;
      - custo de um cluster legado −62%;
      - uma VM −84%;
      - backups respondendo por cerca de 28% da conta.
   5. Rede e segurança como código: VCN, DRG, NSG, NAT com IP fixo, WAF, NLB e NetworkPolicies, em Terraform com validação estática.
3. **O que mais eu já fiz (noite).** Feitos sem empresa:
   - Padronizei mais de 1.100 hosts Linux com AWX, Uyuni, FOG e FreeIPA.
   - Automatizei o provisionamento de mais de 230 filiais.
   - Integrei FreeIPA ao Active Directory.
   - Coloquei mais de 300 access points em produção, com onboarding automático no Zabbix via API.
   - Operei clusters OKE e Rancher no dia 0 e no dia 2.
   - Mantive Harbor, Traefik, cert-manager, Vault/Infisical e HAProxy.
   - Otimizei pipelines GitLab CI e Jenkins.
   - Montei runners self-hosted do GitHub Actions dentro do cluster.
   - Automatizei com AWX acessos temporários e a sincronização de serviços com o Argo CD.
   - Migrei Kafka, MongoDB, MinIO, Consul e outros serviços com estado.
   - Tirei 87% do tráfego de telemetria (~380 mil envios/dia) da saída pública.
   - Conduzi uma migração de SQL Server 2022 → 2025 com runbook.
4. **Como eu trabalho (noite → papel).**
   - Runbooks com guarda de rollback, ADRs e cerca de 60 tickets conduzidos com registro e handoff.
   - Uma base de aprendizados que vira `AGENTS.md` e skills para o time e para agentes de IA.
   - Regras de produção: segredo nunca vaza, só se aplica plan conferido e produção é lida sem gerar carga.
5. **Stack (papel)**, agrupada:
   - cloud e plataforma;
   - GitOps e entrega;
   - segurança e segredos;
   - automação;
   - dados;
   - observabilidade;
   - redes e identidade.

   Só nomes, sem "evidência" em monoespaçada.
6. **Sites e marketing (papel).**
   - Sites: os três demos, com link para `/sites/`.
   - Marketing digital: gestão de Instagram e social media, tráfego pago (Meta, Google, TikTok e Kwai Ads), TikTok Shop e automação de conteúdo. Sem métricas inventadas.
7. **Projetos paralelos:** PyNOC, Floci Cloud Lab, tuildap e MilKontrol, uma linha cada.
8. **Formação e idiomas:** Tecnólogo em Análise e Desenvolvimento de Sistemas pela UTFPR (2023–2026); português nativo; inglês intermediário-avançado.
9. **Contato:** `ceo@lucaspadilha.com`, LinkedIn e GitHub.

## 5. A cena da migração (técnica)

- **Three.js** (`three@0.186`), carregado com `import()` quando o capítulo chega a meia tela da viewport. Nunca entra no carregamento inicial.
- **Geometria:**
  - 5 blocos de VM;
  - cerca de 250 contêineres em um único `InstancedMesh`;
  - um cluster de node pools em grade hexagonal;
  - linhas de borda (`EdgesGeometry`) no estilo desenho técnico, em tinta clara sobre a noite, com contêineres no laranja de sinal.
- **Estado:**
  - Um único valor de progresso de 0 a 1, vindo do ScrollTrigger (`scrub`), define tudo de forma determinística.
  - Cada contêiner tem atraso e trajetória próprios; a posição é interpolada pelo progresso.
  - O contador e os passos de texto leem o mesmo progresso.
- **Custo:**
  - renderiza só quando o progresso ou o tamanho mudam (render sob demanda), sem loop contínuo;
  - devicePixelRatio ≤ 1,5 (≤ 1 em telas pequenas);
  - pausa fora da tela;
  - descarta os recursos ao sair.
- **Fallback:** sem WebGL, com `prefers-reduced-motion`, com `Save-Data` ou se o import falhar, entra um SVG com os mesmos estados, trocado por passo. O texto é HTML real em todos os casos, e o canvas é `aria-hidden`.
- **Runtime compartilhado:** `src/lib/three/` com `mountScene()`, que cuida de lazy-load, detecção de capacidade, render sob demanda, pausa e descarte. Os demos usam o mesmo runtime.

## 6. Movimento de apoio

- **Troca de tema papel ↔ noite**, por ScrollTrigger na entrada e na saída do capítulo, com transição de 500 ms nas cores. Os tokens já existem; entra um modo `night`.
- **Título da abertura** revelado por linha com SplitText. O conteúdo fica visível sem JS.
- **Transições entre páginas** com CSS `@view-transition { navigation: auto; }`, sem JS. Navegadores sem suporte simplesmente navegam.
- **Rolagem nativa.** Sem bibliotecas de smooth scroll.
- **GSAP** (`gsap@3.15`, incluindo ScrollTrigger e SplitText, gratuitos) entra só nas páginas que o usam, em módulos separados.

## 7. Vitrine `/sites/`

- **Preços:** página única a partir de R$ 470, site completo a partir de R$ 960, cuidado mensal a partir de R$ 87.
- **Contato:** `ceo@lucaspadilha.com`, mantendo a lógica de WhatsApp opcional.
- **Nova seção "Marketing digital", sob consulta:** Instagram e social media, tráfego pago, TikTok Shop e automação de conteúdo.
- **Exemplos:** cada demo ganha uma prévia em vídeo curto (WebM, cerca de 6 s), gravada do próprio site com Playwright, com poster e `preload="none"`. Toca quando visível e sem movimento reduzido, para depois de uma volta e tem botão de pausar/tocar.
- **Fora da vitrine:** remover rótulos e numerações proibidos.

## 8. Sites conceito refeitos

Os negócios fictícios continuam os mesmos e ganham um momento autoral cada, usando o runtime compartilhado. Todos têm fallback estático e respeitam a regra dos 5 s.

- **Advocacia (Lacerda & Viana):** um shader WebGL de tinta se espalhando na água, em tinta sobre marfim, atrás do título. O movimento acontece na entrada (≤ 5 s) e depois só reage a cursor e rolagem. O texto é revelado por linha.
- **Odontologia (Aurora):** uma arcada 3D de dentes procedurais, desalinhados no início, que se alinham conforme a rolagem (a metáfora do alinhador), em luz de estúdio suave sobre menta.
- **Café (Casa Jabuticaba):** pães de queijo 3D procedurais, com esfera deslocada por ruído e shader de casca dourada, que "crescem" na rolagem, mais vapor sobre o café ligado à rolagem.

Valem as regras de conteúdo da v2: empresa fictícia, `noindex`, sem telefone nem endereço numerado, sem depoimentos, e regras da OAB e do CFO. Orçamento por demo: até 450 KB sem imagens, incluindo o Three.js.

## 9. Currículo (fora deste repositório)

Pasta `/data/projects/lucaspadilha/curriculo/`:
- `cv-pt.md` e `cv-en.md`, com as empresas pelo nome;
- `linkedin-pt.md` e `linkedin-en.md`, com título, Sobre e experiências prontos para colar;
- `build.mjs`, que transforma o Markdown em PDF via Playwright, compatível com ATS: coluna única, títulos padrão, texto real e selecionável, sem tabelas nem colunas, fonte embutida e metadados no PDF;
- um `README.md` com o comando.

## 10. Verificação

- `test:site` passa a cobrir:
  - ausência de Comboio, ERP, Nexora e nomes de empresas;
  - `ceo@` como contato;
  - os preços novos;
  - a troca de tema na rolagem;
  - o canvas da cena criado com WebGL;
  - o fallback SVG sob movimento reduzido;
  - que nada se move sozinho depois de 5 s (amostragem de quadros);
  - a ausência de rótulos/eyebrows e de numeração de seção;
  - os mesmos checks da v2.
- `test:startup` continua passando.
- Lighthouse mobile em todas as rotas, e capturas visuais em 390 e 1440 com ciclos de correção.
