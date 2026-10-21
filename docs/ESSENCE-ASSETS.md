# 01 — A Essência: integração do macro aprovado

## Estado atual

Integração visual concluída no painel editorial existente, entre introdução e explicação institucional. Fundo claro, headline, textos e tipografia preservados. O hero e todas as seções posteriores à Essência mantêm sua marcação e seus estilos aprovados.

## Arquivos e procedência

Recebidos do responsável pelo projeto no ZIP `valetto-essencia-assets.zip`:

| Arquivo                       | Dimensões     | Tamanho         | Uso                                 |
| ----------------------------- | ------------- | --------------- | ----------------------------------- |
| `valetto-essencia-macro.png`  | 1677 × 938 px | 1.906.710 bytes | Original preservado sem alterações  |
| `valetto-essencia-macro.webp` | 1677 × 938 px | 137.092 bytes   | WebP aprovado usado pelo componente |

Ambos ficam em `public/media/essence/`. O arquivo `ASSET-INFO.txt` foi preservado integralmente em `docs/ESSENCE-ASSET-INFO.txt`.

Segundo as informações fornecidas, a imagem foi **gerada por IA no ChatGPT em 20/10/2026**, especificamente para o projeto. Não é fotografia real, não é render de um GLB existente e não há garantia de que represente o mesmo modelo físico exibido no hero. Não se presumiram autoria adicional, vínculo com fabricante ou licença específica. O responsável forneceu e aprovou o material para esta integração. As observações originais sobre termos de uso e revisão de eventuais semelhanças permanecem no arquivo de procedência.

SHA-256 dos arquivos preservados:

- PNG: `21a594d1992699fdb324d7d25a597c503df60f8ccc3c0d0c8dca5195a7a9fad9`
- WebP: `61ecd7a3e1201300694684dfe27b54755fe7dd6e3e44a303c5015a8c25408119`

## Direção editorial e enquadramento

O painel amplo cria uma pausa visual entre a introdução ampliada e a explicação institucional, sem acrescentar cards, legendas comerciais ou alterar os textos aprovados. O contraste do macro escuro com o fundo claro valoriza pintura grafite, recortes da carenagem e relevos metálicos.

Aspectos do painel: 2,05:1 no desktop, 1,8:1 no tablet e 1,2:1 no mobile. O ponto de foco é `50% 48%` no desktop/tablet e `65% 50%` no mobile, mantendo o tanque e a carenagem como detalhes principais. Os cortes nas periferias respeitam o enquadramento macro já presente no original; a moto inteira não é o assunto desta imagem.

`src/lib/essence-asset.ts` registra paths, dimensões, alt, procedência e foco. O PNG original não é solicitado pela página. Next Image usa o WebP fornecido, carregamento lazy, tamanhos responsivos e área reservada pelo aspect-ratio, sem deslocamento de layout no carregamento.

## Movimento e acessibilidade

Conteúdo renderizado no servidor. `EssenceReveal` usa IntersectionObserver e Web Animations API, sem dependências novas, loop contínuo, pin ou bloqueio de scroll. A revelação ocorre uma vez: opacidade de 0,65 a 1 e deslocamento vertical de 12px durante 1s. A imagem só anima depois de carregar e decodificar, evitando revelar um painel vazio em rede lenta. Se o visitante já tiver saído da área, não se dispara uma animação fora da tela.

Movimento reduzido impede novas animações e cancela animações em andamento. Sem JavaScript ou suporte às APIs, texto e imagem continuam visíveis. Alt descritivo em português, HTML semântico e contraste de texto preservados.

## Evidências de validação

Build de produção, ESLint, TypeScript strict e formatação aprovados. **33 testes Playwright aprovados**, incluindo os testes existentes de hero e navegação e os cenários da Essência: textos institucionais, carregamento real do WebP, imagem e conteúdo sem JavaScript, redução de movimento, revelação após carregamento atrasado e cancelamento da animação.

Capturas da seção e do detalhe revisadas em 1440×900, 768×1024 e 390×844. Não há overflow horizontal ou erros de página nas verificações. A inspeção de recortes preserva o assunto metálico principal nos três tamanhos. Resultados locais não substituem medição de Core Web Vitals em produção; Safari, Firefox e dispositivos físicos não foram testados nesta etapa.

Nenhum deploy ou envio ao GitHub nesta etapa.
