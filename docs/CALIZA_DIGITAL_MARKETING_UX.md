# CALIZA GROUP — experiencia y mercadeo digital

> **Actualización del 11-11-2026:** este documento conserva el alcance inicial del prototipo. Las decisiones vigentes, los canales oficiales, la eliminación de las 16 fichas ficticias y los requisitos de publicación están en [`CALIZA_RELEASE_2026-11-11.md`](CALIZA_RELEASE_2026-11-11.md). En caso de conflicto prevalece ese cierre y el contrato de publicación de Drive. El número de WhatsApp y los perfiles oficiales ya fueron confirmados; el visor público ya no admite que visitantes agreguen enlaces.

**Corte:** 11 de noviembre de 2026

**Alcance:** prototipo estático de revisión en Vercel. No autoriza publicar el catálogo como oferta comercial ni activar procesamiento de datos personales.

## 1. Fuente de verdad

La identidad oficial es `brand/authority/caliza-group-design-system/`, con su archivo original preservado en `brand/authority/`. Ningún cambio UX puede recrear o deformar los logotipos. Los estilos nuevos de `prototype/assets/css/marketing.css` consumen los tokens de `prototype/assets/css/authority-tokens.css` y las fuentes locales Playfair Display/Montserrat. La prueba `brand/identity/tests/identity.test.mjs` verifica integridad.

## 2. Matriz de experiencia

| Recorrido | Estado de la revisión | Conducta real |
| --- | --- | --- |
| Descubrimiento de las tres líneas | Implementado | Portada y rutas Stone Design, Living Design y Stone Care. |
| Orientación comercial por intención | Implementado | Tres recorridos explícitos: brief, tienda de consulta, diagnóstico. |
| WhatsApp flotante contextual | Implementado con pendiente de dato | Mensaje contextual y selección para cotizar. Sin número oficial abre WhatsApp sin destinatario preseleccionado. |
| Tienda visible en menú | Implementado, sin comercio transaccional | Ruta `#/tienda`, búsqueda local, filtros, fichas y selección. No hay pago, precios ni stock verificado. |
| Selección de referencias | Implementado | Carrito local, cantidades, resumen copiable y texto listo para compartir voluntariamente por WhatsApp. |
| Contacto / brief / cuidado | Implementado | Preparación local, resumen verificable y acceso a WhatsApp. Ningún dato se envía silenciosamente. |
| Visor Instagram + TikTok | Implementado con pendiente editorial | Visible en portada y `#/inspiracion`; acepta enlaces públicos aprobados o añadidos localmente, filtros y carga del iframe solo tras clic. |
| Curaduría social compartida | Preparado, sin contenido oficial suministrado | `prototype/assets/js/featured-social.js` permite añadir hasta ocho enlaces revisados que se mostrarán a todos. La lista está vacía intencionalmente. |
| Enlaces a perfiles oficiales | Preparado, pendiente de verificación | Metadatos `caliza-instagram` y `caliza-tiktok` en el `<head>`; solo se muestran tras URL válida. |
| Atribución de campaña hacia WhatsApp | Preparado | `utm_source` y `utm_campaign` (limitados y saneados) se adjuntan de modo visible al mensaje **solo cuando el usuario pulsa el enlace**. No existe telemetría. |

## 3. Datos de activación pendientes — imprescindibles

1. **WhatsApp**: confirmar el número comercial propiedad de Caliza, en formato internacional solo dígitos. Escribirlo en `prototype/index.html`, `<meta name="caliza-whatsapp" content="573XXXXXXXXX">`. No se aceptan números simulados. El sitio cambia automáticamente de mensaje para compartir a enlace directo `wa.me/<número>`.
2. **Perfiles sociales**: aportar URL oficial de Instagram (`https://www.instagram.com/usuario/`) y TikTok (`https://www.tiktok.com/@usuario`), con control de marca verificado. Escribirlos en las etiquetas meta correspondientes.
3. **Publicaciones**: aportar enlaces exactos de reels, posts y videos públicos que Caliza autorice a destacar. Agregar solo URLs a `window.CALIZA_FEATURED_SOCIAL` en `prototype/assets/js/featured-social.js`. Comprobar que cada iframe sea embebible y que no infrinja derechos de imagen. No hay API ni sincronización automática.
4. **Catálogo**: revisar nombres de piezas, fotografías por referencia, inventario, precios, impuestos, plazos y condiciones. Sin esta aprobación, la tienda solo puede denominarse **de consulta**.
5. **Proyectos**: autorizar fotografías propias, créditos, descripción del trabajo, ciudad y permisos de uso. No presentar ambientaciones conceptuales como obras ejecutadas.

## 4. Paso siguiente para convertir el sitio en un motor de mercadeo

### Prioridad alta (posterior a validar contenido)

- Publicar páginas indexables con URLs reales para las tres marcas, categorías, fichas de piezas, proyectos y guías; la revisión actual usa `#/` y `robots=noindex,nofollow` de forma deliberada.
- Instalar un formulario/CRM con validación, política de privacidad, base jurídica, protección antispam, aviso de recepción y asignación de responsable por línea. **No** reutilizar el prototipo local como si recibiera clientes.
- Diseñar fichas de producto completas: material disponible, medidas, fotos propias, variantes, cuidados, condiciones, cotización e identificación de referencia.
- Integrar WhatsApp Business y enlaces a perfiles sociales oficialmente validados, con pruebas en Android/iOS y desktop.
- Entregar páginas de proyectos reales con pruebas de confianza: objetivos, material, proceso, fotografías de obra y consentimiento.

### Medición verificable (cuando se autorice la analítica)

| Evento propuesto | Disparador | Datos mínimos, no personales |
| --- | --- | --- |
| `view_business_line` | Visita a una de las tres líneas | Línea y ruta. |
| `select_path` | Clic en recorrido de portada | Identificador de recorrido. |
| `view_item` | Apertura de ficha | SKU/referencia aprobada. |
| `add_to_quote` | Agregar referencia | SKU y cantidad. |
| `begin_quote` | Abrir selección | Número de referencias. |
| `click_whatsapp` | Clic voluntario al enlace | Línea, ubicación de CTA, UTM permitidos; **nunca** texto libre del cliente. |
| `social_open_embed` | Clic para abrir embed | Plataforma, ID público. |
| `contact_intent` | Preparación de consulta | Línea, nunca contenido del mensaje ni ciudad libre. |

Antes de conectar GA4, GTM, Meta Pixel u otra herramienta, definir mecanismo de consentimiento, retención, finalidades y tratamiento de datos conforme a las políticas reales de Caliza. Nada de eso está habilitado por esta revisión.

### Prioridad media

- Biblioteca editorial y SEO de cuidado de piedra, comparativas de materiales, preguntas frecuentes, e inspiración arquitectónica con fotografía verificada.
- Casos de estudio con CTA a la línea pertinente y galería filtrable por aplicación, espacio y material.
- Prueba de usabilidad con clientes reales: móvil (360/390 px), tablet, desktop, teclado y lector de pantalla; velocidad/LCP, CLS e imágenes optimizadas.
- Integración de agenda comercial y seguimiento de estados de oportunidad, solo con canales y responsabilidades aprobados.

## 5. Criterio de publicación

El prototipo es **apto para revisión**, no para anunciar una tienda transaccional. Para publicidad activa debe existir un canal de contacto correcto, contenido aprobado, sitio indexable con información legal y una ruta verificable hasta recepción y respuesta de la consulta. Ningún diseño convincente sustituye esas pruebas.

## 6. Verificaciones locales

```sh
node prototype/tests/smoke.cjs
node brand/identity/tests/identity.test.mjs
git diff --check
```

El visor de Instagram/TikTok puede fallar al embeber publicaciones según las restricciones de cada plataforma; siempre conserva el enlace para abrir el original. Sin autorización no se consulta API ni se inventan redes o métricas de Caliza.
