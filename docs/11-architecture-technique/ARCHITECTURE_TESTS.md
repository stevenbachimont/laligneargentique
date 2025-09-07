# 🧪 Architecture de Tests

## 📋 Vue d'ensemble

Cette section détaille l'architecture de tests du projet, incluant les tests unitaires, d'intégration et end-to-end.

## 🧪 Tests Unitaires

### Structure
```
tests/
├── services/                # Tests des services
├── api/                     # Tests des APIs
└── utils/                   # Tests des utilitaires
```

### Exemple de Test
```typescript
// tests/services/baladesService.test.ts
import { describe, it, expect } from 'vitest';
import { getBalades } from '$lib/server/baladesService';

describe('BaladesService', () => {
  it('should return active balades', async () => {
    const balades = await getBalades();
    expect(balades).toBeDefined();
    expect(balades.length).toBeGreaterThan(0);
  });
});
```

## 🔗 Tests d'Intégration

### Structure
```
tests/
├── integration/             # Tests d'intégration
└── routes/                  # Tests des routes
```

### Tests d'API
```typescript
// tests/api/balades.test.ts
import { test, expect } from '@playwright/test';

test('GET /api/balades should return balades', async ({ request }) => {
  const response = await request.get('/api/balades');
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
});
```

## 🎭 Tests End-to-End

### Structure
```
e2e/
├── demo.test.ts            # Tests de démonstration
└── parcours.test.ts        # Tests de parcours utilisateur
```

### Configuration Playwright
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

## 📊 Qualité du Code

### Linting
- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique
- **TypeScript** : Vérification des types

### Couverture de Tests
```bash
# Génération du rapport de couverture
npm run test:coverage
```

---

**💡 Conseil** : Cette architecture de tests assure une qualité de code élevée et une maintenance facilitée.
