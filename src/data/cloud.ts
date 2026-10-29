import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Cloud chapter: a landing zone by compartments, one network per environment around a
// DRG hub, all in Terraform, and the telemetry route that moved inside the network. The
// drawing is the OCI build; the table shows the same design on AWS and Azure. Same
// public-site rule as home.ts: no employers, hostnames, repositories, amounts or dates.

export const cloud = {
  title: { en: 'Cloud and network architecture', pt: 'Arquitetura de cloud e rede' } satisfies L,
  pain: {
    en: 'Every environment was built by hand and nobody knows what talks to what.',
    pt: 'Cada ambiente foi criado na mão e ninguém sabe o que fala com o quê.',
  } satisfies L,
  lede: {
    en: 'I design the landing zone by compartments: one network per environment around a hub, firewall rules per role, and all of it in Terraform, reviewed before apply.',
    pt: 'Desenho a landing zone por compartimentos: uma rede por ambiente em volta de um hub, regras de firewall por papel e tudo em Terraform, revisado antes do apply.',
  } satisfies L,
  body: {
    en: 'On OCI I designed and built the whole network of the multi-cluster compartments: a management cluster (MGMT) plus one per environment (dev, staging, prod), every NSG, and a DRG that organizes the peering between the VCNs. NAT with a reserved IP, public and internal load balancers, WAF, Cluster Autoscaler, KMS, IAM, cost tags and backup policies live in the same code.',
    pt: 'Na OCI, desenhei e implementei toda a rede dos compartimentos multi-cluster: um cluster de gestão (MGMT) e um por ambiente (dev, homologação, prod), todas as NSGs e um DRG que organiza o peering entre as VCNs. NAT com IP reservado, load balancers público e interno, WAF, Cluster Autoscaler, KMS, IAM, tags de custo e políticas de backup ficam no mesmo código.',
  } satisfies L,
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: {
    en: ['Terraform', 'OCI', 'AWS', 'Azure', 'VCN/VPC/VNet', 'DRG', 'NSG', 'NAT', 'WAF', 'load balancers', 'KMS', 'IAM', 'cost tags'],
    pt: ['Terraform', 'OCI', 'AWS', 'Azure', 'VCN/VPC/VNet', 'DRG', 'NSG', 'NAT', 'WAF', 'load balancers', 'KMS', 'IAM', 'tags de custo'],
  } satisfies Localized<string[]>,
  facts: [
    {
      value: '87%',
      text: {
        en: 'of about 380 thousand telemetry sends a day taken off the public path',
        pt: 'de cerca de 380 mil envios de telemetria por dia saíram da rota pública',
      },
    },
    {
      value: '1',
      text: { en: 'DRG at the center organizes the peering between the VCNs', pt: 'DRG no centro organiza o peering entre as VCNs' },
    },
    {
      value: '4',
      text: { en: 'automated static validation suites for the Terraform', pt: 'suítes automatizadas de validação estática do Terraform' },
    },
  ] satisfies { value: string; text: L }[],

  figure: {
    en: 'An OCI landing zone assembled by terraform apply in dependency order: a DRG at the hub, one VCN per environment, and the route telemetry takes to its collector',
    pt: 'Uma landing zone na OCI montada por terraform apply em ordem de dependência: um DRG no centro, uma VCN por ambiente e a rota da telemetria até o coletor',
  } satisfies L,
  // Drawing labels, keyed by the piece they name. `prefix` and `detail` are dropped on phones.
  pieces: [
    { key: 'compartments', name: { en: 'Compartments', pt: 'Compartimentos' }, detail: { en: 'IAM · cost tags · backup', pt: 'IAM · tags de custo · backup' } },
    { key: 'prod', prefix: 'VCN', name: { en: 'PROD', pt: 'PROD' }, detail: { en: 'OKE · Cluster Autoscaler', pt: 'OKE · Cluster Autoscaler' } },
    { key: 'hml', prefix: 'VCN', name: { en: 'STG', pt: 'HML' }, detail: { en: 'staging', pt: 'homologação' } },
    { key: 'dev', prefix: 'VCN', name: { en: 'DEV', pt: 'DEV' } },
    { key: 'mgmt', prefix: 'VCN', name: { en: 'MGMT', pt: 'MGMT' }, detail: { en: 'management cluster', pt: 'cluster de gestão' } },
    { key: 'drg', name: { en: 'DRG', pt: 'DRG' }, detail: { en: 'VCN hub', pt: 'hub das VCNs' } },
    { key: 'internet', name: { en: 'Internet', pt: 'Internet' } },
    { key: 'nat', name: { en: 'NAT', pt: 'NAT' }, detail: { en: 'reserved IP', pt: 'IP reservado' } },
    { key: 'waf', name: { en: 'WAF', pt: 'WAF' } },
    { key: 'pnlb', name: { en: 'Public NLB', pt: 'NLB público' } },
    { key: 'inlb', name: { en: 'Internal NLB', pt: 'NLB interno' } },
    { key: 'kms', name: { en: 'KMS vault', pt: 'Vault do KMS' }, detail: { en: 'encryption keys', pt: 'chaves de criptografia' } },
    { key: 'collector', name: { en: 'Telemetry collector', pt: 'Coletor de telemetria' } },
  ] satisfies { key: string; prefix?: string; name: L; detail?: L }[],

  // Real resource types of the OCI Terraform provider, in the order the drawing builds.
  log: [
    'oci_identity_compartment',
    'oci_core_vcn',
    'oci_core_subnet',
    'oci_core_network_security_group',
    'oci_core_drg',
    'oci_core_drg_attachment',
    'oci_core_nat_gateway',
    'oci_network_load_balancer_network_load_balancer',
    'oci_waf_web_app_firewall',
    'oci_kms_vault',
    'oci_containerengine_cluster',
    'oci_containerengine_node_pool',
  ],
  logDone: 'Apply complete.',

  route: {
    label: { en: 'Telemetry route', pt: 'Rota da telemetria' },
    before: { en: 'Before', pt: 'Antes' },
    after: { en: 'After', pt: 'Depois' },
  } satisfies Record<string, L>,
  status: {
    before: {
      en: '87% of about 380 thousand sends a day went out through NAT, round the internet, and back in through the WAF and the public load balancer.',
      pt: '87% de cerca de 380 mil envios por dia saíam pela NAT, davam a volta pela internet e voltavam pelo WAF e pelo load balancer público.',
    },
    after: {
      en: '87% of about 380 thousand sends a day took the round trip through the internet. Now they stay inside the network.',
      pt: '87% de cerca de 380 mil envios por dia faziam a volta pela internet. Agora seguem por dentro da rede.',
    },
  } satisfies Record<string, L>,

  // The same design on other clouds: only the resource names change.
  equivalence: {
    intro: {
      en: 'Most of my experience is on OCI; I have also worked with AWS and Azure (Entra ID and Microsoft 365). The design is the same, only the resource names change.',
      pt: 'Mais experiência em OCI; também AWS e Azure (Entra ID e Microsoft 365). O desenho é o mesmo, muda o nome do recurso.',
    },
    title: { en: 'The same design on other clouds', pt: 'O mesmo desenho em outras clouds' },
    piece: { en: 'Piece', pt: 'Peça' },
    clouds: ['OCI', 'AWS', 'Azure'],
    rows: [
      { piece: { en: 'Managed Kubernetes', pt: 'Kubernetes gerenciado' }, names: ['OKE', 'EKS', 'AKS'] },
      { piece: { en: 'Network', pt: 'Rede' }, names: ['VCN', 'VPC', 'VNet'] },
      { piece: { en: 'Network hub', pt: 'Hub de rede' }, names: ['DRG', 'Transit Gateway', 'Virtual WAN'] },
      { piece: { en: 'Instance firewall', pt: 'Firewall da instância' }, names: ['NSG', 'Security group', 'NSG'] },
      { piece: { en: 'Keys', pt: 'Chaves' }, names: ['Vault/KMS', 'KMS', 'Key Vault'] },
      { piece: { en: 'Identity', pt: 'Identidade' }, names: ['IAM', 'IAM', 'Entra ID'] },
    ],
  } satisfies { intro: L; title: L; piece: L; clouds: string[]; rows: { piece: L; names: string[] }[] },
};
