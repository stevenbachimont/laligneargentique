import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from '../../src/routes/+page.svelte';

// Mock des services
vi.mock('$lib/services/baladesClientService', () => ({
  baladesStore: {
    subscribe: vi.fn()
  }
}));

describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});
});
