# Cinemática 2.0 — Filosofia, Processo e Experiência

Implementação local sobre `7d29ae1`. Hero, A Essência, manifesto, navegação, marca e arquivos de imagem preservados. Sem novas dependências, commits, push, deploy ou configuração de domínio/Vercel.

## Mudanças visuais concretas

- **Nossa Filosofia:** o painel lateral passa a ser uma faixa fotográfica de ponta a ponta no desktop. Os textos ocupam uma região de contraste sobre a mesma cena. Cockpit, engenharia e acabamento mantêm suas imagens originais, com aproximação e deslocamento discretos, dissoluções sem intervalo escuro e numeração sincronizada. No mobile, cada fotografia abre seu próprio capítulo, antes do título e do texto, em uma composição mais ampla.
- **Como Funciona:** a sequência 01–04 ganha escala editorial e uma linha contínua compartilhada. Cada número cresce e recebe contraste durante sua etapa, enquanto os anteriores assentam em escala menor. Textos acompanham o avanço com deslocamento e contraste suaves, sem desaparecer. A composição vertical própria permanece no mobile.
- **A Experiência:** o panorama ocupa uma cena mais alta. No desktop, a descrição passa a ocupar o lado direito da fotografia, mantendo a motocicleta livre à esquerda; no mobile, o texto continua abaixo da imagem. As linhas da headline se aproximam da cena, a máscara abre a fotografia e um movimento de escala/parallax cria profundidade bidimensional. A visão de expansão segue fora da imagem, separada por divisória. Uma faixa clara abre a passagem para o manifesto existente, sem alterar seu componente ou conteúdo.

## Comportamento técnico preservado

GSAP e ScrollTrigger compartilhados, carregados progressivamente pelos controladores existentes. Sem pinning, scroll hijacking, perspectiva falsa, rotação 3D, filtros animados ou estado React por frame. As transições são reversíveis e se desfazem quando a preferência por movimento reduzido muda. O HTML está completo sem JavaScript.

As três fotografias do palco desktop são decodificadas antes da ativação. A altura dos capítulos é reservada também na versão estática: a chegada tardia das fotos não desloca a timeline abaixo. No mobile, mantém-se o carregamento lazy das imagens em fluxo. A indicação `sizes` do palco foi corrigida para sua nova largura real.

Em telas desktop de pouca altura, a fotografia recebe uma altura adequada ao espaço disponível e os indicadores ficam restritos ao lado esquerdo, sem cruzar os parágrafos. Cabeçalho sticky e âncoras permanecem intactos.

## Evidências de validação

Build de produção, lint, TypeScript e formatação. Suíte completa Playwright: **129 testes aprovados**, em desktop, tablet e mobile, incluindo testes novos de cobertura das bordas do panorama, abertura reversível, sobreposição em telas de pouca altura e carregamento tardio sem deslocar o processo. Os testes de carregamento progressivo, navegação, fontes, versões sem JavaScript e movimento reduzido continuam na suíte.

Capturas e gravações em `/workspace/valetto-cinematic-sections/antes/` e `depois/`, com viewports 1440×900, 768×1024 e 390×844. O comparativo MP4 utiliza o mesmo viewport desktop, o mesmo roteiro e a mesma duração de cada passagem entre seções, com avanço e retorno em tempo real. A distância acompanha a altura própria das composições. O início é alinhado após a preparação dos controladores; a exportação não acelera o vídeo.

Nenhum erro de execução ou overflow horizontal nos três cenários capturados. Testes adicionais exercitam 1440×390. Validação em Chromium emulado; Safari, dispositivos físicos e CDN não foram testados. Não foi feita uma nova medição Lighthouse, nem se presume uma pontuação a partir destes testes.

A implementação continua local para aprovação visual.
