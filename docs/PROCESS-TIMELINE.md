# Como Funciona — apresentação progressiva

## Escopo e composição

A seção 03 mantém literalmente a headline, as quatro etapas de `src/lib/brand.ts` e a nota de pré-lançamento. O JSX foi extraído de `page.tsx` para `ProcessSection`, um componente de servidor. Hero, A Essência, Nossa Filosofia e demais seções não foram alterados.

Uma linha única articula os quatro momentos, sem cards, fotografias, palco sticky ou retenção de rolagem. No desktop, quatro colunas têm leitura simultânea, numeração ampliada e espaço de leitura consistente. Até 900px, a composição passa a uma coluna com linha vertical, números à esquerda e texto à direita. A linha tem quatro segmentos contíguos, sem lacunas entre etapas.

## Movimento e fallback

`ProcessTimeline` isola a melhoria progressiva no cliente. O GSAP/ScrollTrigger já existente é importado apenas quando a seção se aproxima do viewport. Uma timeline local, com scrub de 0,35s, preenche os quatro segmentos e coordena contraste/escala dos números (máximo 1,035) e opacidade dos textos (mínimo 0,86). O avanço funciona em ambos os sentidos. O índice de cena acompanha a timeline renderizada, sem atualizações de estado React por frame nem anúncios de leitor de tela durante o scroll.

No desktop, o percurso vai do topo da timeline em 80% do viewport até sua base em 42%. No mobile, o final corresponde à base em 60% do viewport. Não existe pin, interceptação de wheel/touch ou altura artificial para prolongar a seção.

O HTML contém lista ordenada, headings e parágrafos reais. A linha e números visuais não duplicam a ordem anunciada pela lista. Sem JavaScript, com falha no chunk ou com redução de movimento, o processo permanece integralmente visível e a linha completa é estática. Mudanças de breakpoint e preferência desfazem o contexto GSAP e refazem somente os efeitos locais. Cleanup impede callbacks assíncronos de reativarem um componente desmontado.

Não foram adicionados bibliotecas, imagens, modelos, ações de serviço ou dados operacionais.

## Validação

A suíte cobre avanço 01→02→03→04 e retorno, preenchimento de cada segmento, troca desktop→vertical, ausência de overflow/erros, redução de movimento e lista sem JavaScript com headline e nota de pré-lançamento. As 42 verificações anteriores continuam incluídas; com os nove cenários de Processo, a suíte tem 51 execuções.

Build, lint, TypeScript, formatação e as 51 execuções Playwright passaram na versão final. Capturas revisadas em 1440 × 900, 768 × 1024 e 390 × 844, sem erros de página nem overflow horizontal. A gravação desktop registra rolagem em tempo real, a 110px/s, avançando e retornando pela timeline. Core Web Vitals de produção e dispositivos físicos não foram medidos.

Sem push ou deploy nesta etapa.
