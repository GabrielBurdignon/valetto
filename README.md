# VALETTO — Motorcycle Concierge

Fundação do website em português brasileiro, em pré-lançamento em Belo Horizonte. Next.js App Router, React, TypeScript strict, Tailwind CSS 4 e Lucide. Veja `PLAN.md` para arquitetura, critérios e dependências futuras.

## Desenvolvimento

Node.js >=20.9 (validado com 24.19.0), npm e acesso ao registry.npmjs.org.

```sh
cd /workspace/valetto
npm ci
npm run dev
```

A configuração npm usa cache gravável em `/workspace/.npm-cache` neste ambiente. Fora da nuvem, substitua com `npm --cache /caminho/gravavel ci`.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

## Testes de navegador

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e
```

Neste ambiente, use o navegador já instalado (o download externo é bloqueado):

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Os testes iniciam o servidor de produção na porta 3100; execute o build antes. Cobrem navegação, menu móvel, privacidade e ausência de overflow em desktop/tablet/mobile. Metas de Core Web Vitals ainda não medidas.

## Escopo

Sem credenciais, banco, cadastro ou rastreamento nesta fase. O CTA abre o Instagram oficial. Não há confirmação simulada de captação. Página de privacidade descreve apenas a versão atual; revisar antes de coleta de dados. Para 3D, é necessário fornecer/selecionar modelo de motocicleta licenciado e fallback aprovado. O monograma editorial não é uma renderização de moto.

Deploy requer build e processo Next.js compatível. Domínio e publicação não são configurados por este projeto.
