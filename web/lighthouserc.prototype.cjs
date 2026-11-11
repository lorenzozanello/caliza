/* Presupuesto V1 QA: SEO público no se puntúa mientras noindex esté activo. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'python3 -m http.server 8865 --bind 127.0.0.1 --directory ../prototype',
      startServerReadyPattern: 'Serving HTTP',
      url: [
        'http://127.0.0.1:8865/index.html#/',
        'http://127.0.0.1:8865/index.html#/living-design/coleccion',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
        onlyCategories: ['performance','accessibility','best-practices','seo'],
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:performance': ['warn', { minScore: 0.80 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci-caliza' },
  },
}
