<script lang="ts">
  import emailjs from 'emailjs-com';
  let nom = '';
  let prenom = '';
  let email = '';
  let message = '';
  let sent = false;
  let error = '';

  // Récupération des variables d'environnement
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Debug temporaire - à supprimer après
  console.log('EmailJS Config:', { serviceId, templateId, publicKey });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    console.log('Tentative d\'envoi avec:', { serviceId, templateId, publicKey });
    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          nom,
          prenom,
          email,
          message
        },
        publicKey
      );
      console.log('Email envoyé avec succès:', result);
      sent = true;
      error = '';
      nom = prenom = email = message = '';
    } catch (err) {
      console.error('Erreur EmailJS:', err);
      error = 'Erreur lors de l\'envoi du message.';
      sent = false;
    }
  }
</script>

<section class="contact-section">
  <h1>Contact</h1>
  <p>
    N’hésitez pas à me contacter pour toute demande de collaboration, projet web, photographie, ou simplement pour échanger. Je réponds rapidement à tous les messages !
  </p>
  <form class="contact-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="prenom">Prénom</label>
      <input id="prenom" type="text" bind:value={prenom} required />
    </div>
    <div class="form-group">
      <label for="nom">Nom</label>
      <input id="nom" type="text" bind:value={nom} required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" rows="5" bind:value={message} required></textarea>
    </div>
    <button type="submit" class="contact-btn">Envoyer</button>
  </form>
  {#if sent}
    <p class="success">Message envoyé !</p>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}
</section>

<style>
.contact-section {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: rgba(0,0,0,0.7);
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.15);
  text-align: center;
}
.contact-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-accent-1);
}
.contact-section p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #fff;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: stretch;
}
.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
label {
  color: #fff;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
input, textarea {
  width: 100%;
  padding: 0.7rem;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  background: rgba(216, 209, 209, 0.709);
  color: #fff;
  outline: none;
}
input:focus, textarea:focus {
  background: rgba(255,255,255,0.2);
}
.contact-btn {
  align-self: center;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  color: #fff;
  background: linear-gradient(45deg, var(--color-accent-1), var(--color-accent-2));
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s, transform 0.2s;
  cursor: pointer;
}
.contact-btn:hover {
  background: linear-gradient(45deg, var(--color-accent-2), var(--color-accent-1));
  transform: scale(1.05);
}
.success {
  color: #00ff99;
  margin-top: 1rem;
}
.error {
  color: #ff4444;
  margin-top: 1rem;
}
</style> 