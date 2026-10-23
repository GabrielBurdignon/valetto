# Acabamento local — Valetto 2.0

Base: `0266100`. Sem commit, push ou deploy. Ajustes restritos ao CSS e documentação; conteúdo, fotografias, fontes, JavaScript e animações preservados.

## Identidade

PNG fornecido no ZIP e WebP público comparados em RGBA: zero alterações em pixels visíveis ou alpha. A referência reproduzida é o arquivo do responsável, sem reconstrução dos dois Ts, lettering ou assinatura. Dos 1.572.519 pixels, 1.220.065 são totalmente transparentes. Composição sobre cinza permite distinguir transparência real de visualizadores que expõem RGB oculto. Não foi observado halo ou ruído adicional nas aplicações revisadas; não houve limpeza automática do desenho.

Aumento moderado do cabeçalho: 180 → 190 px no desktop; 150 → 160 px nos layouts compactos. Alturas de 96/80 px preservadas, inclusive as folgas para as âncoras e Filosofia. Altura proporcional da imagem: aproximadamente 76/64 px. Rodapé permanece com até 300 px. Arquivo de 1983 px fornece resolução suficiente para estas aplicações em densidades 1×, 2× e 3×; o WebP servido continua com 191.666 bytes.

**Limitação:** o lockup completo concentra símbolo, lettering e uma assinatura muito longa. A assinatura continua pequena no cabeçalho, apesar do ganho discreto. Recomendação pendente, sem implementação: solicitar uma aplicação horizontal/compacta oficial ou vetor, para melhorar sua leitura sem aumentar o cabeçalho ou reconstruir a marca. A assinatura é mais legível no rodapé e também está disponível no texto alternativo da imagem.

## Contraste comprovado e correções

- Filosofia: reflexos metálicos atravessavam os parágrafos, especialmente na terceira cena. Reforçada a graduação escura existente à direita e clareado o índice pequeno no palco desktop. Fotografias, composição, dissoluções e fluxo mobile preservados.
- Experiência: ajustada somente a graduação horizontal existente. O escurecimento continua progressivo; a proteção radial original permanece suave. Sem mancha circular, painel opaco ou nova animação. O CSS mobile continua colocando o texto em fundo sólido.

Amostragem raster no Chromium de produção, 1440 × 900, com cada cena assentada e sem alterar a geometria. Texto ocultado para capturar o fundo, comparando a luminância sRGB desse fundo com a cor computada do texto. O mínimo abaixo considera todo o retângulo do parágrafo, inclusive espaços sem glifos, portanto é conservador. Não equivale a certificação de contraste em todos os frames, telas ou navegadores.

| Parágrafo            |  Antes | Depois |
| -------------------- | -----: | -----: |
| Conveniência         | 2,93:1 | 6,51:1 |
| Responsabilidade     | 2,60:1 | 6,11:1 |
| Atenção aos detalhes | 2,04:1 | 5,24:1 |
| A Experiência        | 3,16:1 | 4,61:1 |

Não foram alterados os demais textos ou sua hierarquia. Não houve mudança visual significativa que exigisse reconstrução ou aprovação de nova composição.

## Revisão responsiva e evidências

Capturas antes/depois em `/workspace/valetto-finish-review/antes/` e `depois/`: 1440 × 900 (1×), 768 × 1024 (2×), 360 × 800 (2×), 390 × 844 (3×), 430 × 932 (3×) e 844 × 390 (2×). Cabeçalho, Essência, três cenas de Filosofia, timeline, Experiência, manifesto, rodapé e menu compacto. Comparativos lado a lado na raiz dessa pasta. Home completa com movimento reduzido em 360, 390 e 430 px.

Sem overflow ou erros de console nas jornadas capturadas. Menu abre e fecha com Escape nas três larguras mobile; cinco destinos preservados. Logo carrega sem JavaScript em todas as três larguras. Movimento reduzido remove os transforms do panorama. Capturas e testes em Chromium emulado, sem validação em aparelhos físicos ou Safari.

Nenhum recurso adicional de rede, dependência ou controlador foi introduzido. Não foi executada nova campanha Lighthouse; não se atribui nova pontuação ou equivalência de desempenho sem medição.

## Validação técnica

Build de produção, lint, TypeScript e formatação aprovados. Suíte final Playwright: **138 testes passaram (2,3 minutos)**, incluindo navegação, imagens, sem JavaScript, movimento reduzido, fontes, rolagem reversível e sticky em telas baixas. Logs locais em `/tmp/valetto-finish-*.log`. Uma execução intermediária foi invalidada por recompilação concorrente do diretório `.next`; foi repetida integralmente com o build final congelado. Nenhuma falha dessa execução intermediária foi tratada como regressão visual sem confirmação.
