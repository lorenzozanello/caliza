/** Presupuesto de calidad: accesibilidad, buenas prácticas y SEO bloquean; rendimiento avisa hasta tener fotos definitivas. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx next start -p 3300',
      startServerReadyPattern: 'Ready',
      url: ['http://localhost:3300/', 'http://localhost:3300/design', 'http://localhost:3300/design/mesa-estrato'],
      numberOfRuns: 1,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
