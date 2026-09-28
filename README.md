# Raffaela Forasteira — portfólio

Hero com vídeo cinematográfico de seis segundos e interface sincronizada pelo tempo real da mídia. O menu fixo permanece independente e preservado. Nenhuma outra seção foi criada: há apenas o bloco vazio `#continuacao` para o convite de scroll.

## Stack e execução

Next.js 16 / App Router, React 19, TypeScript, Tailwind CSS 4, GSAP e @gsap/react. Roboto na interface da hero, Manrope no menu existente. Fontes servidas pelo Next Font; o build precisa de acesso ao Google Fonts. Node.js 22+ recomendado.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
npm run test:e2e
```

Os testes de navegador usam Edge headless e requerem servidor local em execução. `PLAYWRIGHT_BASE_URL` permite apontar para outra instância; configure `channel` em `playwright.config.ts` se necessário.

## Onde editar

- `src/components/hero/Hero.tsx`: vídeo decorativo, camadas, conteúdo e fallback sem JavaScript.
- `src/components/hero/HeroHeadline.tsx`: máscaras independentes da headline.
- `src/components/hero/ScrollIndicator.tsx`: CTA sem animação infinita.
- `src/lib/animations/hero.ts`: sincronização e ciclo de vida.
- `src/lib/constants/hero-intro.ts`: **HERO_TIMING**, **HERO_MOTION**, **HERO_VIDEO_MOTION**, **HERO_VIDEO** e **HERO_COPY**.
- `src/app/globals.css`: layout da hero, enquadramento estático por breakpoint, estados iniciais e movimento reduzido.
- `src/app/layout.tsx`: fontes e metadados.

## Sincronização

Uma timeline GSAP pausada recebe `timeline.time(video.currentTime, false)`. `requestVideoFrameCallback` atualiza a interface conforme os frames apresentados; `requestAnimationFrame` é o fallback. Eventos `timeupdate` e `seeked` mantêm coerência ao pausar/avançar. O reposicionamento da personagem vem do MP4. A camada do vídeo recebe um zoom suave, sincronizado pela mesma timeline, com compensação horizontal para valorizar o rosto.

Minutagens em `HERO_TIMING` (segundos): eyebrow 1.40, titleLine1 2.05, titleLine2 2.38, description 3.20, cta 3.70, settled 4.20. Durações, deslocamentos do texto e tempo de fallback ficam em `HERO_MOTION`.

As linhas começam ocultas via CSS e sobem dentro de containers com overflow hidden. Não há flash de texto antes da hidratação. O CTA termina sua entrada em 4.20s. Nesse ponto o loop de sincronização para, enquanto o vídeo continua até o fim. Ao terminar, seu último frame permanece no próprio elemento, sem loop ou reinício. Listeners, callbacks e timeline são limpos no unmount.

## Vídeo e fallback

Vídeo original fornecido pela usuária: `public/videos/hero-intro.mp4` (1920×1080, seis segundos, aproximadamente 2,6 MB). O elemento usa autoplay, muted, playsInline e preload auto, sem controles ou loop. Troque o arquivo ou o caminho em `HERO_VIDEO`.

`hero-poster.webp` é um frame inicial extraído do vídeo. `hero-final.webp` é um frame final extraído do mesmo vídeo, utilizado quando autoplay falha, ocorre erro, JavaScript está desligado ou há preferência por movimento reduzido. Ao trocar o vídeo, atualize também esses frames para que correspondam ao novo arquivo.

Há um único watchdog de oito segundos para mídia indisponível/estagnada; ele não controla a coreografia. É reiniciado somente com progresso ou eventos de reprodução. Falha de play e erro de mídia mostram imediatamente o estado final. Movimento reduzido pausa e oculta o vídeo, mostra o frame final e torna o conteúdo visível. O fallback não tenta reproduzir novamente.

## Copy

A headline e o CTA preservam o texto aprovado. O eyebrow usa o nome da profissional. `HERO_COPY.description` está vazio, pois não foi fornecida descrição definitiva. Preenchê-lo habilita automaticamente a entrada em 3.20s, sem mudar a lógica da timeline. O link do CTA continua apontando para `#continuacao`.

## Responsividade

Desktop: vídeo cover, conteúdo à esquerda e personagem à direita no final. Ultrawide tem ajuste estático de object-position. Até 900px, o vídeo ocupa a área superior e o conteúdo aparece abaixo, sobre base escura, para preservar o rosto ao longo do movimento. O enquadramento desktop recebe zoom de 0 a 4.20s com ease sine.inOut. HERO_VIDEO_MOTION centraliza escala inicial 1, escala final 1.10 em HD/notebook e 1.06 em ultrawide, origens 68% 35% e 66% 35%, e compensações horizontais de -2.8% e -1.6%. Até 900px a escala permanece 1 para preservar o enquadramento móvel. Mudanças de breakpoint recalculam o zoom no tempo atual, sem reiniciar a intro. O frame de fallback recebe o mesmo enquadramento final.

A opacidade do grain em .hero-grain (src/app/globals.css) é .24, aumento de 50% sobre .16; a textura fina e o blend multiply foram preservados. O grain e a base escura permanecem em camadas entre vídeo e interface. O vídeo é oculto da árvore acessível; o conteúdo tem h1 e link reais. O menu mantém seu favicon original, glass, navegação e comportamento fixo.

## Validação

Os testes cobrem desktop 1920×1080, ultrawide 3440×1440, notebook, tablet e mobile; fim sem loop; muted; zoom sincronizado, estável em pausa e responsivo; pause/seek sincronizados; início atrasado sem flash; falha de autoplay; erro de mídia; requestAnimationFrame; movimento reduzido; watchdog de stall; e JavaScript desligado. As capturas ficam em `.qa/` e não são versionadas. A navegação tem testes próprios de foco, blur e posicionamento fixo.

As fotografias e máscaras das versões anteriores permanecem no repositório como referência, mas não são usadas na hero atual. As seções #sobre, #cases, #processo, #experiencia e #contato ainda serão implementadas.
