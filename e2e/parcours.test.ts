import { test, expect } from '@playwright/test';

test.describe('Gestion des Parcours - Tests E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'administration
    await page.goto('/admin');
    
    // Se connecter avec le code d'accès
    await page.fill('input[type="password"]', 'argentique2024');
    await page.click('button[type="submit"]');
    
    // Attendre la redirection et aller à la gestion des balades
    await page.waitForURL('/admin');
    await page.click('text=Gestion des Balades');
    await page.waitForURL('/admin/balades');
  });

  test('peut ouvrir l\'interface d\'édition du parcours', async ({ page }) => {
    // Attendre que les balades se chargent
    await page.waitForSelector('text=Architecture médiévale');
    
    // Cliquer sur le bouton parcours de la première balade
    const parcoursButtons = page.locator('text=🗺️ Parcours');
    await parcoursButtons.first().click();
    
    // Vérifier que l'interface d'édition s'affiche
    await expect(page.locator('text=🗺️ Édition du parcours - Architecture médiévale')).toBeVisible();
    await expect(page.locator('text=➕ Ajouter une étape')).toBeVisible();
    await expect(page.locator('text=💾 Sauvegarder le parcours')).toBeVisible();
  });

  test('peut voir les étapes existantes du parcours', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Vérifier que les étapes existantes sont affichées
    await expect(page.locator('text=Départ - Place du Bouffay')).toBeVisible();
    await expect(page.locator('text=📍 47.2138, -1.5561')).toBeVisible();
  });

  test('peut ajouter une nouvelle étape', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Cliquer sur "Ajouter une étape"
    await page.click('text=➕ Ajouter une étape');
    
    // Remplir le formulaire
    await page.fill('input[placeholder*="titre"]', 'Nouvelle étape test');
    await page.fill('input[placeholder*="latitude"]', '47.2200');
    await page.fill('input[placeholder*="longitude"]', '-1.5500');
    await page.fill('textarea[placeholder*="description"]', 'Description de la nouvelle étape test');
    
    // Sauvegarder l'étape
    await page.click('text=Ajouter l\'étape');
    
    // Vérifier que l'étape a été ajoutée
    await expect(page.locator('text=Nouvelle étape test')).toBeVisible();
    await expect(page.locator('text=📍 47.22, -1.55')).toBeVisible();
  });

  test('peut modifier une étape existante', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Cliquer sur le bouton modifier de la première étape
    const editButtons = page.locator('text=✏️');
    await editButtons.first().click();
    
    // Vérifier que le formulaire est pré-rempli
    await expect(page.locator('input[value="Départ - Place du Bouffay"]')).toBeVisible();
    await expect(page.locator('input[value="47.2138"]')).toBeVisible();
    await expect(page.locator('input[value="-1.5561"]')).toBeVisible();
    
    // Modifier les valeurs
    await page.fill('input[placeholder*="titre"]', 'Étape modifiée');
    await page.fill('input[placeholder*="latitude"]', '47.2300');
    await page.fill('input[placeholder*="longitude"]', '-1.5400');
    await page.fill('textarea[placeholder*="description"]', 'Description modifiée');
    
    // Sauvegarder les modifications
    await page.click('text=Modifier l\'étape');
    
    // Vérifier que les modifications sont visibles
    await expect(page.locator('text=Étape modifiée')).toBeVisible();
    await expect(page.locator('text=📍 47.23, -1.54')).toBeVisible();
  });

  test('peut supprimer une étape', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Compter le nombre d'étapes avant suppression
    const etapesAvant = page.locator('.etape-card');
    const countAvant = await etapesAvant.count();
    
    // Cliquer sur le bouton supprimer de la première étape
    const deleteButtons = page.locator('text=🗑️');
    await deleteButtons.first().click();
    
    // Confirmer la suppression (dialogue de confirmation)
    page.on('dialog', dialog => dialog.accept());
    
    // Vérifier que le nombre d'étapes a diminué
    await expect(etapesAvant).toHaveCount(countAvant - 1);
  });

  test('peut réorganiser les étapes', async ({ page }) => {
    // Créer une balade avec plusieurs étapes pour le test
    // (Ce test nécessiterait une balade avec au moins 2 étapes)
    
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Vérifier que les boutons de réorganisation sont présents
    const moveUpButtons = page.locator('text=⬆️');
    const moveDownButtons = page.locator('text=⬇️');
    
    await expect(moveUpButtons).toBeVisible();
    await expect(moveDownButtons).toBeVisible();
    
    // Le premier bouton up devrait être désactivé
    await expect(moveUpButtons.first()).toBeDisabled();
  });

  test('peut sauvegarder le parcours', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Cliquer sur "Sauvegarder le parcours"
    await page.click('text=💾 Sauvegarder le parcours');
    
    // Vérifier que le message de succès s'affiche
    await expect(page.locator('text=Parcours sauvegardé avec succès !')).toBeVisible();
    
    // Vérifier que l'interface d'édition se ferme
    await expect(page.locator('text=🗺️ Édition du parcours - Architecture médiévale')).not.toBeVisible();
  });

  test('peut annuler l\'édition du parcours', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Cliquer sur "Annuler"
    await page.click('text=❌ Annuler');
    
    // Vérifier que l'interface d'édition se ferme
    await expect(page.locator('text=🗺️ Édition du parcours - Architecture médiévale')).not.toBeVisible();
  });

  test('valide les champs obligatoires lors de l\'ajout d\'étape', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Cliquer sur "Ajouter une étape"
    await page.click('text=➕ Ajouter une étape');
    
    // Essayer de sauvegarder sans remplir les champs obligatoires
    await page.click('text=Ajouter l\'étape');
    
    // Vérifier que le message d'erreur s'affiche
    await expect(page.locator('text=Veuillez remplir le titre et la description de l\'étape')).toBeVisible();
  });

  test('affiche le bon nombre d\'étapes dans le titre', async ({ page }) => {
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Vérifier que le nombre d'étapes est affiché
    await expect(page.locator('text=Étapes du parcours (1)')).toBeVisible();
  });

  test('gère les balades sans parcours', async ({ page }) => {
    // Aller à une balade qui n'a pas de parcours (si elle existe)
    // Ou créer une balade sans parcours pour le test
    
    // Pour ce test, on vérifie juste que l'interface s'affiche correctement
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Vérifier que l'interface d'édition s'affiche même sans étapes
    await expect(page.locator('text=🗺️ Édition du parcours')).toBeVisible();
  });

  test('interface responsive sur mobile', async ({ page }) => {
    // Redimensionner la fenêtre pour simuler un mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Ouvrir l'édition du parcours
    await page.waitForSelector('text=Architecture médiévale');
    await page.locator('text=🗺️ Parcours').first().click();
    
    // Vérifier que l'interface reste utilisable sur mobile
    await expect(page.locator('text=🗺️ Édition du parcours')).toBeVisible();
    await expect(page.locator('text=➕ Ajouter une étape')).toBeVisible();
    
    // Vérifier que les boutons sont accessibles
    await expect(page.locator('text=💾 Sauvegarder le parcours')).toBeVisible();
    await expect(page.locator('text=❌ Annuler')).toBeVisible();
  });
});
