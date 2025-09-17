<script>
  import '../app.css';
  
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
</script>

<div class="container">
  <header>
    <div class="logo">
      <a href="/">La Ligne Argentique</a>
    </div>
    <button class="menu-button" on:click={toggleMenu} aria-label="Menu">
      <span class="hamburger" class:open={isMenuOpen}></span>
    </button>
    <nav class:open={isMenuOpen}>

      <!-- Menu Photographie -->
      <div class="dropdown-container">
        <a href="/photographie" class="nav-link" on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown}>
          Photographie
        </a>
        <div class="dropdown" class:active={activeDropdown === 'photographie'} on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown}>
          <a href="/photographie/argentique" on:click={() => isMenuOpen = false}>La Ligne Argentiques</a>
          <a href="/photographie/galeriePhoto" on:click={() => isMenuOpen = false}>Galerie Photos</a>
        </div>
      </div>



      <a href="/#about-section" on:click={() => isMenuOpen = false}>A propos</a>
      <a href="/contact" on:click={() => isMenuOpen = false}>Contact</a>
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
            <a href="/photographie/argentique">La Ligne Argentiques</a>
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
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
  }

  .logo {
    position: absolute;
    font-weight: bold;
    left: 1rem;
    top: 1rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    background: var(--color-accent-3);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo:hover {
    transition: all 0.5s ease;
    position: absolute;
    font-weight: bold;
    left: 1rem;
    top: 1rem;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: var(--color-accent-2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
  }

  .hamburger {
    display: block;
    width: 25px;
    height: 2px;
    background-color: var(--color-text);
    position: relative;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
    left: 0;
  }

  .hamburger::before {
    top: -8px;
  }

  .hamburger::after {
    bottom: -8px;
  }

  .hamburger.open {
    background-color: transparent;
  }

  .hamburger.open::before {
    transform: rotate(45deg);
    top: 0;
  }

  .hamburger.open::after {
    transform: rotate(-45deg);
    bottom: 0;
  }

  nav {
    display: flex;
    gap: 2rem;
    margin-right: 2rem;
    justify-content: center;
    align-items: center;
  }

  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  .nav-link {
    text-decoration: none;
    color: var(--color-text);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    display: block;
    cursor: pointer;
  }

  .nav-link:hover {
    color: var(--color-accent-2);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    color: var(--color-text);
    text-decoration: none;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .dropdown a:last-child {
    border-bottom: none;
  }

  .dropdown a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-accent-2);
  }

  nav a:not(.nav-link):hover {
    color: var(--color-accent-2);
  }

  main {
    flex: 1;
    padding: 2rem;
  }

  .footer {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: var(--color-text);
    padding: 1rem 0 0.3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .footer-section h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--color-accent-2);
    border-bottom: 1px solid var(--color-accent-3);
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
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.1rem 0;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .footer-column a:hover {
    color: var(--color-accent-2);
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
    .menu-button {
      display: block;
    }

    nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100vw;
      height: 100vh;
      background: #000 !important;
      background-color: #000 !important;
      flex-direction: column;
      justify-content: center;
      transition: right 0.3s ease;
      padding: 2rem;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    nav.open {
      right: 0;
    }

    .dropdown-container {
      width: 100%;
    }

    .nav-link {
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dropdown {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin-left: 1rem;
      margin-bottom: 1rem;
    }

    .dropdown a {
      font-size: 1.2rem;
      padding: 0.8rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    nav a:not(.nav-link) {
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    :global(body) {
      overflow-x: hidden !important;
    }
  }

  /* Footer responsive */
  @media (max-width: 768px) {
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