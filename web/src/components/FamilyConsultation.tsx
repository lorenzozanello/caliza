import Link from 'next/link'
import { CALIZA_WHATSAPP } from '@/lib/official-channels'

// Una carpeta de origen no constituye una referencia de venta aprobada.
// Las escenas son inspiración editorial conceptual, nunca fotos atribuidas a un SKU.
const families = [
  { name: 'Mesas de comedor', category: 'Mesas', image: '/option08-living.webp', description: 'Alternativas de bases, materiales y acabados para definir con el equipo.' },
  { name: 'Mesas auxiliares', category: 'Mesas', image: '/editorial-mesas-auxiliares.webp', description: 'Piezas de apoyo y acento para complementar ambientes.' },
  { name: 'Sillas para hogar', category: 'Sillas', image: '/editorial-sillas-hogar.webp', description: 'Asientos residenciales; modelos y tapizados sujetos a confirmación.' },
  { name: 'Sillas comerciales', category: 'Sillas', image: '/editorial-sillas-comerciales.webp', description: 'Opciones para hospitalidad y proyectos comerciales, bajo consulta técnica.' },
  { name: 'Lavamanos', category: 'Lavamanos', image: '/editorial-lavamanos.webp', description: 'Posibilidades en piedra natural para baños; medidas y material por definir.' },
]

export function FamilyConsultation({ limit }: { limit?: number }) {
  return (
    <div className="caliza-family-consultation">
      <div className="caliza-family-consultation__lead">
        <span className="eyebrow">Living Design · Universo editorial</span>
        <h2>La materia encuentra su lugar.</h2>
        <p>Explore cinco familias documentadas en CALIZA. Las imágenes son escenas conceptuales, no fotografías de modelos disponibles; cada opción se confirma en una conversación con el equipo.</p>
      </div>
      <div className="caliza-family-consultation__grid">
        {families.slice(0, limit ?? families.length).map((family) => {
          const message = `Hola, deseo conocer la familia ${family.name} de CALIZA LIVING DESIGN y consultar modelos, materiales, acabados y disponibilidad.`
          return (
            <article className="caliza-family-consultation__card" key={family.name}>
              <div className="caliza-family-consultation__media">
                <img src={family.image} alt={`Inspiración editorial conceptual de ${family.name.toLocaleLowerCase('es')}, no es un producto disponible`} loading="lazy" />
                <span>Imagen conceptual</span>
              </div>
              <div className="caliza-family-consultation__body">
                <span className="eyebrow">CALIZA · {family.category}</span>
                <h3>{family.name}</h3>
                <p>{family.description}</p>
                <a href={`https://wa.me/${CALIZA_WHATSAPP}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Consultar esta familia <span aria-hidden="true">↗</span></a>
                <small>Familia documentada · ficha comercial por validar</small>
              </div>
            </article>
          )
        })}
      </div>
      {limit && <Link href="/design" className="o8-button">Explorar todas las familias <span aria-hidden="true">→</span></Link>}
    </div>
  )
}
