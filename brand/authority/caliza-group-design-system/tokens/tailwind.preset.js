// CALIZA GROUP — preset de Tailwind (v3). Requiere cargar tokens/tokens.css.
// Uso: presets: [require("./tokens/tailwind.preset.js")]
module.exports = { theme: { extend: {
  "colors": {
    "marine-ink": "var(--marine-ink)",
    "terracotta": "var(--terracotta)",
    "sand": "var(--sand)",
    "limewash": "var(--limewash)",
    "surface": "var(--surface)",
    "surface-raised": "var(--surface-raised)",
    "surface-sand": "var(--surface-sand)",
    "line": "var(--line)",
    "line-strong": "var(--line-strong)",
    "ink": "var(--ink)",
    "ink-muted": "var(--ink-muted)",
    "accent": "var(--accent)",
    "accent-text": "var(--accent-text)",
    "primary": "var(--primary)",
    "on-primary": "var(--on-primary)",
    "focus": "var(--focus)",
    "rule": "var(--rule)",
    "scrim": "var(--scrim)"
  },
  "fontFamily": {
    "serif": [
      "var(--font-serif)"
    ],
    "sans": [
      "var(--font-sans)"
    ]
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px",
    "7": "48px",
    "8": "64px",
    "9": "96px"
  },
  "borderRadius": {
    "none": "0",
    "xs": "2px",
    "arch": "999px",
    "round": "50%"
  },
  "boxShadow": {
    "float": "var(--shadow-float)"
  }
} } };
