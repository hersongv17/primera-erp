/* ═══════════════════════════════════════════════════════
   DOMINA IA — lógica de la aplicación
   Vanilla JS · sin dependencias · progreso en localStorage
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const KEY = 'dominaia.progress.v1';
  const THEME_KEY = 'dominaia.theme';

  /* ──────────────────────────────
     DATOS
     ────────────────────────────── */

  const LEVELS = [
    {
      n: 1, title: 'Fundamentos de la IA', hours: '4 h',
      desc: 'Qué hay realmente dentro de un modelo, por qué se equivoca y qué puedes esperar de él.',
      modules: ['Qué es un modelo', 'Tokens y contexto', 'Entrenamiento e inferencia', 'Abierto vs cerrado', 'Límites y alucinaciones'],
      done: 'Base sólida'
    },
    {
      n: 2, title: 'El arte del prompting', hours: '5 h',
      desc: 'De pedir favores a dar instrucciones profesionales: rol, contexto, formato y evaluación.',
      modules: ['Anatomía del prompt', 'Contexto y ejemplos', 'Razonamiento', 'Salidas en JSON', 'Iterar y evaluar'],
      done: 'Prompts que rinden'
    },
    {
      n: 3, title: 'Modelos y herramientas', hours: '4 h',
      desc: 'El mapa completo: texto, imagen, vídeo, audio y código. Cómo elegir sin caer en modas.',
      modules: ['Familias de modelos', 'Multimodalidad', 'Imagen y vídeo', 'Audio y voz', 'Criterios de elección'],
      done: 'Criterio de elección'
    },
    {
      n: 4, title: 'Datos y RAG', hours: '6 h',
      desc: 'Conecta la IA a tus documentos para que responda con tu información, no con inventos.',
      modules: ['Embeddings', 'Chunking', 'Bases vectoriales', 'RAG vs fine-tuning', 'Evaluación de respuestas'],
      done: 'IA con tus datos'
    },
    {
      n: 5, title: 'Agentes y automatización', hours: '7 h',
      desc: 'Modelos que usan herramientas, planifican y ejecutan. Con guardarraíles y control de costes.',
      modules: ['Tool use', 'Function calling', 'MCP', 'Sistemas multiagente', 'Guardarraíles'],
      done: 'Automatizar de verdad'
    },
    {
      n: 6, title: 'Producto, ética y seguridad', hours: '4 h',
      desc: 'Lo que separa una demo bonita de un producto serio: evals, privacidad, sesgos y regulación.',
      modules: ['Evals', 'Privacidad', 'Sesgos', 'Propiedad intelectual', 'EU AI Act'],
      done: 'Construir con rigor'
    },
    {
      n: 7, title: 'Especialización', hours: '8 h',
      desc: 'Elige un vertical, construye portafolio y mide impacto real. Aquí dejas de ser usuario.',
      modules: ['Tu vertical', 'Portafolio', 'Medir ROI', 'Enseñar', 'Mantenerte al día'],
      done: 'Experto en tu campo'
    }
  ];

  const PROMPTS = [
    {
      title: 'Editor implacable', cat: 'Escritura',
      text: `Actúa como editor senior de [publicación].

Revisa el texto que te pego y devuelve:
1) Los 5 problemas más graves, ordenados por impacto.
2) Una versión reescrita que conserve mi voz.
3) Tres titulares alternativos.

No suavices la crítica: prefiero un texto incómodo y verdadero.

Texto: [pega aquí]`
    },
    {
      title: 'Traductor de jerga', cat: 'Escritura',
      text: `Reescribe este texto para que lo entienda una persona de 15 años sin perder precisión.

Prohíbe jerga, siglas sin explicar y frases de más de 20 palabras.
Después, señala qué matices se han perdido y si alguno era importante.

Texto: [pega aquí]`
    },
    {
      title: 'El email difícil', cat: 'Negocio',
      text: `Escribe un email a [persona o rol] para [objetivo: decir no, pedir plazo, corregir un error].

Contexto: [situación].
Tono: firme pero cordial.
Máximo 150 palabras, una sola petición clara y sin disculpas innecesarias.

Dame 2 versiones: directa y diplomática.`
    },
    {
      title: 'Guion que retiene', cat: 'Creatividad',
      text: `Actúa como guionista de contenido.

Crea un guion de [duración] para [plataforma] sobre [tema].
Estructura: gancho de 3 segundos, promesa, 3 puntos con ejemplos, cierre con llamada a la acción.

Escribe el texto hablado en una columna y lo que se ve en pantalla en otra.
Público: [descríbelo].`
    },
    {
      title: '30 ideas, no 3', cat: 'Creatividad',
      text: `Genera 30 ideas para [problema].

Agrúpalas en 5 estrategias distintas. Marca las 3 más originales y las 3 más fáciles de ejecutar.
Prohíbe ideas genéricas tipo "usar redes sociales".

Para cada idea: una frase y su primer paso concreto.`
    },
    {
      title: 'Naming con criterio', cat: 'Negocio',
      text: `Propón 15 nombres para [negocio], repartidos en 3 territorios creativos distintos.

Para cada uno: disponibilidad probable del dominio .com, qué sugiere y un eslogan.
Evita nombres que suenen a IA genérica.

Después elige los 3 mejores y justifica con criterios, no con gusto personal.`
    },
    {
      title: 'Refactor con tests', cat: 'Código',
      text: `Actúa como ingeniero senior.

Refactoriza este código para [objetivo: legibilidad, rendimiento, testabilidad].
Antes de tocar nada, explica los riesgos.

Devuelve: diagnóstico, código refactorizado, tests que cubren el comportamiento actual y qué podría romperse.

Código: [pega aquí]`
    },
    {
      title: 'Depuración por hipótesis', cat: 'Código',
      text: `Tengo este error: [mensaje].
Entorno: [lenguaje y versión].

No adivines. Haz una lista de 5 hipótesis ordenadas por probabilidad.
Para cada una: cómo comprobarla con un comando o un test.
Espera mi resultado antes de proponer la solución.

Código relevante: [pega aquí]`
    },
    {
      title: 'Auditoría de seguridad', cat: 'Código',
      text: `Revisa este código como si fueras un auditor de seguridad.

Lista vulnerabilidades por severidad (crítico, alto, medio, bajo), explica el vector de ataque y muestra el parche mínimo para cada una.
Si no hay evidencias de un problema, dilo en lugar de inventarlo.

Código: [pega aquí]`
    },
    {
      title: 'Texto a JSON estricto', cat: 'Análisis',
      text: `Extrae la información de este texto y devuélvela ÚNICAMENTE como JSON válido que cumpla este esquema:

[esquema]

Si un campo no aparece, usa null. No inventes datos.
Al final, fuera del JSON, indica qué campos quedaron vacíos y por qué.

Texto: [pega aquí]`
    },
    {
      title: 'Analista de datos', cat: 'Análisis',
      text: `Actúa como analista de datos.

Con estos datos: [pega CSV o describe], identifica:
- 3 patrones
- 2 anomalías
- 1 hipótesis comprobable y la métrica que la validaría

Separa hechos de interpretaciones y dime qué dato falta para decidir mejor.`
    },
    {
      title: 'Investigación con fuentes', cat: 'Análisis',
      text: `Investiga [tema] y responde con este formato:

- Resumen en 5 bullets.
- 3 hallazgos con fuente y fecha.
- 2 desacuerdos entre expertos.
- 1 pregunta que sigue abierta.

Cita solo fuentes que puedas verificar y marca claramente lo que sea inferencia tuya.`
    },
    {
      title: 'Decisión difícil', cat: 'Negocio',
      text: `Ayúdame a decidir entre [A] y [B].

Contexto: [restricciones, plazo, recursos].
Haz una tabla con criterios ponderados y calcula la puntuación.

Después escribe el mejor argumento en contra de la opción ganadora y recomienda un siguiente paso reversible.`
    },
    {
      title: 'Resumen ejecutivo', cat: 'Negocio',
      text: `Resume este documento para un director que tiene 60 segundos.

Formato:
1. Una frase de conclusión.
2. Tres hallazgos.
3. Un riesgo.
4. La decisión que debe tomar.
5. El coste de no hacer nada.

Sin adjetivos: solo datos y consecuencias.

Documento: [pega aquí]`
    },
    {
      title: 'Plan de 7 días', cat: 'Negocio',
      text: `Convierte este objetivo en un plan de 7 días: [objetivo].

Para cada día: una tarea de máximo 90 minutos, el resultado tangible y cómo saber que está hecho.

Asume que tengo [horas al día] y [recursos].
Señala la tarea con más impacto y la que puedo eliminar sin consecuencias.`
    },
    {
      title: 'Tutor socrático', cat: 'Estudio',
      text: `Actúa como tutor socrático de [materia].

No me des la respuesta: hazme preguntas, detecta el error en mi razonamiento y dame una pista cada vez.

Cuando lo entienda, propón un ejercicio un poco más difícil y explica por qué funciona.

Tema: [tema].`
    },
    {
      title: 'Simulador de entrevista', cat: 'Estudio',
      text: `Simula una entrevista para [puesto] en [empresa].

Haz una pregunta cada vez y espera mi respuesta.
Evalúala en claridad, estructura y evidencia.

Al terminar, dime las 5 preguntas que peor respondí y cómo mejorarlas.
Nivel: [junior / senior].`
    },
    {
      title: 'Plan de 30 días', cat: 'Estudio',
      text: `Diseña un plan de 30 días para aprender [habilidad] desde cero, 45 minutos al día.

Incluye 4 proyectos que produzcan evidencia real, 3 formas de autoevaluarme y las 5 trampas típicas de quien empieza.

Sé específico con recursos gratuitos y no supongas que tengo conocimientos previos.`
    },
    {
      title: 'Prompt de sistema', cat: 'Agentes',
      text: `Eres [rol] para [producto].

Objetivo: [objetivo].

Reglas:
1) [regla]
2) [regla]
3) Si falta información, pregunta antes de responder.

Tono: [tono]. Formato: [formato].

Nunca inventes datos: si no lo sabes, dilo y propón cómo averiguarlo.
Casos límite: [lista].`
    },
    {
      title: 'Agente investigador', cat: 'Agentes',
      text: `Actúa como agente de investigación.

Planifica:
1) Descompón [objetivo] en 5 subtareas.
2) Indica qué herramienta usarías en cada una.
3) Ejecuta solo la primera y muéstrame el resultado antes de continuar.

Presupuesto: [tokens o tiempo].
Detente y pregúntame si tu confianza es baja.`
    },
    {
      title: 'Reunión a acta útil', cat: 'Negocio',
      text: `Convierte esta transcripción en un acta útil:

- Decisiones tomadas.
- Responsables con fecha.
- Temas sin resolver.
- Riesgos detectados.

No resumas la conversación: extrae compromisos verificables.

Transcripción: [pega aquí]`
    },
    {
      title: 'Crítica adversarial', cat: 'Análisis',
      text: `Ataca esta idea como si fueras tu competidor mejor financiado.

Enumera 5 formas de hundirla, cuál es la más probable y qué haría para defenderme.
Después, di qué parte de la idea sigue en pie y por qué.

Idea: [describe]`
    }
  ];

  const MODELS = [
    { name: 'ChatGPT', maker: 'OpenAI', abbr: 'GP', cat: 'Texto', tier: 'Freemium', desc: 'Asistente generalista con el ecosistema más amplio: voz, imagen, datos y agentes.', best: 'Empezar y cubrir el 80% de tareas', tags: ['Multimodal', 'Agentes', 'Voz'] },
    { name: 'Claude', maker: 'Anthropic', abbr: 'CL', cat: 'Texto', tier: 'Freemium', desc: 'Razonamiento pausado, escritura cuidada y muy buen uso de herramientas.', best: 'Documentos largos y código', tags: ['Contexto largo', 'Código', 'Agentes'] },
    { name: 'Gemini', maker: 'Google', abbr: 'GE', cat: 'Texto', tier: 'Freemium', desc: 'Integración profunda con Google Workspace y una ventana de contexto enorme.', best: 'Vídeo, audio y trabajo en Drive', tags: ['Multimodal', 'Workspace'] },
    { name: 'Grok', maker: 'xAI', abbr: 'GR', cat: 'Texto', tier: 'Freemium', desc: 'Respuestas con acceso a información reciente y un tono poco corporativo.', best: 'Actualidad y conversación directa', tags: ['Tiempo real', 'X'] },
    { name: 'DeepSeek', maker: 'DeepSeek', abbr: 'DS', cat: 'Texto', tier: 'Freemium', desc: 'Relación calidad/precio muy agresiva, sobre todo en razonamiento y código.', best: 'Presupuesto ajustado', tags: ['Abierto', 'Código', 'Razonamiento'] },
    { name: 'Qwen', maker: 'Alibaba', abbr: 'QW', cat: 'Texto', tier: 'Gratis', desc: 'Familia abierta, multilingüe y con variantes para casi cualquier tarea.', best: 'Autoalojar y experimentar', tags: ['Abierto', 'Multilingüe'] },
    { name: 'Llama', maker: 'Meta', abbr: 'LL', cat: 'Texto', tier: 'Gratis', desc: 'El estándar de facto para modelos abiertos y experimentación local.', best: 'Privacidad y ejecución local', tags: ['Abierto', 'Local'] },
    { name: 'Mistral', maker: 'Mistral AI', abbr: 'MI', cat: 'Texto', tier: 'Freemium', desc: 'Modelos europeos eficientes, con foco en empresas y soberanía de datos.', best: 'Empresas europeas', tags: ['Europa', 'Abierto'] },
    { name: 'Kimi', maker: 'Moonshot', abbr: 'KI', cat: 'Texto', tier: 'Gratis', desc: 'Contexto muy largo: devora informes y libros sin perder el hilo.', best: 'Leer documentos gigantes', tags: ['Contexto largo', 'PDF'] },
    { name: 'Copilot', maker: 'Microsoft', abbr: 'MS', cat: 'Texto', tier: 'Freemium', desc: 'La IA metida dentro de Office, Windows y el navegador.', best: 'Trabajo diario en Microsoft 365', tags: ['Office', 'Windows'] },

    { name: 'Midjourney', maker: 'Midjourney', abbr: 'MJ', cat: 'Imagen', tier: 'Pago', desc: 'La referencia en calidad estética y dirección de estilo.', best: 'Arte, moda y conceptualización', tags: ['Estética', 'Estilo'] },
    { name: 'GPT Image', maker: 'OpenAI', abbr: 'GI', cat: 'Imagen', tier: 'Freemium', desc: 'Edición conversacional y texto legible dentro de la imagen.', best: 'Iterar hablando y carteles', tags: ['Edición', 'Texto'] },
    { name: 'Flux', maker: 'Black Forest Labs', abbr: 'FL', cat: 'Imagen', tier: 'Freemium', desc: 'Realismo y control fino, también con versiones abiertas.', best: 'Fotorrealismo y control', tags: ['Abierto', 'Realismo'] },
    { name: 'Stable Diffusion', maker: 'Stability AI', abbr: 'SD', cat: 'Imagen', tier: 'Gratis', desc: 'El ecosistema abierto: LoRAs, ControlNet y flujos con ComfyUI.', best: 'Flujos personalizados', tags: ['Abierto', 'ComfyUI'] },
    { name: 'Ideogram', maker: 'Ideogram', abbr: 'ID', cat: 'Imagen', tier: 'Freemium', desc: 'Tipografía y texto dentro de la imagen sin errores evidentes.', best: 'Logos, carteles y tipografía', tags: ['Tipografía', 'Diseño'] },

    { name: 'Sora', maker: 'OpenAI', abbr: 'SO', cat: 'Vídeo', tier: 'Pago', desc: 'Clips cinematográficos a partir de texto o imágenes.', best: 'Escenas conceptuales', tags: ['Texto a vídeo', 'Cine'] },
    { name: 'Veo', maker: 'Google', abbr: 'VE', cat: 'Vídeo', tier: 'Pago', desc: 'Vídeo con audio y control de cámara para piezas cortas.', best: 'Anuncios y redes sociales', tags: ['Audio', 'Cámara'] },
    { name: 'Runway', maker: 'Runway', abbr: 'RW', cat: 'Vídeo', tier: 'Freemium', desc: 'Suite de edición, efectos y generación para producción real.', best: 'Edición profesional', tags: ['Edición', 'Efectos'] },
    { name: 'Kling', maker: 'Kling', abbr: 'KL', cat: 'Vídeo', tier: 'Freemium', desc: 'Movimiento realista y control de imagen a vídeo.', best: 'Movimiento y personajes', tags: ['Imagen a vídeo', 'Realismo'] },

    { name: 'ElevenLabs', maker: 'ElevenLabs', abbr: 'EL', cat: 'Audio', tier: 'Freemium', desc: 'Voces realistas, clonación y doblaje multilingüe.', best: 'Locución y doblaje', tags: ['Voz', 'Doblaje'] },
    { name: 'Suno', maker: 'Suno', abbr: 'SU', cat: 'Audio', tier: 'Freemium', desc: 'Canciones completas con voz, letra y producción.', best: 'Música original rápida', tags: ['Música', 'Voz'] },
    { name: 'Whisper', maker: 'OpenAI', abbr: 'WH', cat: 'Audio', tier: 'Gratis', desc: 'Transcripción precisa y ejecutable en tu propio equipo.', best: 'Subtítulos y actas', tags: ['Transcripción', 'Abierto'] },

    { name: 'GitHub Copilot', maker: 'GitHub', abbr: 'GH', cat: 'Código', tier: 'Freemium', desc: 'Autocompletado y agentes integrados directamente en tu editor.', best: 'Programar dentro del IDE', tags: ['IDE', 'Autocompletado'] },
    { name: 'Claude Code', maker: 'Anthropic', abbr: 'CC', cat: 'Código', tier: 'Pago', desc: 'Agente de terminal que entiende repositorios completos.', best: 'Refactors y tareas largas', tags: ['Terminal', 'Agente'] },
    { name: 'Cursor', maker: 'Cursor', abbr: 'CU', cat: 'Código', tier: 'Freemium', desc: 'Editor AI-first con contexto de todo el proyecto.', best: 'Desarrollo diario con IA', tags: ['IDE', 'Contexto'] },

    { name: 'Perplexity', maker: 'Perplexity', abbr: 'PX', cat: 'Agentes', tier: 'Freemium', desc: 'Búsqueda conversacional con fuentes citadas.', best: 'Investigar con referencias', tags: ['Búsqueda', 'Fuentes'] },
    { name: 'NotebookLM', maker: 'Google', abbr: 'NL', cat: 'Agentes', tier: 'Gratis', desc: 'Cuaderno que responde solo con tus documentos y cita la página.', best: 'Estudiar tus apuntes', tags: ['Documentos', 'Estudio'] },
    { name: 'Manus', maker: 'Manus', abbr: 'MA', cat: 'Agentes', tier: 'Pago', desc: 'Agente generalista que planifica y ejecuta tareas largas.', best: 'Delegar trabajo completo', tags: ['Agente', 'Autonomía'] },
    { name: 'n8n', maker: 'n8n', abbr: 'N8', cat: 'Agentes', tier: 'Freemium', desc: 'Automatizaciones visuales con nodos de IA y cientos de integraciones.', best: 'Conectar apps y datos', tags: ['No-code', 'Integraciones'] },
    { name: 'Ollama', maker: 'Ollama', abbr: 'OL', cat: 'Agentes', tier: 'Gratis', desc: 'Ejecuta modelos abiertos en tu ordenador con un comando.', best: 'IA local y privada', tags: ['Local', 'Privacidad'] }
  ];

  const MODEL_CATS = ['Todos', 'Texto', 'Imagen', 'Vídeo', 'Audio', 'Código', 'Agentes'];

  const NEEDS = [
    { icon: 'pen', label: 'Escribir mejor', cat: 'Texto', advice: 'Busca un modelo con buena escritura y contexto largo. Prueba el mismo texto en dos y compara: la diferencia se nota en la primera frase.', picks: ['Claude', 'ChatGPT', 'Gemini'] },
    { icon: 'code', label: 'Programar', cat: 'Código', advice: 'Más que el modelo, importa el contexto del repositorio. Empieza con un copiloto en tu editor y sube a un agente de terminal para tareas largas.', picks: ['Cursor', 'Claude Code', 'GitHub Copilot'] },
    { icon: 'image', label: 'Crear imágenes', cat: 'Imagen', advice: 'Define primero el estilo. Para explorar, un modelo artístico; para integrar en un flujo con control, uno abierto con ComfyUI.', picks: ['Midjourney', 'GPT Image', 'Flux'] },
    { icon: 'video', label: 'Editar vídeo', cat: 'Vídeo', advice: 'Genera planos cortos y monta después. Ningún modelo sostiene una narrativa larga: el guion sigue siendo tuyo.', picks: ['Runway', 'Veo', 'Sora'] },
    { icon: 'audio', label: 'Voz y música', cat: 'Audio', advice: 'Para locución, clona tu voz solo con permiso y revisa los términos. Para música, la letra y la estructura marcan más diferencia que el modelo.', picks: ['ElevenLabs', 'Suno', 'Whisper'] },
    { icon: 'search', label: 'Investigar', cat: 'Agentes', advice: 'Exige fuentes citadas y compruébalas. Un resumen sin referencia es una hipótesis, no un dato.', picks: ['Perplexity', 'NotebookLM', 'Gemini'] },
    { icon: 'automation', label: 'Automatizar', cat: 'Agentes', advice: 'Empieza por una tarea repetitiva y medible. Si no puedes describirla en 5 pasos, todavía no está lista para automatizar.', picks: ['n8n', 'Manus', 'ChatGPT'] },
    { icon: 'book', label: 'Estudiar', cat: 'Texto', advice: 'Sube tus propios apuntes y pide preguntas, no respuestas. El aprendizaje ocurre cuando intentas explicarlo.', picks: ['NotebookLM', 'Claude', 'Gemini'] }
  ];

  const GLOSSARY = [
    { term: 'Modelo', body: 'Un programa que ha aprendido patrones a partir de datos y produce respuestas <strong>probables</strong>, no verdades. Un modelo de lenguaje no "sabe" cosas: calcula qué palabra encaja mejor con el contexto.' },
    { term: 'Parámetro', body: 'Los números internos que se ajustan durante el entrenamiento. Cuando oyes "70B", significa 70.000 millones de parámetros. Más parámetros suele implicar más capacidad, pero también más coste y latencia.' },
    { term: 'Token', body: 'La unidad mínima en la que se parte el texto. En inglés un token ronda 4 caracteres; en español, 3. Los precios y los límites se miden en tokens, no en palabras.' },
    { term: 'Ventana de contexto', body: 'Cuánto texto puede tener "delante" el modelo en una conversación. Si tu documento no cabe, habrá que resumirlo, trocearlo o usar RAG. Contexto grande no significa que el modelo atienda todo igual de bien.' },
    { term: 'Prompt', body: 'La instrucción que le das al modelo. Un prompt profesional define rol, objetivo, contexto, formato y restricciones. La calidad de la respuesta está limitada por la calidad del encargo.' },
    { term: 'Prompt del sistema', body: 'La instrucción de fondo que define el comportamiento del asistente: personalidad, reglas y límites. El usuario normalmente no la ve, pero condiciona todas sus respuestas.' },
    { term: 'Temperatura', body: 'Un ajuste que controla la aleatoriedad. Baja (0–0.3) para respuestas consistentes y extracción de datos; alta (0.7–1) para creatividad. No arregla un prompt mal escrito.' },
    { term: 'Inferencia', body: 'El momento en que el modelo genera una respuesta. Entrenar es caro y ocurre una vez; inferir es barato por unidad, pero se multiplica con cada usuario. Ahí está la mayor parte del coste real.' },
    { term: 'Embedding', body: 'Una representación numérica del significado de un texto. Textos con significado parecido quedan cerca en un espacio vectorial. Es la base de la búsqueda semántica y de RAG.' },
    { term: 'RAG', body: 'Retrieval-Augmented Generation: antes de responder, el sistema busca fragmentos relevantes en tus documentos y se los pasa al modelo. Reduce alucinaciones y permite citar fuentes. Si la búsqueda falla, la respuesta falla.' },
    { term: 'Fine-tuning', body: 'Reentrenar un modelo con ejemplos propios para especializarlo en un estilo o tarea. Útil para formato y tono; no es la forma más eficiente de añadir conocimiento factual. Para eso, RAG.' },
    { term: 'Alucinación', body: 'Cuando el modelo inventa un dato, una cita o una función con total seguridad. No miente: completa lo que estadísticamente encaja. Se combate con fuentes, verificación y evals, no solo pidiendo "no inventes".' },
    { term: 'Multimodal', body: 'Un modelo que procesa o genera más de un tipo de contenido: texto, imagen, audio o vídeo. No porque pueda ver significa que lea bien un gráfico complejo: pruébalo con tus casos.' },
    { term: 'Agente', body: 'Un modelo al que le das un objetivo, herramientas y un bucle para actuar: planifica, ejecuta, observa el resultado y corrige. La autonomía es una escala, no un interruptor. Más autonomía exige más guardarraíles.' },
    { term: 'Function calling', body: 'La capacidad del modelo de pedir que se ejecute una función externa con argumentos estructurados: buscar en una base de datos, enviar un correo, consultar una API. El modelo no ejecuta nada: propone la llamada y tu sistema decide.' },
    { term: 'MCP', body: 'Model Context Protocol: un estándar abierto para conectar modelos con herramientas y fuentes de datos sin reinventar la integración en cada cliente. Piensa en "USB-C para herramientas de IA".' },
    { term: 'Evals', body: 'Conjunto de pruebas repetibles para medir si tu sistema mejora o empeora. Sin evals, cada cambio de prompt es una opinión. Empieza con 20 casos reales y criterios claros.' },
    { term: 'Cuantización', body: 'Reducir la precisión numérica de los pesos de un modelo para que ocupe menos memoria y corra más rápido, a cambio de algo de calidad. Es lo que permite ejecutar modelos abiertos en un portátil.' },
    { term: 'MoE', body: 'Mixture of Experts: una arquitectura donde solo se activan partes del modelo para cada token. Permite modelos enormes con un coste de inferencia menor. "Total de parámetros" y "parámetros activos" no son lo mismo.' },
    { term: 'Guardarraíles', body: 'Filtros, reglas y verificaciones que limitan lo que un sistema de IA puede hacer: validar salidas, exigir confirmación humana, restringir herramientas y registrar acciones. Se diseñan antes del incidente, no después.' }
  ];

  const CHALLENGES = [
    'Pide a una IA que se describa y detecta 3 imprecisiones.',
    'Reescribe un email tuyo con 3 prompts distintos y compara.',
    'Genera la misma imagen con 3 estilos diferentes.',
    'Haz que una IA resuma un PDF real de más de 20 páginas.',
    'Construye un prompt con rol, contexto, formato y límites.',
    'Pide JSON estricto y valida que se pueda parsear.',
    'Haz la misma pregunta difícil a dos modelos y compara.',
    'Pide un concepto complejo explicado con una analogía cotidiana.',
    'Transcribe un audio de 2 minutos y corrige los errores.',
    'Automatiza una tarea repetitiva con una herramienta no-code.',
    'Crea un tutor que solo haga preguntas, nunca dé la respuesta.',
    'Pide feedback brutal de tu CV y aplica 3 cambios.',
    'Genera 10 titulares y elige uno con criterios explícitos.',
    'Provoca una alucinación y demuestra por qué lo es.',
    'Diseña un mini-RAG pegando tus apuntes en el contexto.',
    'Escribe el prompt de sistema de un asistente propio.',
    'Ejecuta un modelo local con Ollama y mide su velocidad.',
    'Genera tests para una función que ya tengas escrita.',
    'Compara 3 herramientas con criterios que definas tú.',
    'Pide a una IA que critique su propia respuesta anterior.',
    'Esboza un agente con dos herramientas y sus límites.',
    'Calcula el coste aproximado de tu uso semanal de IA.',
    'Prueba la misma tarea en versión gratuita y de pago.',
    'Escribe un guion de 60 segundos y grábalo.',
    'Adapta un mismo texto para 3 públicos distintos.',
    'Analiza un dataset pequeño y cuestiona sus conclusiones.',
    'Define qué información nunca pegarías en un chat de IA.',
    'Escribe tu política personal de uso de IA en 10 líneas.',
    'Enseña a alguien en 5 minutos lo que has aprendido.',
    'Revisa tu progreso y elige tu especialidad.'
  ];

  const RESOURCES = [
    { title: 'Documentación de OpenAI', level: 'Oficial', desc: 'Referencia de API, guías de modelos y prompting aplicado.', source: 'platform.openai.com/docs', url: 'https://platform.openai.com/docs' },
    { title: 'Anthropic Docs', level: 'Oficial', desc: 'Guías de Claude, uso de herramientas y buenas prácticas de prompt.', source: 'docs.anthropic.com', url: 'https://docs.anthropic.com' },
    { title: 'Google AI for Developers', level: 'Oficial', desc: 'Gemini, Vertex AI y ejemplos de código listos para ejecutar.', source: 'ai.google.dev', url: 'https://ai.google.dev' },
    { title: 'Hugging Face Learn', level: 'Curso', desc: 'Cursos gratuitos de LLMs, agentes, difusión y puesta en producción.', source: 'huggingface.co/learn', url: 'https://huggingface.co/learn' },
    { title: 'Prompt Engineering Guide', level: 'Referencia', desc: 'Catálogo de técnicas de prompting con ejemplos y comparativas.', source: 'promptingguide.ai', url: 'https://www.promptingguide.ai' },
    { title: 'Model Context Protocol', level: 'Referencia', desc: 'El estándar para conectar modelos con herramientas y datos.', source: 'modelcontextprotocol.io', url: 'https://modelcontextprotocol.io' },
    { title: 'DeepLearning.AI', level: 'Curso', desc: 'Cursos cortos con socios del sector; muchos son gratuitos.', source: 'deeplearning.ai', url: 'https://www.deeplearning.ai' },
    { title: 'Kaggle Learn', level: 'Curso', desc: 'Fundamentos de machine learning con notebooks y datos reales.', source: 'kaggle.com/learn', url: 'https://www.kaggle.com/learn' },
    { title: 'Ollama', level: 'Herramienta', desc: 'Ejecuta Llama, Qwen, DeepSeek y otros modelos en local.', source: 'ollama.com', url: 'https://ollama.com' },
    { title: 'n8n Docs', level: 'Herramienta', desc: 'Automatizaciones con nodos, integraciones y agentes de IA.', source: 'docs.n8n.io', url: 'https://docs.n8n.io' },
    { title: 'arXiv cs.AI', level: 'Fuente primaria', desc: 'Preprints: lo último sin filtro editorial. Úsalos con criterio.', source: 'arxiv.org/list/cs.AI/recent', url: 'https://arxiv.org/list/cs.AI/recent' },
    { title: 'EU AI Act', level: 'Regulación', desc: 'Texto y guías del reglamento europeo de inteligencia artificial.', source: 'artificialintelligenceact.eu', url: 'https://artificialintelligenceact.eu' }
  ];

  const MARQUEE = ['ChatGPT', 'Claude', 'Gemini', 'Llama', 'DeepSeek', 'Qwen', 'Mistral', 'Flux', 'Midjourney', 'Sora', 'Veo', 'Runway', 'ElevenLabs', 'Suno', 'Copilot', 'Cursor', 'Perplexity', 'Ollama'];

  const VIDEO_CASES = [
    {
      youtube: 'W3mt46rEmuM',
      cat: 'Vídeo',
      title: 'Edita vídeo con IA sin perder el criterio',
      teaser: 'Convierte horas de material bruto en un montaje claro: cortes, subtítulos, voz y ritmo. La IA acelera; tú decides qué historia se cuenta.',
      detail: 'El flujo no es «genera un vídeo y ya». Es guion, material, montaje, subtítulos y sonido. La IA se lleva el trabajo repetitivo y tú proteges el ritmo, el mensaje y la voz de la marca.',
      channel: 'Pol Corominas',
      duration: '10:55',
      tools: ['InVideo AI', 'Runway', 'Descript'],
      steps: [
        'Escribe el objetivo: plataforma, duración y mensaje.',
        'Organiza el material y pide un primer corte con subtítulos.',
        'Revisa ritmo, cortes, voz y música; elimina lo que no aporta.',
        'Exporta, publica y mide retención para el siguiente corte.'
      ],
      prompt: `Actúa como editor de vídeo senior. Tengo [tipo de material] sobre [tema] para [plataforma] y busco un vídeo de [duración] con tono [tono].

Entrégame:
1) Un guion de montaje con gancho, desarrollo y cierre.
2) Los 8 cortes imprescindibles y qué debo eliminar.
3) Subtítulos con correcciones de estilo.
4) Una lista de música y recursos de sonido.

Antes de responder, pregúntame lo que falte para no inventar el contexto.`
    },
    {
      youtube: 'ShjzOwlqL3M',
      cat: 'Contenido',
      title: 'Un sistema de contenido, no posts sueltos',
      teaser: 'De una idea a un calendario sostenible: ángulos, ganchos, guiones y adaptaciones. Publica con criterio, no por inercia.',
      detail: 'Un calendario sostenible nace de una promesa clara y diez ángulos que se pueden repetir. La IA acelera la ideación, el guion y la adaptación a cada formato; la edición humana protege la voz.',
      channel: 'Silvia Triana',
      duration: '28:11',
      tools: ['ChatGPT', 'Claude', 'Canva'],
      steps: [
        'Define audiencia, promesa y una métrica de éxito.',
        'Genera diez ángulos y elige tres con criterio editorial.',
        'Escribe gancho, guion y llamada a la acción para cada uno.',
        'Publica, escucha respuestas y recicla lo que funcione.'
      ],
      prompt: `Actúa como estratega de contenido para [marca o persona] que ayuda a [público] a [resultado].

Mi promesa es [promesa] y el canal principal es [canal].

Dame 10 ángulos originales, elige 3 y desarrolla para cada uno:
- Gancho de 3 segundos.
- Guion de 60 segundos.
- Llamada a la acción.
- Versión corta para LinkedIn.

Evita fórmulas genéricas y no inventes datos ni resultados.`
    },
    {
      youtube: 'UaGM7h00gcE',
      cat: 'ERP',
      title: 'Un ERP a medida con Cursor + Claude',
      teaser: 'Modela datos, roles y módulos de un ERP real. Empieza por un flujo que te duela y amplía sin romper lo anterior.',
      detail: 'Un ERP se construye por flujos, no por pantallas. Empieza por compras, ventas o inventario; define entidades, permisos y estados; después pide un módulo pequeño con criterios de aceptación y amplía sobre datos reales.',
      channel: 'Josma',
      duration: '18:46',
      tools: ['Cursor', 'Claude', 'PostgreSQL'],
      steps: [
        'Elige un flujo que duela: compras, ventas o inventario.',
        'Modela entidades, roles, estados y reglas de negocio.',
        'Pide un módulo pequeño con criterios de aceptación.',
        'Prueba con datos reales y amplía sin romper lo anterior.'
      ],
      prompt: `Actúa como arquitecto de software especializado en ERPs. Quiero construir un módulo de [compras/ventas/inventario/producción] para una empresa de [sector] con [tamaño].

Define:
1) Entidades, relaciones y estados.
2) Roles y permisos.
3) Flujos principales y casos borde.
4) Un MVP en 5 historias de usuario con criterios de aceptación.

Propón el stack y qué partes conviene generar con IA y cuáles revisar a mano.`
    },
    {
      youtube: '8a5zfyv1O1U',
      cat: 'Web',
      title: 'De la idea a la web publicada',
      teaser: 'Estructura, copy, maquetación y despliegue. Una web profesional lista para enseñar, captar clientes y medir.',
      detail: 'Una web profesional no es solo bonita: tiene una promesa, una estructura, copy que convierte y una publicación cuidada. La IA puede escribir, maquetar y desplegar; tú validas el negocio y pruebas cada formulario.',
      channel: 'Estoy Programando',
      duration: '17:44',
      tools: ['v0', 'Cursor', 'Vercel'],
      steps: [
        'Define a quién sirve y qué acción debe tomar.',
        'Escribe la estructura y el copy antes de tocar diseño.',
        'Genera la maqueta y el código; revisa responsive y SEO.',
        'Publica con dominio, analítica y un formulario probado.'
      ],
      prompt: `Actúa como diseñador web y copywriter senior. Necesito una web para [negocio] que consiga [objetivo] de [público].

Propón:
1) Arquitectura de una página con secciones y jerarquía.
2) Copy completo: titular, subtítulo, beneficios, prueba social y llamada a la acción.
3) Dirección visual y componentes responsive.
4) Checklist de publicación: dominio, SEO técnico, analítica y formularios.

No uses relleno ni promesas que no pueda demostrar.`
    },
    {
      youtube: 'AJfd-eVf5eU',
      cat: 'Agentes',
      title: 'Tu primer agente que trabaja solo',
      teaser: 'Conecta un disparador, herramientas y memoria. Un agente útil hace una tarea concreta y pide permiso cuando debe.',
      detail: 'Un agente útil tiene un disparador, herramientas, memoria y límites. Empieza con una tarea repetitiva y medible; añade supervisión humana antes de darle acceso a dinero, clientes o sistemas críticos.',
      channel: 'Metics Media',
      duration: '27:45',
      tools: ['n8n', 'OpenAI', 'Google Sheets'],
      steps: [
        'Elige una tarea repetitiva y medible.',
        'Diseña disparador, herramientas, memoria y salida.',
        'Pon límites: permisos, coste, errores y escalado humano.',
        'Prueba con casos reales y mide ahorro y calidad.'
      ],
      prompt: `Actúa como diseñador de agentes de IA. Quiero automatizar [tarea repetitiva] que hoy consume [tiempo] y usa [herramientas/datos].

Diseña:
1) Disparador y frecuencia.
2) Pasos, herramientas y formato de salida.
3) Memoria y contexto necesarios.
4) Permisos, límites de coste y puntos de revisión humana.
5) Cinco casos de prueba, incluidos errores y datos incompletos.

No permitas que el agente invente datos ni ejecute acciones irreversibles sin confirmación.`
    },
    {
      youtube: '4hVKrEVMJs4',
      cat: 'Producción',
      title: 'Planifica la producción con un agente',
      teaser: 'Cruza demanda, capacidad, inventario y plazos. Obtén un plan ejecutable con cuellos de botella y alertas.',
      detail: 'El plan de producción cruza demanda, capacidad, inventario y plazos. La IA puede generar escenarios y detectar cuellos de botella; el planner valida supuestos, negocia prioridades y decide.',
      channel: 'OBI',
      duration: '9:43',
      tools: ['Odoo', 'Excel', 'Agente IA'],
      steps: [
        'Reúne demanda, capacidad, inventario y plazos.',
        'Pide un plan con supuestos explícitos y cuellos de botella.',
        'Simula retrasos y compara escenarios.',
        'Convierte el plan en órdenes y revisa cada turno.'
      ],
      prompt: `Actúa como planificador de producción. Tengo esta demanda [datos], esta capacidad [datos], este inventario [datos] y estas restricciones [plazos/turnos/proveedores].

Genera un plan de producción para [horizonte] con:
1) Supuestos explícitos.
2) Cuellos de botella y riesgo de retraso.
3) Escenario base y alternativa.
4) Tabla de órdenes priorizadas y alertas.

Marca qué datos faltan y no inventes cifras.`
    },
    {
      youtube: 'y8Hmt96ZbXs',
      cat: 'Finanzas',
      title: 'Un modelo financiero que se actualiza solo',
      teaser: 'Supuestos, escenarios y alertas conectados. La IA acelera el análisis; las decisiones siguen siendo tuyas.',
      detail: 'Un modelo financiero es un conjunto de supuestos conectados. La IA ayuda a construirlo, documentarlo y actualizarlo; tú firmas las decisiones y contrastas cada cifra antes de usarla.',
      channel: 'The Bankruptcy',
      duration: '16:13',
      tools: ['Excel', 'Claude Code', 'Power BI'],
      steps: [
        'Ordena históricos, costes y supuestos en una hoja.',
        'Pide el modelo con fórmulas auditables, no solo números.',
        'Genera escenarios base, optimista y conservador.',
        'Revisa desviaciones y actualiza el cuadro de mando.'
      ],
      prompt: `Actúa como analista financiero senior. Con estos históricos [datos], costes [datos] y supuestos [datos], construye un modelo para [decisión].

Incluye:
1) Estructura de pestañas y fórmulas auditables.
2) Escenarios base, optimista y conservador.
3) Cuadro de mando con seis métricas.
4) Riesgos, sensibilidades y supuestos que debo validar.

No inventes cifras: si falta un dato, dilo.`
    },
    {
      youtube: '6eX3f_z3fH8',
      cat: 'Apps',
      title: 'Crea la app que tienes en la cabeza',
      teaser: 'Pasa de la idea a un MVP funcional sin escribir todo el código. Define el problema, recorta y publica.',
      detail: 'Cualquier idea puede convertirse en un MVP si recortas el alcance. Define el problema, el usuario y las tres pantallas imprescindibles; después publica algo que se pueda probar y aprende de la primera semana.',
      channel: 'Migue Baena IA',
      duration: '18:06',
      tools: ['Google Antigravity', 'Gemini', 'Supabase'],
      steps: [
        'Define problema, usuario y resultado mínimo.',
        'Recorta el MVP a tres pantallas y un flujo.',
        'Genera la app, revisa datos y estados vacíos.',
        'Publica, comparte y aprende de la primera semana.'
      ],
      prompt: `Actúa como product builder. Quiero crear [idea] para [usuario] y resolver [problema].

Define:
1) Propuesta de valor en una frase.
2) MVP con tres pantallas y un flujo principal.
3) Modelo de datos mínimo y estados vacíos.
4) Plan de siete días para construir y publicar con IA.
5) Cómo medir si merece la pena seguir.

Recorta todo lo que no sea imprescindible.`
    }
  ];


  const ICON = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>'
  };

  const NEED_ICONS = {
    pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4z"/></svg>',
    audio: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>',
    automation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  };

  const needIcon = (key) => NEED_ICONS[key] || '';

  /* ──────────────────────────────
     ESTADO Y PERSISTENCIA
     ────────────────────────────── */

  let state = { levels: new Set(), challenges: new Set() };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (Array.isArray(raw.levels)) raw.levels.forEach(n => state.levels.add(Number(n)));
    if (Array.isArray(raw.challenges)) raw.challenges.forEach(n => state.challenges.add(Number(n)));
  } catch (e) { /* almacenamiento no disponible: seguimos en memoria */ }

  function saveProgress() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        levels: [...state.levels],
        challenges: [...state.challenges]
      }));
    } catch (e) { /* modo privado o file:// restringido */ }
  }

  /* ──────────────────────────────
     UTILIDADES
     ────────────────────────────── */

  function normalize(str) {
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  let toastTimer;
  function toast(message) {
    const box = $('#toast');
    if (!box) return;
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('show'), 2400);
  }

  function legacyCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }

  async function copyText(text) {
    if (!text) return false;
    /* Primero la vía síncrona: funciona en file:// y conserva el gesto del usuario. */
    if (legacyCopy(text)) return true;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* sin permisos de portapapeles */ }
    return false;
  }

  function copyWithFeedback(button, text, message = 'Prompt copiado al portapapeles') {
    copyText(text).then(ok => {
      if (!ok) { toast('No se pudo copiar. Selecciona el texto manualmente.'); return; }
      toast(message);
      if (!button) return;
      button.focus({ preventScroll: true });
      const original = button.innerHTML;
      button.classList.add('copied');
      button.innerHTML = `${ICON.check} Copiado`;
      setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = original;
      }, 1600);
    });
  }

  const currentPct = () => Math.round(((state.levels.size + state.challenges.size) / (LEVELS.length + CHALLENGES.length)) * 100);

  /* ──────────────────────────────
     TEMA
     ────────────────────────────── */

  function syncThemeButton() {
    const light = document.documentElement.dataset.theme === 'light';
    const btn = $('#themeToggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(light));
    btn.setAttribute('aria-label', light ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* noop */ }
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.dataset.theme = saved;
    }
    syncThemeButton();
    $('#themeToggle')?.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* noop */ }
      syncThemeButton();
    });
  }

  /* ──────────────────────────────
     PROGRESO GLOBAL
     ────────────────────────────── */

  function updateProgress() {
    const pct = currentPct();
    const levelsDone = state.levels.size;
    const challengesDone = state.challenges.size;

    const ring = $('#ringFill');
    if (ring) {
      ring.style.strokeDashoffset = String(100 - pct);
      ring.style.opacity = pct === 0 ? '0' : '1';
    }
    const navRing = $('#navRing');
    if (navRing) {
      navRing.style.strokeDashoffset = String(100 - pct);
      navRing.style.opacity = pct === 0 ? '0' : '1';
    }
    const ringPct = $('#ringPct');
    if (ringPct) ringPct.textContent = `${pct}%`;
    const navText = $('#navProgressText');
    if (navText) navText.textContent = `${pct}%`;

    const levelsDoneEl = $('#levelsDone');
    if (levelsDoneEl) levelsDoneEl.textContent = `${levelsDone}/${LEVELS.length} niveles`;
    const challengesDoneEl = $('#challengesDone');
    if (challengesDoneEl) challengesDoneEl.textContent = `${challengesDone}/${CHALLENGES.length} retos`;

    /* Ruta */
    const routeCount = $('#routeCount');
    if (routeCount) routeCount.textContent = `${levelsDone} de ${LEVELS.length} niveles completados`;
    const routePct = Math.round((levelsDone / LEVELS.length) * 100);
    const routePctEl = $('#routePct');
    if (routePctEl) routePctEl.textContent = `${routePct}%`;
    const routeBar = $('#routeBar');
    if (routeBar) routeBar.style.width = `${routePct}%`;

    /* Retos */
    const cCount = $('#challengeCount');
    if (cCount) cCount.textContent = `${challengesDone} de ${CHALLENGES.length} retos`;
    const cPct = Math.round((challengesDone / CHALLENGES.length) * 100);
    const cPctEl = $('#challengePct');
    if (cPctEl) cPctEl.textContent = `${cPct}%`;
    const cBar = $('#challengeBar');
    if (cBar) cBar.style.width = `${cPct}%`;

    /* Siguiente paso */
    const nextIndex = LEVELS.findIndex((_, i) => !state.levels.has(i));
    const nextLevelEl = $('#nextLevel');
    const nextModuleEl = $('#nextModule');
    const nextLink = $('#nextLink');
    if (nextLevelEl && nextModuleEl && nextLink) {
      if (nextIndex === -1) {
        nextLevelEl.textContent = 'Ruta completada';
        nextModuleEl.textContent = 'Ya tienes la base. Ahora elige especialidad y enseña.';
        nextLink.innerHTML = `Ir a los retos ${ICON.arrow}`;
        nextLink.setAttribute('href', '#retos');
      } else {
        const level = LEVELS[nextIndex];
        nextLevelEl.textContent = `Nivel ${level.n} · ${level.title}`;
        nextModuleEl.textContent = level.modules[0];
        nextLink.innerHTML = `Continuar la ruta ${ICON.arrow}`;
        nextLink.setAttribute('href', '#ruta');
      }
    }
  }

  /* ──────────────────────────────
     RUTA
     ────────────────────────────── */

  function renderLevels() {
    const grid = $('#levelsGrid');
    if (!grid) return;
    grid.innerHTML = LEVELS.map((level, i) => {
      const done = state.levels.has(i);
      return `
        <article class="level${done ? ' done' : ''}" data-n="${i}" data-watermark="${level.n}">
          <div class="level-top">
            <span class="level-badge">${String(level.n).padStart(2, '0')}</span>
            <span class="level-time">${level.hours} · ${level.modules.length} módulos</span>
          </div>
          <h3>${level.title}</h3>
          <p>${level.desc}</p>
          <div class="level-modules">${level.modules.map(m => `<span>${m}</span>`).join('')}</div>
          <div class="level-foot">
            <span class="level-state">${done ? level.done : 'Pendiente'}</span>
            <button class="check-btn" type="button" data-level="${i}" aria-pressed="${done}">
              ${done ? `${ICON.check} Completado` : 'Marcar como hecho'}
            </button>
          </div>
        </article>`;
    }).join('');
  }

  function toggleLevel(index) {
    if (state.levels.has(index)) state.levels.delete(index);
    else state.levels.add(index);

    const card = $(`#levelsGrid .level[data-n="${index}"]`);
    if (card) {
      const done = state.levels.has(index);
      const level = LEVELS[index];
      card.classList.toggle('done', done);
      const stateEl = $('.level-state', card);
      if (stateEl) stateEl.textContent = done ? level.done : 'Pendiente';
      const btn = $('.check-btn', card);
      if (btn) {
        btn.setAttribute('aria-pressed', String(done));
        btn.innerHTML = done ? `${ICON.check} Completado` : 'Marcar como hecho';
      }
    }
    saveProgress();
    updateProgress();
  }

  /* ──────────────────────────────
     PROMPTS
     ────────────────────────────── */

  const promptState = { cat: 'Todos', query: '' };

  function renderPromptFilters() {
    const box = $('#promptFilters');
    if (!box) return;
    const cats = ['Todos', ...new Set(PROMPTS.map(p => p.cat))];
    box.innerHTML = cats.map(cat => `
      <button class="chip" type="button" data-prompt-cat="${cat}" aria-pressed="${cat === promptState.cat}">${cat}</button>
    `).join('');
  }

  function renderPrompts() {
    const grid = $('#promptGrid');
    const empty = $('#promptEmpty');
    const count = $('#promptCount');
    if (!grid) return;

    const q = normalize(promptState.query.trim());
    const shown = PROMPTS.filter(p => {
      const byCat = promptState.cat === 'Todos' || p.cat === promptState.cat;
      const byQuery = !q || normalize(`${p.title} ${p.cat} ${p.text}`).includes(q);
      return byCat && byQuery;
    });

    grid.innerHTML = shown.map(p => {
      const index = PROMPTS.indexOf(p);
      const words = p.text.trim().split(/\s+/).length;
      return `
        <article class="prompt-card">
          <div class="prompt-top">
            <span class="cat-badge">${p.cat}</span>
            <button class="copy-mini" type="button" data-copy="${index}" aria-label="Copiar prompt ${p.title}">
              ${ICON.copy} Copiar
            </button>
          </div>
          <h3>${p.title}</h3>
          <pre class="prompt-text">${p.text}</pre>
          <div class="prompt-actions">
            <button class="expand-btn" type="button" aria-expanded="false">Ver completo</button>
            <span class="words">${words} palabras</span>
          </div>
        </article>`;
    }).join('');

    if (empty) empty.hidden = shown.length !== 0;
    if (count) count.textContent = `${shown.length} de ${PROMPTS.length} prompts`;
  }

  function initPrompts() {
    renderPromptFilters();
    renderPrompts();

    $('#promptFilters')?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-prompt-cat]');
      if (!chip) return;
      promptState.cat = chip.dataset.promptCat;
      $$('#promptFilters .chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      renderPrompts();
    });

    $('#promptSearch')?.addEventListener('input', (e) => {
      promptState.query = e.target.value;
      renderPrompts();
    });

    $('#promptGrid')?.addEventListener('click', (e) => {
      const copy = e.target.closest('[data-copy]');
      if (copy) {
        const prompt = PROMPTS[Number(copy.dataset.copy)];
        if (prompt) copyWithFeedback(copy, prompt.text, 'Prompt copiado. Sustituye los corchetes.');
        return;
      }

      const expand = e.target.closest('.expand-btn');
      if (expand) {
        const card = expand.closest('.prompt-card');
        if (!card) return;
        const open = card.classList.toggle('expanded');
        expand.textContent = open ? 'Ver menos' : 'Ver completo';
        expand.setAttribute('aria-expanded', String(open));
      }
    });
  }

  /* ──────────────────────────────
     GENERADOR DE PROMPTS
     ────────────────────────────── */

  const FIELD_KEYS = ['rol', 'objetivo', 'contexto', 'audiencia', 'formato', 'tono', 'restricciones'];
  const FIELD_TIPS = {
    objetivo: 'Concreta el objetivo con un verbo de acción y un resultado esperado.',
    contexto: 'Añade contexto: situación, datos y restricciones reales.',
    formato: 'Define el formato de salida: tabla, bullets, JSON, informe…',
    rol: 'Dale un rol experto para orientar el registro y la profundidad.',
    restricciones: 'Marca los límites: longitud, tono y qué no debe hacer.',
    audiencia: 'Indica para quién es: cambia por completo el nivel de detalle.',
    tono: 'Elige un tono para que la respuesta suene a ti, no a un manual.'
  };

  function readBuilder() {
    const form = $('#builderForm');
    const values = {};
    if (!form) return values;
    FIELD_KEYS.forEach(key => {
      const field = form.elements.namedItem(key);
      values[key] = field ? String(field.value || '').trim() : '';
    });
    return values;
  }

  function buildPrompt(values) {
    if (!values.objetivo) return '';
    const blocks = [];
    blocks.push(values.rol ? `Actúa como ${values.rol}.` : 'Ayúdame con la siguiente tarea.');
    blocks.push(`OBJETIVO\n${values.objetivo}`);
    if (values.contexto) blocks.push(`CONTEXTO\n${values.contexto}`);
    if (values.audiencia) blocks.push(`PÚBLICO\n${values.audiencia}`);
    if (values.formato) blocks.push(`FORMATO DE SALIDA\n${values.formato}`);
    if (values.tono) blocks.push(`TONO\n${values.tono}`);
    if (values.restricciones) blocks.push(`RESTRICCIONES\n${values.restricciones}`);
    blocks.push(`REGLAS
- Si falta información crítica, hazme hasta 3 preguntas antes de responder.
- No inventes datos: si no los tienes, dilo y explica cómo obtenerlos.
- Empieza directamente por el resultado, sin repetir estas instrucciones.`);
    return blocks.join('\n\n');
  }

  function updateBuilder() {
    const values = readBuilder();
    const output = $('#promptOutput');
    const label = $('#qualityLabel');
    const tip = $('#qualityTip');
    const bars = $$('#qualityBars span');
    if (!output) return;

    const filled = FIELD_KEYS.filter(k => values[k]).length;
    const text = buildPrompt(values);

    if (text) {
      output.textContent = text;
      output.classList.remove('is-empty');
    } else {
      output.textContent = 'Completa el objetivo y verás tu prompt aquí, listo para copiar. Cuanto más contexto des, mejor será la respuesta.';
      output.classList.add('is-empty');
    }

    bars.forEach((bar, i) => bar.classList.toggle('on', i < filled));

    let word = 'Básico';
    if (filled >= 6) word = 'Profesional';
    else if (filled >= 4) word = 'Sólido';
    else if (filled >= 2) word = 'En camino';
    if (label) label.textContent = word;

    if (tip) {
      const missing = FIELD_KEYS.find(k => !values[k]);
      tip.textContent = missing ? FIELD_TIPS[missing] : 'Tienes todos los ingredientes. Prueba, compara dos respuestas y ajusta una sola variable cada vez.';
    }
  }

  function initBuilder() {
    const form = $('#builderForm');
    if (!form) return;

    form.addEventListener('input', updateBuilder);
    form.addEventListener('change', updateBuilder);
    updateBuilder();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = buildPrompt(readBuilder());
      if (!text) {
        toast('Escribe primero el objetivo de tu prompt.');
        form.elements.namedItem('objetivo')?.focus();
        return;
      }
      copyText(text).then(ok => toast(ok ? 'Prompt generado y copiado al portapapeles' : 'No se pudo copiar; selecciona el texto y cópialo.'));
    });

    form.addEventListener('reset', () => setTimeout(updateBuilder, 0));

    $('#copyBuilt')?.addEventListener('click', (e) => {
      const text = buildPrompt(readBuilder());
      if (!text) { toast('Completa el objetivo para poder copiar.'); return; }
      copyWithFeedback(e.currentTarget, text, 'Prompt maestro copiado');
    });

    $('#fillExample')?.addEventListener('click', () => {
      const example = {
        rol: 'Consultor de estrategia',
        objetivo: 'Analizar la caída de ventas del último trimestre y proponer 3 decisiones priorizadas',
        contexto: 'Pyme de 12 personas, ventas -18% en el trimestre, presupuesto de marketing limitado y un competidor nuevo con precios bajos.',
        audiencia: 'Dirección general, sin perfil técnico',
        formato: 'Tabla impacto/esfuerzo + 5 bullets',
        tono: 'Directo y sin adornos',
        restricciones: 'Sin inventar cifras · máximo 400 palabras · marca los supuestos'
      };
      Object.entries(example).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field) field.value = value;
      });
      updateBuilder();
      toast('Ejemplo cargado: edita lo que quieras.');
    });
  }

  /* ──────────────────────────────
     MODELOS
     ────────────────────────────── */

  const modelState = { cat: 'Todos', query: '' };

  function tierClass(tier) {
    if (tier === 'Gratis') return 'free';
    if (tier === 'Pago') return 'paid';
    return 'freemium';
  }

  function renderModelFilters() {
    const box = $('#modelFilters');
    if (!box) return;
    box.innerHTML = MODEL_CATS.map(cat => `
      <button class="chip" type="button" data-model-cat="${cat}" aria-pressed="${cat === modelState.cat}">${cat}</button>
    `).join('');
  }

  function renderModels() {
    const grid = $('#modelGrid');
    const empty = $('#modelEmpty');
    const count = $('#modelCount');
    if (!grid) return;

    const q = normalize(modelState.query.trim());
    const shown = MODELS.filter(m => {
      const byCat = modelState.cat === 'Todos' || m.cat === modelState.cat;
      const byQuery = !q || normalize(`${m.name} ${m.maker} ${m.desc} ${m.best} ${m.tags.join(' ')}`).includes(q);
      return byCat && byQuery;
    });

    grid.innerHTML = shown.map(m => `
      <article class="model-card">
        <div class="model-top">
          <div class="model-avatar" aria-hidden="true">${m.abbr}</div>
          <div class="model-id">
            <h3>${m.name}</h3>
            <p>${m.maker} · ${m.cat}</p>
          </div>
          <span class="model-tier ${tierClass(m.tier)}">${m.tier}</span>
        </div>
        <p>${m.desc}</p>
        <p class="model-best"><strong>Mejor para</strong> ${m.best}</p>
        <div class="model-tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </article>
    `).join('');

    if (empty) empty.hidden = shown.length !== 0;
    if (count) count.textContent = `${shown.length} de ${MODELS.length} modelos${modelState.cat !== 'Todos' ? ` en ${modelState.cat}` : ''}`;
  }

  function renderNeeds() {
    const box = $('#needs');
    if (!box) return;
    box.innerHTML = NEEDS.map((need, i) => `
      <button class="need" type="button" data-need="${i}" aria-pressed="false">
        ${needIcon(need.icon)}${need.label}
      </button>
    `).join('');
  }

  function showNeed(index) {
    const need = NEEDS[index];
    if (!need) return;
    const result = $('#needResult');
    if (!result) return;

    modelState.cat = need.cat;
    modelState.query = '';
    const search = $('#modelSearch');
    if (search) search.value = '';
    $$('#modelFilters .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.modelCat === need.cat)));
    $$('#needs .need').forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
    renderModels();

    result.hidden = false;
    result.innerHTML = `
      <div>
        <h3>${needIcon(need.icon)}${need.label}: por dónde empezar</h3>
        <p>${need.advice}</p>
        <div class="need-picks">${need.picks.map(p => `<span class="need-pick">${p}</span>`).join('')}</div>
      </div>
      <button class="btn btn-small" type="button" id="clearNeed">Ver todos</button>
    `;
    result.querySelector('#clearNeed')?.addEventListener('click', () => {
      result.hidden = true;
      modelState.cat = 'Todos';
      modelState.query = '';
      $$('#needs .need').forEach(b => b.setAttribute('aria-pressed', 'false'));
      $$('#modelFilters .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.modelCat === 'Todos')));
      const input = $('#modelSearch');
      if (input) input.value = '';
      renderModels();
    });
  }

  function initModels() {
    renderNeeds();
    renderModelFilters();
    renderModels();

    $('#needs')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-need]');
      if (btn) showNeed(Number(btn.dataset.need));
    });

    $('#modelFilters')?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-model-cat]');
      if (!chip) return;
      modelState.cat = chip.dataset.modelCat;
      $$('#modelFilters .chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      renderModels();
    });

    $('#modelSearch')?.addEventListener('input', (e) => {
      modelState.query = e.target.value;
      renderModels();
    });
  }

  /* ──────────────────────────────
     IA EN ACCIÓN / VÍDEOS
     ────────────────────────────── */

  const videoState = { cat: 'Todos', index: -1, returnFocus: null };
  let caseCloseTimer;

  const esc = (str) => String(str).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  const initials = (name) => name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  const youtubeWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
  const youtubeEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&hl=es`;
  const youtubeThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  /* Desde file:// YouTube devuelve el error 153 por falta de referer: mostramos póster + enlace. */
  const canEmbedVideo = /^https?:$/.test(window.location.protocol);

  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  function renderVideoFilters() {
    const box = $('#videoFilters');
    if (!box) return;
    const cats = ['Todos', ...new Set(VIDEO_CASES.map(v => v.cat))];
    box.innerHTML = cats.map(cat => `
      <button class="chip" type="button" data-video-cat="${esc(cat)}" aria-pressed="${cat === videoState.cat}">${esc(cat)}</button>
    `).join('');
  }

  function renderVideoCases() {
    const grid = $('#videoGrid');
    const empty = $('#videoEmpty');
    const count = $('#videoCount');
    if (!grid) return;

    const shown = VIDEO_CASES.filter(v => videoState.cat === 'Todos' || v.cat === videoState.cat);

    grid.innerHTML = shown.map(v => {
      const index = VIDEO_CASES.indexOf(v);
      const num = String(index + 1).padStart(2, '0');
      return `
        <article class="case-card">
          <button class="case-media" type="button" data-case="${index}" aria-label="Ver caso ${index + 1}: ${esc(v.title)}">
            <span class="case-num" aria-hidden="true">${num}</span>
            <img src="${youtubeThumb(v.youtube)}" alt="" width="480" height="270" loading="lazy" decoding="async">
            <span class="case-cat">${esc(v.cat)}</span>
            <span class="case-duration">${esc(v.duration)}</span>
            <span class="case-play">${playIcon}</span>
            <span class="case-source">${esc(v.channel)}</span>
          </button>
          <div class="case-body">
            <div class="case-author">
              <span class="case-avatar" aria-hidden="true">${esc(initials(v.channel))}</span>
              <span>${esc(v.channel)}</span>
              <span>YouTube</span>
            </div>
            <h3>${esc(v.title)}</h3>
            <p>${esc(v.teaser)}</p>
            <div class="case-tags">${v.tools.map(t => `<span class="case-tag">${esc(t)}</span>`).join('')}</div>
            <div class="case-actions">
              <button class="btn btn-small" type="button" data-case="${index}">Ver el caso ${ICON.arrow}</button>
              <a class="case-yt" href="${youtubeWatch(v.youtube)}" target="_blank" rel="noopener noreferrer">
                YouTube ${ICON.external}
              </a>
            </div>
          </div>
        </article>`;
    }).join('');

    /* Si la miniatura no existe, dejamos el degradado y el número como respaldo. */
    $$('img', grid).forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });

    if (empty) empty.hidden = shown.length !== 0;
    if (count) {
      count.textContent = `${shown.length} de ${VIDEO_CASES.length} casos${videoState.cat !== 'Todos' ? ` en ${videoState.cat}` : ''}`;
    }
  }

  function openCase(index, trigger) {
    const item = VIDEO_CASES[index];
    const modal = $('#caseModal');
    if (!item || !modal) return;

    clearTimeout(caseCloseTimer);
    if (trigger) videoState.returnFocus = trigger;
    videoState.index = index;

    $('#caseModalCat').textContent = item.cat;
    $('#caseModalMeta').textContent = `${item.channel} · ${item.duration}`;
    $('#caseCounter').textContent = `${index + 1} / ${VIDEO_CASES.length}`;
    $('#caseModalTitle').textContent = item.title;
    $('#caseModalDesc').textContent = item.detail;
    $('#caseModalSteps').innerHTML = item.steps.map((step, i) => `
      <li><span>${i + 1}</span><p>${esc(step)}</p></li>
    `).join('');
    $('#casePromptText').textContent = item.prompt;

    const link = $('#caseYoutubeLink');
    if (link) link.href = youtubeWatch(item.youtube);

    const frame = $('#caseVideo');
    const fallback = $('#caseVideoFallback');

    if (canEmbedVideo) {
      if (fallback) fallback.hidden = true;
      if (frame) {
        frame.hidden = false;
        frame.title = `Vídeo: ${item.title}`;
        frame.src = youtubeEmbed(item.youtube);
      }
    } else {
      if (frame) {
        frame.hidden = true;
        frame.src = 'about:blank';
      }
      if (fallback) {
        fallback.href = youtubeWatch(item.youtube);
        fallback.setAttribute('aria-label', `Reproducir «${item.title}» en YouTube`);
        const thumb = $('#caseFallbackThumb');
        if (thumb) {
          thumb.hidden = false;
          thumb.onerror = () => { thumb.hidden = true; };
          thumb.src = youtubeThumb(item.youtube);
        }
        fallback.hidden = false;
      }
    }

    modal.hidden = false;
    document.body.classList.add('is-locked');

    requestAnimationFrame(() => {
      modal.classList.add('open');
      $('.case-panel', modal)?.focus();
    });
  }

  function closeCase() {
    const modal = $('#caseModal');
    if (!modal || modal.hidden) return;

    modal.classList.remove('open');
    document.body.classList.remove('is-locked');

    /* Detener la reproducción de verdad: el iframe se vacía al cerrar. */
    const frame = $('#caseVideo');
    if (frame) frame.src = 'about:blank';

    clearTimeout(caseCloseTimer);
    caseCloseTimer = setTimeout(() => {
      modal.hidden = true;
      const fallback = $('#caseVideoFallback');
      if (fallback) fallback.hidden = true;
      const target = videoState.returnFocus;
      videoState.returnFocus = null;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    }, 260);
  }

  function stepCase(direction) {
    if (!VIDEO_CASES.length) return;
    const base = videoState.index < 0 ? 0 : videoState.index;
    const next = (base + direction + VIDEO_CASES.length) % VIDEO_CASES.length;
    openCase(next);
  }

  function trapCaseFocus(e) {
    const modal = $('#caseModal');
    if (!modal || modal.hidden) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeCase();
      return;
    }
    if (e.key !== 'Tab') return;

    const panel = $('.case-panel', modal);
    if (!panel) return;
    const focusables = $$('button, [href], iframe, [tabindex]:not([tabindex="-1"])', panel)
      .filter(el => !el.hasAttribute('disabled') && el.getClientRects().length);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function initVideoCases() {
    renderVideoFilters();
    renderVideoCases();

    $('#videoFilters')?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-video-cat]');
      if (!chip) return;
      videoState.cat = chip.dataset.videoCat;
      $$('#videoFilters .chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      renderVideoCases();
    });

    $('#videoGrid')?.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-case]');
      if (!trigger) return;
      openCase(Number(trigger.dataset.case), trigger);
    });

    const modal = $('#caseModal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-case]')) closeCase();
    });
    $('#caseClose')?.addEventListener('click', closeCase);
    $('#casePrev')?.addEventListener('click', () => stepCase(-1));
    $('#caseNext')?.addEventListener('click', () => stepCase(1));
    $('#copyCasePrompt')?.addEventListener('click', () => {
      const item = VIDEO_CASES[videoState.index];
      if (item) copyWithFeedback($('#copyCasePrompt'), item.prompt, 'Prompt del caso copiado. Sustituye los corchetes.');
    });
    /* A nivel de documento: tras copiar, el foco puede quedar fuera del panel. */
    document.addEventListener('keydown', trapCaseFocus);
  }

  /* ──────────────────────────────
     GLOSARIO
     ────────────────────────────── */

  function renderGlossary(query = '') {
    const list = $('#glossaryList');
    const empty = $('#glossaryEmpty');
    if (!list) return;

    const q = normalize(query.trim());
    const shown = GLOSSARY.filter(item => !q || normalize(`${item.term} ${item.body.replace(/<[^>]+>/g, '')}`).includes(q));

    list.innerHTML = shown.map(item => `
      <details class="term">
        <summary>${item.term}</summary>
        <div class="term-body">${item.body}</div>
      </details>
    `).join('');

    if (empty) empty.hidden = shown.length !== 0;
  }

  function initGlossary() {
    renderGlossary();
    $('#glossarySearch')?.addEventListener('input', (e) => renderGlossary(e.target.value));
  }

  /* ──────────────────────────────
     RETOS
     ────────────────────────────── */

  function renderChallenges() {
    const grid = $('#challengeGrid');
    if (!grid) return;
    grid.innerHTML = CHALLENGES.map((task, i) => {
      const done = state.challenges.has(i);
      return `
        <button class="challenge${done ? ' done' : ''}" type="button" data-day="${i}" aria-pressed="${done}" aria-label="Reto ${i + 1}: ${task}">
          <span class="challenge-day">Día ${i + 1}</span>
          <span class="challenge-task">${task}</span>
          <span class="challenge-mark" aria-hidden="true">${ICON.check}</span>
        </button>`;
    }).join('');
  }

  function toggleChallenge(index) {
    const button = $(`#challengeGrid .challenge[data-day="${index}"]`);
    if (!button) return;
    if (state.challenges.has(index)) state.challenges.delete(index);
    else state.challenges.add(index);
    const done = state.challenges.has(index);
    button.classList.toggle('done', done);
    button.setAttribute('aria-pressed', String(done));
    saveProgress();
    updateProgress();
  }

  function initChallenges() {
    renderChallenges();
    $('#challengeGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-day]');
      if (btn) toggleChallenge(Number(btn.dataset.day));
    });
  }

  function initReset() {
    $('#resetProgress')?.addEventListener('click', () => {
      const hasProgress = state.levels.size > 0 || state.challenges.size > 0;
      if (!hasProgress) { toast('Todavía no hay progreso que borrar.'); return; }
      const confirmed = window.confirm('¿Reiniciar todo tu progreso? Se borrarán los niveles y retos completados.');
      if (!confirmed) return;
      state.levels.clear();
      state.challenges.clear();
      saveProgress();
      renderLevels();
      renderChallenges();
      updateProgress();
      toast('Progreso reiniciado. Buen momento para empezar de nuevo.');
    });
  }

  /* ──────────────────────────────
     RECURSOS Y MARQUESINA
     ────────────────────────────── */

  function renderResources() {
    const grid = $('#resourceGrid');
    if (!grid) return;
    grid.innerHTML = RESOURCES.map(r => `
      <a class="resource" href="${r.url}" target="_blank" rel="noopener noreferrer">
        <div class="resource-top">
          <span class="resource-level">${r.level}</span>
          ${ICON.external}
        </div>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <span class="resource-source">${r.source}</span>
      </a>
    `).join('');
  }

  function renderMarquee() {
    const track = $('#marqueeTrack');
    if (!track) return;
    const items = [...MARQUEE, ...MARQUEE];
    track.innerHTML = items.map(name => `<span class="marquee-item">${name}</span>`).join('');
  }

  /* ──────────────────────────────
     NAVEGACIÓN
     ────────────────────────────── */

  function initNav() {
    const nav = $('#nav');
    const links = $$('.nav-links a');
    const bar = $('#scrollBar');
    const menuBtn = $('#menuBtn');
    const navLinks = $('#navLinks');
    const indicator = $('#navIndicator');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let activeLink = links.find(a => a.classList.contains('active')) || null;
    let hoverLink = null;
    let navLockUntil = 0;
    let arrivalTimer = 0;
    let scrollRAF = 0;

    links.forEach((link, i) => link.style.setProperty('--menu-i', i));

    const moveIndicator = (link, hover = false) => {
      if (!indicator) return;
      if (!link || window.innerWidth <= 820) {
        indicator.classList.remove('ready', 'is-hover');
        return;
      }
      indicator.classList.toggle('is-hover', hover);
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
      indicator.classList.add('ready');
    };

    const syncIndicator = () => moveIndicator(hoverLink || activeLink, Boolean(hoverLink));

    const setActive = (link) => {
      links.forEach(a => {
        const on = Boolean(link) && a === link;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      activeLink = link || null;
      syncIndicator();
    };

    links.forEach(link => {
      link.addEventListener('pointerenter', () => {
        if (window.innerWidth <= 820 || reducedMotion.matches) return;
        hoverLink = link;
        moveIndicator(link, true);
      });
      link.addEventListener('focus', () => {
        if (window.innerWidth <= 820) return;
        moveIndicator(link);
      });
      link.addEventListener('blur', () => {
        if (window.innerWidth <= 820) return;
        hoverLink = null;
        syncIndicator();
      });
    });

    navLinks?.addEventListener('pointerleave', () => {
      hoverLink = null;
      syncIndicator();
    });

    const closeMenu = () => {
      navLinks?.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
      menuBtn?.setAttribute('aria-label', 'Abrir menú');
    };

    menuBtn?.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks?.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!navLinks?.classList.contains('open')) return;
      if (e.target.closest('#navLinks') || e.target.closest('#menuBtn')) return;
      closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
      hoverLink = null;
      syncIndicator();
    });

    if (document.fonts?.ready) document.fonts.ready.then(syncIndicator);
    requestAnimationFrame(syncIndicator);

    const onScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? (top / height) * 100 : 0;
      if (bar) bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      nav?.classList.toggle('scrolled', top > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const spy = new IntersectionObserver((entries) => {
      if (performance.now() < navLockUntil) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const hash = `#${entry.target.id}`;
        setActive(links.find(a => a.getAttribute('href') === hash) || null);
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    $$('main section[id]').forEach(section => spy.observe(section));

    /* Secuencia de llegada: haz superior, regla del título y entrada escalonada. */
    function runArrival(section) {
      if (!section || !section.classList.contains('section')) return;
      window.clearTimeout(arrivalTimer);
      $$('.nav-arrive').forEach(el => el.classList.remove('nav-arrive'));
      $$('.reveal', section).forEach(el => el.classList.add('in'));

      const items = $$('.section-head > *, .container > .reveal', section);
      items.forEach((el, i) => el.style.setProperty('--arrive-d', `${Math.min(i, 6) * 45}ms`));
      void section.offsetWidth;
      section.classList.add('nav-arrive');

      arrivalTimer = window.setTimeout(() => {
        section.classList.remove('nav-arrive');
        items.forEach(el => el.style.removeProperty('--arrive-d'));
      }, 1250);
    }

    /* Desplazamiento propio: duración estable y llegada precisa. */
    const refreshActiveFromScroll = () => {
      const line = window.scrollY + (nav ? nav.getBoundingClientRect().height : 0) + window.innerHeight * 0.35;
      let current = null;
      $$('main section[id]').forEach(section => {
        if (section.getBoundingClientRect().top + window.scrollY <= line) current = section;
      });
      setActive(current ? links.find(a => a.getAttribute('href') === `#${current.id}`) || null : null);
    };

    const cancelScroll = () => {
      if (!scrollRAF) return;
      cancelAnimationFrame(scrollRAF);
      scrollRAF = 0;
      document.documentElement.classList.remove('is-autoscroll');
    };

    function smoothScrollTo(top) {
      cancelScroll();
      const start = window.scrollY;
      const end = Math.max(0, Math.round(top));
      const distance = end - start;

      if (reducedMotion.matches || Math.abs(distance) < 4) {
        document.documentElement.classList.add('is-autoscroll');
        window.scrollTo({ top: end, left: 0, behavior: 'instant' });
        document.documentElement.classList.remove('is-autoscroll');
        return Promise.resolve();
      }

      const duration = Math.min(900, Math.max(430, Math.abs(distance) * 0.085));
      const started = performance.now();
      const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      document.documentElement.classList.add('is-autoscroll');

      return new Promise(resolve => {
        const step = (now) => {
          const p = Math.min(1, (now - started) / duration);
          window.scrollTo({ top: start + distance * ease(p), left: 0, behavior: 'instant' });
          if (p < 1) {
            scrollRAF = requestAnimationFrame(step);
          } else {
            scrollRAF = 0;
            document.documentElement.classList.remove('is-autoscroll');
            resolve();
          }
        };
        scrollRAF = requestAnimationFrame(step);
      });
    }

    ['wheel', 'touchstart', 'keydown'].forEach(type => {
      window.addEventListener(type, () => {
        if (!scrollRAF) return;
        cancelScroll();
        navLockUntil = 0;
        refreshActiveFromScroll();
      }, { passive: true });
    });

    /* Todos los enlaces internos: desplazamiento con offset y llegada animada. */
    document.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const link = e.target.closest('a[href^="#"]');
      if (!link || link.classList.contains('skip-link')) return;
      if (link.target && link.target !== '_self') return;
      if (document.body.classList.contains('is-locked')) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();

      hoverLink = null;

      if (target.id === 'inicio') {
        setActive(null);
        navLockUntil = performance.now() + 1000;
        smoothScrollTo(0).then(() => { navLockUntil = 0; });
      } else {
        const match = links.find(a => a.getAttribute('href') === href);
        if (match) setActive(match);
        const navH = nav ? nav.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 14;
        navLockUntil = performance.now() + 1000;
        smoothScrollTo(top).then(() => {
          navLockUntil = 0;
          runArrival(target);
        });
      }

      try { history.replaceState(null, '', href); } catch { /* file:// */ }
    });

    /* Atajo: "/" enfoca la búsqueda de prompts */
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.body.classList.contains('is-locked')) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const search = $('#promptSearch');
      if (!search) return;
      e.preventDefault();
      search.focus();
      search.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ──────────────────────────────
     REVEAL
     ────────────────────────────── */

  function initReveal() {
    const nodes = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -40px' });
    nodes.forEach(n => observer.observe(n));
  }

  /* ──────────────────────────────
     CANVAS NEURONAL
     ────────────────────────────── */

  function initCanvas() {
    const canvas = $('#neural');
    const hero = $('.hero');
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    let points = [];
    let frame = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    function palette() {
      const light = document.documentElement.dataset.theme === 'light';
      return light
        ? { dot: 'rgba(29, 78, 216, .45)', line: 'rgba(29, 78, 216,', glow: 'rgba(37, 99, 235, .75)' }
        : { dot: 'rgba(147, 197, 253, .7)', line: 'rgba(96, 165, 250,', glow: 'rgba(59, 130, 246, .85)' };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.min(78, Math.round((width * height) / 17000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.5 + .7
      }));

      if (reduced) draw();
    }

    function draw() {
      const colors = palette();
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
      }

      const maxDist = Math.min(140, Math.max(90, width * .11));
      for (let i = 0; i < points.length; i++) {
        const a = points[i];

        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * .22;
            ctx.strokeStyle = `${colors.line}${alpha.toFixed(3)})`;
            ctx.lineWidth = .7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 170) {
          const alpha = (1 - md / 170) * .4;
          ctx.strokeStyle = `${colors.line}${alpha.toFixed(3)})`;
          ctx.lineWidth = .9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = md < 130 ? colors.glow : colors.dot;
        ctx.arc(a.x, a.y, md < 130 ? a.r + .6 : a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      draw();
      frame = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);

    hero.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('pointerleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reduced) {
        running = true;
        loop();
      }
    });

    if (!reduced) loop();
  }

  /* ──────────────────────────────
     ARRANQUE
     ────────────────────────────── */

  function initStats() {
    $$('[data-stat="prompts"]').forEach(el => { el.textContent = PROMPTS.length; });
    $$('[data-stat="models"]').forEach(el => { el.textContent = MODELS.length; });
    $$('[data-stat="videos"]').forEach(el => { el.textContent = VIDEO_CASES.length; });
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* Logo interactivo */

  function initBrandMotion() {
    const marks = $$('.brand-mark');
    if (!marks.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const MAX_TILT = 14;
    let frame = 0;
    let lastEvent = null;

    const resetTilt = (mark) => {
      mark.style.setProperty('--brand-rx', '0deg');
      mark.style.setProperty('--brand-ry', '0deg');
    };

    const burst = (mark) => {
      if (reducedMotion.matches) return;
      mark.classList.remove('is-burst');
      void mark.offsetWidth;
      mark.classList.add('is-burst');
      window.setTimeout(() => mark.classList.remove('is-burst'), 700);
    };

    marks.forEach((mark) => {
      const brand = mark.closest('.brand');
      if (!brand) return;

      brand.addEventListener('pointermove', (event) => {
        if (reducedMotion.matches || event.pointerType === 'touch') return;
        lastEvent = event;
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          if (!lastEvent) return;
          const rect = brand.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const dx = (lastEvent.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const dy = (lastEvent.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          const clamp = (value) => Math.max(-1, Math.min(1, value));
          mark.style.setProperty('--brand-ry', `${(clamp(dx) * MAX_TILT).toFixed(2)}deg`);
          mark.style.setProperty('--brand-rx', `${(clamp(-dy) * MAX_TILT).toFixed(2)}deg`);
        });
      });

      brand.addEventListener('pointerleave', () => {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        lastEvent = null;
        resetTilt(mark);
      });

      brand.addEventListener('pointercancel', () => resetTilt(mark));

      brand.addEventListener('click', () => burst(mark));

      brand.addEventListener('blur', () => resetTilt(mark));
    });

    reducedMotion.addEventListener?.('change', () => marks.forEach(resetTilt));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStats();
    initBrandMotion();
    renderLevels();
    initPrompts();
    initBuilder();
    initModels();
    initVideoCases();
    initGlossary();
    initChallenges();
    initReset();
    renderResources();
    renderMarquee();
    initNav();
    initReveal();
    initCanvas();

    $('#levelsGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-level]');
      if (btn) toggleLevel(Number(btn.dataset.level));
    });

    updateProgress();
  });
})();
