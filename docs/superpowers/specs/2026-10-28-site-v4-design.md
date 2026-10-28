# Site v4: a home como sala de controle

## 1. Por que refazer

O dono achou a v3 superficial. Diagnóstico, com capturas em 1440 e 390:

- O hero fala do próprio site (o "recibo de build"), não do trabalho do dono. A primeira peça forte, a cena da migração, só aparece depois da rolagem.
- Os títulos de seção têm cerca de 90 px e quase nenhum conteúdo por tela. A home mede 10.300 px no desktop.
- As habilidades centrais do dono são DevSecOps, cloud OCI, migração para Kubernetes, Argo CD, Terraform e FinOps. Elas aparecem como listas de texto, sem mostrar como ele trabalha.

O dono pediu:
- uma animação de deploy automatizado DevSecOps, uma de cloud engineering e uma de FinOps;
- um hero bonito e impactante desde o primeiro quadro;
- métricas citadas discretamente, como prova;
- cuidado com tamanhos e com espaço mal aproveitado.

## 2. Decisões

Tomadas sem perguntar, conforme a preferência do dono. Ver a memória "autonomia".

1. **A página começa escura.** A parte de engenharia (hero, Kubernetes, cloud, FinOps, operação) é noite desde o primeiro pixel, com fundo quase preto quente, traço papel e sinal laranja. A parte de negócio (sites, marketing e contato) é papel. É a v3 invertida: "a noite que vira papel". As zonas são fixas no HTML e só o header acompanha a rolagem, de modo que nada depende de JS para ter contraste.
2. **Uma linguagem visual para as quatro peças:** desenho técnico isométrico em traço fino, sem gradiente nem brilho.
   - O hero, a cloud e o FinOps são SVG gerado no build por `src/lib/iso.ts`, com projeção isométrica de 30°, e animado por CSS.
   - A migração continua em Three.js, com a mesma câmera isométrica.
3. **Animação por CSS e não por GSAP nas peças novas.**
   - Começa no primeiro paint, sem esperar o JS.
   - Não custa TBT.
   - Sem JS, o SVG já está no estado final.
   - Cada peça roda uma vez, em no máximo 5 s (WCAG 2.2.2), e para. Botões permitem rodar de novo.
   - `prefers-reduced-motion` mostra só o estado final.
4. **Rótulos em HTML sobre o SVG**, posicionados em % a partir da projeção. O texto fica legível no celular, com tamanho fixo, enquanto o desenho escala.
5. **Métricas como legenda:** números pequenos, junto do elemento que provam. Nada de fileira de números grandes.
6. **Ferramentas no contexto:** cada peça lista as ferramentas que usa, e a seção "Ferramentas" sai.
7. **Densidade:**
   - h2 com no máximo 44 px e h1 com no máximo 68 px;
   - padding de seção entre 64 e 96 px;
   - meta de altura da home em 1440: ≤ 7.000 px.

## 3. Estrutura da home (EN e PT)

| # | Seção | Zona | Peça |
|---|---|---|---|
| 1 | Hero: "Do commit ao cluster, sem passo manual." | noite | Pipeline DevSecOps isométrico |
| 2 | Kubernetes: de cinco VMs a um cluster | noite | Cena Three.js existente, reduzida a 3 passos |
| 3 | Cloud: rede e clusters como código | noite | Topologia OCI montada em ordem de dependência + rota da telemetria |
| 4 | FinOps: a conta, de baixo para cima | noite | Grade de requests vs. p95 + resultados |
| 5 | Operação em escala | noite | Tabela densa: número, o quê, como |
| 6 | Sites e marketing | papel | Miniaturas dos 3 demos, preços "a partir de", marketing |
| 7 | Projetos, sobre e contato | papel | Lista compacta e e-mail |

Navegação: Entrega · Kubernetes · Cloud · FinOps · Sites · Contato. O CTA "Quero um site" fica.

## 4. Peças

### 4.1 Hero: pipeline DevSecOps

- **Layout:**
  - Desktop: a cópia ocupa cerca de 5/12 à esquerda, e a cena, 7/12, sangra até a borda direita. Tudo cabe em 1440×900.
  - Celular: título, cena e lede, com a cena dentro da primeira tela.
- **Estágios** (a cena sobe da esquerda para a direita):
  1. commit;
  2. CI em runner self-hosted no OKE (testes, validação de IaC, build);
  3. portão de política (Kyverno) e segredos (External Secrets ← Vault);
  4. registry (OCIR);
  5. Argo CD (Image Updater, sync window);
  6. cluster OKE com pods em rolling update.
- **Rodada limpa:** o pacote atravessa a pipeline, cada estágio acende e os pods antigos viram novos um a um. O log termina em "Synced · Healthy".
- **Rodada bloqueada** (botão "Simular violação de política"): o pacote para no portão, o portão fica hachurado, o log diz que o Kyverno barrou um container rodando como root, e o cluster não muda.
- **Legendas discretas:** "111 arquivos de teste · 4 suítes de IaC" no CI, "73 apps" no Argo CD e "258 workloads" no cluster.
- **Cópia:** a lede cita, em prosa, a migração de ~250 serviços em três semanas e os 26–30% de economia em compute mapeados. Um link secundário leva aos sites.
- **Acessibilidade:** a figura tem uma descrição em lista ordenada (estágios e ferramentas), visualmente oculta. O desenho é `aria-hidden`.

### 4.2 Kubernetes

A cena Three.js da v3 fica com só 3 passos: VMs, migração em fases e VMs desligadas. FinOps e rede viraram peças próprias. A rolagem fixada cai de cerca de 4.000 px para cerca de 2.000 px. Legendas: 10 → 258 workloads, 234 registros de service discovery e 12 serviços de plataforma (Kafka, MongoDB, MinIO, Consul, Sentry, Strapi + PostgreSQL 17).

### 4.3 Cloud

- **Montagem:** ao entrar na tela, a topologia monta em ordem de dependência, como num `terraform apply`. A ordem é região → VCN → sub-redes pública e privada → NAT com IP reservado, DRG → WAF + NLB público, NLB interno → clusters OKE PROD e MGMT com node pools → KMS. Ao lado, um log curto mostra os tipos de recurso reais do provider OCI.
- **Rota da telemetria:** é um alternador com dois estados.
  - "Antes": os pontos saem do cluster pela NAT, voltam pela internet e passam pelo NLB público e pelo WAF.
  - "Depois": seguem pelo NLB interno.
  - Legenda: "87% de ~380 mil envios por dia faziam a volta pela internet".
- **Ferramentas:** Terraform, OCI (VCN, DRG, NSG, NAT, NLB, WAF, KMS, IAM, tags de custo), OKE e Cluster Autoscaler.

### 4.4 FinOps

- **Peça principal:** uma grade de 128 células, em que cada célula é 0,1 core e o total são os 12,8 cores pedidos.
  - Primeiro aparece o contorno do pedido.
  - Depois acendem as cerca de 9 células do uso real no p95 (0,86).
  - Por fim, o rightsizing recolhe o contorno para perto do uso.
- **Achados e resultados** em barras pequenas normalizadas, com "antes" igual a 100:
  - VM −84%;
  - cluster legado −63%;
  - 26–30% de compute mapeado;
  - backups ≈ 28% da fatura;
  - 2 servidores com 86% do egress.
- **Regra:** só números do currículo, nenhum valor em R$.

### 4.5 Operação em escala

Tabela compacta com as colunas número, o quê e como:
- 1.100+ hosts Linux (AWX, Uyuni, FOG, FreeIPA);
- 230+ filiais provisionadas;
- 300+ access points via API do Zabbix;
- FreeIPA ↔ AD;
- Kubernetes do dia 0 ao dia 2 (OKE, Rancher);
- serviços de plataforma (Harbor, Traefik, cert-manager, Vault/Infisical, HAProxy);
- CI (GitHub Actions self-hosted, GitLab CI, Jenkins);
- SQL Server 2022 → 2025 preparado;
- automações Python/n8n;
- ~60 tickets com registro e handoff, além de AGENTS.md e skills.

## 5. Regras mantidas da v3

- Sem empregadores, valores em R$, nomes internos ou datas de incidente. O contato é `ceo@lucaspadilha.com`.
- Sem eyebrows, numeração de seção, texto em gradiente, glass decorativo, borda lateral colorida ou emoji.
- Sem JS, o conteúdo e os desenhos ficam visíveis. Three.js nunca entra no carregamento inicial.
- `/sites/`, os demos e `/startup/` não mudam nesta versão.

## 6. Critérios de aceite

- `npm run test:site` e `test:startup` verdes. Testes novos:
  - as três peças isométricas existem no HTML sem JS;
  - cada animação para em ≤ 5 s (dois screenshots iguais após 5,5 s);
  - a rodada bloqueada muda o log e não muda o cluster;
  - o alternador da telemetria troca o estado;
  - movimento reduzido mostra o estado final;
  - a home em 1440 mede ≤ 7.000 px;
  - o h2 tem ≤ 44 px.
- Lighthouse mobile: home ≥ 95 e `/sites/` ≥ 95.
- axe sem violações nas duas homes.
- Revisão independente antes do PR. Merge e deploy só com o ok do dono.
