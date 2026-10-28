// Everything the /sites/ showcase says about the offer lives here.

export const contact = {
  email: 'lucasgpadilhatec@gmail.com',
  /** Digits only with country code, e.g. '5519999999999'. While null, CTAs fall back to e-mail. */
  whatsapp: null as string | null,
};

const SUBJECT = 'Quero uma prévia do meu site';

/** Contact link for a CTA: WhatsApp when configured, otherwise e-mail with the subject filled in. */
export function contactHref(message: string): string {
  if (contact.whatsapp) return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  return `mailto:${contact.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(message)}`;
}

export const contactLabel = contact.whatsapp ? 'Chamar no WhatsApp' : 'Pedir por e-mail';

export const defaultMessage =
  'Olá, Lucas! Tenho um negócio e quero uma prévia do meu site.\n\nNome do negócio:\nCidade:\nO que vendemos ou fazemos:\nJá temos site ou Instagram? (link):\n';

export const hero = {
  kicker: 'Sites para pequenos negócios · Lucas Padilha',
  title: 'Sites rápidos e bonitos para negócios que querem ser encontrados.',
  lede: 'Eu desenho, construo, publico e cuido do seu site. E você vê a prévia funcionando antes de fechar.',
  primary: 'Pedir minha prévia',
  secondary: 'Ver exemplos',
};

export interface Demo {
  slug: 'advocacia' | 'odontologia' | 'cafe';
  name: string;
  niche: string;
  summary: string;
  shows: string[];
}

export const demos: Demo[] = [
  {
    slug: 'advocacia',
    name: 'Lacerda & Viana Advocacia',
    niche: 'Advocacia',
    summary: 'Sóbrio e editorial, para transmitir confiança sem exagero.',
    shows: ['Áreas de atuação claras', 'Como funciona a primeira conversa', 'Texto dentro das regras da OAB'],
  },
  {
    slug: 'odontologia',
    name: 'Aurora Odontologia',
    niche: 'Clínica odontológica',
    summary: 'Claro e acolhedor, para quem tem receio de dentista.',
    shows: ['Tratamentos explicados sem jargão', 'Agendamento em destaque', 'Dentro das regras do CFO'],
  },
  {
    slug: 'cafe',
    name: 'Casa Jabuticaba',
    niche: 'Café e padaria',
    summary: 'Quente e apetitoso, com cardápio e encomendas.',
    shows: ['Cardápio com preços', 'Horário das fornadas', 'Encomenda de bolos'],
  },
];

export const reasons = [
  {
    title: 'Rápido de verdade',
    body: 'Medido, não prometido: o recibo nesta página mostra o peso e o tempo de carregamento no seu aparelho. Site leve não perde cliente esperando e conta pontos no Google.',
  },
  {
    title: 'Feito primeiro para o celular',
    body: 'É de lá que vem quase todo cliente de negócio local. O desenho começa na tela pequena e cresce até o computador.',
  },
  {
    title: 'WhatsApp e Google no lugar certo',
    body: 'Botão de WhatsApp com mensagem pronta, rota no mapa, horário de funcionamento e ajuda para configurar o Perfil da Empresa no Google.',
  },
  {
    title: 'Cuidado por quem opera servidores',
    body: 'Domínio, certificado HTTPS, backups e monitoramento ficam comigo. É o mesmo trabalho que eu faço em sistemas de produção.',
  },
];

export const steps = [
  { title: 'Conversa', body: 'Uns 15 minutos para entender o seu negócio, seus clientes e o que você quer que o site faça.' },
  { title: 'Prévia', body: 'Eu monto uma prévia funcionando, com a sua marca e os seus textos, e mando o link.' },
  { title: 'Ajustes', body: 'Você mostra para quem quiser, pede mudanças e só fecha se gostar.' },
  { title: 'No ar', body: 'Publico no seu domínio, com HTTPS, e deixo tudo pronto para o Google encontrar.' },
  { title: 'Cuidado', body: 'Se quiser, eu sigo cuidando: atualizações, backups e pequenas alterações todo mês.' },
];

/** Suggested prices from the Figma strategy (tickets of R$500–1.200). Confirm before publishing. */
export const plans = [
  {
    name: 'Página única',
    from: 'a partir de',
    price: 'R$ 790',
    cadence: 'pagamento único',
    items: ['Uma página com até 6 seções', 'Botão de WhatsApp e rota no mapa', 'Pronto para celular e Google', 'Publicação no seu domínio'],
    pending: true,
  },
  {
    name: 'Site completo',
    from: 'a partir de',
    price: 'R$ 1.490',
    cadence: 'pagamento único',
    items: ['Até 5 páginas', 'SEO local e Perfil da Empresa no Google', 'Galeria, cardápio ou lista de serviços', 'Estatísticas de visita sem rastreadores invasivos'],
    pending: true,
    featured: true,
  },
  {
    name: 'Cuidado mensal',
    from: '',
    price: 'R$ 89',
    cadence: 'por mês',
    items: ['Hospedagem, domínio e HTTPS', 'Backups e monitoramento', 'Pequenas alterações todo mês', 'Atendimento direto comigo'],
    pending: true,
  },
];

export const faq = [
  {
    q: 'Preciso já ter domínio?',
    a: 'Não. Se você ainda não tem, eu ajudo a registrar o seu .com.br no seu nome. O domínio é sempre seu.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'A prévia fica pronta poucos dias depois da nossa conversa. Com os ajustes aprovados, publicar é rápido.',
  },
  {
    q: 'E se eu não gostar da prévia?',
    a: 'Você só fecha se gostar. A prévia existe justamente para você decidir com o site na mão, e não por uma promessa.',
  },
  {
    q: 'Posso pedir alterações depois que o site estiver no ar?',
    a: 'Pode. No cuidado mensal, pequenas alterações já estão incluídas. Fora dele, combinamos cada pedido.',
  },
  {
    q: 'Onde o site fica hospedado?',
    a: 'Num servidor que eu mesmo administro, com HTTPS, backup e monitoramento. Se um dia você preferir outra hospedagem, eu entrego tudo.',
  },
  {
    q: 'Os sites de exemplo são de empresas reais?',
    a: 'Não. São sites conceito de empresas fictícias, feitos para mostrar o que dá para construir para o seu negócio.',
  },
];
