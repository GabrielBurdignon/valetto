# Plano de implementação

## Arquitetura

Next.js App Router, React, TypeScript strict, Tailwind 4 e CSS com tokens. Página e seções editoriais renderizadas no servidor. Header interativo isolado. Conteúdo de marca em módulo próprio. Fonte de sistema para evitar dependência de downloads; seleção de fonte licenciada na fase visual.

## Fase 1 — Foundation

- [x] Estrutura, tokens Dark Precision e tipografia fluida.
- [x] Header e navegação móvel, links de seção, footer.
- [x] Conteúdo editorial, etapas, serviços e pré-lançamento.
- [x] Metadata, Open Graph, sitemap, robots, privacidade inicial.
- [x] Gate: lint, tipos, build, navegação desktop/mobile, teclado e reduced motion verificados.

## Fase 2 — Visual Experience

- [ ] Selecionar logomarca e fotografia autorizada ou render de moto neutra como fallback.
- [ ] Revisar fonte licenciada com suporte ao português.
- [ ] GSAP/ScrollTrigger: animação reversível sem bloquear scroll; redução de movimento.
- [ ] Gate: revisão visual desktop, tablet e mobile; fallback funcional sem JavaScript/3D.

## Fase 3 — Three-Dimensional Experience

- [ ] Obter modelo GLB de motocicleta de qualidade com licença apropriada, sem marcas.
- [ ] Three.js, React Three Fiber e Drei em componentes client carregados sob demanda.
- [ ] Iluminação física, rig de câmera e cenas de scroll, DPR limitado.
- [ ] Viewer independente: toque, rotação limitada, zoom, reset e foco por botões acessíveis.
- [ ] Gate: não substituir moto por geometria abstrata; manter alternativa identificada até aprovação do asset.

## Fase 4 — Conversion

- [ ] Escolher/configurar serviço de persistência e tratamento de dados.
- [ ] Formulário com Zod, nome/e-mail/WhatsApp, moto opcional e consentimento.
- [ ] Proteção contra abuso, erros e estados de envio reais; testes de persistência.
- [ ] Atualizar política com responsável, retenção, direitos e canal de contato aprovado.

## Fase 5 — Production Polish

- [ ] Auditoria de acessibilidade, performance e testes de interações críticas.
- [ ] Medir LCP, CLS e INP em produção; percentil 75 exige tráfego real.
- [ ] Validar domínio, metadata, contatos e dados comerciais com responsável.

## Decisões e limitações

A primeira fase utiliza um monograma V em CSS como composição editorial, não como substituto final da moto. Não existe formulário sem backend. CTA funcional direciona ao Instagram oficial. Nenhuma operação anterior ou promessa de serviço ativo é afirmada. Motion/Zod/3D serão instalados quando houver uso concreto; Motion apenas se complementar ao GSAP. Documentação pública de Next e Tailwind respondeu HTTP 403 em 20/10/2026; versões estáveis e requisitos consultados no registro npm, compatibilidade validada pelo build.

## Validação da fase 1

- Build de produção, TypeScript strict, ESLint sem avisos e Prettier aprovados.
- Playwright: 6 testes aprovados em Chromium, com perfis desktop, tablet e mobile; sem erros de página nas interações verificadas.
- Capturas dos três tamanhos inspecionadas. Não houve overflow horizontal nos viewports testados.
- HTTP 200: página inicial, privacidade, sitemap, robots e Open Graph PNG.
- O download Playwright foi bloqueado pela rede; testes executados com Chromium já instalado em `/usr/bin/chromium`.
- Core Web Vitals, leitor de tela, Safari/Firefox e dispositivos físicos não medidos/testados.

## Evolução do hero — infraestrutura cinematográfica

- [x] Remover o V como destaque principal, preservando assinatura secundária.
- [x] Isolar carregamento 3D client, cena PBR, softboxes locais e rig de câmera com GSAP/ScrollTrigger.
- [x] Preparar poster otimizado, redução de movimento, Save-Data, timeout, boundary e context loss.
- [x] Preservar headline, CTA, menu, tipografia e demais seções.
- [x] Build, tipos, lint, formatação e 12 testes de navegador da configuração sem asset.
- [x] Checagens temporárias de integração com poster de teste: preferência de movimento reduzido não solicita GLB; ausência de WebGL preserva poster; GLB inexistente preserva poster. CTA funcional nos três cenários. Fixtures removidas após os testes.
- [ ] Selecionar/adquirir GLB e render com direitos de uso comercial e distribuição web. Usuário informou que não possui os assets.
- [ ] Ativar e validar materiais, câmera, entrada, reflexos e acabamento com a moto real. Não há motocicleta renderizada nesta entrega.

Contrato de entrega e ativação: `docs/HERO-ASSETS.md`. Nenhum placeholder é apresentado como resultado automotivo final. Não foram medidos Core Web Vitals nem qualidade/performance do modelo ausente.

## Hero cinematográfico estático — imagem recebida

- [x] Receber `Motocicleta.zip`, preservar PNG original e registrar procedência declarada como imagem gerada por IA fornecida pelo responsável do projeto.
- [x] Gerar WebP desktop (~98 KiB) e mobile (~88 KiB), preservando a motocicleta inteira.
- [x] Ativar apresentação 2D com imagem prioritária, entrada suave e parallax discreto; manter `motorcycleAsset = null`.
- [x] Adaptar enquadramento em 1440/768/390px sem alterar o conteúdo ou as demais seções.
- [x] Verificar imagem com e sem JavaScript, preferência de movimento reduzido e mudança dessa preferência, CTA e navegação.
- [x] Revisar capturas e ausência de overflow. A validação definitiva e o contrato atual estão em `docs/HERO-ASSETS.md`.

Esta etapa resolve o bloqueio anterior de recebimento do arquivo da imagem. O modelo GLB e sua licença continuam sendo uma dependência exclusiva da evolução 3D. A autorização desta etapa não inclui deploy.
