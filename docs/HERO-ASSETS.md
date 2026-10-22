# Hero cinematográfico estático

## Estado atual e procedência

Imagem integrada ao hero existente. O original `Motocicleta.png` foi recebido no arquivo `Motocicleta.zip`, enviado pelo responsável do projeto. Conforme informado pelo responsável, trata-se de **imagem gerada por IA fornecida pelo responsável do projeto**. Não há atribuição de autoria adicional ou licença presumida. A imagem não é um GLB nem evidencia a existência de um modelo 3D.

Original preservado sem alteração em `public/media/hero/motorcycle-original.png`: 1672 × 941 px, 1.975.734 bytes. SHA-256: `3b53a3ad93f91aa55f168a944e10075e19e885b4f1e0d1b9cfdb05a597506a52`.

Derivados de apresentação, sem geração de geometria ou alteração artística da moto:

| Arquivo                   | Dimensões  | Tamanho       | Preparação                                                       |
| ------------------------- | ---------- | ------------- | ---------------------------------------------------------------- |
| `motorcycle-desktop.webp` | 1672 × 941 | 100.114 bytes | WebP qualidade 88, effort 6                                      |
| `motorcycle-mobile.webp`  | 920 × 941  | 89.874 bytes  | Recorte à direita a partir de x=752; WebP qualidade 86, effort 6 |

Ambos ficam em `public/media/hero/`. O recorte móvel mantém as duas rodas, retrovisores e para-brisa. O original não é solicitado pela página. A configuração de paths, dimensões, descrição e procedência está em `src/lib/hero-asset.ts`.

## Composição e comportamento

`HeroPoster` apresenta a imagem como conteúdo HTML, sem canvas. Desktop preserva espaço negativo à esquerda e moto à direita. Tablet reserva a coluna direita para a moto; mobile traz o produto abaixo do texto, com espaçamentos ajustados somente dentro do hero. Máscaras e gradientes suaves integram as bordas ao fundo `#08090B`. Headline, tipografia, menu, logomarca, CTA e demais seções mantidos.

`picture` seleciona o recorte móvel até 900px. Imagem eager com fetchPriority alto; evita preload separado do desktop que provocaria download duplo em mobile. Dimensões e região visual reservadas antes do carregamento. A otimização Next Image continua disponível para desktop.

Após o carregamento, a entrada dura 1,6 s com fade de 0,45 a 1, deslocamento vertical de 10px e escala de 1,015 a 1. O GSAP ScrollTrigger anima a camada independente em até 12px (6px em telas menores), sem pin ou bloqueio de scroll. Cleanup reverte animações e protege contra corridas de carregamento assíncrono. Falha do chunk de animação não oculta a imagem.

`prefers-reduced-motion` desativa entrada e parallax, inclusive quando muda durante a sessão. Sem JavaScript, imagem, headline e CTA continuam funcionais.

## 3D preservado para evolução futura

`motorcycleAsset` permanece `null`. A apresentação estática não monta o canvas nem carrega GLB/HDR. Os componentes Three.js/R3F/Drei de iluminação e câmera permanecem preparados, sem ativação. Para evoluir: obter GLB autocontido de moto sem marcas, materiais PBR e licença que autorize distribuição comercial na web; registrar comprovação e validar enquadramento, render estático correspondente e desempenho. Nenhum dado de licença ou autoria foi inventado nesta etapa.

## Validação

Build de produção, lint, TypeScript strict, formatação e testes Playwright. Cenários cobrem imagem carregada, ausência de canvas/requests GLB, HTML sem JavaScript, navegação, CTA, menu móvel, teclado, redução de movimento e parallax real na rolagem. Capturas revisadas em 1440 × 900, 768 × 1024 e 390 × 844, incluindo a composição normal e a alternativa sem movimento. Nenhum overflow horizontal nos tamanhos testados.

Medições de laboratório em Chromium local, build de produção, sem limitação de CPU/rede, com um contexto novo por viewport, são registradas em `test-results/review/metrics.json`. Não constituem percentil 75 de produção. Não foi medido INP de campo nem testados dispositivos físicos/Safari/Firefox.

Nenhum deploy ou envio ao GitHub foi realizado nesta etapa.

## Refinamento visual do hero aprovado

Escala tipográfica, headline, marca, menu e CTA preservados. A imagem ganhou 20px adicionais de respiro superior e 24px à direita no desktop; tablet/mobile usam recuo interno de 10px no topo e 12px nas laterais, mantendo a área de layout reservada. As máscaras ganharam transições intermediárias, e composição `lighten` sobre o fundo isolado `#08090B` elimina diferenças de preto sem adicionar luz artificial ou editar a imagem original.

A revelação da moto permanece no início. Após 260ms, entram a tipografia e a assinatura; a descrição entra após 400ms, e o CTA após 620ms. São animações CSS somente de opacidade/transformação, sem novas dependências ou JavaScript. Nenhum elemento parte de opacidade zero. Sem hidratação, a tipografia e o CTA permanecem completamente visíveis. Movimento reduzido desativa toda a sequência e o parallax.

Validação desta revisão: build, ESLint, TypeScript e formatação aprovados; 21 testes Playwright aprovados. Capturas normais e com redução de movimento revisadas em 1440×900, 768×1024 e 390×844. Sem overflow horizontal ou erros de página nas checagens. A medição local adicional registrou CLS 0 nos três tamanhos, uma única imagem solicitada por viewport e nenhum canvas. Esses dados locais não representam Core Web Vitals de produção nem desempenho de dispositivos físicos. Nenhum deploy ou envio ao GitHub nesta revisão.

## Variante responsiva da auditoria de publicação

Derivado adicional `motorcycle-mobile-640.webp`: 640 × 655px, 52.140 bytes, WebP qualidade 86. Produzido do mesmo PNG original, preservando o recorte x=752–1672 e sem edição artística. O `source` mobile oferece candidatos 640w/920w e tamanhos de 80vw no mobile ou 48vw no tablet; dispositivos de maior densidade continuam podendo selecionar o arquivo de 920px. O hero, as máscaras, os movimentos e os arquivos anteriores permanecem preservados. No cenário Lighthouse móvel avaliado, o candidato de 640px reduz a transferência do asset de 89.874 para 52.140 bytes (cerca de 42%).
