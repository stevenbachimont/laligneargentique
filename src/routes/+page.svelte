<script lang="ts">
  import { onMount } from 'svelte';
  import codeExamples from '$lib/codeLines.json';

  type Fragment = { text: string; type: string };
  type CodeLine = Fragment[];
  type CodeExample = CodeLine[][];

  let displayedLines: CodeLine[] = [];
  let isVisible = false;
  let showCode = true;
  let showVideo = true;
  let webHover = false;
  let photoHover = false;

  function getRandomExample(): CodeLine[] {
    // codeExamples est un tableau d'exemples, chaque exemple est un tableau de lignes
    return codeExamples[Math.floor(Math.random() * codeExamples.length)];
  }

  onMount(() => {
    isVisible = true;
    typeCodeLoop();
  });

  async function typeCodeLoop() {
    while (true) {
      const codeLines: CodeLine[] = getRandomExample();
      displayedLines = [];
      for (let i = 0; i < codeLines.length; i++) {
        let line: Fragment[] = [];
        for (let frag of codeLines[i]) {
          for (let k = 1; k <= frag.text.length; k++) {
            line = [...line, { text: frag.text.slice(0, k), type: frag.type }];
            displayedLines = [
              ...displayedLines.slice(0, i),
              line,
            ];
            await new Promise(r => setTimeout(r, 15));
            line = [...line.slice(0, -1)];
          }
          line = [...line, frag];
          displayedLines = [
            ...displayedLines.slice(0, i),
            line,
          ];
        }
        await new Promise(r => setTimeout(r, 150));
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
</script>

<div class="hero" class:fade-in={isVisible}>
  <video
    class="hero-bg-video"
    src="/video/hero-bg.mp4"
    autoplay
    muted
    loop
    playsinline
    aria-hidden="true"
    class:hidden={!showVideo}
    class:video-vivid={photoHover}
  ></video>
  <div class="code-bg" aria-hidden="true" class:hidden={!showCode} class:vivid={webHover}>
    {#each displayedLines as line}
      <div class="code-line">
        {#each line as frag}
          <span class={frag.type}>{frag.text}</span>
        {/each}
      </div>
    {/each}
  </div>
  <h1>Développement</h1>
  <div class="cta-buttons">
    <a
      href="/developpement"
      class="button"
      on:mouseenter={() => { showVideo = false; webHover = true; }}
      on:mouseleave={() => { showVideo = true; webHover = false; }}
    >Web</a>
    <a
      href="#about-section"
      class="button"
    >I</a>
    <a
      href="/photographie"
      class="button"
      on:mouseenter={() => { showCode = false; photoHover = true; }}
      on:mouseleave={() => { showCode = true; photoHover = false; }}
    >Photographie</a>
  </div>
</div>

<section id="about-section" class="about-section">
  <h2>À propos</h2>
  <p>
    Passionné par le développement web et la photographie, je crée des expériences numériques uniques
    et capture des moments inoubliables à travers mon objectif.
  </p>
</section>

<style>
  :global(html) { scroll-behavior: smooth; }
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .hero-bg-video {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0.25;
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(.4,0,.2,1), filter 0.3s;
  }
  .code-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.15;
    font-family: 'Fira Mono', 'Consolas', monospace;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 2vw;
    user-select: none;
    text-align: left;
  }
  .code-line { font-size: 1.2rem; white-space: pre; }
  .keyword { color: #569CD6; }
  .function { color: #DCDCAA; }
  .paren, .brace, .operator { color: #fff; }
  .object { color: #4EC9B0; }
  .method { color: #D7BA7D; }
  .string { color: #CE9178; }
  .number { color: #B5CEA8; }
  .variable { color: #9CDCFE; }
  .property { color: #4EC9B0; }
  .type { color: #B5CEA8; font-style: italic; }
  .comment { color: #6A9955; font-style: italic; }

  h1 { font-size: 3.5rem; margin-bottom: 1rem; position: relative; z-index: 1; }
  .cta-buttons { display: flex; gap: 1rem; margin-top: 2rem; background: none; border: none; color: none; font-size: 1.5rem; position: relative; z-index: 1; }
  a.button { transition: transform 0.3s, color 0.3s; background: none; color: var(--color-accent-1); will-change: transform; }
  a.button:hover { transform: scale(1.2); color: var(--color-accent-2); }
  .about-section {
     padding: 4rem 2rem; 
     text-align: center; 
     background: none; 
    }
  .fade-in { animation: fadeIn 1s ease-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
  h1, .cta-buttons {
    position: relative;
    z-index: 1;
  }

  .hero-bg-video,
  .code-bg {
    transition: opacity 0.5s cubic-bezier(.4,0,.2,1);
  }

  .hidden {
    opacity: 0 !important;
    pointer-events: none;
  }

  .code-bg.vivid .keyword { color: #00bfff; }
  .code-bg.vivid .function { color: #ffe066; }
  .code-bg.vivid .paren, .code-bg.vivid .brace, .code-bg.vivid .operator { color: #fff; }
  .code-bg.vivid .object { color: #00ffb3; }
  .code-bg.vivid .method { color: #ffd700; }
  .code-bg.vivid .string { color: #ff5e5e; }
  .code-bg.vivid .number { color: #7fff00; }
  .code-bg.vivid .variable { color: #00eaff; }
  .code-bg.vivid .property { color: #00ffb3; }
  .code-bg.vivid .type { color: #7fff00; font-style: italic; }
  .code-bg.vivid .comment { color: #00ff00; font-style: italic; }

  .code-bg.vivid.vivid {
    filter: brightness(2) saturate(1.5) contrast(1.2);
    opacity: 0.6;
    transition: filter 0.3s, opacity 0.3s;
  }

  .hero-bg-video.video-vivid {
    filter: brightness(1.6) saturate(1.5) contrast(1.2);
    opacity: 0.4;
  }
</style>
