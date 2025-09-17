<script lang="ts">
  export let size = "large"; // "large" pour page principale, "small" pour logo
  export let showAnimation = true;
  
  const sizeClasses = {
    large: "title-large",
    small: "title-small"
  };
</script>

<svg class="animated-title {sizeClasses[size]}" viewBox="0 0 690 109" width={size === "large" ? "600" : "400"} height={size === "large" ? "120" : "80"}>
  <defs>
    <style>
      @font-face { 
        font-family: Excalifont; 
        src: url(data:font/woff2;base64,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); 
      }
    </style>
  </defs>
  <g transform="translate(10 10)">
    <text font-family="Excalifont, sans-serif" font-size={size === "large" ? "71px" : "48px"} fill="#1e1e1e" text-anchor="start">
      <!-- Premier mot : "La" -->
      <tspan x="0" y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0s;">L</tspan>
      <tspan x={size === "large" ? "35" : "26"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.1s;">a</tspan>
      
      <!-- Espace entre "La" et "Ligne" -->
      <tspan x={size === "large" ? "80" : "58"} y={size === "large" ? "63" : "20"} class="space" style="animation-delay: 0.2s;"> </tspan>
      
      <!-- Deuxième mot : "Ligne" -->
      <tspan x={size === "large" ? "120" : "84"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.3s;">L</tspan>
      <tspan x={size === "large" ? "155" : "110"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.4s;">i</tspan>
      <tspan x={size === "large" ? "170" : "122"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.5s;">g</tspan>
      <tspan x={size === "large" ? "200" : "142"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.6s;">n</tspan>
      <tspan x={size === "large" ? "230" : "164"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.7s;">e</tspan>
      
      <!-- Espace entre "Ligne" et "Argentique" -->
      <tspan x={size === "large" ? "280" : "200"} y={size === "large" ? "63" : "20"} class="space" style="animation-delay: 0.8s;"> </tspan>
      
      <!-- Troisième mot : "Argentique" -->
      <tspan x={size === "large" ? "320" : "230"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 0.9s;">A</tspan>
      <tspan x={size === "large" ? "360" : "260"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.0s;">r</tspan>
      <tspan x={size === "large" ? "390" : "278"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.1s;">g</tspan>
      <tspan x={size === "large" ? "420" : "298"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.2s;">e</tspan>
      <tspan x={size === "large" ? "450" : "318"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.3s;">n</tspan>
      <tspan x={size === "large" ? "480" : "338"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.4s;">t</tspan>
      <tspan x={size === "large" ? "510" : "358"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.5s;">i</tspan>
      <tspan x={size === "large" ? "525" : "368"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.6s;">q</tspan>
      <tspan x={size === "large" ? "555" : "388"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.7s;">u</tspan>
      <tspan x={size === "large" ? "585" : "408"} y={size === "large" ? "63" : "20"} class="letter" style="animation-delay: 1.8s;">e</tspan>
    </text>
  </g>
</svg>

<style>
  .animated-title {
    display: inline-block;
    transition: all 0.3s ease;
  }

  .title-large {
    max-width: 600px;
    max-height: 120px;
  }

  .title-small {
    max-width: 400px;
    max-height: 80px;
  }

  .title-small:hover {
    transform: scale(1.05);
  }

  /* Responsive pour mobile */
  @media (max-width: 768px) {
    .title-large {
      max-width: 90%;
      max-height: 80px;
    }
    
    .title-small {
      max-width: 90%;
      max-height: 50px;
    }
  }

  @media (max-width: 480px) {
    .title-large {
      max-width: 95%;
      max-height: 60px;
    }
    
    .title-small {
      max-width: 95%;
      max-height: 40px;
    }
  }

  /* Animation lettre par lettre */
  .letter {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    animation: letterAppear 0.6s ease-out forwards;
  }

  @keyframes letterAppear {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-5px) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Style pour les espaces */
  .space {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    animation: letterAppear 0.6s ease-out forwards;
    font-size: 1.2em;
  }

  /* Désactiver l'animation si showAnimation est false */
  :global(.no-animation) .letter,
  :global(.no-animation) .space {
    animation: none;
    opacity: 1;
    transform: none;
  }
</style>
