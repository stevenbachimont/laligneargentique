<script lang="ts">
  import { onMount } from 'svelte';

  interface Tool {
    name: string;
    description: string;
    url: string;
    category: 'photographie' | 'musique' | 'autre';
    technologies: string[];
    status: 'actif' | 'en développement' | 'archivé';
  }

  let tools: Tool[] = [
    {
      name: "Générateur de métadonnées photo",
      description: "Outil pour générer automatiquement les métadonnées EXIF pour les photos argentiques numérisées",
      url: "https://photo-metadata.stevenbachimont.com",
      category: "photographie",
      technologies: ["React", "TypeScript", "ExifTool"],
      status: "actif"
    },
    {
      name: "Calculateur de développement",
      description: "Calculateur de temps de développement pour différentes pellicules et révélateurs",
      url: "https://dev-calculator.stevenbachimont.com",
      category: "photographie",
      technologies: ["Vue.js", "JavaScript"],
      status: "actif"
    },
    {
      name: "Gestionnaire de pellicules",
      description: "Application pour suivre l'inventaire des pellicules et planifier les développements",
      url: "https://film-manager.stevenbachimont.com",
      category: "photographie",
      technologies: ["SvelteKit", "SQLite"],
      status: "en développement"
    },
    {
      name: "Séquenceur musical",
      description: "Séquenceur en ligne pour créer des patterns rythmiques et mélodiques",
      url: "https://sequencer.stevenbachimont.com",
      category: "musique",
      technologies: ["Web Audio API", "Canvas API", "JavaScript"],
      status: "actif"
    },
    {
      name: "Convertisseur de formats audio",
      description: "Outil pour convertir entre différents formats audio et ajuster les paramètres",
      url: "https://audio-converter.stevenbachimont.com",
      category: "musique",
      technologies: ["Web Audio API", "FFmpeg.wasm"],
      status: "en développement"
    },
    {
      name: "Générateur de partitions",
      description: "Générateur de partitions simples à partir de notes MIDI",
      url: "https://score-generator.stevenbachimont.com",
      category: "musique",
      technologies: ["VexFlow", "JavaScript"],
      status: "archivé"
    },
    {
      name: "Gestionnaire de tâches",
      description: "Application simple de gestion de tâches avec synchronisation cloud",
      url: "https://task-manager.stevenbachimont.com",
      category: "autre",
      technologies: ["SvelteKit", "PocketBase"],
      status: "actif"
    },
    {
      name: "Convertisseur de devises",
      description: "Outil de conversion de devises avec taux en temps réel",
      url: "https://currency-converter.stevenbachimont.com",
      category: "autre",
      technologies: ["React", "API Exchange Rate"],
      status: "actif"
    }
  ];

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });

  function getToolsByCategory(category: string) {
    return tools.filter(tool => tool.category === category);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'actif': return '#00ff00';
      case 'en développement': return '#ffd700';
      case 'archivé': return '#ff6b6b';
      default: return '#888';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'actif': return 'Actif';
      case 'en développement': return 'En développement';
      case 'archivé': return 'Archivé';
      default: return status;
    }
  }

  function openTool(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
</script>

<div class="tools-page">
  <div class="content">
    <h1 class="page-title {isVisible ? 'fade-in-up' : ''}">Outils web</h1>
    <p class="page-description {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.1s">
      Applications web utiles que j'ai développées, classées par thématique.
    </p>

    <!-- Outils Photographie -->
    <section class="tools-category {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
      <div class="category-header">
        <h2>📷 Photographie</h2>
        <p>Outils spécialisés pour la photographie argentique et numérique</p>
      </div>
      <div class="tools-grid">
        {#each getToolsByCategory('photographie') as tool}
          <div class="tool-card" 
               on:click={() => openTool(tool.url)} 
               role="button" 
               tabindex="0" 
               on:keydown={(e) => e.key === 'Enter' && openTool(tool.url)}>
            <div class="tool-header">
              <h3>{tool.name}</h3>
              <div class="status-badge" style="background-color: {getStatusColor(tool.status)}">
                {getStatusText(tool.status)}
              </div>
            </div>
            <p class="tool-description">{tool.description}</p>
            <div class="tool-technologies">
              {#each tool.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
            <div class="tool-cta">
              <span class="cta-text">Cliquez pour visiter l'outil</span>
              <span class="cta-arrow">→</span>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Outils Musique -->
    <section class="tools-category {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.3s">
      <div class="category-header">
        <h2>🎵 Musique</h2>
        <p>Applications pour la création et l'édition musicale</p>
      </div>
      <div class="tools-grid">
        {#each getToolsByCategory('musique') as tool}
          <div class="tool-card" 
               on:click={() => openTool(tool.url)} 
               role="button" 
               tabindex="0" 
               on:keydown={(e) => e.key === 'Enter' && openTool(tool.url)}>
            <div class="tool-header">
              <h3>{tool.name}</h3>
              <div class="status-badge" style="background-color: {getStatusColor(tool.status)}">
                {getStatusText(tool.status)}
              </div>
            </div>
            <p class="tool-description">{tool.description}</p>
            <div class="tool-technologies">
              {#each tool.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
            <div class="tool-cta">
              <span class="cta-text">Cliquez pour visiter l'outil</span>
              <span class="cta-arrow">→</span>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Outils Autres -->
    <section class="tools-category {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
      <div class="category-header">
        <h2>🛠️ Autres</h2>
        <p>Outils utilitaires pour la productivité et les conversions</p>
      </div>
      <div class="tools-grid">
        {#each getToolsByCategory('autre') as tool}
          <div class="tool-card" 
               on:click={() => openTool(tool.url)} 
               role="button" 
               tabindex="0" 
               on:keydown={(e) => e.key === 'Enter' && openTool(tool.url)}>
            <div class="tool-header">
              <h3>{tool.name}</h3>
              <div class="status-badge" style="background-color: {getStatusColor(tool.status)}">
                {getStatusText(tool.status)}
              </div>
            </div>
            <p class="tool-description">{tool.description}</p>
            <div class="tool-technologies">
              {#each tool.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
            <div class="tool-cta">
              <span class="cta-text">Cliquez pour visiter l'outil</span>
              <span class="cta-arrow">→</span>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>

<style>
  .tools-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .content {
    width: 100%;
  }

  .page-title {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    background: linear-gradient(45deg, var(--color-text), var(--color-accent-1));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0;
    transform: translateY(40px);
  }

  .page-description {
    text-align: center;
    margin-bottom: 4rem;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
    transform: translateY(40px);
  }

  .tools-category {
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .category-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .category-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--color-accent-1);
  }

  .category-header p {
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .tool-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .tool-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255,255,255,0.2);
  }

  .tool-card:focus {
    outline: 2px solid var(--color-accent-1);
    outline-offset: 2px;
  }

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .tool-header h3 {
    font-size: 1.3rem;
    color: #fff;
    margin: 0;
    flex: 1;
    line-height: 1.3;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #000;
    flex-shrink: 0;
  }

  .tool-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .tool-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .tech-tag {
    background: rgba(255, 215, 0, 0.2);
    color: var(--color-accent-2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .tool-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .cta-text {
    opacity: 0.8;
  }

  .cta-arrow {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .tool-card:hover .cta-arrow {
    transform: translateX(5px);
    color: var(--color-accent-1);
  }

  .tool-card:hover .cta-text {
    color: rgba(255,255,255,0.9);
  }

  /* Animations */
  .fade-in-up {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Desktop */
  @media (max-width: 1200px) {
    .tools-page {
      padding: 1.5rem;
    }
    
    .tools-grid {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.3rem;
    }
  }

  @media (max-width: 768px) {
    .tools-page {
      padding: 1.5rem;
    }

    .page-title {
      font-size: 2.2rem;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .page-description {
      font-size: 1rem;
      margin-bottom: 3rem;
      padding: 0 1rem;
      line-height: 1.5;
    }

    .tools-category {
      margin-bottom: 3rem;
    }

    .category-header {
      margin-bottom: 1.5rem;
    }

    .category-header h2 {
      font-size: 1.8rem;
      margin-bottom: 0.8rem;
    }

    .category-header p {
      font-size: 0.95rem;
      padding: 0 1rem;
    }

    .tools-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }

    .tool-card {
      padding: 1.3rem;
    }

    .tool-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
      margin-bottom: 1.2rem;
    }

    .tool-header h3 {
      font-size: 1.2rem;
      line-height: 1.3;
    }

    .tool-description {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.2rem;
    }

    .tool-technologies {
      gap: 0.4rem;
      margin-bottom: 1.3rem;
    }

    .tech-tag {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }

    .tool-cta {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 600px) {
    .tools-page {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.8rem;
      margin-bottom: 1.2rem;
      padding: 0 0.8rem;
    }

    .page-description {
      font-size: 0.95rem;
      margin-bottom: 2.5rem;
      padding: 0 0.8rem;
    }

    .tools-category {
      margin-bottom: 2.5rem;
    }

    .category-header h2 {
      font-size: 1.6rem;
      padding: 0 0.8rem;
    }

    .category-header p {
      font-size: 0.9rem;
      padding: 0 0.8rem;
    }

    .tools-grid {
      gap: 1rem;
    }

    .tool-card {
      padding: 1.2rem;
      margin: 0 0.5rem;
    }

    .tool-header h3 {
      font-size: 1.1rem;
    }

    .tool-description {
      font-size: 0.9rem;
    }

    .tool-cta {
      font-size: 0.8rem;
    }
  }

  /* Mobile très petit */
  @media (max-width: 480px) {
    .tools-page {
      padding: 0.8rem;
    }

    .page-title {
      font-size: 1.6rem;
      padding: 0 0.6rem;
    }

    .page-description {
      font-size: 0.9rem;
      padding: 0 0.6rem;
    }

    .category-header h2 {
      font-size: 1.4rem;
      padding: 0 0.6rem;
    }

    .category-header p {
      font-size: 0.85rem;
      padding: 0 0.6rem;
    }

    .tool-card {
      padding: 1rem;
      margin: 0 0.3rem;
    }

    .tool-header h3 {
      font-size: 1rem;
    }

    .tool-description {
      font-size: 0.85rem;
    }

    .tool-technologies {
      gap: 0.3rem;
    }

    .tech-tag {
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
    }

    .tool-cta {
      font-size: 0.75rem;
    }
  }

  /* Mobile ultra petit */
  @media (max-width: 360px) {
    .tools-page {
      padding: 0.6rem;
    }

    .page-title {
      font-size: 1.4rem;
      margin-bottom: 1rem;
      padding: 0 0.5rem;
    }

    .page-description {
      font-size: 0.85rem;
      margin-bottom: 2rem;
      padding: 0 0.5rem;
    }

    .tools-category {
      margin-bottom: 2rem;
    }

    .category-header {
      margin-bottom: 1.2rem;
    }

    .category-header h2 {
      font-size: 1.3rem;
      padding: 0 0.5rem;
    }

    .category-header p {
      font-size: 0.8rem;
      padding: 0 0.5rem;
    }

    .tools-grid {
      gap: 0.8rem;
    }

    .tool-card {
      padding: 0.8rem;
      margin: 0 0.2rem;
    }

    .tool-header {
      margin-bottom: 1rem;
      gap: 0.6rem;
    }

    .tool-header h3 {
      font-size: 0.95rem;
    }

    .tool-description {
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }

    .tool-technologies {
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .tech-tag {
      font-size: 0.65rem;
      padding: 0.1rem 0.4rem;
    }

    .tool-cta {
      font-size: 0.7rem;
    }
  }

  /* Mobile ultra ultra petit */
  @media (max-width: 320px) {
    .tools-page {
      padding: 0.5rem;
    }

    .page-title {
      font-size: 1.3rem;
      padding: 0 0.4rem;
    }

    .page-description {
      font-size: 0.8rem;
      padding: 0 0.4rem;
    }

    .category-header h2 {
      font-size: 1.2rem;
      padding: 0 0.4rem;
    }

    .category-header p {
      font-size: 0.75rem;
      padding: 0 0.4rem;
    }

    .tool-card {
      padding: 0.7rem;
      margin: 0 0.1rem;
    }

    .tool-header h3 {
      font-size: 0.9rem;
    }

    .tool-description {
      font-size: 0.75rem;
    }

    .tech-tag {
      font-size: 0.6rem;
      padding: 0.08rem 0.3rem;
    }

    .tool-cta {
      font-size: 0.65rem;
    }
  }
</style> 