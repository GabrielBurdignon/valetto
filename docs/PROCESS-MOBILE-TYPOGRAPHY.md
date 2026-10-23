# Como Funciona — revisão pontual da tipografia mobile

## Decisão

Preservar as três linhas em 390px e o corpo de **36px**. A quebra automática de
Inter deixava “resto.” isolado. Foi aplicado somente balanceamento de frases:

```text
Você entrega a chave.
Nós cuidamos
do resto.
```

O ajuste está exclusivamente em `process.module.css`, abaixo de 600px e protegido
por `@supports (text-wrap: balance)`. O título usa balanceamento e seu span já
existente forma um bloco para balancear a segunda frase independentemente. Sem
novo HTML, JavaScript, conteúdo, font-size, tracking, entrelinha ou margem.
Browsers sem suporte mantêm a quebra anterior, com todo o conteúdo acessível.

## Comparação

| Largura | Antes de Inter | Inter antes do refinamento | Inter final                                                          |
| ------- | -------------- | -------------------------- | -------------------------------------------------------------------- |
| 360px   | 4 linhas       | 4 linhas                   | 4 linhas: “Você entrega” / “a chave.” / “Nós cuidamos” / “do resto.” |
| 390px   | 2 linhas       | 3 linhas, “resto.” isolado | 3 linhas, segunda frase balanceada                                   |
| 430px   | 2 linhas       | 2 linhas                   | 2 linhas, sem quebra adicional                                       |

Em relação à Inter anterior, a altura do título e o início da timeline não
mudaram em nenhuma largura:

| Largura | Altura do título | Início da timeline, relativo à seção |
| ------- | ---------------: | -----------------------------------: |
| 360px   |         149,75px |                             353,55px |
| 390px   |         112,31px |                             316,11px |
| 430px   |          74,88px |                             278,67px |

A mudança melhora agrupamento semântico e ritmo, preservando a hierarquia entre
headline, numeração e etapas. Nenhum overflow ou erro de página nas capturas.
Outras seções, animações, fotografias e textos não foram alterados. Georgia e o
lettering provisório da marca mantêm a implementação da etapa anterior.

## Capturas e limites

Diretório `/workspace/valetto-process-type-review/`, fora do repositório:

- `anterior-{360,390,430}.png`: build anterior à adoção de Inter.
- `inter-atual-{360,390,430}.png`: Inter antes deste refinamento.
- `inter-balanceado-{360,390,430}.png`: build final, sem injeção de CSS de proposta.
- `measurements.json`: comparação inicial com protótipo temporário.
- `final-measurements.json`: confirmação do CSS efetivamente implementado.

Chromium, DPR 1, viewport com altura 844px, fontes carregadas, movimento reduzido
para comparar toda a seção sem diferenças de progresso da animação. O baseline
Linux usa Liberation Sans como substituta de Arial/Helvetica; Inter é o arquivo
local real. Não representa teste em Safari ou dispositivo físico.

## Validação

Build, lint, TypeScript e formatação aprovados. **21 testes focados aprovados**
(`process.spec.ts` e `typography-integration.spec.ts`, três projetos). O teste novo
confere as três larguras, as frases balanceadas, tamanho preservado e a igualdade
da altura e da posição da timeline com a quebra anterior. A cobertura existente
verifica reversibilidade, movimento reduzido, leitura sem JavaScript, isolamento
da fonte, fallback e falha de download.

Não houve nova medição de LCP/CLS: fonte, carregamento e geometria do hero não
mudaram; o ajuste é CSS localizado abaixo da dobra, sem alteração da altura do
processo comparada à Inter anterior. Não houve commit, push ou deploy.
