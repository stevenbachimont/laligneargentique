<script>
  import '../app.css';
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
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
      <a href="/web" on:click={() => isMenuOpen = false}>Web</a>
      <a href="/photographie" on:click={() => isMenuOpen = false}>Photographie</a>
      <a href="/#about-section" on:click={() => isMenuOpen = false}>A propos</a>
      <a href="/contact" on:click={() => isMenuOpen = false}>Contact</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
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

  nav a:hover {
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

    nav a {
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
    }

    :global(body) {
      overflow-x: hidden !important;
    }
  }
</style> 