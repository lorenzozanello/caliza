const STEPS = [
  ['01', 'Seleccionar', 'Elegimos cada placa por su veta, su tono y su comportamiento antes de que exista tu proyecto.'],
  ['02', 'Interpretar', 'Leemos tu espacio y la piedra juntos: dónde cortar, cómo casar las vetas, qué acabado pide el uso.'],
  ['03', 'Transformar', 'Fabricamos a la medida, con madera y metal cuando la pieza lo pide, e instalamos.'],
  ['04', 'Cuidar', 'Caliza Care acompaña la vida de cada superficie con mantenimiento y restauración.'],
]

/** Método con línea que se dibuja al hacer scroll. `steps` permite reutilizarlo con otros pasos (Care). */
export function Method({ eyebrow = 'Cómo trabajamos', title = 'Del criterio a la obra.', steps, tone = 'papel' }: { eyebrow?: string; title?: string; steps?: { title: string; text?: string | null }[]; tone?: 'papel' | 'piedra' }) {
  const list = steps?.length ? steps.map((s, i) => [String(i + 1).padStart(2, '0'), s.title, s.text ?? '']) : STEPS
  return (
    <section className={`sec-s2 wrap${tone === 'papel' ? ' bg-papel' : ''}`} aria-label={eyebrow}>
      <div className="grid">
        <div className="c-1-4"><div className="method__sticky"><span className="eyebrow muted">{eyebrow}</span><h2 className="h2">{title}</h2></div></div>
        <div className="c-6-7">
          <div className="method__steps" data-steps>
            <div className="method__rail"><i data-rail /></div>
            {list.map(([n, t, d], i) => (
              <div className="step" data-reveal key={n} style={i === list.length - 1 ? { paddingBottom: 0 } : undefined}>
                <span className="step__num">{n}</span><h3 className="h3 step__title">{t}</h3>{d && <p>{d}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
