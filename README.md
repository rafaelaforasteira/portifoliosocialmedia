# Raffaela Forasteira — portfólio

Primeira dobra editorial do portfólio de Social Media. Apenas o hero e um bloco vazio de 50vh para testar scroll; nenhuma segunda seção foi criada.

## Stack e execução

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP e @gsap/react. Fontes Archivo Black e Manrope, otimizadas e servidas localmente por `next/font/google`. Node.js 22 ou superior recomendado.

```bash
npm ci
npm run dev
# http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm start
```

O build precisa de acesso ao Google Fonts para baixar as fontes. O navegador do visitante não faz solicitações ao Google Fonts. Imagens são otimizadas pelo Next.js; use uma hospedagem que execute Next.js com Node.js.

## Arquitetura

- `src/app/`: layout, metadados, página, favicon e estilos globais/tokens.
- `src/components/hero/`: composição, fotografia, headline, pistas, fragmentos de vidro e convite de scroll.
- `src/lib/animations/hero.ts`: sequência de entrada, parallax e resposta ao scroll, com cleanup via GSAP matchMedia.
- `src/lib/constants/hero.ts`: caminho, descrição acessível e enquadramento da fotografia.
- `public/images/hero/`: asset fotográfico substituível.
- `public/textures/`: textura SVG leve e repetível.
- `tests/`: verificação de layout, console, navegação por teclado e movimento reduzido.

O texto e a imagem permanecem disponíveis sem JavaScript. As animações são uma melhoria progressiva. Nenhum vídeo, WebGL ou biblioteca de smooth scroll é utilizado.

## Fotografia provisória

Fotografia de **Giona Mason**, Pexels, ID **19138637**. A modelo da imagem não é Raffaela; trata-se exclusivamente do placeholder solicitado.

- [Página da foto](https://www.pexels.com/photo/model-in-a-black-blouse-posing-in-a-studio-with-purple-backlight-19138637/)
- [Licença Pexels](https://www.pexels.com/license/)

Substitua `public/images/hero/hero-person-placeholder.jpg` e ajuste `HERO_PORTRAIT` em `src/lib/constants/hero.ts` (caminho, alt e objectPosition). Recomenda-se uma foto vertical de aproximadamente 1600px de largura, com rosto na metade superior. A máscara, o contraste e a escala de cinza são aplicados por CSS, sem alterar o arquivo original. O Next Image fornece tamanhos responsivos e formatos modernos.

## Direção visual e tokens

Tokens centralizados no início de `src/app/globals.css`:

| Token | Uso |
| --- | --- |
| `--bg`, `--bg-secondary` | Preto principal e secundário |
| `--foreground`, `--muted` | Texto principal e detalhes |
| `--purple`, `--purple-light`, `--purple-deep`, `--glow` | Iluminação lilás |
| `--yellow` | Pequenas marcações |
| `--glass`, `--line` | Vidro e traços |

A composição tem largura máxima de 1920px. Abaixo de 700px, a foto, a headline, o CTA e as pistas recebem um arranjo específico. O rodapé respeita `safe-area-inset-bottom`. Fragmentos decorativos são ocultos dos leitores de tela e não recebem cliques.

## Ajustar movimento

Edite os offsets da timeline em `src/lib/animations/hero.ts`: luz 150ms, foto 250ms, introdução 400ms, frase principal 600ms, pistas 900ms, convite 1100ms e seta 1300ms. Os atributos `data-depth` controlam a amplitude do parallax em cada camada. As distâncias de scroll ficam no mesmo arquivo.

O parallax só funciona com ponteiro preciso em telas acima de 700px. `prefers-reduced-motion: reduce` desativa entradas GSAP, scroll animado, parallax e movimento da seta. Eventos e triggers são removidos quando o componente desmonta ou a preferência muda.

## Verificação

Com o servidor local rodando:

```bash
npm run test:e2e
```

Os testes usam Microsoft Edge headless (instalado no ambiente de desenvolvimento). Para outro ambiente, altere `channel` em `playwright.config.ts`, ou remova a opção e instale Chromium com `npx playwright install chromium`.

São cobertas as resoluções 375×667, 390×844, 430×932, 1366×768, 1440×900, 1920×1080 e 2560×1440. Capturas para revisão visual são salvas em `.qa/` (ignorado pelo Git). É possível testar uma build de produção definindo `PLAYWRIGHT_BASE_URL`.

## Próximas áreas previstas

A estrutura está preparada para receber apresentação/storytelling, posicionamento, cases, processo, experiência e contato. Essas áreas não foram implementadas nem receberam conteúdo fictício. O link “Vem me conhecer” aponta, por enquanto, para `#continuacao`, o bloco vazio de teste.
