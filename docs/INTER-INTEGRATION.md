# Valetto — integração local e controlada de Inter

## Escopo

Inter é a sans principal da aplicação por `next/font/local`, com preload,
`font-display: swap` e fallback local calibrado por peso. Georgia permanece
exclusivamente no acento editorial já existente do manifesto. Nenhum texto,
fotografia, animação, tamanho de headline, tracking ou estrutura de seção mudou.
A descrição futura do hero não foi antecipada.

O lettering provisório `.wordmark` continua explicitamente em Arial/Helvetica.
Não foi recomposto em Inter nem tratado como marca oficial. O HTML do cabeçalho e
do rodapé não mudou. A integração dos arquivos oficiais e o comportamento sticky
continuam fora desta etapa. Não houve commit, push, deploy ou alteração na Vercel.

Arquivos centrais: `src/lib/fonts.ts`, `src/app/layout.tsx`,
`src/app/globals.css` e `src/app/font-fallback.css`. Licença, fonte derivada e
metadados ficam em `src/assets/fonts/`. Os controladores de movimento e o
carregamento progressivo permanecem intactos; nenhuma dependência adicionada.

## Arquivo, licença e caracteres

Derivação do WOFF2 Latin Inter Fontsource Variable 5.3.0 já aprovado:

- Original: 48.256 bytes, SHA-256
  `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62`.
- Produção local: **35.424 bytes**, peso variável normal **400–600**, SHA-256
  `bb92a1a22e9d857ababffb2127c0ad2d7146a6652cd4d4049a73c13b3387170b`.
- Redução do arquivo em relação ao estudo: 12.832 bytes, aproximadamente 26,6%.
- Um request de fonte na home. Sem itálico Inter, Manrope, Cyrillic ou Greek.
- Subconjunto Latin original mantido, sem remoção adicional de caracteres.
  Cobertura PT-BR conferida para vogais acentuadas, til, cedilha, maiúsculas,
  minúsculas, números e pontuação institucional. Não é um arquivo de cobertura
  Unicode universal.
- Licença SIL OFL 1.1 copiada integralmente para `Inter-OFL.txt`. Sem redesenho de
  letras. O recorte do eixo mantém avanços dos glifos: diferença máxima de uma
  unidade de fonte no peso 500, sobre 2048 unidades/em, e zero em 400/600.

`scripts/prepare-inter.py` reproduz a derivação usando fontTools já instalado no
ambiente e Brotli nativo de Node, sem instalar bibliotecas no projeto. É uma
ferramenta de autoria; não roda no build Next e não é requisito de runtime.
`inter-metrics.json` registra cobertura, hashes, custo e métricas. A faixa cobre
400, 500 e 600 usados pela interface; o peso 700 do lettering fica na fonte de
sistema preservada. As páginas históricas de comparação mantêm seus arquivos
originais para estudo, sem serem importadas pela home.

## Fallback e correção comprovada

Foram definidos `size-adjust`, `ascent-override`, `descent-override` e
`line-gap-override` para 400, 500 e 600. Os rostos locais usam Arial/ArialMT ou
Liberation Sans, e alternativas Helvetica. O cálculo usa a fonte-alvo e métricas
da Liberation Sans instalada, compatível metricamente com Arial; não distribui
arquivos proprietários de sistema. Outros sistemas exigem conferência real.

Uma primeira calibração com frequência de letras em inglês parecia estável no
carregamento comum, mas falhou no teste de fonte atrasada: o apoio mobile ocupava
três linhas no fallback e duas em Inter, deslocando a motocicleta. O teste
deliberadamente atrasado registrou cerca de **0,150 de layout shift** nessa
versão exploratória. Isso foi corrigido antes da entrega final.

A calibração final usa os textos portugueses existentes, separados por peso em
`scripts/font-fallback-samples.json`. Os ajustes de tamanho são aproximadamente
106,19% / 107,23% / 101,19%, respectivamente. Atrasando artificialmente a fonte
após a primeira renderização, o título e o apoio mantiveram suas alturas nas
três larguras. O somatório de shifts observados na troca ficou em aproximadamente:

| Largura | Shifts após liberar a fonte atrasada |
| ------- | -----------------------------------: |
| 1440px  |                             0,000025 |
| 768px   |                             0,000058 |
| 390px   |                             0,000030 |

São casos de stress com movimento reduzido, não uma promessa de CLS zero em
qualquer aparelho. Os pequenos resíduos vêm de diferenças horizontais em
etiquetas, não do salto de linha do apoio. Regressão coberta por teste de fonte
retida, além do teste de falha completa de download. Evidências em
`late-font-first-pass.json`, `late-font.json` e `late-font-log.json`, fora do repo.

## Comparação visual da home completa

Capturas antes/depois em Chromium, DPR 1, nas larguras **1440×900, 768×1024 e
390×844**. Cada viewport tem home completa com movimento normal, uma captura
estática com redução de movimento e capturas por seção. A captura contínua não
mostra todas as fases de um palco sticky; há uma captura adicional da segunda
cena de Filosofia no desktop. Fontes e imagens visíveis são aguardadas antes da
revisão. O skip link não focado é ocultado somente no helper de screenshot longo.

Referência antes: build de produção fresco com a fonte de sistema, preservado
como artefato compilado em `baseline-app`, sem worktree ou checkout adicional.
Depois: build de produção final com Inter. Não se compara servidor dev com
produção. No Linux, Arial/Helvetica são substituídas por Liberation Sans; Georgia
usa uma substituta serifada local. Não equivale à renderização nativa de macOS,
Windows, Safari ou aparelho real.

### Headlines e alinhamentos

- Hero: **3 linhas**, Essência: **2 linhas**, Experiência: **3 linhas**, antes e
  depois em todas as larguras. Tamanhos, tracking e entrelinhas preservados.
- Filosofia: introdução e três pilares mantêm suas quebras nas larguras revistas.
  Números, cenas, sincronização e experiência mobile permanecem.
- Timeline: os quatro títulos de etapa mantêm uma linha. A headline de Como
  Funciona em **390px passa de duas para três linhas**, porque a segunda frase é
  mais larga em Inter. Não se reduziu o tamanho ou se comprimiu o tracking para
  esconder essa diferença. Esse é um ponto explícito da aprovação visual.
- Manifesto mantém suas quebras visuais e Georgia em “viver”. O aumento de 1–2px
  em algumas larguras decorre da combinação de métricas, sem mudança de conteúdo.
- Navegação, menu mobile e rodapé revisados. Fontes pequenas mantêm os tamanhos
  existentes; nenhuma redução adicional para encaixe. Lettering preservado.
- Sem overflow horizontal, overflow textual em títulos/parágrafos, canvas novo
  ou erros de console nos três viewports. A seta textual do manifesto já não
  encontra glifo adequado neste Linux no baseline e continua dependente do
  fallback do sistema; não foi substituída nem adicionada outra fonte nesta fase.

### Alturas das seções, movimento normal — antes → depois

| Seção         | 1440px            | 768px             | 390px             |
| ------------- | ----------------- | ----------------- | ----------------- |
| Hero          | 804 → 804         | 928 → 928         | 772,75 → 772,75   |
| Essência      | 1899,75 → 1826,69 | 1233,52 → 1202,02 | 1115,27 → 1115,27 |
| Filosofia     | 2421,38 → 2421,38 | 2926,23 → 2926,23 | 2258,97 → 2258,97 |
| Como Funciona | 882,06 → 882,06   | 1275,86 → 1275,86 | 1237,86 → 1275,30 |
| Experiência   | 1827,91 → 1828,91 | 1562,31 → 1556,56 | 1361,67 → 1388,56 |
| Manifesto     | 842,44 → 844,44   | 569,75 → 570,75   | 443,80 → 443,80   |
| Encerramento  | 508,48 → 508,48   | 482,98 → 507,48   | 556,91 → 556,91   |

As mudanças são consequência do fluxo tipográfico, principalmente de limites em
`ch` e quebras de parágrafos. Elas não são o CLS de uma navegação: com a fonte já
carregada, os dois layouts podem ter alturas diferentes sem shift durante a
leitura. Fotografias, proporções, foco e resoluções não foram alterados; posições
verticais no documento acompanham o novo fluxo.

## Evidências e reprodução

Artefatos em `/workspace/valetto-inter-integration/`, fora do deploy:

- `before/home-1440.png`, `home-768.png`, `home-390.png` e equivalentes em `after/`.
- `home-static-*`, capturas de todas as seções e do menu mobile.
- `before/visual.json` e `after/visual.json`: caixas, quebras, fontes, imagens,
  erros e overflow; includes preservação do lettering e Georgia.
- `before/performance.json` e `after/performance.json`: medições finais.
- `before-first-pass/` e `after-first-pass/`: medições exploratórias anteriores,
  excluídas do comparativo final.

Capturas: `node /tmp/valetto-integration-review.cjs before 3166` e
`node /tmp/valetto-integration-review.cjs after 3168`. Servidores de produção:
baseline na porta 3166 e build final na 3168. A aplicação não depende desses
helpers. Scripts de medição também ficam em `/tmp`.

## Medições finais equivalentes em produção local

Três navegações por versão, alternadas na ordem antes / depois / depois / antes /
antes / depois, sem builds, testes ou capturas concorrentes. Chromium com
contextos novos, cache desativado, viewport 390×844, DPR 1, modo mobile/toque,
CPU 4× e rede limitada a 150ms de latência, 1638,4 Kibit/s de download e
750 Kibit/s de upload. PerformanceObserver instalado antes dos scripts; janela
de observação até seis segundos após load, sem interação. CLS calculado com
janelas de sessão e sem eventos com input recente. Zero respostas de disk cache
ou service worker; os arquivos foram transferidos nas três execuções de cada
versão. Mesmo processo Chromium, contextos isolados, não seis aparelhos reais.

| Medida                             | Antes                  | Depois                      |
| ---------------------------------- | ---------------------- | --------------------------- |
| LCP: execuções                     | 1844 / 1284 / 1324ms   | 1452 / 1440 / 1456ms        |
| LCP: mediana (mín.–máx.)           | **1324ms (1284–1844)** | **1452ms (1440–1456)**      |
| CLS: três execuções                | **0 / 0 / 0**          | **0 / 0 / 0**               |
| Fonte: corpo transferido           | 0 bytes                | **35.424 bytes**            |
| Fonte: resposta com headers locais | 0 bytes                | 35.724 bytes                |
| JavaScript: corpo transferido      | **151.308 bytes**      | **151.308 bytes**           |
| JavaScript: com headers locais     | **154.720 bytes**      | **154.720 bytes**           |
| LCP final                          | Imagem mobile do hero  | Mesma imagem mobile do hero |

A primeira execução antes foi mais lenta e foi mantida, sem descarte. As faixas
se sobrepõem. A mediana final aumentou **128ms**, aproximadamente 9,7%; não há
ganho de LCP reivindicado. O arquivo de fonte acrescenta uma disputa real pela
banda inicial, embora essa amostra pequena não isole todo o efeito de variação
do ambiente compartilhado. A opção de preload prioriza a tipografia visível e
reduz a espera pela fonte; não foi apresentada como custo gratuito.

Os valores são métricas observadas via CDP no localhost, não Lighthouse simulado,
pontuação ou dados de campo. Não comparar diretamente com o LCP 2,72s da
auditoria anterior. Não incluem DNS/TLS/CDN da Vercel nem comprovam o primeiro
processamento de assets em um deploy novo. A imagem LCP mobile é um WebP estático
direto de 52.140 bytes, sem mudança de prioridade, src ou enquadramento.

O JavaScript preserva o orçamento inicial da otimização mobile anterior. O custo
adicional quantificado acima é da fonte; há também pequenas mudanças no CSS e
HTML do carregamento tipográfico. O cache imutável do asset Next não foi usado
para favorecer o resultado de navegação fria.

Reprodução: `/tmp/valetto-integration-final-performance.cjs`, com os dois
servidores nas portas 3166 e 3168. Resultados finais nos JSON de `before/` e
`after/`, log intercalado em `final-performance-log.jsonl`. As medições
exploratórias não participam desta tabela.

## Validação e limites de aprovação

- Build, lint, TypeScript e formatação aprovados.
- **105/105 testes Playwright aprovados** no build final. Incluem a suíte
  existente de navegação, teclado, mobile, sem JavaScript, preferência reduzida,
  cenas reversíveis, responsividade e nove execuções novas sobre Inter na home,
  falha de fonte e troca tardia do fallback.
- Os testes das rotas de estudo foram atualizados para a adoção intencional de
  uma fonte global. A contagem considera URLs únicas, distinguindo uma nova
  navegação com o mesmo arquivo de um arquivo de fonte adicional.
- Sem alterações em `src/app/page.tsx`, componentes de seção, controladores,
  cabeçalho/rodapé, fotografias, textos, dependências, metadados ou domínios.
- As capturas são evidência visual para aprovação, não aprovação automática.
  Especial atenção à terceira linha de Como Funciona em 390px e à nova largura
  dos parágrafos com medidas em `ch`.
- Falta validar fontes de sistema e comportamento em aparelhos reais, Safari e
  CDN. O stress cobre o hero; não garante ausência absoluta de shift em todo
  link profundo ou restauração de scroll com fonte excepcionalmente atrasada.
- Não houve publicação. Nenhuma próxima etapa foi iniciada.
