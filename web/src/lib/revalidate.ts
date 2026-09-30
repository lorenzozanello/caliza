import { revalidatePath } from 'next/cache'

/** Refresca las páginas publicadas cuando el equipo cambia contenido en el panel. Fuera de Next (seed) no hace nada. */
export function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Sin contexto de Next: scripts como el seed.
  }
}

export const revalidateHooks = {
  afterChange: [() => revalidateSite()],
  afterDelete: [() => revalidateSite()],
}
