# Domina IA

Página web autónoma (sin instalación ni dependencias) para aprender inteligencia artificial de cero a experto: ruta de 7 niveles, biblioteca de prompts, generador de prompts maestros, mapa de 30 modelos, 8 casos reales en vídeo, glosario, retos de 30 días y recursos.

## Cómo abrirla

Haz doble clic en `index.html` o ábrelo con tu navegador. Funciona directamente desde el sistema de archivos (`file://`); no necesita servidor. Necesita conexión para cargar las miniaturas y los vídeos de YouTube y para abrir los enlaces externos de recursos.

```
index.html
assets/
  styles.css   → sistema de diseño, componentes y responsive
  app.js       → datos, progreso, filtros, generador, vídeos y canvas
```

## Qué incluye

- **Ruta de 7 niveles** con módulos, horas estimadas y progreso guardado en `localStorage`.
- **22 prompts** filtrables por categoría y buscables, con copia al portapapeles.
- **Taller de prompts**: formulario con rol, objetivo, contexto, público, formato, tono y restricciones; salida en vivo, medidor de calidad y copia.
- **30 modelos** de texto, imagen, vídeo, audio, código y agentes, con recomendador por necesidad.
- **8 casos reales en vídeo** (edición de vídeo, contenido, ERP, webs, agentes, producción, finanzas y apps) con filtros por área, flujo de trabajo paso a paso, prompt de arranque copiable y navegación entre casos.
- **Glosario** de 20 conceptos con buscador.
- **30 retos prácticos** con seguimiento de progreso.
- **Tema oscuro/claro** persistente y diseño responsive.
- Navegación en página con indicador deslizante, llegada animada y desplazamiento cancelable, sin paneles flotantes.
- Accesibilidad: navegación por teclado, foco visible, `prefers-reduced-motion`, etiquetas ARIA y enlace de salto.

El progreso y el tema se guardan solo en el navegador. El botón **Reiniciar progreso** del pie permite borrarlos.

## Navegación y animaciones

- Los enlaces del menú, la portada y el pie llevan a la sección real de la página; no abren paneles flotantes.
- El desplazamiento es propio (unos 0,4–0,9 s según la distancia) y deja la sección justo debajo de la barra fija. Si el usuario mueve la rueda, toca la pantalla o pulsa una tecla, la animación se cancela al instante.
- Al llegar, la sección dibuja un haz superior y la regla del título, y su contenido entra escalonado. El indicador azul del menú se desliza hasta el enlace activo y sigue al puntero.
- Todo el movimiento se desactiva con `prefers-reduced-motion: reduce`; en ese caso el salto es inmediato.
- El logo junto a **DominaIA** se mueve siempre, sin necesidad de pasar el ratón: la estrella gira, el halo respira, el anillo orbita y el punto recorre la órbita. Al pasar el puntero o al enfocar con el teclado, el giro se acelera, el halo se ilumina y la marca se inclina hacia el cursor; al hacer clic se emite un pulso. Los tiempos están en `brandSpin`, `brandBreathe`, `brandHalo`, `brandOrbit`, `brandDot` y `brandBurst` de `assets/styles.css`; la inclinación se calcula en `initBrandMotion()` de `assets/app.js`.
- Para ajustar la velocidad, edita `smoothScrollTo()` en `assets/app.js` (duración mínima, máxima y factor por distancia). Los tiempos de la llegada están en `runArrival()` y en las animaciones `navBeam`, `navRule` y `navArrive` de `assets/styles.css`.

## Cómo personalizar el contenido

Todo el contenido vive en arrays al principio de `assets/app.js`:

| Constante | Contenido |
| --- | --- |
| `LEVELS` | Niveles, descripción, horas y módulos de la ruta |
| `PROMPTS` | Título, categoría y texto de cada prompt |
| `MODELS` | Modelos, categoría, descripción, tier y etiquetas |
| `VIDEO_CASES` | Casos en vídeo: título, categoría, resumen, canal, duración, herramientas, pasos y prompt |
| `NEEDS` | Recomendador "¿Qué quieres lograr?" |
| `GLOSSARY` | Términos y definiciones |
| `CHALLENGES` | Lista de los 30 retos |
| `RESOURCES` | Enlaces y descripciones de recursos |
| `MARQUEE` | Nombres de la marquesina |

Los contadores de la portada (`prompts`, `modelos`, `casos`) se calculan automáticamente a partir de esos arrays. Si añades o cambias categorías en `MODELS` o `PROMPTS`, añádelas también en `MODEL_CATS` si quieres que aparezcan como filtro.

## Vídeos y conexión

La sección **05 · IA en acción** reúne ocho casos de YouTube en español. Cada tarjeta abre un modal con el flujo de trabajo, el prompt de arranque, un enlace al original y navegación anterior/siguiente.

- Las miniaturas se cargan de `i.ytimg.com` y los vídeos de `youtube-nocookie.com`; ambas cosas requieren conexión.
- **Abierta como archivo local (`file://`)**, YouTube bloquea el reproductor integrado por falta de referente (error 153). En ese caso el modal muestra una portada con el botón **Reproducir en YouTube**, que abre el vídeo en una pestaña nueva. Es el comportamiento previsto y no rompe la promesa de funcionar sin servidor.
- **Publicada en un servidor (`http://` o `https://`)**, el modal reproduce el vídeo integrado con `youtube-nocookie.com`, sin cargar los ocho reproductores a la vez.
- Para cambiar un caso, edita `VIDEO_CASES` al principio de `assets/app.js`. El campo `youtube` debe ser el ID de 11 caracteres del vídeo. La categoría (`cat`) genera automáticamente un filtro nuevo.
- Los vídeos y sus derechos pertenecen a sus autores; la web solo enlaza y muestra el reproductor oficial.

## Cómo adaptar los colores corporativos

La paleta vive en variables CSS al principio de `assets/styles.css`:

- `:root` define el tema oscuro (fondo azul marino, texto claro y acentos).
- `html[data-theme="light"]` sobrescribe los mismos tokens para el tema claro.
- `--accent` (azul cielo), `--accent-2` (azul corporativo) y `--accent-3` (índigo) controlan enlaces, iconos y detalles.
- `--grad` y `--grad-soft` controlan degradados de texto, botones, barras de progreso y fondos suaves.

Para cambiar la marca, edita esos tokens y, si quieres que el favicon, el logotipo del menú y el anillo de progreso combinen, actualiza también los `stop-color` de los SVG `brandGrad` y `ringGrad` en `index.html`, además de `theme-color`.

## Notas

- Contenido educativo independiente, actualizado a la edición 2026. Las familias de modelos evolucionan rápido: verifica límites y precios en la documentación oficial.
- Las marcas y nombres de productos pertenecen a sus respectivos propietarios.
