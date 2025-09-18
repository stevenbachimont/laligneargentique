<script lang="ts">
  export let title: string;
  export let description: string;
  export let keywords: string = "";
  export let canonicalUrl: string;
  export let ogImage: string = "https://laligneargentique.fr/Logo/Logo.png";
  export let ogType: string = "website";
  export let jsonLd: object | null = null;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}
  
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content={ogType} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <!-- Twitter -->
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />
  
  <!-- Données structurées JSON-LD -->
  {#if jsonLd}
    <script type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </script>
  {/if}
</svelte:head>
