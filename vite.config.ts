import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Charger les variables d'environnement
	const env = loadEnv(mode, process.cwd(), '');
	
	return {
		define: {
			'import.meta.env.VITE_ADMIN_ACCESS_CODE': JSON.stringify(env.ADMIN_ACCESS_CODE),
			'process.env.VITEST': JSON.stringify(mode === 'test' ? 'true' : 'false'),
			'process.env.NODE_ENV': JSON.stringify(mode === 'test' ? 'test' : process.env.NODE_ENV || 'development')
		},
		plugins: [
			sveltekit(),
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide'
			})
		],
		server: {
			host: '0.0.0.0',
			port: 3000,
			strictPort: true
		},
		preview: {
			host: '0.0.0.0',
			port: 3000,
			strictPort: true,
			allowedHosts: ['laligneargentique.fr', 'www.laligneargentique.fr']
		},
		test: {
			workspace: [
				{
					extends: './vite.config.ts',
					plugins: [svelteTesting()],
					test: {
						name: 'client',
						environment: 'jsdom',
						clearMocks: true,
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	};
});
