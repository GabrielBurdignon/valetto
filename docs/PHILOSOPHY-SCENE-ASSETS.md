# Nossa Filosofia — três cenas fotográficas

## Estado real

Três fotografias integradas exclusivamente em Nossa Filosofia, a partir do ZIP `valetto-filosofia-imagens.zip` fornecido pelo responsável do projeto. O ZIP contém três PNGs de 1672 × 941 px, sem documentos de licença ou autoria. O responsável confirmou nesta conversa que são imagens geradas por IA e autorizou o uso no site Valetto. Não se presume licença de terceiros, exclusividade, autoria humana ou correspondência a um GLB.

Os PNGs recebidos foram preservados sem alterações em `public/media/philosophy/*-original.png`. A apresentação usa apenas WebPs independentes, sem reutilizar o macro da Essência:

| Cena        | Original no ZIP                                                                | WebP desktop / mobile  |
| ----------- | ------------------------------------------------------------------------------ | ---------------------- |
| cockpit     | `cockpit_premium_de_motocicleta_aventureira.png`                               | 103.086 / 44.876 bytes |
| engineering | arquivo com prefixo `detalhes_mec` (nome com acentuação mal codificada no ZIP) | 123.130 / 59.952 bytes |
| finish      | `close_da_frente_de_moto_de_aventura.png`                                      | 169.066 / 68.468 bytes |

WebPs desktop mantêm 1672 × 941 px; mobile usa 1040 × 585 px. Não houve ampliação artificial. A série completa pesa aproximadamente 386 KiB em desktop ou 169 KiB em mobile antes da negociação de formatos/tamanhos do Next Image. Os originais não são solicitados pela interface.

## Composição e entrega dos assets

| Cena                                  | Assunto                                                   | Enquadramento previsto                                                                                                   |
| ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `cockpit` / 01 — Conveniência         | Cockpit ou posição de pilotagem de uma big trail premium. | Comandos e leitura da posição de uso; espaço escuro à esquerda/parte inferior para o número monumental.                  |
| `engineering` / 02 — Responsabilidade | Motor, conjunto mecânico ou detalhe de engenharia.        | Volumes e conexões com leitura técnica, sem sugerir procedimentos operacionais não definidos.                            |
| `finish` / 03 — Atenção aos detalhes  | Farol, metal ou acabamento refinado.                      | Reflexos controlados, textura e precisão dos encaixes. Uma imagem própria, não uma terceira versão do macro da Essência. |

Direção comum: grafite e preto, iluminação cinematográfica de estúdio, ausência de logos e coerência de materiais/temperatura de luz. Idealmente produzir a série a partir da mesma referência física ou visual, sem afirmar continuidade de modelo que não esteja comprovada.

Os arquivos recebidos têm largura inferior aos 2000px inicialmente recomendados, mas são suficientes para o painel real (cerca de 540px CSS no desktop de 1440px). Mantida a resolução original. O enquadramento usa foco próprio por cena: cockpit central/superior; engenharia central; farol deslocado à direita, preservando a assinatura luminosa. A numeração permanece monumental e o gradiente inferior discreto oferece contraste.

## Arquitetura

`src/lib/philosophy-content.ts` identifica explicitamente `cockpit`, `engineering` e `finish`, preservando os textos. `PhilosophyVisual` aceita caminho/dimensões/posição desktop, descrição acessível, procedência, permissão e, opcionalmente, arquivo/dimensões/posição mobile.

`PhilosophyMedia` centraliza a entrega de imagens para os três painéis do palco e os três painéis equivalentes nos artigos. O número monumental não é substituído nem reduzido para uma pequena legenda. Uma camada escura discreta na base prepara contraste para a numeração; os três arquivos reais foram usados para ajustar o foco.

No desktop com movimento permitido e JavaScript, os painéis sticky compartilham a timeline de números, nomes e progresso. As imagens podem fazer uma aproximação muito discreta de 1,5%, sem câmera falsa ou simulação 3D. A identidade da cena mantém a animação no capítulo correto mesmo quando apenas parte dos assets estiver configurada.

Sem JavaScript, com falha no carregamento do controlador ou com movimento reduzido, cada imagem aparece no artigo correspondente em fluxo natural. No mobile/tablet, as imagens permanecem no fluxo; o índice sticky compacto é preservado. O movimento mobile atua suavemente sobre a imagem em leitura, sem bloquear rolagem. Mudanças de breakpoint reconstroem somente a timeline local e limpam os efeitos anteriores.

As imagens são decorativas em relação ao texto institucional; sua descrição específica é oferecida uma única vez no artigo para leitores de tela. O palco duplicado fica aria-hidden para evitar anúncios repetidos. Não há aria-live no scroll. Dimensões reservadas, lazy loading e tamanhos responsivos são usados; nenhum PNG original é solicitado pela apresentação.

## Verificação

A suíte verifica os arquivos reais: três cenas configuradas, avanço/retorno 01→02→03→02→01, imagens carregadas com fontes independentes, nenhuma solicitação do PNG original, ausência de canvas/overflow, painéis sem JavaScript e redução de movimento. Build, lint, TypeScript, formatação e os 42 testes Playwright passaram após a integração. Os três PNGs originais foram conferidos byte a byte contra os arquivos recebidos.

Capturas revisadas em 1440 × 900, 768 × 1024 e 390 × 844, sem erros de página nem overflow horizontal. Gravação produzida com avanço e retorno entre os três momentos reais. Core Web Vitals em produção e dispositivos físicos não são medidos pelo teste local.

Hero, Essência, Como Funciona e demais seções preservados. Nenhum push ou deploy nesta etapa.
