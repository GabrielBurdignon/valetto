# Valetto — Etapa 1: identidade e comparação tipográfica

## Escopo

Base aprovada: `209d5f60a0d1185a30d649d8d81c3339ac1368ed`. Rota de estudo:
`/revisao/tipografia`. Nenhuma aplicação de fontes ou da nova descrição à home.
Cabeçalho, rodapé, hero e demais seções existentes preservados. Sem alteração de
dependências, domínio ou Vercel. Não houve commit, push ou deploy nesta etapa.

A página é estática, não está ligada à navegação nem ao sitemap e tem metadata
`noindex, nofollow`. Isso **não é controle de acesso**: se o projeto for publicado
futuramente com essa rota, ela será acessível diretamente. Não colocar conteúdo
confidencial aqui. Nenhuma publicação foi autorizada neste trabalho.

## Marca oficial pendente

`src/lib/brand-assets.ts` define aplicações independentes para cabeçalho desktop,
cabeçalho compacto, rodapé, favicon e imagem social. Todas permanecem `null`.
`OfficialBrand` prepara renderização com dimensões e texto alternativo e não
renderiza substituto quando o arquivo não existe. Não foi importado na interface
atual; não usa o V de `src/app/icon.svg` nem reconstrói lettering.

Fornecer assinatura oficial em SVG, aplicações positivas/negativas, versão
compacta e símbolo isolado quando oficialmente existentes, além das regras de
uso. Não derivar uma versão compacta por conta própria. Após aprovação, integrar
marca no cabeçalho/rodapé na Etapa 2. Favicon exige atualizar a convenção de arquivo
de `src/app/icon.svg`; imagem social exige revisar `src/app/opengraph-image.tsx`.
O manifesto sozinho não altera metadata ou esses arquivos. Conferir o texto
“Motorcycle Concierge e Transporte”, proporções, área de proteção e nomes
acessíveis antes de integrar. Reservar dimensões para evitar layout shifts.

## Fontes e licença

Arquivos originais de distribuição Fontsource Variable **5.3.0**, subconjunto
Latin, estilo normal, eixo de peso variável. Sem conversão ou recorte adicional.
Fonte externa usada apenas na obtenção dos arquivos; o navegador recebe tudo do
servidor local. Licenças completas SIL OFL 1.1 e metadata preservadas junto aos
WOFF2 em `src/app/revisao/tipografia/fonts/`.

| Família                       | Corpo do arquivo WOFF2 | Resposta local incluindo headers HTTP |
| ----------------------------- | ---------------------: | ------------------------------------: |
| Inter                         |           48.256 bytes |                          48.556 bytes |
| Manrope                       |           24.836 bytes |                          25.136 bytes |
| Total da página de comparação |           73.092 bytes |                          73.692 bytes |
| Fontes adicionais na home     |   0 bytes / 0 requests |                               0 bytes |

Tamanhos de conteúdo conferidos por tamanho em disco e por
`request.sizes().responseBodySize` no Chromium, build de produção. Headers de
resposta locais foram 300 bytes por arquivo; não são estimativa de CDN nem incluem
overhead TLS. O custo de eventual adoção de uma família não é o total de ambas.

Fontes, URLs imutáveis por versão e SHA-256:

- Inter: `https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5.3.0/files/inter-latin-wght-normal.woff2`
  — `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62`.
- Manrope: `https://cdn.jsdelivr.net/npm/@fontsource-variable/manrope@5.3.0/files/manrope-latin-wght-normal.woff2`
  — `a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972`.

Não há arquivo proprietário de Arial, Helvetica ou Georgia redistribuído. Essas
famílias são solicitadas ao sistema. Nas capturas Linux, CDP identificou
**Liberation Sans** na primeira opção e **Liberation Serif Italic** no acento
solicitado como Georgia. Inter e Manrope são custom fonts reais confirmadas pelo
navegador. Validar também em dispositivo com Arial/Helvetica e Georgia antes da
escolha definitiva. Nomes internos de fonte variável podem apontar Regular ou
ExtraLight mesmo quando o peso CSS é 500; a declaração suporta o eixo de pesos.

## Condições da comparação

- Desktop: 1440 × 1000, três colunas alinhadas por linhas de subgrid.
- Mobile: 390 × 844, três famílias em sequência, mesma largura de amostra.
- Tamanhos, tracking, pesos e entrelinhas iguais entre famílias em cada viewport.
- Mesmas quebras explícitas. Quebras automáticas não são ajustadas por família.
- Headline: 59,04px desktop e 56px mobile; peso 500, entrelinha 1,02.
- Texto de apoio: 16px, entrelinha 1,75.
- Títulos editoriais: 38,16px desktop e 36px mobile.
- Georgia/serif é o mesmo acento nos três casos; labels de identificação usam a
  mesma fonte de sistema para não distorcer a comparação.
- Amostras tipográficas reduzidas para comparação, não reprodução da composição
  completa do hero. Não inferir enquadramento final a partir desta página.
- `@font-face` está no CSS Module da rota. Sem preload global, serviço remoto,
  importação em layout ou inclusão na home. Sem controlador client de comparação.
- Conteúdo legível sem JavaScript; sem animação ou interação necessária à leitura.

O texto abaixo aparece somente no estudo e permanece aprovado para a Etapa 3:

> A Valetto nasce para cuidar da logística da sua motocicleta: retirada, transporte
> para revisão ou manutenção e retorno, com conveniência em cada etapa.

### Medidas finais das amostras

| Viewport | Largura do bloco, nas três opções | Linhas do apoio: sistema / Inter / Manrope |
| -------- | --------------------------------: | ------------------------------------------ |
| 1440px   |                             431px | 3 / 4 / 3                                  |
| 390px    |                             342px | 4 / 4 / 4                                  |

No desktop, a frase “Você não.” mede aproximadamente 233,36px na substituta de
sistema, 252,16px em Inter e 237,92px em Manrope, com tamanho de 59,04px, peso 500
e tracking de -0,055em iguais. São medidas de advance de Canvas, não limites de
tinta nem comparação com Arial proprietária. As diferenças mostram por que a
escolha exige revisar quebras e altura na Etapa 3, sem alterar o hero agora.

## Capturas e medição reproduzível

Artefatos: `/workspace/valetto-typography-review/`, fora do repositório e do deploy.
Incluem comparação desktop, página completa mobile, amostras individuais e
`measurements.json` com medidas, fontes efetivamente renderizadas e rede.

Capturas em Chromium, DPR 1, contextos novos, aguardando `document.fonts.ready`.
Uma regra exclusiva da captura mantém o skip link não focado oculto para evitar
artefatos de elementos fixos ao capturar colunas longas; ela não altera a página
ou o comportamento de teclado. O script de captura fica em
`/tmp/valetto-typography-review.cjs` e usa o servidor de produção na porta 3163.

Procedimento: `npm run build`; `npm run start -- --port 3163`;
`node /tmp/valetto-typography-review.cjs`.

## Critérios de aprovação

Comparar legibilidade, presença de títulos, ritmo de parágrafo, quebras e relação
com o acento serifado. Inter permanece recomendação preliminar; Manrope tem menor
arquivo neste conjunto. Menor arquivo sozinho não determina a escolha.
Não há nova pontuação Lighthouse reivindicada: o objetivo medido é isolamento das
fontes e revisão visual, sem alterar animações ou composição da home.

Etapa 2 depende de escolha tipográfica aprovada e recebimento dos arquivos
oficiais de marca. Não iniciar cabeçalho sticky ou outras mudanças nesta entrega.

## Validação final

- Build de produção, lint, TypeScript e formatação aprovados.
- Playwright: **90/90 testes aprovados**, incluindo seis verificações novas
  (dois cenários em desktop, tablet e mobile) sobre isolamento de fontes,
  dimensões equivalentes, noindex, sitemap e leitura sem JavaScript.
- Uma primeira execução detectou diferença de 1px na terceira coluna desktop;
  corrigida antes da execução final completa e das capturas finais.
- Revisão de capturas 1440px e 390px: sem overflow ou erros de console.
- Nenhuma diferença nos arquivos existentes da home, layout, estilos globais,
  cabeçalho, rodapé, favicon, imagem social ou dependências.
