<script>
  import '../app.css';
  
  let isMenuOpen = false;
  let activeDropdown = null;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
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
      <a href="/">Steven Bachimont</a>
    </div>
    <button class="menu-button" on:click={toggleMenu} aria-label="Menu">
      <span class="hamburger" class:open={isMenuOpen}></span>
    </button>
    <nav class:open={isMenuOpen}>
      <!-- Menu Web -->
      <div class="dropdown-container">
        <a href="/web" class="nav-link" on:mouseenter={() => toggleDropdown('web')} on:mouseleave={closeDropdown}>
          Web
        </a>
        <div class="dropdown" class:active={activeDropdown === 'web'} on:mouseenter={() => toggleDropdown('web')} on:mouseleave={closeDropdown}>
          <a href="/web/portfolioWeb" on:click={() => isMenuOpen = false}>Portfolio Web</a>
          <a href="/web/outils" on:click={() => isMenuOpen = false}>Outils & Technologies</a>
        </div>
      </div>

      <!-- Menu Photographie -->
      <div class="dropdown-container">
        <a href="/photographie" class="nav-link" on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown}>
          Photographie
        </a>
        <div class="dropdown" class:active={activeDropdown === 'photographie'} on:mouseenter={() => toggleDropdown('photographie')} on:mouseleave={closeDropdown}>
          <a href="/photographie/argentique" on:click={() => isMenuOpen = false}>La Ligne Argentiques</a>
          <a href="/photographie/portfolioPhoto" on:click={() => isMenuOpen = false}>Galerie Photos</a>
        </div>
      </div>



      <a href="/#about-section" on:click={() => isMenuOpen = false}>A propos</a>
      <a href="/contact" on:click={() => isMenuOpen = false}>Contact</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <a href="/conditions-generales" on:click={() => isMenuOpen = false}>Conditions Générales</a>
    <a href="/mentions-legales" on:click={() => isMenuOpen = false}>Mentions Légales</a>
    <a href="/politique-confidentialite" on:click={() => isMenuOpen = false}>Politique de Confidentialité</a>
    <p>© 2025 - StevenBACHIMONT</p>
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
    background: var(--color-accent-2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    transition: all 0.5s ease;
    background: var(--color-accent-2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  main {
    flex: 1;
    padding: 2rem;
  }

  footer {
    text-align: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
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
</style> 