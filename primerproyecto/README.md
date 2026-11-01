# NOVA PRESS | Periódico Digital Interactivo con Icono 3D Móvil

Una página web moderna, interactiva y dinámica de noticias con renderizado 3D en tiempo real mediante **Three.js** y **WebGL**.

---

## 🌟 Características Principales

### 1. 🌐 Icono Móvil 3D Interactivo (Three.js)
- **Renderizado 3D por GPU**: Modelado volumétrico con iluminación reactiva, partículas dinámicas y efectos holográficos.
- **Interacción Móvil 360°**:
  - **Arrastre libre**: Haz clic y arrastra con el ratón o desliza con el dedo en dispositivos móviles para rotar en cualquier eje.
  - **Efecto Parallax**: El modelo 3D responde suavemente a la posición del cursor o giroscopio.
  - **Efecto Pulso**: Clic sobre el icono para activar una animación de onda expansiva.
- **3 Modos 3D intercambiables en caliente**:
  1. **HoloGlobo 3D**: Globo terráqueo con meridianos, satélites de información orbitando y anillos de datos.
  2. **Cubo de Noticias 3D**: Prisma tipográfico con la portada y titulares impresos en las caras del cubo.
  3. **Prisma de Cristal 3D**: Cristal translúcido con refracción y núcleo pulsante.
- **Personalización en Vivo**:
  - Cambiador de color de holograma (Cian Neón, Ámbar Solar, Púrpura Cuántico).
  - Control deslizante de velocidad de rotación.
- **Widget Móvil Flotante**: Botón 3D inferior con acceso directo e interactividad táctil en cualquier pantalla.

---

### 2. 📰 Experiencia Periodística e Interactividad
- **Marquesina de Última Hora (Breaking News Ticker)**: Cinta de noticias urgentes con pausa automática al pasar el cursor.
- **Filtro Dinámico por Categorías**: Navegación instantánea entre *Todos, Tecnología, Ciencia, Economía, Innovación, Salud, Cultura & Ocio*.
- **Buscador en Tiempo Real**: Filtrado predictivo al escribir cualquier palabra clave en el titular, resumen o autor.
- **Lector Inmersivo de Noticias (Modal)**:
  - **Síntesis de Voz (Web Speech API)**: Botón *Escuchar Noticia* para reproducción en audio en español, con pausa y reanudación.
  - **Ajuste de Tipografía**: Botones para aumentar (`A+`) o reducir (`A-`) el tamaño de lectura.
  - **Reacciones Interactivas**: Me gusta (❤️) y aplausos (👏) con contadores en tiempo real.
  - **Comentarios en Vivo**: Publica reflexiones y comentarios de inmediato en la noticia.
  - **Compartir**: API de compartir nativa o copiado al portapapeles.
- **Marcadores y Noticias Guardadas (LocalStorage)**:
  - Guarda reportajes para leer más tarde con un solo clic.
  - Cajón interactivo de marcadores para consultar o eliminar noticias guardadas.
- **Modo Oscuro / Modo Claro**: Alternador fluido con persistencia en el navegador.
- **Boletín Digital (Newsletter)**: Formulario interactivo con notificaciones toast flotantes.

---

## 🌐 Cómo Subirlo a Neocities (Sin Errores 404)

El archivo `index.html` ha sido optimizado para ser **100% auto-contenido** (incluye todo el CSS, motor 3D Three.js y scripts de interactividad dentro del mismo archivo).

1. Ingresa a tu cuenta en [neocities.org](https://neocities.org) y ve al panel principal (**Dashboard**).
2. Si tienes un archivo `index.html` viejo o de bienvenida que viene por defecto en Neocities, elimínalo o haz clic en reemplazar.
3. Haz clic en **Upload** (Subir) y selecciona únicamente el archivo `index.html` de esta carpeta.
4. Abre la dirección de tu sitio web: `https://tu-nombre-de-usuario.neocities.org`.
5. Si no ves los cambios al instante, presiona **`Ctrl + F5`** (o `Cmd + Shift + R` en Mac) para forzar la actualización de la caché del navegador.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

Puedes abrir la web directamente de cualquiera de estas formas:

### Opción 1: Abrir directamente en el navegador
Haz doble clic en el archivo `index.html` o ábrelo con Google Chrome, Microsoft Edge, Firefox, Brave o Safari.

### Opción 2: Usar un servidor local ligero
Si dispones de Python o Node.js:

```bash
# Con Python
python -m http.server 8000
# Abre http://localhost:8000 en tu navegador

# O con npx serve
npx serve .
```

---

## 📁 Estructura del Proyecto

```
primerproyecto/
├── index.html          # Estructura semántica, accesibilidad y modales
├── css/
│   └── styles.css      # Tipografía editorial, tema claro/oscuro y animaciones 3D
├── js/
│   ├── data.js         # Base de datos de noticias en español y última hora
│   ├── three-scene.js  # Motor 3D Three.js con interacción orbital y táctil
│   └── app.js          # Lógica interactiva: filtros, voz, comentarios y marcadores
└── README.md           # Documentación del proyecto
```

