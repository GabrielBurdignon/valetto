# Cabeçalho persistente — revisão local

## Escopo

Cabeçalho em `position: sticky`, fundo sólido #08090B e divisória discreta. Alturas preservadas: 96 px acima de 600 px; 80 px no mobile. Sem listeners de scroll, blur, mudança de altura, novas bibliotecas ou fontes.

Navegação desktop: A essência, Nossa filosofia, Como funciona, A experiência e acesso ao pré-lançamento. Até 1100 px, disclosure compacto com cinco destinos. O painel permite rolagem interna em paisagem, Escape devolve o foco ao botão; sair pelo teclado, clicar fora ou retornar ao desktop fecha o painel. Não é um diálogo modal nem prende o foco.

Sem JavaScript, os links nativos aparecem em fluxo natural nas telas compactas; no desktop, permanece a navegação convencional. O painel não usa animações. Preferência por movimento reduzido mantém a navegação nativa imediata.

## Marca pendente

`HeaderBrand` é um slot renderizado no servidor. Preserva exatamente o lettering provisório Arial/Helvetica enquanto `headerDesktop` ou `headerCompact` não estiverem aprovados no manifesto. Nenhuma imagem enviada foi adicionada. A integração definitiva exige arquivos oficiais com contornos e fidelidade aprovados; tamanhos e proporções deverão ser revistos com os arquivos reais. Rodapé, favicon e imagem social permanecem inalterados.

## Compatibilidade com as cenas

`--header-height` e `--header-clearance` coordenam o cabeçalho, as âncoras e os offsets de Nossa Filosofia, sem somar scroll-padding e scroll-margin. A faixa sticky mobile começa abaixo do cabeçalho. Em desktop baixo, a área visual considera a altura disponível e a composição textual recebe a folga correspondente. A narrativa estática permanece em fluxo natural. Nenhum controlador GSAP, fotografia, texto institucional ou timing de animação foi alterado.

## Validação

Build de produção, ESLint, TypeScript e Prettier aprovados. Suíte completa: 117 testes aprovados; o destino Nossa Filosofia também foi acrescentado à verificação sem JavaScript. Testes Playwright cobrem desktop, mobile e tablet, âncoras, teclado, Escape, menu sem JavaScript, movimento reduzido, rolagem reversível e compatibilidade dos elementos sticky. Novos testes verificam destinos, posição persistente, saída por Tab, rolagem interna em paisagem e folga da cena.

Capturas externas ao repositório em `/workspace/valetto-header-review/`: 1440×900, 768×1024, 390×844, 1440×390 e 844×390; abertura, menu e cena da filosofia, além de mobile sem JavaScript. `results.json` registra ausência de erros de execução e overflow horizontal nos cinco cenários. Revisão feita em Chromium emulado; dispositivos físicos e Safari não foram testados.

Sem commit, push ou deploy. A aplicação da marca oficial continua pendente.
