// ===========================
// NAVEGACIÓN Y PROGRESO
// ===========================
const totalSections = 4;
const sectionIds = ['sec-intro', 'sec-lab', 'sec-bug', 'sec-game'];

function goTo(targetId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const currentIndex = sectionIds.indexOf(targetId) + 1;
  const progressPercent = Math.floor((currentIndex / totalSections) * 100);

  document.getElementById('progressBar').style.width = progressPercent + '%';
  document.getElementById('progressLabel').textContent = progressPercent + '%';
}

// ===========================
// SECCIÓN 2: LABORATORIO — SISTEMA DE ALERTAS
// ===========================
function ejecutarLab() {
  const tempVal  = document.getElementById('labTemp').value.trim();
  const terminal = document.getElementById('termLab');
  const btnNext  = document.getElementById('btnNextLab');

  if (tempVal === '') {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Debes ingresar la temperatura del servidor antes de ejecutar.</span>`;
    return;
  }

  const temperatura = parseFloat(tempVal);

  if (isNaN(temperatura)) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Eso no es una temperatura válida. Escribe solo un número.</span>`;
    return;
  }

  const limiteMaximo = 80;
  const esCritica = temperatura > limiteMaximo;

  const color   = esCritica ? '#ff4141' : '#00ff41';
  const mensaje = esCritica
    ? '🔴 ALERTA: Temperatura crítica. Apagando núcleo.'
    : '🟢 Sistema estable. Temperatura dentro del rango.';

  terminal.innerHTML = `
    <span class="term-prompt">></span> Leyendo sensor de temperatura...<br/>
    <span class="term-prompt">></span> temperatura = <strong>${temperatura}</strong> | limiteMaximo = <strong>${limiteMaximo}</strong><br/>
    <span class="term-prompt">></span> Evaluando: ${temperatura} > ${limiteMaximo} → <strong style="color:${color}">${esCritica}</strong><br/>
    <br/>
    <span style="color:${color}">> ${mensaje}</span>
  `;

  if (!esCritica) {
    terminal.innerHTML += `<br/><span style="color:#dcdcaa">> PISTA: Prueba con un número mayor a ${limiteMaximo} para ver la alerta roja.</span>`;
  }

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS — LA PUERTA ROTA
// ===========================
function checkBug() {
  const inputVal = document.getElementById('bugInput').value.trim();
  const output   = document.getElementById('bugOutput');
  const status   = document.getElementById('bugStatus');
  const btnNext  = document.getElementById('btnNextBug');

  if (inputVal === '{') {
    output.innerHTML = `
      <span style="color:#00ff41">¡BUG ELIMINADO! La puerta responde correctamente.</span><br/>
      Ahora el bloque <strong>if (tienePase == true) { ... }</strong> está bien formado.<br/>
      La llave de apertura <strong style="color:#00ff41">{</strong> le indica a JavaScript dónde empieza la acción del if. ¡Acceso concedido!
    `;
    status.textContent = 'PUERTA ABIERTA';
    status.style.color = '#00ff41';
    document.getElementById('ch-bug').classList.add('success');
    btnNext.style.display = 'block';
  } else if (inputVal === '}') {
    output.innerHTML = `
      <span style="color:#ff4141">> Eso es una llave de cierre. Ya existe al final del bloque.</span><br/>
      Necesitas la llave de <strong>apertura</strong>: <strong>{</strong> (sin la barra)
    `;
  } else if (inputVal === '()' || inputVal === '(' || inputVal === ')') {
    output.innerHTML = `
      <span style="color:#ff4141">> Los paréntesis ya están en la condición. Lo que falta va después de ellos.</span><br/>
      Escribe la llave de apertura: <strong>{</strong>
    `;
  } else if (inputVal === '') {
    output.innerHTML = `<span style="color:#ff4141">> Escribe algo en el campo antes de comprobar.</span>`;
  } else {
    output.innerHTML = `
      <span style="color:#ff4141">> "${inputVal}" no es lo que falta.</span><br/>
      Pista: busca el símbolo que abre un bloque de código en JavaScript. Es una llave: <strong>{</strong>
    `;
  }

  output.style.display = 'block';
}

// ===========================
// SECCIÓN 4: RETO FINAL — CLASIFICADOR DE HACKERS
// ===========================
function ejecutarJuego() {
  const code          = document.getElementById('gameEditor').value;
  const terminal      = document.getElementById('termGame');
  const victoryScreen = document.getElementById('victoryClase5');

  // Validaciones básicas de estructura
  if (code.trim() === '') {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: El archivo está vacío. Lee los pasos y empieza a escribir.</span>`;
    return;
  }
  if (!code.includes('let')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la palabra clave 'let' para declarar variables.</span>`;
    return;
  }
  if (!code.includes('nombreHacker')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la variable 'nombreHacker'. Crea una con tu nombre entre comillas.</span>`;
    return;
  }
  if (!code.includes('puntaje')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la variable 'puntaje'. Ponle un número cualquiera.</span>`;
    return;
  }
  if (!code.includes('if')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta el condicional 'if'. Úsalo para clasificar el puntaje.</span>`;
    return;
  }
  if (!code.includes('else')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Necesitas al menos un 'else' para cubrir los demás casos.</span>`;
    return;
  }
  if (!code.includes('console.log')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta console.log() para mostrar el resultado.</span>`;
    return;
  }

  // Extraer valores con regex
  const nombreMatch  = code.match(/let\s+nombreHacker\s*=\s*["'`](.+?)["'`]/);
  const puntajeMatch = code.match(/let\s+puntaje\s*=\s*(\d+)/);

  const nombre   = nombreMatch  ? nombreMatch[1]       : 'Hacker';
  const puntaje  = puntajeMatch ? parseInt(puntajeMatch[1]) : null;

  if (puntaje === null) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: No pude leer el valor de 'puntaje'. Asegúrate de escribir un número entero directamente, por ejemplo: let puntaje = 750;</span>`;
    return;
  }

  // Clasificación
  let rango, rangoColor;
  if (puntaje > 1000) {
    rango      = 'Élite';
    rangoColor = '#ff4141';
  } else if (puntaje > 500) {
    rango      = 'Avanzado';
    rangoColor = '#dcdcaa';
  } else {
    rango      = 'Novato';
    rangoColor = '#00ff41';
  }

  terminal.innerHTML = `
    <span class="term-prompt">></span> Iniciando clasificación de hacker...<br/>
    <span class="term-prompt">></span> nombreHacker = <strong>"${nombre}"</strong><br/>
    <span class="term-prompt">></span> puntaje = <strong>${puntaje}</strong><br/>
    <span class="term-prompt">></span> Evaluando condicionales...<br/>
    <span class="term-prompt">></span> puntaje > 1000 → <strong>${puntaje > 1000}</strong><br/>
    <span class="term-prompt">></span> puntaje > 500 &nbsp;→ <strong>${puntaje > 500}</strong><br/>
    <br/>
    <span style="color:${rangoColor}; font-size: 1.1em;">
      > ${nombre} — Rango: <strong>${rango}</strong>
    </span>
  `;

  // Mostrar pantalla de victoria
  setTimeout(async () => {
    document.querySelector('.editor-wrap').style.display = 'none';
    victoryScreen.style.display = 'block';
    victoryScreen.scrollIntoView({ behavior: 'smooth' });

    // Guardar progreso en Supabase si la función existe
    if (typeof guardarProgreso === 'function') {
      await guardarProgreso({ clase5_completada: true });
    }
  }, 1500);
}

// ===========================
// PISTA DEL RETO FINAL
// ===========================
function mostrarPista() {
  alert(
    "PISTA — Clasificador de Hackers:\n\n" +
    "let nombreHacker = \"Neo\";\n" +
    "let puntaje = 750;\n\n" +
    "if (puntaje > 1000) {\n" +
    "  let rango = \"Élite\";\n" +
    "  console.log(nombreHacker, \"— Rango:\", rango);\n" +
    "} else if (puntaje > 500) {\n" +
    "  let rango = \"Avanzado\";\n" +
    "  console.log(nombreHacker, \"— Rango:\", rango);\n" +
    "} else {\n" +
    "  let rango = \"Novato\";\n" +
    "  console.log(nombreHacker, \"— Rango:\", rango);\n" +
    "}"
  );
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
