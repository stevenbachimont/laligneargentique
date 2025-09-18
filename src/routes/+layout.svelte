<script>
  import '../app.css';
  import { page } from '$app/stores';
  import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';
  
  let isMenuOpen = false;
  /** @type {string | null} */
  let activeDropdown = null;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  /**
   * @param {string} dropdown
   */
  function toggleDropdown(dropdown) {
    if (activeDropdown === dropdown) {
      activeDropdown = null;
    } else {
      activeDropdown = dropdown;
    }
  }
  
  function closeDropdown() {
    activeDropdown = null;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<div class="container">
  <header>
    <button class="menu-button" on:click={toggleMenu} aria-label="Menu">
      {#if isMenuOpen}
        <img src="/utils/ouvert.svg" alt="Fermer le menu" class="menu-icon" loading="eager" />
      {:else}
        <img src="/utils/ferme.svg" alt="Ouvrir le menu" class="menu-icon" loading="eager" />
      {/if}
    </button>
    <nav class:open={isMenuOpen}>
      {#if $page.route.id !== '/'}
        <div class="logo">
          <a href="/" on:click={closeMenu}>
            <AnimatedTitle size="small" showAnimation={false} />
          </a>
        </div>
      {/if}

         <!-- Conteneur pour les liens de droite -->
         <div class="nav-links">
           <!-- Menu Photographie -->
           <div class="dropdown-container">
             <a href="/photographie" class="nav-link" on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown} on:click={closeMenu}>
               <img src="/utils/decouvrir.svg" alt="Découvrir mes services de photographie" class="nav-icon" loading="eager" />
             </a>
             <div class="dropdown" class:active={activeDropdown === 'photographie'} on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown} role="menu" tabindex="0">
               <a href="/decouvrir/ballades" on:click={() => { closeMenu(); closeDropdown(); }}>
                 <img src="/utils/reserver.svg" alt="Réserver une balade photo argentique" class="dropdown-icon" loading="eager" />
               </a>
               <a href="/decouvrir/galerie" on:click={() => { closeMenu(); closeDropdown(); }}>
                 <img src="/utils/galerie.svg" alt="Voir la galerie de photos" class="dropdown-icon" loading="eager" />
               </a>
             </div>
           </div>
           <a href="/contact" on:click={closeMenu}>
             <img src="/utils/contact.svg" alt="Me contacter" class="nav-icon" loading="eager" />
           </a>
         </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="footer">
    <div class="footer-content">
      <!-- Plan du site -->
      <div class="footer-section">
        <h3>Plan du site</h3>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Photographie</h4>
            <a href="/photographie">Galerie Photos</a>
            <a href="/photographie/argentique">La Ligne Argentique</a>
            <a href="/photographie/portfolioPhoto">Portfolio Photo</a>
          </div>
          <div class="footer-column">
            <h4>Informations</h4>
            <a href="/#about-section">À propos</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>

      <!-- Partenaires -->
      <div class="footer-section">
        <h3>Partenaires</h3>
        <div class="partners">
          <div class="partner">
            <h4>Photographie</h4>
            <div class="partner-logos">
              <span class="partner-logo"></span>
              <span class="partner-logo"></span>
              <span class="partner-logo"></span>
            </div>
          </div>
          <div class="partner">
            <h4>Paiements</h4>
            <div class="partner-logos">
              <span class="partner-logo">Stripe</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mentions légales -->
      <div class="footer-section">
        <h3>Mentions légales</h3>
        <div class="legal-links">
          <a href="/conditions-generales">Conditions Générales de Vente</a>
          <a href="/politique-confidentialite">Politique de Confidentialité</a>
          <a href="/mentions-legales">Mentions Légales</a>
        </div>
      </div>

      <!-- Contact et réseaux -->
      <div class="footer-section">
        <h3>Contact</h3>
        <div class="contact-info">
          <p>📧 contact@stevenbachimont.com</p>
          <p>🌐 stevenbachimont.com</p>
        </div>
        <div class="social-links">
          <a href="https://github.com/stevenbachimont" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/stevenbachimont" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>© 2025 - Steven Bachimont. Tous droits réservés.</p>
        <p>Photographe</p>
      </div>
    </div>
  </footer>
</div>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    padding: 1rem;
    background-color: transparent;
    backdrop-filter: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    border-bottom: none;
  }

  /* Header transparent sur desktop */
  @media (min-width: 769px) {
    header {
      padding: 0;
      height: 0;
      overflow: visible;
    }
  }

  .logo {
    position: absolute;
    left: 1rem;
    top: 1rem;
    margin-bottom: 1rem;
    filter: brightness(0) invert(1);
  }

  /* Logo dans la navbar desktop */
  @media (min-width: 769px) {
    .logo {
      position: static;
      margin: 0;
      filter: brightness(0) invert(1);
    }
  }

  /* Logo en haut à gauche sur mobile pour toutes les pages sauf home */
  @media (max-width: 768px) {
    .logo {
      position: fixed !important;
      top: 1rem !important;
      left: 1rem !important;
      z-index: 102 !important;
      filter: brightness(0) invert(1) !important;
    }
  }

  .logo a {
    display: block;
    transition: all 0.3s ease;
  }

  .logo:hover a {
    transform: scale(1.05);
  }

  .menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
  }

  /* Masquer le bouton hamburger sur desktop */
  @media (min-width: 769px) {
    .menu-button {
      display: none;
    }
  }

  .menu-icon {
    width: 30px;
    height: 30px;
    transition: all 0.3s ease;
  }

  nav {
    display: flex;
    gap: 2rem;
    margin-right: 2rem;
    justify-content: center;
    align-items: center;
  }

  /* Menu horizontal en haut de page pour desktop */
  @media (min-width: 769px) {
    nav {
      display: flex !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: auto !important;
      background: transparent !important;
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0.5rem 2rem !important;
      z-index: 101 !important;
      gap: 2rem !important;
    }

    .nav-links {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 2rem !important;
      margin-left: auto !important;
      margin-right: 2rem !important;
    }

    .nav-links > a {
      display: flex !important;
      align-items: center !important;
    }

    .nav-links > a:last-child {
      margin-top: -1rem !important;
    }
    .dropdown-container {
      display: inline-block !important;
      position: relative !important;
    }

    .nav-link {
      display: inline-block !important;
      width: auto !important;
      text-align: center !important;
      padding: 0.5rem 1rem !important;
      white-space: nowrap !important;
    }

    nav a:not(.nav-link) {
      display: inline-block !important;
      width: auto !important;
      text-align: center !important;
      padding: 0.5rem 1rem !important;
      white-space: nowrap !important;
    }

    .dropdown {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      background: rgba(0, 0, 0, 0.9) !important;
      backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 8px !important;
      min-width: 200px !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(-10px) !important;
      transition: all 0.3s ease !important;
      z-index: 1000 !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
    }

    .dropdown.active {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) !important;
    }
  }

  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  .nav-link {
    text-decoration: none;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    display: block;
    cursor: pointer;
  }


  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .dropdown.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .dropdown a {
    display: block;
    padding: 0.75rem 1rem;
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .dropdown a:last-child {
    border-bottom: none;
  }

  /* Styles pour les icônes SVG */
  .nav-icon {
    height: 2rem;
    width: auto;
    filter: brightness(0) invert(1);
    transition: transform 0.2s ease;
  }

  .nav-icon:hover {
    transform: scale(1.05);
  }

  .dropdown-icon {
    height: 1.5rem;
    width: auto;
    filter: brightness(0) invert(1);
    margin-right: 0.5rem;
    vertical-align: middle;
  }


  nav a:not(.nav-link) {
    text-decoration: none;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }


  main {
    flex: 1;
    margin-top: 4rem;
    padding-top: 0;
  }

  /* Page d'accueil sans margin-top */
  :global(body:has(.hero)) main {
    margin-top: 0;
  }

  /* Icônes noires sur la page d'accueil */
  :global(body:has(.hero)) .nav-icon {
    filter: brightness(0) invert(0) !important;
  }

  .footer {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    color: #495057;
    padding: 0;
    border-top: 1px solid rgba(108, 117, 125, 0.2);
    width: 100%;
    margin-top: auto;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.25rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-links {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .footer-links a {
    color: #495057;
    text-decoration: none;
    font-size: 0.75rem;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: #007bff;
  }

  .footer-info {
    text-align: right;
  }

  .footer-info p {
    margin: 0;
    font-size: 0.7rem;
    color: #6c757d;
  }

  .footer-section h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #495057;
    border-bottom: 1px solid rgba(108, 117, 125, 0.3);
    padding-bottom: 0.2rem;
  }

  .footer-section h4 {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0 0 0.4rem;
    color: var(--color-accent-3);
  }

  .footer-links {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  .footer-column {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 100px;
    flex-shrink: 0;
  }

  .footer-column a {
    color: #6c757d;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.1rem 0;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .footer-column a:hover {
    color: #495057;
    transform: translateX(2px);
  }

  .partners {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .partner {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 100px;
  }

  .partner-logos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
  }

  .partner-logo {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
    color: var(--color-text-secondary);
    transition: all 0.3s ease;
  }

  .partner-logo:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-accent-2);
    transform: translateY(-1px);
  }

  .legal-links {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .legal-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.1rem 0;
    font-size: 0.75rem;
  }

  .legal-links a:hover {
    color: var(--color-accent-2);
    transform: translateX(2px);
  }

  .contact-info {
    margin-bottom: 0.8rem;
  }

  .contact-info p {
    margin: 0.2rem 0;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .social-links {
    display: flex;
    gap: 0.6rem;
  }

  .social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: var(--color-text-secondary);
    transition: all 0.3s ease;
  }

  .social-links a:hover {
    background: var(--color-accent-2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
  }

  .footer-bottom {
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-bottom-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .footer-bottom-content p {
    margin: 0.3rem 0;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .footer-bottom-content p:first-child {
    color: var(--color-accent-2);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    header {
      background-color: transparent;
      backdrop-filter: none;
      border-bottom: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }

    .logo {
      filter: brightness(0) invert(1) !important;
    }

    .menu-button {
      display: block;
    }

    .menu-icon {
      filter: brightness(0) invert(1);
    }

    /* Icône noire sur la page d'accueil */
    :global(body:has(.hero)) .menu-icon {
      filter: brightness(0) invert(0);
    }

    main {
      margin-top: 4rem;
      padding-top: 0;
    }
  }

    nav {
      position: fixed;
      top: 0;
      right: 100%;
      width: 90%;
      height: 100vh;
      background: #c0c0c0;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: right 0.3s ease;
      padding: 2rem;
      z-index: 1000;
    }

    nav.open {
      right: 0;
    }

    .dropdown-container {
      width: 100%;
      margin-bottom: 1rem;
    }

    .nav-link {
      font-size: 1.8rem;
      font-weight: 400;
      padding: 1rem;
      width: 100%;
      text-align: center;
      color: #000000;
      display: block;
    }

    .dropdown {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      background: transparent;
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      padding: 0;
    }

    .dropdown a {
      font-size: 1.3rem;
      font-weight: 400;
      padding: 0.8rem 1rem;
      color: #000000;
      display: block;
      text-align: center;
    }

    nav a:not(.nav-link) {
      font-size: 1.8rem;
      font-weight: 400;
      padding: 1rem;
      width: 100%;
      text-align: center;
      color: #000000;
      display: block;
    }

    /* Footer responsive */
    .footer {
      padding: 0.8rem 0 0.3rem;
    }

    .footer-content {
      padding: 0 1rem;
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }

    .footer-section h3 {
      font-size: 0.8rem;
      margin-bottom: 0.6rem;
    }

    .footer-links {
      gap: 1rem;
      flex-direction: column;
    }

    .footer-column {
      gap: 0.2rem;
    }

    .partners {
      gap: 1rem;
      flex-direction: column;
    }

    .partner-logos {
      gap: 0.2rem;
    }

    .partner-logo {
      padding: 0.15rem 0.3rem;
      font-size: 0.6rem;
    }

    .legal-links {
      gap: 0.8rem;
      flex-direction: column;
    }

    .social-links {
      justify-content: center;
    }

    .footer-bottom-content {
      padding: 0 1rem;
    }

    @media (max-width: 480px) {
    .footer-content {
      gap: 1.2rem;
    }

    .footer-section h3 {
      font-size: 0.85rem;
    }

    .footer-section h4 {
      font-size: 0.8rem;
    }

    .partner-logos {
      justify-content: center;
    }
  }
</style> 