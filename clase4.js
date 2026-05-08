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
// SECCIÓN 2: LABORATORIO — CONTROL DE ACCESO
// ===========================
function ejecutarLab() {
  const edadVal    = document.getElementById('labEdad').value.trim();
  const operador   = document.getElementById('labOperador').value;
  const terminal   = document.getElementById('termLab');
  const btnNext    = document.getElementById('btnNextLab');

  if (edadVal === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Debes escribir la edad del usuario antes de ejecutar.</span>`;
    return;
  }
  if (operador === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Selecciona un operador de comparación para que el sistema pueda evaluar.</span>`;
    return;
  }

  const edad = parseFloat(edadVal);
  if (isNaN(edad)) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Eso no es una edad válida. Escribe solo un número.</span>`;
    return;
  }

  const edadMinima = 18;
  let puedeEntrar;

  if (operador === ">")  puedeEntrar = edad > edadMinima;
  if (operador === ">=") puedeEntrar = edad >= edadMinima;
  if (operador === "<")  puedeEntrar = edad < edadMinima;
  if (operador === "==") puedeEntrar = edad == edadMinima;

  const color     = puedeEntrar ? "#00ff41" : "#ff4141";
  const mensaje   = puedeEntrar
    ? "ACCESO CONCEDIDO. El usuario cumple los requisitos."
    : "ACCESO DENEGADO. El usuario no cumple los requisitos.";
  const esCorrectoOperador = operador === ">=";

  terminal.innerHTML = `
    <span class="term-prompt">></span> Evaluando [ let edadUsuario = ${edad} ]...<br/>
    <span class="term-prompt">></span> Comparando [ ${edad} ${operador} ${edadMinima} ]...<br/>
    <span class="term-prompt">></span> ¿Puede entrar al sistema? <strong style="color:${color}">${puedeEntrar}</strong><br/>
    <br/>
    <span style="color:${color}">> ${mensaje}</span>
  `;

  if (!esCorrectoOperador) {
    terminal.innerHTML += `<br/><span style="color:#dcdcaa">> NOTA: El operador correcto para "mayor o igual a 18" sería >=. Prueba a cambiarlo y observa la diferencia.</span>`;
  }

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS — EL GEMELO MALVADO
// ===========================
function checkBug() {
  const inputVal = document.getElementById('bugInput').value.trim();
  const output   = document.getElementById('bugOutput');
  const status   = document.getElementById('bugStatus');
  const btnNext  = document.getElementById('btnNextBug');

  if (inputVal === "==") {
    output.innerHTML = `
      <span style="color:#00ff41">¡BUG ELIMINADO! Sistema de claves reparado.</span><br/>
      Ahora el código compara si <strong>claveIngresada == claveSecreta</strong>.<br/>
      Como ambas son "Matrix2024", el resultado es: <strong style="color:#00ff41">true</strong>. ¡Acceso correcto!
    `;
    status.textContent = "SOLUCIONADO";
    status.style.color = "#00ff41";
    document.getElementById('ch-bug').classList.add('success');
    btnNext.style.display = 'block';
  } else if (inputVal === "=") {
    output.innerHTML = `
      <span style="color:#ff4141">> FALLO DE SEGURIDAD ACTIVO.</span><br/>
      Con un solo <strong>=</strong> estás <em>guardando</em> claveSecreta dentro de claveIngresada, no comparándolas.<br/>
      El sistema aceptaría cualquier clave. Agrega un segundo igual: <strong>==</strong>
    `;
  } else if (inputVal === "===") {
    output.innerHTML = `
      <span style="color:#dcdcaa">> Casi. <strong>===</strong> también compara, pero es más estricto.</span><br/>
      Para esta clase usamos <strong>==</strong>. Quita un igual y prueba de nuevo.
    `;
  } else {
    output.innerHTML = `
      <span style="color:#ff4141">> Ese operador no es correcto.</span><br/>
      Recuerda: necesitas exactamente dos iguales juntos: <strong>==</strong>
    `;
  }

  output.style.display = 'block';
}

// ===========================
// SECCIÓN 4: RETO FINAL — EL MARCADOR
// ===========================
function ejecutarJuego() {
  const code          = document.getElementById('gameEditor').value;
  const terminal      = document.getElementById('termGame');
  const victoryScreen = document.getElementById('victoryClase4');

  const hasLet          = code.includes('let');
  const hasRecord       = code.includes('recordActual');
  const hasKills        = code.includes('kills');
  const hasMulti        = code.includes('multiplicador');
  const hasPuntaje      = code.includes('puntajeFinal');
  const hasNuevoRecord  = code.includes('nuevoRecord');
  const hasOperador     = code.includes('>') || code.includes('<') || code.includes('==');
  const hasMultiplicar  = code.includes('*');
  const hasConsoleLog   = code.includes('console.log');

  if (code.trim() === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: El archivo está vacío. Lee los pasos y empieza a escribir.</span>`;
    return;
  }
  if (!hasLet) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la palabra clave 'let' para crear variables.</span>`;
    return;
  }
  if (!hasRecord) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la variable 'recordActual'. Es el puntaje a superar.</span>`;
    return;
  }
  if (!hasKills || !hasMulti) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Faltan tus estadísticas. Necesitas las variables 'kills' y 'multiplicador'.</span>`;
    return;
  }
  if (!hasMultiplicar || !hasPuntaje) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta calcular tu 'puntajeFinal'. Recuerda multiplicar kills * multiplicador.</span>`;
    return;
  }
  if (!hasOperador || !hasNuevoRecord) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la comparación. Crea la variable 'nuevoRecord' usando el operador >.</span>`;
    return;
  }
  if (!hasConsoleLog) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta imprimir los resultados. Usa console.log() para mostrarlos.</span>`;
    return;
  }

  // Extraer valores con regex
  const recordMatch  = code.match(/let\s+recordActual\s*=\s*(\d+)/);
  const killsMatch   = code.match(/let\s+kills\s*=\s*(\d+)/);
  const multiMatch   = code.match(/let\s+multiplicador\s*=\s*(\d+)/);

  const recordVal  = recordMatch  ? parseInt(recordMatch[1])  : 5000;
  const killsVal   = killsMatch   ? parseInt(killsMatch[1])   : 0;
  const multiVal   = multiMatch   ? parseInt(multiMatch[1])   : 1;
  const puntajeVal = killsVal * multiVal;
  const esRecord   = puntajeVal > recordVal;

  const colorRecord = esRecord ? "#00ff41" : "#ff4141";
  const mensajeRecord = esRecord
    ? "¡NUEVO RÉCORD REGISTRADO EN EL SERVIDOR!"
    : `No superaste el récord aún. Necesitas más de ${recordVal} puntos.`;

  terminal.innerHTML = `
    <span class="term-prompt">></span> Procesando estadísticas de combate...<br/>
    <span class="term-prompt">></span> kills = ${killsVal} &nbsp;|&nbsp; multiplicador = ${multiVal}<br/>
    <span class="term-prompt">></span> puntajeFinal = ${killsVal} * ${multiVal} = <strong>${puntajeVal}</strong><br/>
    <span class="term-prompt">></span> Comparando: ${puntajeVal} > ${recordVal}...<br/>
    <span class="term-prompt">></span> nuevoRecord = <strong style="color:${colorRecord}">${esRecord}</strong><br/>
    <br/>
    <span style="color:${colorRecord}">> ${mensajeRecord}</span>
  `;

  if (!esRecord) {
    terminal.innerHTML += `<br/><span style="color:#dcdcaa">> PISTA: Sube el número de kills o el multiplicador para superar ${recordVal} puntos.</span>`;
    return;
  }

  setTimeout(async () => {
    document.querySelector('.editor-wrap').style.display = 'none';
    victoryScreen.style.display = 'block';
    victoryScreen.scrollIntoView({ behavior: 'smooth' });

    await guardarProgreso({ clase4_completada: true });
  }, 1500);
}

// ===========================
// PISTA DEL RETO FINAL
// ===========================
function mostrarPista() {
  alert(
    "PISTA:\n\n" +
    "let recordActual = 5000;\n" +
    "let kills = 300;\n" +
    "let multiplicador = 2;\n" +
    "let puntajeFinal = kills * multiplicador;\n" +
    "let nuevoRecord = puntajeFinal > recordActual;\n\n" +
    "console.log(\"Tu puntaje:\", puntajeFinal);\n" +
    "console.log(\"¿Nuevo récord?:\", nuevoRecord);"
  );
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
