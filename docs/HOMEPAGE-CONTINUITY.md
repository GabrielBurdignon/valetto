# Integração cinematográfica da homepage — revisão local

Base: `be408bc`. Sem commit, push, deploy, novos assets ou bibliotecas.

## Mudanças implementadas

- Hero → Essência: a entrada da identificação do capítulo acompanha a saída da cena, mantendo a composição do hero e a imagem aprovada.
- Essência → Filosofia: menor intervalo após a leitura institucional e entrada da headline coordenada com o encerramento do capítulo claro.
- Filosofia: menor permanência dos capítulos, com a mesma altura reservada antes e depois de carregar as fotos. A graduação de contraste preserva mais detalhes do cockpit e das superfícies, com texto mais claro. A segunda frase de Como Funciona acompanha a saída da sequência, no desktop.
- Processo → Experiência: timeline mais compacta, especialmente no mobile, e continuidade de fundo para a próxima cena. Números, quatro etapas, progresso e textos preservados.
- Experiência → Manifesto: contraste localizado ao redor da descrição, preservando mais cor no panorama; bordas da proteção são transparentes. Intervalo menor após a visão de expansão e passagem clara mais direta para o manifesto. O manifesto permanece um momento de leitura, sem nova animação repetitiva.

Controladores existentes e HTML gerado no servidor preservados. As transições se desfazem com movimento reduzido e funcionam nos dois sentidos da rolagem. Não há retenção de página nem estado React por frame. Fontes Inter + Georgia, fotografias, textos e menu sticky permanecem.

## Logo integrada

Arquivo fornecido em `Logo Valetto em Branco.zip`, agora aplicado no cabeçalho e rodapé. Original PNG preservado em `docs/brand/`; versão WebP sem perdas e com transparência em `public/media/brand/`. Nenhuma reconstrução, correção de contornos ou alteração de proporções. Os vídeos abaixo foram produzidos antes desta integração e ainda mostram a marca provisória.

## Validação e evidências

Build de produção, lint, TypeScript e Prettier aprovados. Suíte Playwright: **132 testes aprovados**. Inclui verificação nova de desmontagem dos efeitos entre capítulos quando se reduz movimento ou muda o layout; continuam os testes de imagens, carregamento tardio, rolagem reversível, fontes, menu, HTML sem JavaScript e ausência de overflow.

Gravações antes/depois em `/workspace/valetto-continuity/`, viewport 1440×900, da abertura ao rodapé e retorno ao início. Mesmo roteiro e duração de cada passagem, em tempo real; a distância considera a altura própria das versões. Sem aceleração na exportação. Capturas adicionais em 768×1024 e 390×844.

Vídeo completo: `homepage-completa.mp4`. Comparativo lado a lado: `comparativo-homepage.mp4`. As capturas e vídeos mostram a marca provisória, pois o arquivo da logo ainda não está acessível. Chromium emulado; dispositivos físicos e Safari não foram testados. Não há nova pontuação Lighthouse nesta etapa.
