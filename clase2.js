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
// SECCIÓN 2: LABORATORIO GUIADO
// ===========================
function ejecutarLab() {
  const nombre = document.getElementById('labNombre').value.trim();
  const rango  = document.getElementById('labRango').value.trim();
  const terminal = document.getElementById('termLab');
  const btnNext  = document.getElementById('btnNextLab');

  if (nombre === "" || rango === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Las variables no pueden estar vacías. El sistema requiere datos.</span>`;
    return;
  }

  terminal.innerHTML = `
    <span class="term-prompt">></span> Guardando [ let nombre = "${nombre}" ]... OK.<br/>
    <span class="term-prompt">></span> Guardando [ let rango = "${rango}" ]... OK.<br/>
    <span style="color:#00ff41">> Bienvenido, ${nombre}. Se han detectado permisos de ${rango}.</span>
  `;

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS
// ===========================
function checkBug() {
  const inputVal = document.getElementById('bugInput').value.trim();
  const output   = document.getElementById('bugOutput');
  const status   = document.getElementById('bugStatus');
  const btnNext  = document.getElementById('btnNextBug');

  if (inputVal === "10") {
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
    output.innerHTML = `
      <span style="color:#ff4141">RESULTADO EN CONSOLA: 105.</span><br/>
      JavaScript creyó que el 10 era una palabra y le pegó el 5 al lado. ¡Tienes que quitarle las comillas!
    `;
  } else {
    output.innerHTML = `<span style="color:#ff4141">Ese no es el código original. Solo debías quitarle las comillas al 10.</span>`;
  }

  output.style.display = "block";
}

// ===========================
// SECCIÓN 4: MINI-JUEGO (HACKEO VIP)
// ===========================
function ejecutarJuego() {
  const code     = document.getElementById('gameEditor').value;
  const terminal = document.getElementById('termGame');
  const victoryScreen = document.getElementById('victoryClase2');

  const hasLet        = code.includes('let');
  const hasAlias      = code.includes('alias');
  const hasRango      = code.includes('rango');
  const hasConsoleLog = code.includes('console.log');
  const hasQuotes     = code.includes('"') || code.includes("'");

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

  terminal.innerHTML = `
    <span class="term-prompt">></span> Compilando código de infiltración...<br/>
    <span class="term-prompt">></span> Variables [alias] y [rango] detectadas...<br/>
    <span class="term-prompt">></span> Ejecutando impresión...<br/>
    <span style="color:#00ff41">> [SISTEMA VULNERADO]: Identidad aceptada. Pase VIP generado con éxito.</span>
  `;

  setTimeout(async () => {
    document.querySelector('.editor-wrap').style.display = 'none';
    victoryScreen.style.display = 'block';
    victoryScreen.scrollIntoView({ behavior: 'smooth' });

    // Usa guardarProgreso() de supabase.js
    await guardarProgreso({ clase2_completada: true });
  }, 1500);
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
