# Valetto — validação visual de Inter nas cenas existentes

## Escopo e reprodução

- Versão atual isolada: `/revisao/inter/atual`.
- Versão Inter isolada: `/revisao/inter/inter`.
- Base institucional e visual: commit aprovado `209d5f6`.
- Apenas família tipográfica muda dentro do recorte. Tamanhos CSS, pesos,
  tracking, entrelinhas, espaçamentos, textos, assets e enquadramentos preservados.
- A Essência e A Experiência usam os componentes existentes sem alteração. O
  hero é uma cópia explícita do markup aprovado em `hero-specimen.tsx`, sem
  modificar ou extrair código da home. Testes conferem textos e medidas com a home.
- O recorte omite Filosofia, Processo, manifesto e encerramento; posições
  absolutas na página e gatilhos de scroll não equivalem à jornada completa.
- Cabeçalho e rodapé continuam os existentes, com fonte de sistema. Nenhum
  comportamento sticky novo ou aplicação de marca oficial foi introduzido.
- Georgia não aparece nessas três seções no original: não se acrescentou acento
  serifado onde ele não existia. Continua previsto para o manifesto.
- A nova descrição aprovada para a Etapa 3 não foi antecipada. O hero usa seu
  texto atual para isolar o efeito da tipografia.

Ambas as rotas são estáticas, sem links na navegação principal, fora do sitemap e
com `noindex, nofollow`. Não são rotas autenticadas: nenhuma informação
confidencial foi incluída. Não houve publicação.

Para reproduzir: `npm run build`, `npm run start -- --port 3165`,
`node /tmp/valetto-inter-scenes.cjs`. As rotas também podem ser abertas em um
servidor de desenvolvimento existente. O helper de captura fica fora do projeto.

## Capturas

Diretório: `/workspace/valetto-inter-scenes/`. Para cada uma das três seções, há
capturas `*-atual-1440.png`, `*-inter-1440.png`, `*-atual-390.png` e
`*-inter-390.png`. Dados geométricos estão em `visual-measurements.json`.

Chromium, viewports 1440×900 e 390×844, DPR 1, fontes e imagens decodificadas antes
das capturas. Movimento reduzido usado para comparar composições estáticas finais
sem diferenças de frame entre animações. O helper oculta somente o skip link não
focado durante screenshots longos, sem alterar a interface. Não é validação em
Safari ou aparelho real.

A referência de sistema usa **Liberation Sans** no Linux, como confirmado na
comparação tipográfica anterior, e não Arial/Helvetica proprietárias. As capturas
precisam também ser conferidas em um aparelho com essas fontes antes da adoção.
Inter é o mesmo WOFF2 real de 48.256 bytes já licenciado/documentado no estudo.

## Quebras, tamanhos e hierarquia

As headlines mantiveram **3 linhas no hero, 2 na Essência e 3 na Experiência**, em
ambas as famílias e viewports. Nenhum tamanho foi reduzido para fazê-las caber.

| Headline    | Desktop: tamanho / altura | Mobile: tamanho / altura |
| ----------- | ------------------------- | ------------------------ |
| Hero        | 125,28px / 368,30px       | 65px / 191,06px          |
| Essência    | 88,56px / 191,28px        | 31,2px / 74,38px         |
| Experiência | 109,44px / 334,88px       | 40px / 122,39px          |

Medidas iguais antes/depois. O texto desenhado fica mais largo em Inter:

| Trecho                 | Desktop: atual → Inter | Mobile: atual → Inter |
| ---------------------- | ---------------------- | --------------------- |
| “Você não.”            | 483,94 → 523,81px      | 251,12 → 271,81px     |
| “Seu tempo é valioso.” | 729,52 → 782,77px      | 260,06 → 278,81px     |
| “A próxima revisão.”   | 782,00 → 837,41px      | 285,83 → 306,08px     |

São larguras de caixas de caracteres medidas por DOM Range, não limites de tinta.
O bloco do título do hero não tem largura textual fixa: sua largura de layout é
maior que as linhas desenhadas. Não confundir a caixa com a extensão dos glifos.

Visualmente, Inter dá mais presença e densidade aos títulos, especialmente no
peso 500, que não tem equivalência de desenho exata na fonte de sistema. A
hierarquia entre headline, introdução e corpo permanece. Não houve cortes ou
sobreposição com a motocicleta nas capturas revisadas.

## Fluxo de texto: diferenças reais

Limites em `ch` dependem da largura do zero de cada família. Preservar o mesmo CSS
não garante o mesmo tamanho físico do parágrafo. Não houve compensação desse
efeito no estudo, para expor o comportamento real da troca de fonte.

| Elemento                    | Desktop: atual → Inter                  | Mobile: atual → Inter                   |
| --------------------------- | --------------------------------------- | --------------------------------------- |
| Apoio atual do hero         | 2 → 2 linhas; altura 49px               | 2 → 2 linhas; altura 45,5px             |
| Introdução da Essência      | 4 → 3 linhas; largura 487,62 → 553,12px | 4 → 4 linhas; largura 315,33 → 324,91px |
| Corpo principal da Essência | 5 → 4 linhas; largura 422,53 → 479,28px | 5 → 5 linhas; largura 342px             |
| Descrição da Experiência    | 3 → 3 linhas                            | 3 → 4 linhas; altura 77,67 → 103,56px   |

Consequências no layout final:

- Hero: altura preservada, 804px desktop e 772,75px mobile.
- Essência desktop: 1899,75 → 1826,69px (**−73,06px**). A fotografia sobe no fluxo
  porque a introdução ocupa uma linha a menos; enquadramento não foi alterado.
- Essência mobile: altura preservada em 1115,27px.
- Experiência desktop: 1827,91 → 1828,91px (**+1px**).
- Experiência mobile: 1361,67 → 1388,56px (**+26,89px**).

Essas diferenças entre dois layouts já carregados não são, por si, CLS. CLS mede
deslocamentos durante uma navegação. O fallback pode gerar deslocamento se a
fonte chegar depois que o texto estiver visível.

As três imagens mantiveram src efetivo, largura/altura, object-fit e
object-position em ambos os viewports. Sem overflow horizontal ou erro de console
na revisão visual. A hierarquia permaneceu legível nos tamanhos existentes.

## Isolamento e impacto potencial

`@font-face` existe somente no CSS Module do recorte. A variante atual não usa a
família e não requisita WOFF2; a variante Inter requisita apenas um arquivo local.
Sem preload global, biblioteca adicional ou alteração da home. Licença e hashes:
`docs/IDENTITY-TYPOGRAPHY-REVIEW.md`.

48.256 bytes adicionais podem disputar banda com recursos críticos e criar uma
nova dependência de renderização de texto. `font-display: swap` preserva leitura,
mas não elimina risco de troca visível ou CLS. Não se aplica preload ou ajuste de
métricas à home antes da aprovação. O efeito definitivo exige medir a página
completa e os fallbacks reais dos dispositivos após uma eventual adoção.

O estudo não altera a logomarca. A aplicação oficial continua pendente do arquivo
fornecido pelo responsável. Não houve commit, push ou deploy.

## Medição exploratória de LCP e CLS

Seis navegações instrumentadas, três por variante, no build final de produção,
sem capturas, testes ou builds concorrentes. Chromium via CDP, viewport 390×844,
DPR 1, toque/mobile habilitados, movimento normal. Rede com latência de 150ms,
download de 1638,4 Kibit/s e upload de 750 Kibit/s, CPU 4×. Contexto novo a cada
execução e cache do navegador desativado; zero respostas de disk cache ou service
worker. Ordem: atual, Inter, Inter, atual, atual, Inter. Nenhuma interação de scroll.
Observação até seis segundos após o evento load, com PerformanceObserver de LCP
e layout-shift instalado antes dos scripts da página. CLS calculado por janelas
de sessão, excluindo deslocamentos com input recente.

Não é Lighthouse, dado de campo, Safari ou medição da CDN. Assets de imagem do
servidor local podem estar preparados; não mede a primeira otimização de imagem
de um deployment. A imagem LCP mobile é o mesmo WebP estático direto em todas as
execuções. Não comparar esses tempos com o Lighthouse simulado da auditoria.

| Medida                      | Tipografia atual      | Inter                                            |
| --------------------------- | --------------------- | ------------------------------------------------ |
| LCP: execuções              | 1472 / 1324 / 1348ms  | 1440 / 1444 / 1436ms                             |
| LCP: mediana (mín.–máx.)    | 1348ms (1324–1472)    | 1440ms (1436–1444)                               |
| CLS: três execuções         | 0 / 0 / 0             | 0,004081 / 0,004081 / 0,004081                   |
| Fonte adicional transferida | 0 bytes               | 48.256 bytes de WOFF2, 48.556 com headers locais |
| Elemento LCP final          | Imagem da motocicleta | Mesma imagem da motocicleta                      |

As faixas de LCP se sobrepõem. A diferença mediana de +92ms não comprova, sozinha,
uma regressão generalizável, mas não há ganho de LCP reivindicado. O recurso
adicional existe e pode competir pela banda inicial. Não foram alteradas
prioridades de imagem, fontes ou animações para favorecer um resultado.

Na execução Inter exemplificada no JSON, a fonte termina a transferência em
1728ms e há layout shift em 1773ms. As fontes de deslocamento incluem as linhas
do título, cujas caixas de texto se movem cerca de 3px verticalmente. O padrão é
compatível com a troca de métricas do fallback para Inter. **CLS não permaneceu
zero no recorte Inter**, embora o valor seja pequeno. Uma eventual adoção deve
avaliar fallback ajustado por métricas e a estratégia de entrega, com nova
medição na home inteira. Não foi feita essa compensação nesta fase visual.

Fontes em CSS `ch` mudam também o fluxo abaixo da dobra. O teste sem rolagem não
comprova ausência de deslocamentos ao abrir links profundos, restaurar scroll ou
receber a fonte tardiamente sobre outras seções. Essas situações permanecem na
validação técnica de uma eventual integração.

Resultados brutos: `/workspace/valetto-inter-scenes/performance.json` e
`performance-log.jsonl`. Reprodução: `/tmp/valetto-inter-performance.cjs`, mesmo
servidor na porta 3165. O script não é dependência do produto.

## Verificação final

- Build de produção, lint, TypeScript e formatação aprovados.
- **96/96 testes Playwright aprovados** no build final, incluindo seis execuções
  novas (dois cenários em três viewports) de medidas, textos, assets, isolamento
  de fonte e leitura estática do recorte.
- Arquivos existentes de home, layout, estilos globais, cabeçalho, rodapé e
  componentes de hero/Essência/Experiência sem alterações; dependências intactas.
- Capturas sem erros de console ou overflow horizontal em 1440 e 390px.
- Não equivale a aprovação visual: aguardar a decisão do responsável antes de
  aplicar a fonte à home. Fallback e CLS permanecem pendência técnica explícita.
