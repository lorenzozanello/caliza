import { execSync } from 'node:child_process'

/** Cada corrida parte del contenido de ejemplo recién cargado. */
export default function globalSetup() {
  execSync('npm run seed', { stdio: 'inherit' })
}
