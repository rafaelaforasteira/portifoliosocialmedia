# Raffaela Forasteira — portfólio

Base visual do hero em validação: fundo branco acinzentado, fotografia original um pouco menor, degradê preto em toda a largura do hero e grain fino mais perceptível. Todos os textos e elementos de interface foram retirados temporariamente. A próxima seção continua sendo apenas um bloco vazio para testes de scroll.

## Executar e verificar

Stack: Next.js 16, App Router, React 19, TypeScript, Tailwind CSS 4 e GSAP. Node.js 22 ou superior recomendado.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

Com o servidor local rodando, `npm run test:e2e` verifica nove resoluções (mobile, HD e ultrawide até 3440×1440), ausência de texto, imagem carregada, ausência de overflow, cobertura integral do hero pelo degradê e ordem das camadas e movimento reduzido. Usa Edge headless; para outro ambiente, configure o browser em `playwright.config.ts`. Capturas ficam em `.qa/`, ignorado pelo Git.

## Estrutura

- `src/components/hero/Hero.tsx`: mantém a composição original, renderizando somente o retrato nesta etapa.
- `HeroPortrait.tsx`: fotografia original centralizada. Grain e degradê são irmãos do palco da imagem, diretamente no hero.
- `HeroHeadline.tsx` e `ScrollIndicator.tsx`: copy preservada para futura reinserção; não são renderizados.
- `src/lib/constants/hero.ts`: caminho e descrição acessível da foto.
- `src/lib/animations/hero.ts`: entrada por opacidade, desativada com movimento reduzido.
- `src/app/globals.css`: fundo, escala, posição e tratamento monocromático.

## Foto original e tratamento

`public/images/hero/raffaela-hero.png` é uma cópia idêntica do arquivo enviado pela usuária. Nenhuma pessoa foi gerada e nenhum rosto ou roupa foi alterado. O fundo claro original está visível: a máscara de recorte da versão escura não é aplicada nesta versão.

O Next Image otimiza a entrega. O grain `.hero-grain` e o degradê `.hero-shade` são camadas absolutas com `inset: 0` no hero, independentes da largura máxima da imagem. A ordem explícita é fundo claro → fotografia (z-index 1) → grain (2) → degradê preto (3). O degradê alcança ambas as laterais da viewport e toda a borda inferior da primeira dobra. O degradê concentra o preto na parte inferior e preserva o rosto. Não existem glow, acentos coloridos ou interface lateral.

A escala está em `.portrait-plane`: até 88% da composição, limitada a 2160px e à altura da viewport. Os tokens ativos são `--bg`, `--foreground` e `--portrait-black`. A imagem fica centralizada, com ajuste de enquadramento para mobile. Textura em `public/textures/grain.svg`.

As fontes permanecem configuradas em `next/font` para o retorno dos textos; o build requer acesso ao Google Fonts. A máscara e seu script da versão anterior foram mantidos no repositório, mas não participam da renderização atual.

## Próximas etapas

Após validar a base, reinserir headline e convite. Storytelling, cases, experiência e contato ainda não foram implementados.

O fundo da tela usa #fdfdfd (RGB 253, 253, 253), o tom mais frequente nas bordas claras da imagem original, para minimizar a diferença entre fotografia e página.

## Menu superior

`src/components/navigation/SiteHeader.tsx` reutiliza `/icon.svg`, nas cores originais, incluindo o ponto roxo, e mantém navegação fixa de 72px (64px no mobile). O CSS está isolado em `SiteHeader.module.css`; o hero não foi alterado. A prop `tone="light" | "dark"` prepara o glass para futuras seções, sem alternância automática nesta etapa.

Os links apontam para `#sobre`, `#cases`, `#processo`, `#experiencia` e `#contato`. As seções ainda não existem; a rolagem suave funcionará quando forem adicionadas com esses IDs. O deslocamento de 88px evita que títulos fiquem sob o menu. No mobile, aparecem apenas logo e contato. Movimento reduzido e foco por teclado são respeitados.

A barra utiliza vidro branco a 38%, blur de 18px com saturação de 140%, brilho interno e sombra leve. O favicon é reutilizado sem filtros que removam ou alterem suas cores.
