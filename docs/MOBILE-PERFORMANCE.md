# Valetto — otimização mobile com aparência preservada

## Resultado

Redução comprovada de **23,6% no JavaScript transferido na abertura**, de 202.401 para 154.720 bytes, e de 29,8% no tempo mediano de avaliação de scripts. As animações e o HTML permanecem. A mediana Lighthouse ficou em 96 antes e depois; **não houve ganho conclusivo de LCP nem de pontuação** nesta rodada.

O resultado antigo de 72 pontos / LCP 3,63s / TBT 696ms não se reproduziu nas três execuções novas do build anterior à otimização. Não se atribui a mudança de 72 para 96 ao código desta etapa.

## Método e controle de cache

- Baseline: commit `099ddcd`, build de produção novo, servidor Next na porta 3160. Otimização: mesmo checkout/configuração, novo build de produção, porta 3162. Ambos em loopback, mesma máquina e Chromium 154.
- Lighthouse 13.5.0, perfil móvel padrão (412×823, DPR 1,75), throttling **simulado**: RTT 150ms, throughput 1638,4Kbps e CPU 4×. Três execuções sequenciais antes e três depois, sem testes, profiler ou capturas concorrentes.
- Cada processo Lighthouse criou perfil de navegador isolado e manteve a limpeza de storage habilitada (`disableStorageReset=false`). DevTools registrou **zero respostas de cache do navegador** nas seis execuções; nenhum service worker. As reduções de requests e bytes foram verificadas nos próprios logs, não inferidas da pontuação.
- Os assets são os mesmos e os dois servidores usam o pipeline Next existente. Não se trata de uma medição do primeiro processamento de uma imagem em um deploy recém-criado: o cache de otimização do servidor não foi invalidado entre execuções. A imagem LCP mobile é um WebP estático direto, sem passar por esse cache. O custo de CDN/DNS/TLS da Vercel não está representado no loopback.
- As condições de software/throttling são equivalentes. O benchmark de CPU do Lighthouse variou: 2311–2463,5 antes e 2304–2468,5 depois. Isso é registrado como variação do ambiente compartilhado, sem descartar resultados ou escolher apenas a melhor execução.
- Além dessas seis medições, foi feito um perfil CDP por versão, com rede realmente limitada a 1638,4Kbps/150ms e CPU 4×, cache desativado. Esse perfil instrumental tem overhead e não é misturado à mediana Lighthouse. A comparação usa `before/cpu-profile.json` e `after/cpu-profile.json`, executados isoladamente. Um perfil auxiliar feito junto de capturas foi invalidado e preservado em `after/overlapped-profile`; ele não afeta as seis medições Lighthouse.

Reprodução: `measure.sh`, relatórios HTML/JSON, traces, DevTools logs, cobertura e CPU profiles estão em `/workspace/valetto-mobile-performance/`. Ferramentas de auditoria instaladas anteriormente em `/tmp`, sem dependências adicionadas ao projeto.

## Comparativo antes/depois

| Medida                                         | Antes: mediana (mín.–máx.) | Depois: mediana (mín.–máx.) |
| ---------------------------------------------- | -------------------------- | --------------------------- |
| Lighthouse Performance                         | 96 (96–100)                | 96 (96–99)                  |
| LCP                                            | 2,68s (1,88s–2,84s)        | 2,72s (2,12s–2,77s)         |
| TBT                                            | 64ms (62ms–65,5ms)         | 66ms (58,5ms–70ms)          |
| CLS                                            | 0 (0–0)                    | 0 (0–0)                     |
| JS inicial transferido, incluindo headers      | 202.401 bytes              | 154.720 bytes               |
| JS inicial descomprimido                       | 616.927 bytes              | 497.510 bytes               |
| Requests de scripts na navegação sem interação | 12                         | 9                           |
| Avaliação de scripts, auditoria main-thread    | 683ms                      | 480ms                       |
| Trabalho total de main-thread, auditoria       | 1630ms                     | 1241ms                      |

Execuções antes: 100 / LCP 1,88s / TBT 64,0ms; 96 / LCP 2,68s / TBT 65,5ms; 96 / LCP 2,84s / TBT 62,0ms. Depois: 96 / LCP 2,72s / TBT 66,0ms; 96 / LCP 2,77s / TBT 58,5ms; 99 / LCP 2,12s / TBT 70,0ms. As faixas de LCP/TBT se sobrepõem; o TBT mediano final variou de 64 para 66ms, sem melhora comprovada. A redução determinística de bytes, requests e execução de módulos na abertura é a evidência mais forte. A rodada exploratória anterior à correção dos limites de scroll está preservada em `after-first-pass`; esta tabela usa somente o build final.

## Diagnóstico do LCP e dos recursos

O elemento LCP foi `.hero-poster img`, usando `/media/hero/motorcycle-mobile-640.webp`, nas seis execuções. O asset de 52.140 bytes já era entregue com `loading=eager` e `fetchPriority=high`, no enquadramento responsivo aprovado. Não houve download duplicado da variante desktop na apresentação móvel observada. Imagem, formato, prioridade, foco e dimensões não foram alterados nesta etapa.

O insight de LCP fornece tempos **do trace local não simulado**. As medianas abaixo explicam a descoberta/renderização, mas não podem ser somadas para reproduzir o LCP simulado de 2,68/2,72s:

| Parcela do insight                    | Antes   | Depois  |
| ------------------------------------- | ------- | ------- |
| TTFB                                  | 14,7ms  | 16,1ms  |
| Espera até iniciar recurso            | 16,5ms  | 16,7ms  |
| Download da imagem                    | 27,5ms  | 17,1ms  |
| Atraso de renderização após o recurso | 117,0ms | 132,0ms |

Não há fonte web: Arial/Helvetica e Georgia são fontes do sistema, com zero requests de fontes. Não se adicionou preload nem dependência de fontes. Os dois stylesheets continuam iguais; são render-blocking, mas não foi encontrada evidência para justificar alteração do CSS aprovado ou da prioridade da imagem. O trabalho de JavaScript foi a oportunidade de baixo risco comprovada.

## Profiling da thread principal

O perfil CDP separado mostrou o custo no bootstrap/hidratação e no carregamento dos módulos, além do motor de scroll. Amostras atribuídas por URL, incluindo atribuição de frames nativos ao ancestral JS mais próximo:

| Grupo identificado no código do chunk   | Antes | Depois                   |
| --------------------------------------- | ----- | ------------------------ |
| React/React DOM — chunk com hydrateRoot | 240ms | 274ms                    |
| Runtime Next                            | 117ms | 112ms                    |
| Carregador Turbopack                    | 289ms | 222ms                    |
| GSAP core                               | 60ms  | Não carregado em repouso |
| ScrollTrigger                           | 82ms  | Não carregado em repouso |
| Bundle de componentes/controladores     | 18ms  | 11ms                     |

São tempos de amostragem de um perfil direcionado, não uma decomposição exata e exclusiva de CPU por biblioteca. Não se atribui todo o TBT ao GSAP. React/Next e o carregador também aparecem entre os maiores custos. A inspeção dos chunks confirmou as identidades: APIs `hydrateRoot`/React no framework e identificadores/licença de GSAP/ScrollTrigger nos módulos correspondentes.

As long tasks observadas nesse perfil foram 310ms, 123ms antes; 294ms depois. O custo de React permanece, e o perfil não comprova uma regressão ou defeito dessa biblioteca. Os controladores de seções distantes **já evitavam criar timelines na abertura**, mas o seu código ainda vinha no bundle inicial; não foram acusados de inicializar cenas que permaneciam com `data-enhanced=false`.

GSAP e ScrollTrigger respondiam por aproximadamente 45,7KB de transferência inicial, além dos stubs de carregamento. O parallax do hero era suficiente para importar e registrar esse motor ao carregar a imagem, mesmo sem qualquer rolagem. As timelines abaixo da dobra não foram a causa comprovada do custo de inicialização dessas bibliotecas.

## Otimizações implementadas

1. **Preparação do parallax por intenção de scroll:** a animação de entrada do hero continua em CSS, com os mesmos tempos, opacidades e transformações. O motor de scroll é solicitado em wheel, touchstart, teclas de rolagem ou scroll programático; restauração em posição já rolada também é tratada. O tween continua com os mesmos 6/12px e scrub 0,8. Movimento reduzido evita a preparação e reverte efeitos ativos.
2. **Code splitting dos controladores:** Essência, Filosofia, Processo e Experiência mantêm seus wrappers HTML e conteúdo de servidor. O hook pequeno `useProgressiveController` observa a aproximação e importa o controlador DOM correspondente. Os limiares já usados (600/800px) foram preservados. Essência pode aproximar-se ainda na abertura; seu controlador nativo pequeno pode ser carregado nesse momento. Os controladores das três seções mais distantes não vêm na abertura móvel em repouso.
3. **Fallback e lifecycle:** importações que terminem após desmontagem não iniciam efeitos; cada controlador conserva seu cleanup, preferências, movimentos e comportamento reversível. Falha de importação deixa o HTML visível. Preferência reduzida inicial e alternada antes/depois da aproximação são testadas.
4. **Limites de rolagem após ativação:** a suíte identificou uma corrida quando a ativação de Filosofia altera a altura acima de Processo. O controlador recalcula os limites ScrollTrigger após aplicar o estado aprimorado. Um teste segura deliberadamente o download do controlador de Filosofia e verifica a timeline seguinte após liberá-lo. Isso ocorre abaixo da dobra e não adiciona trabalho à abertura.
5. **Hero estático como composição de servidor:** a escolha entre poster e futuro modelo não precisa de um componente client próprio. O scaffold de cena licenciada foi isolado em `licensed-visual.tsx`. R3F/Three continuam disponíveis para evolução futura e desativados; não foram removidos nem apresentados como ativos.

Não houve mudança em imagens, fontes, textos institucionais, CSS, layout, paleta, duração de entradas ou parâmetros das animações aprovadas. Nenhuma biblioteca adicionada. O code splitting pode acrescentar chunks/requests ao percurso completo; a redução quantificada refere-se à abertura sem interação, não ao total de JavaScript de uma visita que percorra todas as seções. O custo do motor de scroll é **adiado, não eliminado**: ele continua necessário quando o visitante interage. Em rede lenta, a primeira importação pode acrescentar latência ao início do parallax; o conteúdo e a entrada CSS permanecem visíveis nesse intervalo.

## Validação e limites

Build de produção, lint, TypeScript strict e formatação aprovados. A suíte completa passou em 84/84 execuções, incluindo os 75 cenários anteriores, ajuste da espera do teste de parallax para o novo gatilho e nove verificações de carregamento progressivo/preferência reduzida/limites de rolagem. Filosofia e Processo passaram também em 36 execuções focadas, repetidas duas vezes.

A revisão visual percorreuu desktop 1440px, tablet 768px, mobile 390px e 320px, fotografias, timelines nos dois sentidos e transição entre seções. Sem erros de console, overflow ou canvas nas quatro larguras. Menu, skip link, navegação sem JavaScript e cancelamento por movimento reduzido foram verificados. Não houve push ou deploy.

**Gargalo remanescente:** hidratação/bootstrap de React/Next e renderização inicial ainda existem. Não foi demonstrado que a experiência cinematográfica precise ser reduzida para melhorar o LCP; tampouco há evidência para prometer uma pontuação maior com esta mudança. Alterar a entrada aprovada só para obter score não seria justificado pelo profiling obtido. Próximo passo recomendado: validar LCP/INP em aparelhos reais e na CDN, preservando esta redução de trabalho inicial. Os números históricos de 72 pontos não são usados como baseline desta comparação.
