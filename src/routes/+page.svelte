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
  <div class="about-content">
    <div class="about-background"></div>
    <div class="about-text">
      <h2>À propos</h2>
      <p>
        Diplômé des arts du cirque, j'ai longtemps cherché ma voie après une blessure qui a bouleversé mon parcours. 
        Cette quête m'a mené vers la musique pour le spectacle, les arts numériques, et l'enseignement des arts du cirque 
        dans des milieux variés - psychiatrique, carcéral, scolaire et de loisir.
      </p>
      <p>
        Aujourd'hui, je me passionne pour le développement web, trouvant mon équilibre dans l'élaboration de projets 
        et leur architecture. En parallèle, je redécouvre la photographie argentique, m'occupant de tout moi-même : 
        restauration d'appareils anciens de tous formats, prises de vues et développements.
      </p>
      <p>
        Ce grand écart entre le web et la photographie m'aide à me développer personnellement, 
        créant un équilibre unique entre technologie moderne et artisanat traditionnel.
      </p>
    </div>
  </div>
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
  @media (max-width: 600px) {
    .hero-bg-video {
      display: none !important;
    }
    .code-bg {
      display: none !important;
    }
    .code-bg, .code-bg * {
      display: none !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
    .hero {
      width: 100% !important;
      overflow-x: hidden !important;
    }
    :global(body) {
      width: 100% !important;
      overflow-x: hidden !important;
      margin: 0 !important;
    }
    h1 {
      font-size: 2rem !important;
      word-break: break-word;
    }
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
  .about-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start; /* Alignement en haut */
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: visible;
    border-radius: 20px;
    gap: 2rem;
  }
  .about-background {
    flex: 0 0 300px;
    height: auto; /* Hauteur auto */
    aspect-ratio: 3/4; /* Pour garder la proportion portrait */
    background-image: url('/background/moi.jpg');
    background-size: contain;
    background-position: left center;
    background-repeat: no-repeat;
    background-color: #000;
    border-radius: 20px;
    opacity: 1;
    filter: none;
    z-index: 0;
    min-height: 320px; /* Pour éviter qu'elle soit trop petite */
    max-height: 100%;
    margin-top: 3rem; /* Ajuste cette valeur selon le rendu souhaité */
  }
  .profile-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.15;
    filter: blur(2px);
    border-radius: 20px;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
  }
  .about-text {
    flex: 1 1 0;
    position: relative;
    z-index: 1;
    background: none;
    padding: 2rem;
    border-radius: 15px;
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .about-text h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--color-accent-1);
  }
  .about-text p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  @media (max-width: 768px) {
    .about-text {
      margin: 1rem;
      padding: 1.5rem;
    }
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
  .profile-photo {
    z-index: 1 !important;
    opacity: 1 !important;
    filter: none !important;
  }

  /* Responsive : photo en dessous du texte */
  @media (max-width: 900px) {
    .about-content {
      flex-direction: column-reverse;
      align-items: center;
      gap: 1rem;
    }
    .about-background {
      width: 100%;
      max-width: 400px;
      height: 300px;
      margin: 0 auto;
      background-position: center;
      aspect-ratio: 3/4;
      min-height: 200px;
    }
    .about-text {
      padding: 1.5rem;
      max-width: 100%;
    }
  }
  @media (max-width: 768px) {
    .about-section {
      padding: 1rem 0.5rem; /* Moins de padding latéral */
    }
    .about-text {
      width: 90vw;
      max-width: none;
      margin: 0;
      padding: 1rem 1.2rem;
    }
  }
</style>
