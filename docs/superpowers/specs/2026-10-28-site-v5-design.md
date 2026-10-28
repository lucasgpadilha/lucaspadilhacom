# Site v5: o cenário completo e as partes dele

## Pedido do dono

- Não apresentar OCI/OKE como a única forma de trabalhar: falar em cloud e Kubernetes, deixar claro que a maior experiência é em OCI e que ele trabalha com qualquer cloud.
- Mostrar a arquitetura de cloud e de plataforma:
  - multicluster, com um cluster de gerenciamento e um cluster por ambiente;
  - compartments, NSGs e uma DRG organizando os peerings entre VCNs.
- Cobrir também:
  - CI/CD: Jenkins on-prem, GitHub Actions direto, ARC e ARC com jobs em virtual node pool;
  - SQL Server com Ansible e Terraform;
  - o ambiente para agentes de código;
  - a plataforma de observabilidade.
- O hero deve ser um cenário completo e interativo, e as seções seguintes, as partes desse cenário em detalhe.
- O site precisa fazer sentido para quem não conhece o dono: cada parte mostra a dor que resolve.
- Prova: 500+ serviços migrados para Kubernetes.

## O que a pesquisa indicou

Fontes: NN/g, guias de recrutamento para DevOps/SRE, páginas de consultorias como Container Solutions, Fairwinds, Truss e Duckbill, e o relatório DORA.

- **Hero:** o visitante decide nos primeiros ~10 s, e a maior parte da atenção fica na primeira tela.
  - Precisa de uma frase clara sobre quem ele é e o que resolve, e de dois caminhos ("tem um projeto?" e "contratando?").
  - O desenho apoia a frase, sem atrasá-la.
- **Seções:** todas na mesma ordem — a dor nas palavras de quem contrata → o que ele constrói → um número de prova → ferramentas.
- **Várias clouds:** dizer com honestidade a cloud principal e mostrar a equivalência dos recursos, em vez de alegar "todas as clouds".
- **Cenário anônimo:** é "uma plataforma de referência montada a partir de trabalhos reais". O detalhe aparece por demanda (divulgação progressiva).
- **Evitar:** parede de logos, barras de habilidade, cards idênticos, animação que segura o título e números impossíveis de verificar.

## Estrutura

1. **Hero (`Scenario.astro`):**
   - título "Plataformas de nuvem que o seu time consegue operar.";
   - apresentação com mais de quatro anos em TI, maior experiência em OCI, também AWS e Azure;
   - botões "Tem um projeto? Fale comigo" (e-mail) e "Contratando? LinkedIn";
   - prova em lista: 4+ anos, 500+ serviços, 10 → 258 workloads, 1.100+ hosts, 26–30% mapeados.
2. **Mapa interativo do hero:**
   - quatro redes (MGMT, DEV, HML, PROD) em volta de um hub, com compartments;
   - clusters em cada rede; no MGMT, Argo CD, observabilidade e runners ARC num virtual pool;
   - o pipeline de fora da cloud até o Argo CD;
   - linhas de GitOps e de telemetria;
   - SQL Server em PROD, agentes de IA em DEV, VMs com Docker migrando e o custo.
3. **Legenda do mapa:** tem 8 partes, cada uma um `<details>` com a dor, o que ele constrói e o link "Ver como". Abrir uma parte acende essa parte no mapa e apaga o resto; clicar no mapa abre a parte correspondente. No celular, o mapa fica fixo enquanto a legenda rola.
4. **Seções, cada uma com a dor no topo (`Chapter.pain`):**
   - Arquitetura de cloud e rede (`#cloud`): hub-and-spoke e tabela OCI/AWS/Azure;
   - Kubernetes multicluster (`#platform`): alternador "um cluster para tudo × MGMT + um por ambiente";
   - Migração de Docker para Kubernetes (`#kubernetes`);
   - Entrega contínua e DevSecOps (`#delivery`): a animação do deploy;
   - FinOps (`#finops`);
   - "O que mantém tudo de pé": observabilidade (`#observability`), bancos (`#data`) e automação com agentes de IA (`#automation`), em blocos compactos;
   - Como eu trabalho (`#how`).
5. **Zona de papel:** sites e marketing, e contato.

## Regras mantidas

- Sem nomes de empregadores, valores em R$ de fatura, nomes internos ou datas.
- Cada animação dura no máximo 5 s, para e respeita o movimento reduzido.
- Sem JS, o conteúdo aparece pronto, e a legenda funciona como `<details>` nativo.
- Os nomes de `@keyframes` levam um prefixo por componente.
- Orçamento de altura em 1440: ≤ 8.000 px.
