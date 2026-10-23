# Cinemática 2.0 — primeira entrega local

Base de comparação: commit `0f22f56`. Implementação limitada ao hero e A Essência. Sem novas dependências, imagens, fontes, modelos, configurações da Vercel ou publicação.

## Resultado implementado

- Hero: composição desktop em dois níveis tipográficos, com “Você não.” em escala maior; motocicleta com presença ampliada; entrada por máscara, deslocamento e escala; imagem e texto percorrem distâncias diferentes durante a saída. A composição mobile mantém três linhas e uma cena fotográfica própria abaixo do texto.
- A Essência: headline editorial com movimentos coordenados entre suas duas linhas; introdução alinhada à direita no desktop; macro de largura integral, com abertura progressiva da máscara e aproximação suave. A escala mínima mantém cobertura das bordas durante o deslocamento.
- Nenhuma retenção de scroll ou pin. A escala da motocicleta continua sendo uma transformação bidimensional da imagem aprovada. Não há rotação, nova geometria ou iluminação artificial adicionada.
- Textos, arquivos fotográficos, Inter + Georgia, marca provisória, navegação e outras seções preservados. Apenas a distribuição das linhas do hero foi alterada, mantendo a frase.

## Carregamento e acessibilidade

Entrada inicial em CSS, após a fotografia decodificar. O controlador do hero só importa GSAP/ScrollTrigger após intenção de rolagem; o de A Essência é carregado quando o conteúdo se aproxima, com margem de 120 px. Motores compartilhados, sem estado React por frame. A fotografia do hero mantém prioridade alta; macro permanece lazy e informa sua nova largura real.

HTML completo e visível sem JavaScript, sem esconder conteúdo com CSS por padrão. Troca da preferência de movimento desmonta os efeitos, restaura transformações e abre integralmente o painel. Nenhum filtro ou desfoque em animação; movimento menor no mobile. O contraste da tipografia do hero é preservado durante a saída, limitando a redução de opacidade.

## Validação e evidências

Build de produção, lint, TypeScript e formatação aprovados. Suíte Playwright: 120 testes, incluindo reversão da escala, abertura e fechamento do macro, cobertura das bordas, decodificação da fotografia, movimento reduzido, ausência de JavaScript, fontes, navegação e regressões das demais seções.

As expectativas antigas de três linhas no desktop e de animações WAAPI foram atualizadas para a composição solicitada nesta etapa e para o comportamento de scroll. A comparação tipográfica histórica continua verificando suas duas variantes, textos e fotografias compartilhados.

Medição local em contextos novos de Chromium: 148.390 bytes de corpo de JavaScript inicial, CLS 0 e nenhum erro de console ou overflow em 1440×900, 768×1024, 390×844, 1440×390, 360×640 e 430×932. A suíte confirma que GSAP e os controladores das seções posteriores não são baixados em repouso. Não se trata de uma nova pontuação Lighthouse ou validação de CDN; Safari e dispositivos físicos não foram testados.

Capturas e gravações fora do repositório: `/workspace/valetto-cinematic-2/`. Comparação desktop em 1440×900, com avanço e retorno em tempo real, exportada como MP4 lado a lado. A duração da passagem é equivalente; a distância percorrida considera a altura própria de cada versão. Não há aceleração na exportação. Capturas em desktop, tablet e mobile, além de versões sem JavaScript e com redução de movimento.

Sem commit, push ou deploy. Filosofia, Como Funciona, A Experiência e manifesto não recebem esta nova linguagem nesta entrega.
