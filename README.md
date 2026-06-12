# lucaspadilhacom

Portfolio pessoal — site estático com Astro 5, React, Framer Motion, GSAP e Tailwind CSS.

## Stack

- **Framework**: [Astro 5](https://astro.build/)
- **UI**: React 19 + Framer Motion + GSAP
- **CSS**: Tailwind CSS 3
- **Output**: Static HTML

## Dev

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## CI/CD

GitHub Actions faz build e deploy automático do `dist/` pro servidor via SCP.

| Secret | Descrição |
|--------|-----------|
| `SERVER_IP` | IP do servidor EC2 (`56.126.174.29`) |
| `SSH_PRIVATE_KEY` | Chave privada SSH (`portfolio-key`) |

## Domínios

- **lucaspadilha.com** — Apex (certificado Let's Encrypt automático)
- **www.lucaspadilha.com** — Redireciona pro apex

## Relacionado

- [aws-terraform](https://github.com/lucasgpadilha/aws-terraform) — Infra
- [aws-ansible](https://github.com/lucasgpadilha/aws-ansible) — Configuração do servidor
