// ===========================
// ESTADO GLOBAL
// ===========================
let seccionActual = 'sec-intro';
let retosCompletados = 0;
const totalRetos = 3;

// ===========================
// NAVEGACIÓN ENTRE SECCIONES
// ===========================
function goTo(id) {
  document.getElementById(seccionActual).classList.remove('active');
  document.getElementById(id).classList.add('active');
  seccionActual = id;
  actualizarProgreso();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// PROGRESO
// ===========================
const secciones = [
  'sec-intro',
  'sec-historia',
  'sec-editor',
  'sec-explicacion',
  'sec-quiz',
  'sec-ejercicio'
];

function actualizarProgreso() {
  const index = secciones.indexOf(seccionActual);
  const pct = Math.round((index / (secciones.length - 1)) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '%';
}

// ===========================
// EDITOR — SECCIÓN 03
// ===========================
function ejecutarCodigo() {
  const condicion = document.getElementById('codeInput1').value.trim();
  const cuerpo    = document.getElementById('codeInput2').value.trim();
  const termBody  = document.getElementById('terminalBody');
  const termStatus = document.getElementById('termStatus');
  const byteReaction = document.getElementById('byteReaction');
  const byteMsg   = document.getElementById('byteMsg');
  const btnSig    = document.getElementById('btnSiguienteEditor');

  const productos = ["leche", "pan", "huevo", "agua", "arroz"];

  // Validar condición
  const condOk =
    condicion === 'productos.length' ||
    condicion === '5' ||
    condicion === 'productos.length ' ||
    condicion.replace(/\s/g, '') === 'productos.length';

  // Validar cuerpo
  const cuerpoOk =
    cuerpo.replace(/\s/g, '') === 'productos[i]';

  termBody.innerHTML = '';

  if (!condicion || !cuerpo) {
    termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">❌ Completa los dos campos antes de ejecutar.</span>`;
    termStatus.textContent = 'ERROR';
    return;
  }

  if (!condOk) {
    termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">❌ La condición no es correcta. Pista: usa productos.length</span>`;
    termStatus.textContent = 'ERROR';
    byteReaction.style.display = 'flex';
    byteMsg.textContent = 'La condición le dice al for cuándo parar. ¿Cuántos productos tiene el array?';
    return;
  }

  if (!cuerpoOk) {
    termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">❌ Dentro del for usa productos[i] para acceder a cada elemento.</span>`;
    termStatus.textContent = 'ERROR';
    byteReaction.style.display = 'flex';
    byteMsg.textContent = 'La i cambia sola en cada vuelta. ¡Prueba con productos[i]!';
    return;
  }

  // Todo correcto — simular el for
  let html = '';
  for (let i = 0; i < productos.length; i++) {
    html += `<div><span class="term-prompt">></span> <span style="color:#fff">${productos[i]}</span></div>`;
  }
  termBody.innerHTML = html;
  termStatus.textContent = 'EJECUTADO';

  byteReaction.style.display = 'flex';
  byteMsg.textContent = '¡Perfecto! El for recorrió los 5 productos automáticamente. Así es como funciona un bucle. 🚀';

  btnSig.style.display = 'block';
}

function mostrarHint() {
  document.getElementById('hintBox').style.display = 'block';
}

function resetEditor() {
  document.getElementById('codeInput1').value = '';
  document.getElementById('codeInput2').value = '';
  document.getElementById('terminalBody').innerHTML =
    `<span class="term-prompt">></span> <span class="term-wait">esperando ejecución...</span>`;
  document.getElementById('termStatus').textContent = 'LISTO';
  document.getElementById('byteReaction').style.display = 'none';
  document.getElementById('hintBox').style.display = 'none';
  document.getElementById('btnSiguienteEditor').style.display = 'none';
}

// ===========================
// EXPLICACIÓN — PARTE CARDS
// ===========================
function highlightPart(part) {
  document.querySelectorAll('.part-card').forEach(c => c.classList.remove('active-part'));
  const target = document.getElementById('part-' + part);
  if (target) target.classList.add('active-part');

  // Resaltar la parte en el código display
  document.querySelectorAll('.code-display [data-part]').forEach(el => {
    el.classList.remove('highlighted');
  });
  const codeEl = document.querySelector(`.code-display [data-part="${part}"]`);
  if (codeEl) codeEl.classList.add('highlighted');
}

// ===========================
// QUIZ — SECCIÓN 05
// ===========================
const preguntas = [
  {
    pregunta: '¿Cuál es la función de i++ en el for?',
    opciones: [
      'Reiniciar el contador a 0',
      'Sumar 1 al contador en cada vuelta',
      'Comparar el contador con el array',
      'Declarar una variable nueva'
    ],
    correcta: 1
  },
  {
    pregunta: '¿Qué pasa si olvidas el i++ en un for?',
    opciones: [
      'El for termina inmediatamente',
      'Salta un elemento cada vez',
      'El bucle se repite infinitamente',
      'Da un error de sintaxis'
    ],
    correcta: 2
  },
  {
    pregunta: 'Si productos tiene 5 elementos, ¿qué devuelve productos.length?',
    opciones: ['4', '5', '6', '0'],
    correcta: 1
  },
  {
    pregunta: '¿Qué valor tiene i en la primera vuelta de un for?',
    opciones: ['1', '-1', '0', 'undefined'],
    correcta: 2
  },
  {
    pregunta: 'Para mostrar el tercer producto de un array dentro de un for con i=2, ¿qué usas?',
    opciones: ['productos[3]', 'productos[i]', 'productos[2]', 'productos.i'],
    correcta: 1
  }
];

let preguntaActual = 0;
let puntaje = 0;

function renderizarQuiz() {
  const container = document.getElementById('quizContainer');
  if (preguntaActual >= preguntas.length) {
    mostrarResultadoQuiz();
    return;
  }

  const p = preguntas[preguntaActual];
  container.innerHTML = `
    <div class="q-title">${preguntaActual + 1}/${preguntas.length} — ${p.pregunta}</div>
    ${p.opciones.map((op, i) => `
      <button class="q-opt" onclick="responder(${i})">${op}</button>
    `).join('')}
  `;
}

function responder(indice) {
  const p = preguntas[preguntaActual];
  const botones = document.querySelectorAll('.q-opt');
  botones.forEach(b => b.disabled = true);

  if (indice === p.correcta) {
    botones[indice].classList.add('correct');
    puntaje++;
  } else {
    botones[indice].classList.add('wrong');
    botones[p.correcta].classList.add('correct');
  }

  setTimeout(() => {
    preguntaActual++;
    renderizarQuiz();
  }, 1300);
}

function mostrarResultadoQuiz() {
  document.getElementById('quizContainer').style.display = 'none';
  const result = document.getElementById('quizResult');
  result.style.display = 'block';
  document.getElementById('qrScore').textContent = `${puntaje} / ${preguntas.length}`;

  let msg = '';
  if (puntaje === preguntas.length) {
    msg = '🤖 BYTE dice: ¡Perfecto! Dominas los bucles for por completo.';
  } else if (puntaje >= 3) {
    msg = '🤖 BYTE dice: Bien. Entiende el i++ y el .length antes de seguir.';
  } else {
    msg = '🤖 BYTE dice: Vuelve a la sección de explicación. Los bucles son clave.';
  }
  document.getElementById('qrMsg').textContent = msg;
}

// ===========================
// RETOS — SECCIÓN 06
// ===========================
function checkChallenge(num) {
  if (num === 1) checkReto1();
  if (num === 2) checkReto2();
  if (num === 3) checkReto3();
}

// ─────────────────────────
// RETO 01 — Recorrer el stock
// ─────────────────────────
function checkReto1() {
  const codigo = document.getElementById('ch1-input').value.trim();
  const output = document.getElementById('ch1-output');
  output.style.display = 'block';

  // Ejecutar el código del alumno con sandbox
  const productos = ["leche", "pan", "huevo", "agua", "arroz"];
  let logs = [];

  try {
    const fn = new Function('productos', `
      const console = { log: (...args) => __logs.push(args.join(' ')) };
      const __logs = [];
      ${codigo}
      return __logs;
    `);
    logs = fn(productos);
  } catch (e) {
    output.innerHTML = `<span style="color:#ff4141">❌ Error en tu código: ${e.message}</span>`;
    return;
  }

  // Verificar que mostró los 5 productos en orden
  const esperado = productos;
  const correcto = logs.length === 5 && esperado.every((p, i) => logs[i] === p);

  if (correcto) {
    output.innerHTML = `<span style="color:#00ff41">✅ ¡Correcto! Tu for mostró:<br/>${logs.map(l => '> ' + l).join('<br/>')}</span>`;
    document.getElementById('ch1').classList.add('success');
    document.getElementById('ch1-status').textContent = '✓ COMPLETADO';
    if (!window._ch1Done) { window._ch1Done = true; retosCompletados++; verificarVictoria(); }
  } else {
    const got = logs.length ? logs.map(l => '> ' + l).join('<br/>') : '(nada)';
    output.innerHTML = `<span style="color:#ff4141">❌ Tu for mostró ${logs.length} líneas. Deben ser 5 productos en orden.<br/>${got}</span>`;
  }
}

// ─────────────────────────
// RETO 02 — Primeros 3 invitados
// ─────────────────────────
function checkReto2() {
  const codigo = document.getElementById('ch2-input').value.trim();
  const output = document.getElementById('ch2-output');
  output.style.display = 'block';

  const invitados = ["Ana", "Luis", "María", "Pedro", "Sofía", "Juan"];
  let logs = [];

  try {
    const fn = new Function('invitados', `
      const __logs = [];
      const console = { log: (...args) => __logs.push(args.join(' ')) };
      ${codigo}
      return __logs;
    `);
    logs = fn(invitados);
  } catch (e) {
    output.innerHTML = `<span style="color:#ff4141">❌ Error en tu código: ${e.message}</span>`;
    return;
  }

  const esperado = ["Ana", "Luis", "María"];
  const correcto =
    logs.length === 3 &&
    esperado.every((p, i) => logs[i] === p);

  if (correcto) {
    output.innerHTML = `<span style="color:#00ff41">✅ ¡Perfecto! Mostraste solo los primeros 3:<br/>${logs.map(l => '> ' + l).join('<br/>')}</span>`;
    document.getElementById('ch2').classList.add('success');
    document.getElementById('ch2-status').textContent = '✓ COMPLETADO';
    if (!window._ch2Done) { window._ch2Done = true; retosCompletados++; verificarVictoria(); }
  } else {
    const got = logs.length ? logs.map(l => '> ' + l).join('<br/>') : '(nada)';
    output.innerHTML = `<span style="color:#ff4141">❌ Tu for mostró ${logs.length} invitados. Pista: cambia la condición del for a i < 3.<br/>${got}</span>`;
  }
}

// ─────────────────────────
// RETO 03 — Buscador de stock
// ─────────────────────────
function checkReto3() {
  const codigo = document.getElementById('ch3-input').value.trim();
  const output = document.getElementById('ch3-output');
  output.style.display = 'block';

  if (!codigo) {
    output.innerHTML = `<span style="color:#ff4141">❌ Escribe tu código primero.</span>`;
    return;
  }

  // Verificaciones básicas de estructura
  const tieneFor       = /for\s*\(/.test(codigo);
  const tieneArray     = /\[.*\]/.test(codigo) && /let\s+\w+\s*=\s*\[/.test(codigo);
  const tieneIf        = /if\s*\(/.test(codigo);
  const tieneConsole   = /console\.log/.test(codigo);
  const tieneNombre    = /let\s+\w+\s*=\s*["']/.test(codigo);
  const tieneComentarios = (codigo.match(/\/\//g) || []).length >= 3;

  const errores = [];
  if (!tieneNombre)      errores.push('Falta una variable con tu nombre (clase 2)');
  if (!tieneArray)       errores.push('Falta el array con productos (clase 7)');
  if (!tieneFor)         errores.push('Falta el for para recorrer el array (clase 8)');
  if (!tieneIf)          errores.push('Falta el if que compara el producto buscado (clase 5)');
  if (!tieneConsole)     errores.push('Falta console.log para mostrar el resultado (clase 1)');
  if (!tieneComentarios) errores.push('Agrega al menos 3 comentarios con // explicando tu código');

  if (errores.length > 0) {
    output.innerHTML = `<span style="color:#ff4141">❌ Revisa estos puntos:<br/>• ${errores.join('<br/>• ')}</span>`;
    return;
  }

  // Ejecutar el código del alumno y extraer el array para el buscador interactivo
  let productosAlumno = [];
  let nombreAlumno = '';
  let logs = [];

  try {
    const fn = new Function(`
      const __logs = [];
      const console = { log: (...args) => __logs.push(args.join(' ')) };
      ${codigo}

      // Intentar extraer variables del scope
      let __arr = null;
      let __nombre = null;

      // Buscar el primer array declarado
      ${codigo.match(/let\s+(\w+)\s*=\s*\[/)?.[0]
        ? `try { __arr = ${codigo.match(/let\s+\w+\s*=\s*(\[[\s\S]*?\])/)?.[1]}; } catch(e) {}`
        : ''}

      return { logs: __logs, arr: __arr, nombre: __nombre };
    `);
    const result = fn();
    logs = result.logs || [];
    productosAlumno = result.arr || [];
  } catch(e) {
    output.innerHTML = `<span style="color:#ff4141">❌ Error al ejecutar tu código: ${e.message}</span>`;
    return;
  }

  // Extraer el array del código del alumno de forma segura
  try {
    const matchArr = codigo.match(/let\s+\w+\s*=\s*(\[[\s\S]*?\])/);
    if (matchArr) {
      productosAlumno = JSON.parse(matchArr[1].replace(/'/g, '"'));
    }
  } catch(e) { /* no critical */ }

  // Extraer nombre
  try {
    const matchNom = codigo.match(/let\s+\w+\s*=\s*["']([^"']+)["']/);
    if (matchNom) nombreAlumno = matchNom[1];
  } catch(e) { /* no critical */ }

  // ¡Éxito!
  output.innerHTML = `<span style="color:#00ff41">✅ ¡Tu buscador está listo, ${nombreAlumno || 'programador'}! Pruébalo abajo.</span>`;
  document.getElementById('ch3').classList.add('success');
  document.getElementById('ch3-status').textContent = '✓ COMPLETADO';

  // Mostrar buscador interactivo con el array del alumno
  const buscadorApp = document.getElementById('buscadorApp');
  buscadorApp.style.display = 'block';
  buscadorApp.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Guardar productos para el buscador
  window._productosAlumno = productosAlumno.length > 0
    ? productosAlumno
    : extraerProductosDeCodigo(codigo);

  // Mostrar el log si lo hay
  if (logs.length > 0) {
    document.getElementById('buscadorLog').innerHTML =
      logs.map(l => `<div class="log-line"><span class="term-prompt">></span> ${l}</div>`).join('');
  }

  if (!window._ch3Done) { window._ch3Done = true; retosCompletados++; verificarVictoria(); }
}

// Extrae productos del código del alumno como fallback
function extraerProductosDeCodigo(codigo) {
  try {
    const m = codigo.match(/\[([^\]]+)\]/);
    if (!m) return [];
    return m[1].split(',').map(s => s.trim().replace(/["']/g, '').trim()).filter(Boolean);
  } catch(e) { return []; }
}

// ─────────────────────────
// BUSCADOR INTERACTIVO
// ─────────────────────────
function buscarProducto() {
  const query = document.getElementById('buscadorInput').value.trim().toLowerCase();
  const resultado = document.getElementById('buscadorResultado');
  const log = document.getElementById('buscadorLog');

  if (!query) {
    resultado.innerHTML = `<span style="color:#ffd700">⚠ Escribe un producto para buscar.</span>`;
    return;
  }

  const productos = window._productosAlumno || [];

  if (productos.length === 0) {
    resultado.innerHTML = `<span style="color:#ff4141">❌ No se pudo leer tu array. Asegúrate de declararlo con let.</span>`;
    return;
  }

  let encontrado = false;
  let htmlLog = '<div style="margin-top:8px;opacity:0.6;font-size:0.85rem">// Simulando el for...</div>';

  for (let i = 0; i < productos.length; i++) {
    const prod = String(productos[i]).toLowerCase();
    const match = prod === query || prod.includes(query);
    htmlLog += `<div class="log-line"><span class="term-prompt">></span> i=${i} → revisando "${productos[i]}" ${match ? '✅ ¡encontrado!' : '❌'}</div>`;
    if (match) { encontrado = true; }
  }

  log.innerHTML = htmlLog;

  if (encontrado) {
    resultado.innerHTML = `<span style="color:#00ff41">✅ "${query}" SÍ está en el stock.</span>`;
  } else {
    resultado.innerHTML = `<span style="color:#ff4141">❌ "${query}" NO está en el stock.</span>`;
  }
}

// Permite buscar con Enter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('buscadorInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') buscarProducto();
    });
  }
});

// ===========================
// VICTORIA
// ===========================
function verificarVictoria() {
  if (retosCompletados >= totalRetos) {
    setTimeout(() => {
      const screen = document.getElementById('completionScreen');
      screen.style.display = 'block';
      screen.scrollIntoView({ behavior: 'smooth' });
      guardarProgreso();
    }, 600);
  }
}

// ===========================
// GUARDAR PROGRESO EN SUPABASE
// ===========================
async function guardarProgreso() {
  try {
    const { data: { user } } = await clienteSupabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await clienteSupabase
      .from('usuarios')
      .select('xp')
      .eq('id', user.id)
      .single();

    const xpActual = userData?.xp || 0;

    await clienteSupabase
      .from('usuarios')
      .update({
        clase8_completada: true,
        xp: xpActual + 150,
        rango: calcularRango({ clase8_completada: true })
      })
      .eq('id', user.id);
  } catch (e) {
    console.log('Error al guardar progreso:', e.message);
  }
}

function calcularRango(data) {
  if (data.clase14_completada) return 'Oro';
  if (data.clase10_completada) return 'Bronce';
  if (data.clase8_completada)  return 'Plata';
  if (data.clase7_completada)  return 'Madera';
  return 'Sin rango';
}

// ===========================
// INICIAR
// ===========================
actualizarProgreso();
renderizarQuiz();
