// Everything the /sites/ showcase says about the offer lives here.

export const contact = {
  email: 'ceo@lucaspadilha.com',
  /** Digits only with country code, e.g. '5519999999999'. While null, CTAs fall back to e-mail. */
  whatsapp: null as string | null,
};

const SUBJECT = 'Quero uma prévia do meu site';

/** Digits of a usable Brazilian WhatsApp number (55 + DDD + number), or null. */
const whatsappDigits = () => {
  const digits = (contact.whatsapp ?? '').replace(/\D/g, '');
  return digits.length >= 12 && digits.length <= 13 ? digits : null;
};

/** Contact link for a CTA: WhatsApp when a valid number is configured, otherwise e-mail with the subject filled in. */
export function contactHref(message: string): string {
  const digits = whatsappDigits();
  if (digits) return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  return `mailto:${contact.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(message)}`;
}

/** Rendered as data-contact on every CTA so tests can check that they all agree. */
export const contactChannel: 'whatsapp' | 'email' = whatsappDigits() ? 'whatsapp' : 'email';

export const contactLabel = contactChannel === 'whatsapp' ? 'Chamar no WhatsApp' : 'Pedir por e-mail';

export const defaultMessage =
  'Olá, Lucas! Tenho um negócio e quero uma prévia do meu site.\n\nNome do negócio:\nCidade:\nO que vendemos ou fazemos:\nJá temos site ou Instagram? (link):\n';

export const hero = {
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

/** Reference prices set by the owner. */
export const plans = [
  {
    name: 'Página única',
    from: 'a partir de',
    price: 'R$ 470',
    cadence: 'pagamento único',
    items: ['Uma página com até 6 seções', 'Botão de WhatsApp e rota no mapa', 'Pronto para celular e Google', 'Publicação no seu domínio'],
  },
  {
    name: 'Site completo',
    from: 'a partir de',
    price: 'R$ 960',
    cadence: 'pagamento único',
    items: ['Até 5 páginas', 'SEO local e Perfil da Empresa no Google', 'Galeria, cardápio ou lista de serviços', 'Estatísticas de visita sem rastreadores invasivos'],
    featured: true,
  },
  {
    name: 'Cuidado mensal',
    from: 'a partir de',
    price: 'R$ 87',
    cadence: 'por mês',
    items: ['Hospedagem, domínio e HTTPS', 'Backups e monitoramento', 'Pequenas alterações todo mês', 'Atendimento direto comigo'],
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

export const marketing = {
  title: 'Marketing digital',
  lede: 'Site no ar é metade do caminho. A outra metade é gente chegando nele.',
  items: [
    { title: 'Instagram e redes sociais', body: 'Calendário, posts, stories e atendimento, no tom do seu negócio.' },
    { title: 'Tráfego pago', body: 'Campanhas no Meta, Google, TikTok e Kwai Ads, com orçamento que você controla.' },
    { title: 'TikTok Shop', body: 'Catálogo, vitrine e operação da loja dentro do TikTok.' },
    { title: 'Automação de conteúdo', body: 'Fluxos que preparam e agendam publicações para você postar com constância.' },
  ],
  note: 'Sob consulta, sozinho ou junto com o site.',
};
