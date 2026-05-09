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
const secciones = ['sec-intro', 'sec-historia', 'sec-editor', 'sec-explicacion', 'sec-quiz', 'sec-ejercicio'];

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
  const input = document.getElementById('codeInput').value.trim();
  const termBody = document.getElementById('terminalBody');
  const byteReaction = document.getElementById('byteReaction');
  const byteMsg = document.getElementById('byteMsg');

  const productos = ["leche", "pan", "huevo", "agua"];

  const indice = parseInt(input);

  if (isNaN(indice)) {
    termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">Error: escribe un número entre 0 y 3</span>`;
    return;
  }

  if (indice < 0 || indice > 3) {
    termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">Error: índice fuera de rango. El array tiene 4 elementos (0 a 3)</span>`;
    return;
  }

  const resultado = productos[indice];
  termBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#fff">${resultado}</span>`;
  document.getElementById('termStatus').textContent = 'EJECUTADO';

  byteReaction.style.display = 'flex';

  if (indice === 1) {
    byteMsg.textContent = '¡Correcto! productos[1] devuelve "pan". ¡Ya entiendes los índices!';
    document.getElementById('btnSiguienteEditor').style.display = 'block';
  } else {
    byteMsg.textContent = `Bien, productos[${indice}] devuelve "${resultado}". Pero intenta con el índice 1 para continuar.`;
  }
}

function mostrarHint() {
  document.getElementById('hintBox').style.display = 'block';
}

function resetEditor() {
  document.getElementById('codeInput').value = '';
  document.getElementById('terminalBody').innerHTML = `<span class="term-prompt">></span> <span class="term-wait">esperando ejecución...</span>`;
  document.getElementById('termStatus').textContent = 'LISTO';
  document.getElementById('byteReaction').style.display = 'none';
  document.getElementById('hintBox').style.display = 'none';
}

// ===========================
// EXPLICACIÓN — PARTE CARDS
// ===========================
function highlightPart(part) {
  document.querySelectorAll('.part-card').forEach(c => c.classList.remove('active-part'));
  document.getElementById('part-' + part)?.classList.add('active-part');
}

// ===========================
// QUIZ — SECCIÓN 05
// ===========================
const preguntas = [
  {
    pregunta: '¿Qué símbolo se usa para crear un array?',
    opciones: ['{ }', '( )', '[ ]', '< >'],
    correcta: 2
  },
  {
    pregunta: '¿Desde qué número empiezan los índices de un array?',
    opciones: ['1', '0', '-1', '2'],
    correcta: 1
  },
  {
    pregunta: '¿Qué devuelve productos.length si el array tiene 5 elementos?',
    opciones: ['4', '6', '5', '0'],
    correcta: 2
  },
  {
    pregunta: 'Si productos = ["leche", "pan", "huevo"], ¿qué devuelve productos[2]?',
    opciones: ['"leche"', '"pan"', '"huevo"', 'undefined'],
    correcta: 2
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
  }, 1200);
}

function mostrarResultadoQuiz() {
  document.getElementById('quizContainer').style.display = 'none';
  const result = document.getElementById('quizResult');
  result.style.display = 'block';
  document.getElementById('qrScore').textContent = `${puntaje} / ${preguntas.length}`;

  let msg = '';
  if (puntaje === preguntas.length) {
    msg = '🤖 BYTE dice: ¡Perfecto! Dominas los arrays.';
  } else if (puntaje >= 2) {
    msg = '🤖 BYTE dice: Bien. Repasa los índices y sigue adelante.';
  } else {
    msg = '🤖 BYTE dice: Vuelve a la explicación antes de continuar.';
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

// RETO 01
function checkReto1() {
  const linea1 = document.getElementById('ch1-input1').value.trim();
  const linea2 = document.getElementById('ch1-input2').value.trim();
  const output = document.getElementById('ch1-output');
  output.style.display = 'block';

  const productos = ["leche", "pan", "huevo", "agua", "arroz"];

  const ok1 = linea1.includes('productos[2]') || linea1.includes('console.log(productos[2])');
  const ok2 = linea2.includes('productos.length') || linea2.includes('console.log(productos.length)');

  if (ok1 && ok2) {
    output.innerHTML = `<span style="color:#00ff41">✅ Correcto: productos[2] = "${productos[2]}" | productos.length = ${productos.length}</span>`;
    document.getElementById('ch1').classList.add('success');
    document.getElementById('ch1-status').textContent = '✓ COMPLETADO';
    retosCompletados++;
    verificarVictoria();
  } else {
    output.innerHTML = `<span style="color:#ff4141">❌ Revisa: usa productos[2] para el índice y productos.length para el total</span>`;
  }
}

// RETO 02
function checkReto2() {
  const l1 = document.getElementById('ch2-input1').value.trim();
  const l2 = document.getElementById('ch2-input2').value.trim();
  const l3 = document.getElementById('ch2-input3').value.trim();
  const l4 = document.getElementById('ch2-input4').value.trim();
  const output = document.getElementById('ch2-output');
  output.style.display = 'block';

  const ok1 = l1.includes('[') && l1.includes(']') && l1.includes('let');
  const ok2 = l2.includes('[1]') && l2.includes('"miel"');
  const ok3 = l3.includes('.push(') && l3.includes('"vinagre"');
  const ok4 = l4.includes('console.log');

  if (ok1 && ok2 && ok3 && ok4) {
    output.innerHTML = `<span style="color:#00ff41">✅ Correcto: modificaste el array, agregaste "vinagre" y lo mostraste</span>`;
    document.getElementById('ch2').classList.add('success');
    document.getElementById('ch2-status').textContent = '✓ COMPLETADO';
    retosCompletados++;
    verificarVictoria();
  } else {
    let msg = '❌ Revisa: ';
    if (!ok1) msg += 'crea el array con let. ';
    if (!ok2) msg += 'cambia índice 1 a "miel". ';
    if (!ok3) msg += 'usa .push("vinagre"). ';
    if (!ok4) msg += 'muestra el array con console.log. ';
    output.innerHTML = `<span style="color:#ff4141">${msg}</span>`;
  }
}

// RETO 03
function checkReto3() {
  const codigo = document.getElementById('ch3-input').value.trim();
  const output = document.getElementById('ch3-output');
  output.style.display = 'block';

  const tieneArray = codigo.includes('[') && codigo.includes(']') && codigo.includes('let');
  const tieneConsole = codigo.includes('console.log');
  const tieneComentarios = (codigo.match(/\/\//g) || []).length >= 3;
  const tieneLength = codigo.includes('.length');

  if (tieneArray && tieneConsole && tieneComentarios && tieneLength) {
    output.innerHTML = `<span style="color:#00ff41">✅ ¡Excelente! Tu sistema de stock está completo y bien comentado. BYTE está orgulloso.</span>`;
    document.getElementById('ch3').classList.add('success');
    document.getElementById('ch3-status').textContent = '✓ COMPLETADO';
    retosCompletados++;
    verificarVictoria();
  } else {
    let msg = '❌ Falta: ';
    if (!tieneArray) msg += 'crea un array con let. ';
    if (!tieneConsole) msg += 'usa console.log. ';
    if (!tieneComentarios) msg += 'agrega al menos 3 comentarios con //. ';
    if (!tieneLength) msg += 'usa .length. ';
    output.innerHTML = `<span style="color:#ff4141">${msg}</span>`;
  }
}

// ===========================
// VICTORIA
// ===========================
function verificarVictoria() {
  if (retosCompletados >= totalRetos) {
    setTimeout(() => {
      document.getElementById('completionScreen').style.display = 'block';
      document.getElementById('completionScreen').scrollIntoView({ behavior: 'smooth' });
      guardarProgreso();
    }, 500);
  }
}

// ===========================
// GUARDAR PROGRESO EN SUPABASE
// ===========================
async function guardarProgreso() {
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
      clase7_completada: true,
      xp: xpActual + 150,
      rango: calcularRango({ clase7_completada: true })
    })
    .eq('id', user.id);
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
