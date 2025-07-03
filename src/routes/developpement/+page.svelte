<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Project {
    title: string;
    description: string;
    technologies: string[];
    image?: string;
    lien?: string | null;
    status?: string | null;
  }

  interface TimelineItem {
    id: number;
    title: string;
    description: string;
    date: string;
    projects: Project[];
  }
  
  let timelineItems: TimelineItem[] = [];
  let activeItem: number | null = null;
  let scrollPosition = 0;

  async function fetchProjects() {
    try {
      const response = await fetch('https://api.stevenbachimont.com/api/projects');
      if (!response.ok) throw new Error('Network response was not ok');
      timelineItems = await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  function handleScroll() {
    scrollPosition = window.scrollY;
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top + window.scrollY;
    
    timelineItems.forEach((item) => {
      const itemElement = document.querySelector(`#item-${item.id}`);
      if (itemElement) {
        const itemRect = itemElement.getBoundingClientRect();
        const itemTop = itemRect.top + window.scrollY;
        
        if (scrollPosition >= itemTop - window.innerHeight / 2) {
          activeItem = item.id;
        }
      }
    });
  }

  onMount(() => {
    fetchProjects();
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div class="development-page">
  <h1>THE Parcours de Développement web</h1>
  
  <div class="timeline">
    {#each timelineItems as item (item.id)}
      <div id="item-{item.id}" class="timeline-item" class:active={activeItem === item.id}>
        <div class="timeline-content">
          <div class="timeline-date">{item.date}</div>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          
          {#if item.projects.length > 0}
            <div class="projects-branch">
              {#each item.projects as project (project.title)}
                <div class="project-card">
                  {#if project.image}
                    <div class="project-image">
                      {#if project.lien}
                        <a href={project.lien} target="_blank" rel="noopener noreferrer" class="image-link">
                          <img src={project.image} alt={project.title} />
                          <div class="hover-message">Visiter?</div>
                        </a>
                      {:else}
                        <img src={project.image} alt={project.title} />
                      {/if}
                    </div>
                  {/if}
                  <div class="project-content">
                    <div class="project-header">
                      <h3>{project.title}</h3>
                      {#if project.status}
                        <span class="status-badge" 
                          class:status-inachevé={project.status === 'inachevé'} 
                          class:status-en-cours={project.status === 'en cours'}
                          class:status-achevé={project.status === 'achevé'} 
                          class:status-livré={project.status === 'livré'}
                        >{project.status}</span>
                      {/if}
                    </div>
                    <p>{project.description}</p>
                    {#if project.technologies && project.technologies.length > 0}
                      <div class="technologies">
                        {#each project.technologies as tech (tech)}
                          <span class="tech-tag">{tech}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .development-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 4rem;
    font-size: 2.5rem;
    background: linear-gradient(45deg, var(--color-text), var(--color-accent-1));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .timeline {
    position: relative;
    padding: 2rem 0;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--color-text), var(--color-accent-1));
    transform: translateX(-50%);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 4rem;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .timeline-item.active {
    opacity: 1;
  }

  .timeline-content {
    position: relative;
    width: 45%;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
  }

  .timeline-item:nth-child(odd) .timeline-content {
    margin-left: auto;
  }

  .timeline-date {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: var(--color-accent-2);
    font-weight: bold;
  }

  .projects-branch {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .project-card {
    background: rgba(135, 206, 235, 0.1);
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .project-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 4px;
    position: relative;
  }

  .image-link {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .hover-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .image-link:hover img {
    transform: scale(1.05);
    filter: brightness(0.7);
  }

  .image-link:hover .hover-message {
    opacity: 1;
  }

  .project-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .tech-tag {
    background: rgba(255, 215, 0, 0.2);
    color: var(--color-accent-2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .status-inachevé {
    background: rgba(255, 0, 0, 0.2);
    color: #ff4444;
  }

  .status-en-cours {
    background: rgba(0, 123, 255, 0.2);
    color: #007bff;
  }

  .status-achevé {
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
  }

  .status-livré {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
  }

  @media (max-width: 768px) {
    .timeline::before {
      left: 1rem;
    }

    .timeline-content {
      width: 80%;
      margin-left: 2rem !important;
    }

    .timeline-date {
      left: 1rem;
      transform: none;
    }
  }
</style> 