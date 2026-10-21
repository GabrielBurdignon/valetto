# Nossa Filosofia — três cenas fotográficas

## Estado real

Infraestrutura preparada; **integração fotográfica pendente dos três assets aprovados**. O repositório contém apenas a imagem ampla do hero e o macro de A Essência. Nenhum deles foi reutilizado nesta seção, nenhuma imagem externa foi baixada e nenhum modelo 3D foi criado. Os três campos `visual` permanecem `null`; o site mantém a composição tipográfica enquanto os assets não chegam. Não são exibidos painéis vazios como resultado final.

## Composição e entrega dos assets

| Cena                                  | Assunto                                                   | Enquadramento previsto                                                                                                   |
| ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `cockpit` / 01 — Conveniência         | Cockpit ou posição de pilotagem de uma big trail premium. | Comandos e leitura da posição de uso; espaço escuro à esquerda/parte inferior para o número monumental.                  |
| `engineering` / 02 — Responsabilidade | Motor, conjunto mecânico ou detalhe de engenharia.        | Volumes e conexões com leitura técnica, sem sugerir procedimentos operacionais não definidos.                            |
| `finish` / 03 — Atenção aos detalhes  | Farol, metal ou acabamento refinado.                      | Reflexos controlados, textura e precisão dos encaixes. Uma imagem própria, não uma terceira versão do macro da Essência. |

Direção comum: grafite e preto, iluminação cinematográfica de estúdio, ausência de logos e coerência de materiais/temperatura de luz. Idealmente produzir a série a partir da mesma referência física ou visual, sem afirmar continuidade de modelo que não esteja comprovada.

Fornecer três arquivos independentes, preferencialmente em ZIP:

- PNG/JPG original e WebP otimizado; mínimo recomendado de 2000px de largura (ideal 2400px ou mais).
- Arquivos para enquadramento desktop aproximadamente 4:3 e mobile 1,35:1, ou composição ampla que permita ambos sem cortar o assunto. Cada cena admite foco independente e um arquivo mobile dedicado.
- Procedência e autorização de uso; registrar geração por IA quando aplicável, sem inventar autoria/licença nem associação a um GLB.
- Orçamento inicial proposto: até 250KB para cada WebP desktop e até 150KB para mobile; validar qualidade real de textura e metal antes de reduzir peso.

Os enquadramentos definitivos, o contraste sobre os números e a qualidade da série dependem desses arquivos e ainda não foram aprovados.

## Arquitetura

`src/lib/philosophy-content.ts` identifica explicitamente `cockpit`, `engineering` e `finish`, preservando os textos. `PhilosophyVisual` aceita caminho/dimensões/posição desktop, descrição acessível, procedência, permissão e, opcionalmente, arquivo/dimensões/posição mobile.

`PhilosophyMedia` centraliza a entrega de imagens para os três painéis do palco e os três painéis equivalentes nos artigos. O número monumental não é substituído nem reduzido para uma pequena legenda. Uma camada escura discreta na base prepara contraste para a numeração; o acabamento final precisa ser afinado com as imagens reais.

No desktop com movimento permitido e JavaScript, os painéis sticky compartilham a timeline de números, nomes e progresso. As imagens podem fazer uma aproximação muito discreta de 1,5%, sem câmera falsa ou simulação 3D. A identidade da cena mantém a animação no capítulo correto mesmo quando apenas parte dos assets estiver configurada.

Sem JavaScript, com falha no carregamento do controlador ou com movimento reduzido, cada imagem aparece no artigo correspondente em fluxo natural. No mobile/tablet, as imagens permanecem no fluxo; o índice sticky compacto é preservado. O movimento mobile atua suavemente sobre a imagem em leitura, sem bloquear rolagem. Mudanças de breakpoint reconstroem somente a timeline local e limpam os efeitos anteriores.

As imagens são decorativas em relação ao texto institucional; sua descrição específica é oferecida uma única vez no artigo para leitores de tela. O palco duplicado fica aria-hidden para evitar anúncios repetidos. Não há aria-live no scroll. Dimensões reservadas, lazy loading e tamanhos responsivos são usados; nenhum PNG original é solicitado pela apresentação.

## Verificação

Build, lint, TypeScript, formatação e os 42 testes Playwright do projeto passaram na configuração final sem fotografias. Além da suíte, foram executadas cinco verificações com três fixtures SVG locais explicitamente marcadas como testes: desktop sem JavaScript, mobile sem JavaScript, movimento reduzido, mobile com JavaScript e palco sticky com avanço/retorno e mudança para mobile. Confirmaram três fontes independentes, carregamento das imagens, apresentação estática e ausência de canvas/overflow. As fixtures e a configuração temporária foram removidas, e o build final foi refeito com `visual: null`.

Esses testes validam entrega e comportamento, **não qualidade fotográfica ou desempenho com assets finais**. A gravação entregue demonstra apenas os três momentos estruturais, ainda sem fotografias. Core Web Vitals em produção e dispositivos físicos não foram medidos.

Hero, Essência, Como Funciona e demais seções preservados. Nenhum push ou deploy nesta etapa.
