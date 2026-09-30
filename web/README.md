# Caliza · web

Sitio, tienda y administración de Caliza. Next.js 16 (App Router) + Payload CMS 3 en la misma aplicación.

## Arrancar

```bash
cp .env.example .env      # y cambia PAYLOAD_SECRET
npm install
npm run seed              # contenido de ejemplo + usuario administrador (SEED_ADMIN_*)
npm run dev               # http://localhost:3000 · panel en /admin
```

En sesiones de Claude Code en la nube, `.claude/hooks/session-start.sh` hace estos pasos solo.

## Qué hay

| Ruta | Qué es |
| --- | --- |
| `/` | Home y landing de campañas. `?utm_source=instagram` se guarda y viaja en cada mensaje de WhatsApp. |
| `/design`, `/design/[slug]` | Tienda con filtros y ficha con configurador (piedra, tamaño, base), precio en vivo y cotización de envío. |
| `/checkout` | Datos, entrega con accesos, pago completo o anticipo, método de pago. |
| `/pago/simulado` | Pasarela de prueba (solo con `PAYMENTS_PROVIDER=simulated`). |
| `/pedido/[token]` | Seguimiento privado: etapas, avances con foto, guía de envío, reintento de pago, WhatsApp con el número de pedido. |
| `/proyectos/[slug]` | Caso de proyecto. |
| `/webhooks/wompi` | Eventos de Wompi con verificación de firma. |
| `/admin` | Panel en español: productos, precios y disponibilidad, proyectos, materiales, pedidos, prospectos, home y ajustes (WhatsApp, ciudades y costos de envío). |

## Reglas de negocio

- El servidor recalcula precios, envío y anticipo; nunca confía en el carrito del navegador.
- Entrega inmediata: pago completo y descuento de unidades al confirmarse el pago. Bajo pedido y configurable: anticipo (50% por defecto, editable por producto) o pago completo.
- Solo cotización: sin carrito, con WhatsApp.
- Cada intento de pago tiene referencia `C-XXXXXX-N`; aplicar un resultado es idempotente.
- Los pedidos solo son visibles para el equipo; el cliente los ve con su enlace privado.

## Pagos con Wompi

1. `PAYMENTS_PROVIDER=wompi` y las llaves `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET` (sandbox o producción).
2. En el panel de Wompi, URL de eventos: `https://<dominio>/webhooks/wompi`.
3. El cliente paga en el checkout web de Wompi y vuelve a `/pedido/[token]`; el estado cambia cuando llega el evento firmado.

## Producción

- `DATABASE_URI=postgres://…` activa el adaptador de Postgres.
- `media/` es almacenamiento local: en un despliegue sin disco persistente hay que conectar almacenamiento de objetos (S3 o equivalente).
- `NEXT_PUBLIC_SITE_URL` con el dominio final (sitemap, JSON-LD y retorno de pagos).

## Pruebas

```bash
npm run typecheck
npm run build
npm run test:e2e   # recarga el contenido de ejemplo; 1440 px y móvil; axe WCAG 2.2 AA
npm run test:lhci  # accesibilidad ≥ 95, buenas prácticas y SEO ≥ 90
```

El flujo `.github/workflows/web.yml` corre lo mismo en cada push.

Las fotos del contenido de ejemplo son provisionales (recortes del mockup de referencia) y se marcan como tales en el sitio.
