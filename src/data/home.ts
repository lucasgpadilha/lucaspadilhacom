import type { Localized } from '../lib/locale';

type L = Localized<string>;

export const meta = {
  title: {
    en: 'Lucas Padilha — DevOps engineer and web developer',
    pt: 'Lucas Padilha — engenheiro DevOps e desenvolvedor web',
  } satisfies L,
  description: {
    en: 'I build websites and the infrastructure that keeps them online: Terraform, Ansible, Docker, CI/CD and fast static sites. Based in Brazil.',
    pt: 'Construo sites e a infraestrutura que os mantém no ar: Terraform, Ansible, Docker, CI/CD e sites estáticos rápidos. No Brasil.',
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
  kicker: { en: 'DevOps · Cloud · Web — Brazil', pt: 'DevOps · Cloud · Web — Brasil' } satisfies L,
  title: {
    en: 'I build websites and the infrastructure that keeps them online.',
    pt: 'Construo sites e a infraestrutura que os mantém no ar.',
  } satisfies L,
  lede: {
    en: 'Terraform, Ansible, Docker and CI/CD pipelines on one side; fast, well-made websites on the other. Designed, shipped and maintained by the same person.',
    pt: 'Terraform, Ansible, Docker e pipelines de CI/CD de um lado; sites rápidos e bem-feitos do outro. Desenhados, publicados e mantidos pela mesma pessoa.',
  } satisfies L,
  primary: { en: 'See the work', pt: 'Ver o trabalho' } satisfies L,
  secondary: { en: 'I need a website', pt: 'Preciso de um site' } satisfies L,
};

export const sections = {
  work: {
    label: { en: '01 — Work', pt: '01 — Trabalho' } satisfies L,
    title: { en: 'Selected work', pt: 'Trabalho selecionado' } satisfies L,
  },
};
