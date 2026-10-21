# A Experiência — quadro editorial cinematográfico

## Escopo e narrativa

Somente a seção 04 foi extraída de `src/app/page.tsx` para `ExperienceSection`, com estilos isolados. A headline e todos os textos institucionais, link e visão de expansão foram preservados literalmente. Hero, A Essência, Nossa Filosofia, Como Funciona e manifesto não foram alterados.

A entrada apresenta tipografia monumental acima do panorama, sem repetir a composição lateral do hero ou o sticky numerado da Filosofia. No desktop, a fotografia ocupa a largura da página em proporção 2:1. A descrição ocupa uma base editorial integrada ao gradiente inferior, deixando a motocicleta livre. Até 900px, usa-se o enquadramento vertical fornecido; tablet exibe um recorte 1,25:1 com foco em 50%/58%, e mobile preserva a proporção do original. O texto segue abaixo da foto, sem sobreposição.

A visão de expansão fica fora da cena, separada por linha, espaçamento e identificação próprios. O encerramento mantém a passagem para o manifesto claro existente, sem alterações no manifesto.

## Procedência e entrega

Pacote recebido: `valetto-experiencia-assets.zip`, com dois PNGs e `PROCEDENCIA-E-LICENCA.md`. O documento declara que as imagens foram geradas por IA para Valetto e autoriza uso no website e materiais correlatos. Não são fotografias documentais, comprovação de atendimento, modelos GLB ou renders derivados de modelo 3D licenciado.

Os PNGs originais estão preservados byte a byte em `public/media/experience/*-original.png`. O documento de procedência foi copiado para a mesma pasta, com apenas formatação Markdown normalizada. Não foi inventada licença adicional, autoria humana, exclusividade ou correspondência física entre as motocicletas das diferentes seções.

| Entrega       | Dimensões   | WebP          |
| ------------- | ----------- | ------------- |
| Desktop       | 1774 × 887  | 141.452 bytes |
| Mobile/tablet | 1122 × 1402 | 141.846 bytes |

A resolução recebida foi mantida sem ampliação artificial. O desktop está abaixo da resolução ideal proposta no briefing, mas foi revisado no painel real de 1440px. Não há validação visual em monitor 4K ou dispositivos físicos. A interface não solicita os PNGs originais. `picture` seleciona o recorte mobile; Next Image entrega o desktop com tamanhos responsivos. Carregamento tardio e dimensões reservadas evitam transferências prioritárias e deslocamentos de layout desnecessários.

## Movimento e acessibilidade

`ExperienceMotion` carrega GSAP/ScrollTrigger existentes quando a seção se aproxima do viewport. A headline e a descrição recebem revelação editorial do conjunto (opacidade mínima 0,82 e deslocamento de 8px). A foto, somente após carregamento/decodificação, usa opacidade mínima 0,88, deslocamento de +8 a −8px e escala estável de 1,04 para preservar a cobertura da janela. Os movimentos acompanham a rolagem nos dois sentidos. Não há pin, scroll hijacking, retenção artificial, canvas ou atualizações React por frame.

O HTML do servidor oferece headings, descrição acessível da imagem e link real. A descrição identifica a cena como imagem conceitual gerada por IA. Sem JavaScript, na falha do controlador ou com movimento reduzido, foto e textos são integralmente visíveis. Alterações da preferência revertem o contexto local; callbacks de imagem e importações assíncronas são cancelados ou ignorados após desmontagem. O conteúdo continua legível se a imagem falhar.

## Verificação

Testes cobrem fonte desktop/mobile, conteúdo e link preservados, ausência de canvas/overflow, progressão e retorno do parallax, redução de movimento inicial e durante a sessão, leitura sem JavaScript e carregamento de imagem deliberadamente atrasado. A suíte contém as 51 execuções anteriores e nove de A Experiência.

Revisão visual em 1440 × 900, 768 × 1024 e 390 × 844, incluindo entrada, fotografia, descrição e passagem para o manifesto. Gravação desktop em tempo real, avançando e retornando a 160px/s. Core Web Vitals de produção não foram medidos.

Nenhuma dependência adicionada. Sem push ou deploy nesta etapa.
