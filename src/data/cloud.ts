import type { Localized } from '../lib/locale';

type L = Localized<string>;

// Cloud chapter: the OCI network and the OKE clusters, built in Terraform, and the
// telemetry route that moved inside the network. Same public-site rule as home.ts:
// no employers, hostnames, repositories, bill amounts or incident dates.

export const cloud = {
  title: { en: 'Network and clusters as code', pt: 'Rede e clusters como código' } satisfies L,
  lede: {
    en: 'I designed the OKE clusters on Oracle Cloud and provisioned them in Terraform, from the VCN to the keys, with static validation before anything applies.',
    pt: 'Desenhei os clusters OKE na Oracle Cloud e provisionei tudo em Terraform, da VCN às chaves, com validação estática antes de qualquer apply.',
  } satisfies L,
  body: {
    en: 'VCNs, DRG, NSGs, NAT with a reserved IP, public and internal NLBs, WAF, Cluster Autoscaler, KMS and IAM live in the same code, along with cost tags and backup policies. Then I moved telemetry onto the internal network.',
    pt: 'VCNs, DRG, NSGs, NAT com IP reservado, NLB público e interno, WAF, Cluster Autoscaler, KMS e IAM vivem no mesmo código, junto com tags de custo e políticas de backup. Depois, levei a telemetria para a rede interna.',
  } satisfies L,
  toolsLabel: { en: 'Tools', pt: 'Ferramentas' } satisfies L,
  tools: {
    en: ['OCI', 'Terraform', 'OKE', 'VCN', 'DRG', 'NSG', 'NAT', 'NLB', 'WAF', 'KMS', 'IAM', 'Cluster Autoscaler', 'cost tags'],
    pt: ['OCI', 'Terraform', 'OKE', 'VCN', 'DRG', 'NSG', 'NAT', 'NLB', 'WAF', 'KMS', 'IAM', 'Cluster Autoscaler', 'tags de custo'],
  } satisfies Localized<string[]>,
  facts: [
    {
      value: '87%',
      text: {
        en: 'of about 380 thousand telemetry sends a day taken off the public path',
        pt: 'de cerca de 380 mil envios de telemetria por dia saíram da rota pública',
      },
    },
    { value: '2', text: { en: 'OKE clusters, PROD and MGMT, in Terraform', pt: 'clusters OKE, PROD e MGMT, em Terraform' } },
    {
      value: '4',
      text: { en: 'automated IaC validation suites', pt: 'suítes automatizadas de validação de IaC' },
    },
  ] satisfies { value: string; text: L }[],

  figure: {
    en: 'An OCI network assembled by terraform apply in dependency order, and the route telemetry takes to its collector',
    pt: 'Uma rede na OCI montada por terraform apply em ordem de dependência, e a rota da telemetria até o coletor',
  } satisfies L,
  // Drawing labels, keyed by the piece they name. `detail` is dropped on phones.
  pieces: [
    { key: 'region', name: { en: 'OCI region', pt: 'Região OCI' }, detail: { en: 'IAM · cost tags · backup policies', pt: 'IAM · tags de custo · políticas de backup' } },
    { key: 'vcn', name: { en: 'VCN', pt: 'VCN' }, detail: { en: 'subnets and NSGs', pt: 'sub-redes e NSGs' } },
    { key: 'public', name: { en: 'Public subnet', pt: 'Sub-rede pública' } },
    { key: 'private', name: { en: 'Private subnet', pt: 'Sub-rede privada' } },
    { key: 'internet', name: { en: 'Internet', pt: 'Internet' } },
    { key: 'nat', name: { en: 'NAT gateway', pt: 'Gateway NAT' }, detail: { en: 'reserved IP', pt: 'IP reservado' } },
    { key: 'drg', name: { en: 'DRG', pt: 'DRG' }, detail: { en: 'to other networks', pt: 'para outras redes' } },
    { key: 'waf', name: { en: 'WAF', pt: 'WAF' } },
    { key: 'pnlb', name: { en: 'Public NLB', pt: 'NLB público' } },
    { key: 'inlb', name: { en: 'Internal NLB', pt: 'NLB interno' } },
    { key: 'prod', name: { en: 'OKE PROD', pt: 'OKE PROD' }, detail: { en: 'node pools · Cluster Autoscaler', pt: 'node pools · Cluster Autoscaler' } },
    { key: 'mgmt', name: { en: 'OKE MGMT', pt: 'OKE MGMT' } },
    { key: 'kms', name: { en: 'KMS vault', pt: 'Vault do KMS' }, detail: { en: 'encryption keys', pt: 'chaves de criptografia' } },
    { key: 'collector', name: { en: 'Telemetry collector', pt: 'Coletor de telemetria' } },
  ] satisfies { key: string; name: L; detail?: L }[],

  // Real resource types of the OCI Terraform provider, in the order the drawing builds.
  log: [
    'oci_core_vcn',
    'oci_core_subnet',
    'oci_core_nat_gateway',
    'oci_core_drg',
    'oci_core_network_security_group',
    'oci_network_load_balancer_network_load_balancer',
    'oci_waf_web_app_firewall',
    'oci_containerengine_cluster',
    'oci_containerengine_node_pool',
    'oci_kms_vault',
  ],
  logDone: 'Apply complete.',

  route: {
    label: { en: 'Telemetry route', pt: 'Rota da telemetria' },
    before: { en: 'Before', pt: 'Antes' },
    after: { en: 'After', pt: 'Depois' },
  } satisfies Record<string, L>,
  status: {
    before: {
      en: '87% of about 380 thousand sends a day went out through NAT and came back in through the WAF and the public NLB.',
      pt: '87% de cerca de 380 mil envios por dia saíam pela NAT e voltavam pelo WAF e pelo NLB público.',
    },
    after: {
      en: '87% of about 380 thousand sends a day took the round trip through the internet. Now they stay inside the network.',
      pt: '87% de cerca de 380 mil envios por dia faziam a volta pela internet. Agora seguem por dentro da rede.',
    },
  } satisfies Record<string, L>,
};
