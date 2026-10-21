# Nossa Filosofia — protótipo de narrativa progressiva

## Escopo

Somente Nossa Filosofia foi substituída por um componente próprio. Hero, A Essência, Como Funciona e seções posteriores preservados. Conteúdo institucional dos três pilares mantido literalmente. Nenhum asset externo, modelo 3D, nova dependência ou funcionalidade operacional foi acrescentado.

## Linguagem proposta

Um palco contínuo apresenta Conveniência, Responsabilidade e Atenção aos detalhes como três capítulos. No desktop, o índice tipográfico permanece em CSS sticky enquanto o texto percorre a coluna de leitura. O número em grande escala, a ênfase dos nomes e o progresso linear mudam juntos. Os artigos não são cards nem são ocultados durante a leitura.

Uma timeline GSAP/ScrollTrigger local controla os três momentos, com scrub de 0,45 s. A progressão funciona nos dois sentidos. Não há pin, scroll hijacking, rolagem sintética em produção ou mudança de estado React a cada frame. A linha usa scaleX, os números usam opacity/transform e o texto mantém opacidade mínima de 0,82.

No tablet/mobile, o índice vira uma faixa sticky compacta e os capítulos permanecem em fluxo natural. Os intervalos foram reduzidos para permitir continuidade entre momentos sem reproduzir o painel desktop em escala menor.

## Fallback e acessibilidade

Todo o texto está no HTML do servidor. Sem JavaScript ou se o chunk GSAP falhar, o desktop mostra o intervalo estático 01—03 e todos os pilares continuam legíveis. Com movimento reduzido, a timeline é revertida, os capítulos ficam compactos e o índice deixa de ser sticky. Mudanças de preferência durante a sessão são tratadas.

O palco visual é aria-hidden, pois repete informações já presentes nos headings reais. Não há aria-live disparando durante a rolagem. Headings, textos e ordem de leitura permanecem semânticos. Cleanup cancela timelines/ScrollTriggers locais; preferências e callbacks assíncronos não podem reativar uma cena desmontada.

## Arquitetura para assets futuros

`src/lib/philosophy-content.ts` mantém o texto e um campo `visual` por capítulo. Os três campos estão deliberadamente `null`. Cada visual futuro terá caminho, dimensões, ponto de foco, procedência e autorização de uso. O palco já aceita a imagem e reduz a escala do índice quando há imagem, sem reconstruir a seção.

A versão atual é um protótipo editorial tipográfico, não uma simulação de uma motocicleta. Integrar imagens futuramente exige receber material aprovado, ajustar enquadramentos e validar fallback/mobile com esses assets reais. O comportamento visual com imagens ainda não foi aprovado nem medido.

## Validação e material para aprovação

Build, lint, TypeScript e formatação. A suíte inclui 42 testes Playwright: os 33 existentes e nove execuções dos cenários de Filosofia em desktop/tablet/mobile. Cobrem progressão 01→02→03→02→01, coordenação do índice, ausência de canvas/imagens fictícias, movimento reduzido e conteúdo sem JavaScript.

Capturas revisadas em 1440×900, 768×1024 e 390×844, sem erros de página ou overflow horizontal nas checagens. Gravação desktop mostra o avanço e o retorno do scroll. Não representa medição de fluidez em dispositivos físicos; Core Web Vitals de produção não foram medidos nesta etapa.

Não houve deploy ou push. Este é um protótipo para aprovação antes de estender a linguagem a qualquer outra seção.
