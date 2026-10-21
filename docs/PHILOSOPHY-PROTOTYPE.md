# Nossa Filosofia — protótipo de narrativa progressiva

## Escopo

Somente Nossa Filosofia foi substituída por um componente próprio. Hero, A Essência, Como Funciona e seções posteriores preservados. Conteúdo institucional dos três pilares mantido literalmente. Nenhum asset externo, modelo 3D, nova dependência ou funcionalidade operacional foi acrescentado.

## Linguagem proposta

Um palco contínuo apresenta Conveniência, Responsabilidade e Atenção aos detalhes como três capítulos. No desktop, o índice tipográfico permanece em CSS sticky enquanto o texto percorre a coluna de leitura. O número em grande escala, a ênfase dos nomes e o progresso linear mudam juntos. Os artigos não são cards nem são ocultados durante a leitura.

Uma timeline GSAP/ScrollTrigger local controla os três momentos, com scrub de 0,45 s. A progressão funciona nos dois sentidos. Não há pin, scroll hijacking, rolagem sintética em produção ou mudança de estado React a cada frame. A linha usa scaleX, os números usam opacidade no desktop e opacity/transform no mobile e o texto mantém opacidade mínima de 0,82.

No tablet/mobile, o índice vira uma faixa sticky compacta e os capítulos permanecem em fluxo natural. Os intervalos foram reduzidos para permitir continuidade entre momentos sem reproduzir o painel desktop em escala menor.

## Fallback e acessibilidade

Todo o texto está no HTML do servidor. Sem JavaScript ou se o chunk GSAP falhar, o desktop mostra o intervalo estático 01—03 e todos os pilares continuam legíveis. Com movimento reduzido, a timeline é revertida, os capítulos ficam compactos e o índice deixa de ser sticky. Mudanças de preferência durante a sessão são tratadas.

O palco visual é aria-hidden, pois repete informações já presentes nos headings reais. Não há aria-live disparando durante a rolagem. Headings, textos e ordem de leitura permanecem semânticos. Cleanup cancela timelines/ScrollTriggers locais; preferências e callbacks assíncronos não podem reativar uma cena desmontada.

## Arquitetura para assets futuros

`src/lib/philosophy-content.ts` mantém o texto e um campo `visual` por capítulo. Os três campos agora referenciam os WebPs fornecidos pelo responsável do projeto. Cada visual tem caminho, dimensões, ponto de foco, procedência e autorização de uso. O palco e os painéis estáticos/mobile aceitam imagens independentes por cena, preservando a numeração monumental, sem reconstruir a seção.

A evolução fotográfica utiliza três imagens geradas por IA, recebidas em ZIP e autorizadas pelo responsável do projeto. Os PNGs originais foram preservados. Não há simulação 3D ou associação a modelo GLB.

## Validação e material para aprovação

Build, lint, TypeScript e formatação. A suíte inclui 42 testes Playwright: os 33 existentes e nove execuções dos cenários de Filosofia em desktop/tablet/mobile. Cobrem progressão 01→02→03→02→01, coordenação do índice, ausência de canvas/imagens fictícias, movimento reduzido e conteúdo sem JavaScript.

Capturas revisadas em 1440×900, 768×1024 e 390×844, sem erros de página ou overflow horizontal nas checagens. Gravação desktop mostra o avanço e o retorno do scroll. Não representa medição de fluidez em dispositivos físicos; Core Web Vitals de produção não foram medidos nesta etapa.

Não houve deploy ou push. Este é um protótipo para aprovação antes de estender a linguagem a qualquer outra seção.

A evolução da infraestrutura fotográfica, a procedência e os detalhes dos três assets estão em `PHILOSOPHY-SCENE-ASSETS.md`.

## Refinamento cinematográfico final

Apenas o desktop aprimorado recebeu novas proporções: coluna visual de 54% do espaço útil, intervalo de 8% e painel de até 460px. Em 1440px, a fotografia passa de aproximadamente 570 × 418px para 630 × 454px (cerca de 20% de área adicional). A numeração mantém sua escala. O topo sticky considera a altura real do painel para aproximar seu centro da linha central de leitura. Capítulos passam de 72svh para no mínimo 68svh/560px, com padding de 56px, encurtando as esperas inicial e final.

A timeline desktop agora começa no centro do primeiro capítulo e termina no centro do último. As duas dissoluções ocupam metade do percurso entre centros consecutivos, coordenando fotografia, número, destaque dos nomes e opacidade do texto. O índice ativo acompanha a timeline renderizada, incluindo o scrub. A imagem anterior permanece opaca sob a próxima até a dissolução terminar, evitando escurecimento do fundo; todas as mudanças são reversíveis. Não há deslocamento vertical do palco desktop. O movimento de escala de 1,5% foi mantido.

O mobile conserva as proporções e animações anteriores. A leitura estática/sem JavaScript e a preferência de movimento reduzido não recebem os ajustes desktop. Nenhum asset, texto institucional, dependência ou seção externa a Nossa Filosofia foi alterado.

A gravação de revisão usa deslocamento constante de 160px por segundo, em tempo real, com avanço e retorno restritos à seção. É uma demonstração de navegador, não medição de fluidez de dispositivo físico.
