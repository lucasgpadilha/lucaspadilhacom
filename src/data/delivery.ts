import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Delivery chapter: the path from commit to cluster. Capability first; numbers as proof.

export const delivery = {
  title: { en: 'Continuous delivery and DevSecOps', pt: 'Entrega contínua e DevSecOps' } satisfies L,
  pain: {
    en: 'Only one person knows how to deploy, and the runner queue stalls the team.',
    pt: 'Só uma pessoa sabe fazer deploy, e a fila de runner trava o time.',
  } satisfies L,
  lede: {
    en: 'I build the path from commit to production with no manual steps: CI with tests and IaC validation, policies and secrets on the way, and Argo CD delivering to the cluster.',
    pt: 'Monto o caminho do commit até produção sem passo manual: CI com testes e validação de IaC, políticas e segredos no meio do caminho e o Argo CD entregando no cluster.',
  } satisfies L,
  body: {
    en: 'GitHub Actions straight on GitHub or on ARC runners inside Kubernetes, with CI jobs sent to a virtual node pool so the queue scales with demand; Jenkins on-prem and GitLab CI where that is what the team runs.',
    pt: 'GitHub Actions direto no GitHub ou em runners ARC dentro do Kubernetes, com os jobs de CI indo para um virtual node pool e a fila crescendo conforme a demanda; Jenkins on-prem e GitLab CI quando é o que o time usa.',
  } satisfies L,
  facts: [
    { value: '~880', text: { en: 'commits over 12 repositories in 4 months, with tests and static validation', pt: 'commits em 12 repositórios em 4 meses, com testes e validação estática' } },
  ] satisfies { value: string; text: L }[],
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: ['GitHub Actions', 'ARC', 'Jenkins', 'GitLab CI', 'Argo CD', 'Image Updater', 'Helm', 'Kyverno', 'External Secrets', 'Vault', 'Harbor', 'OCIR'],
};
