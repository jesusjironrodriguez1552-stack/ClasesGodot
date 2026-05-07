// ===========================
// NAVEGACIÓN Y PROGRESO
// ===========================
const totalSections = 4;
const sectionIds = ['sec-intro', 'sec-lab', 'sec-bug', 'sec-game'];

function goTo(targetId) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  // Mostrar la solicitada
  document.getElementById(targetId).classList.add('active');
  // Subir al tope suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Actualizar barra de progreso
  const currentIndex = sectionIds.indexOf(targetId) + 1;
  const progressPercent = Math.floor((currentIndex / totalSections) * 100);
  
  document.getElementById('progressBar').style.width = progressPercent + '%';
  document.getElementById('progressLabel').textContent = progressPercent + '%';
}

// ===========================
// SECCIÓN 2: LABORATORIO GUIADO
// ===========================
function ejecutarLab() {
  const nombre = document.getElementById('labNombre').value.trim();
  const rango = document.getElementById('labRango').value.trim();
  const terminal = document.getElementById('termLab');
  const btnNext = document.getElementById('btnNextLab');

  if (nombre === "" || rango === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Las variables no pueden estar vacías. El sistema requiere datos.</span>`;
    return;
  }

  // Simulamos que la máquina procesa las variables
  terminal.innerHTML = `
    <span class="term-prompt">></span> Guardando [ let nombre = "${nombre}" ]... OK.<br/>
    <span class="term-prompt">></span> Guardando [ let rango = "${rango}" ]... OK.<br/>
    <span style="color:#00ff41">> Bienvenido, ${nombre}. Se han detectado permisos de ${rango}.</span>
  `;

  // Mostramos el botón para avanzar
  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS
// ===========================
function checkBug() {
  const inputVal = document.getElementById('bugInput').value.trim();
  const output = document.getElementById('bugOutput');
  const status = document.getElementById('bugStatus');
  const btnNext = document.getElementById('btnNextBug');

  // Evaluar la respuesta
  if (inputVal === "10") {
    // CORRECTO: Quitó las comillas
    output.innerHTML = `
      <span style="color:#00ff41">¡SÍ! BUG ELIMINADO.</span><br/>
      Al quitar las comillas, le dijiste a la computadora que es un <strong>Número</strong> real.<br/>
      Ahora sí hace matemáticas: 10 + 5 = 15.
    `;
    status.textContent = "SOLUCIONADO";
    status.style.color = "#00ff41";
    document.getElementById('ch-bug').classList.add('success');
    btnNext.style.display = "block";

  } else if (inputVal === '"10"' || inputVal === "'10'") {
    // ERROR: Dejó las comillas
    output.innerHTML = `
      <span style="color:#ff4141">RESULTADO EN CONSOLA: 105.</span><br/>
      JavaScript creyó que el 10 era una palabra y le pegó el 5 al lado. ¡Tienes que quitarle las comillas!
    `;
  } else {
    // ERROR: Cambió el número por otra cosa
    output.innerHTML = `<span style="color:#ff4141">Ese no es el código original. Solo debías quitarle las comillas al 10.</span>`;
  }
  
  output.style.display = "block";
}

// ===========================
// SECCIÓN 4: MINI-JUEGO (HACKEO VIP)
// ===========================
function ejecutarJuego() {
  const code = document.getElementById('gameEditor').value;
  const terminal = document.getElementById('termGame');
  const victoryScreen = document.getElementById('victoryClase2');

  // Validaciones del código del alumno
  const hasLet = code.includes('let');
  const hasAlias = code.includes('alias');
  const hasRango = code.includes('rango');
  const hasConsoleLog = code.includes('console.log');
  const hasQuotes = code.includes('"') || code.includes("'");

  if (code.trim() === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: El archivo está vacío. Escribe tu código.</span>`;
    return;
  }

  if (!hasLet) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR DE SINTAXIS: Falta la palabra clave 'let' para crear variables.</span>`;
    return;
  }

  if (!hasAlias || !hasRango) {
    terminal.innerHTML = `<span style="color:#ff4141">> ALERTA DEL SISTEMA: Debes crear las variables exactas 'alias' y 'rango'.</span>`;
    return;
  }

  if (!hasQuotes) {
    terminal.innerHTML = `<span style="color:#ff4141">> BUG: Recuerda que los Textos (Strings) deben ir entre comillas "".</span>`;
    return;
  }

  if (!hasConsoleLog) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Creaste las variables, pero falta imprimirlas. Usa console.log() para engañar al sistema.</span>`;
    return;
  }

  // Si pasó todas las validaciones, ¡Victoria!
  terminal.innerHTML = `
    <span class="term-prompt">></span> Compilando código de infiltración...<br/>
    <span class="term-prompt">></span> Variables [alias] y [rango] detectadas...<br/>
    <span class="term-prompt">></span> Ejecutando impresión...<br/>
    <span style="color:#00ff41">> [SISTEMA VULNERADO]: Identidad aceptada. Pase VIP generado con éxito.</span>
  `;

  // Mostrar la pantalla final con un poco de retraso
  setTimeout(() => {
    document.querySelector('.editor-wrap').style.display = 'none'; // Ocultamos el editor para limpiar la pantalla
    victoryScreen.style.display = 'block';
    victoryScreen.scrollIntoView({ behavior: 'smooth' });
  }, 1500);
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  // Inicializamos el progreso en el 25% (Sección 1)
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
