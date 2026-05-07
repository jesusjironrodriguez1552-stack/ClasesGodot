// ===========================
// NAVEGACIÓN Y PROGRESO
// ===========================
const totalSections = 3;
const sectionIds = ['sec-intro', 'sec-editor', 'sec-cazador'];

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
// SECCIÓN 2: LABORATORIO DE VARIABLES
// ===========================
function ejecutarClase2() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const edad = document.getElementById('inputEdad').value.trim();
  const terminal = document.getElementById('termClase2');
  const btnNext = document.getElementById('btnNextClase2');

  // Validación básica
  if (nombre === "" || edad === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: No puedes dejar las cajas de memoria vacías. BYTE necesita datos.</span>`;
    return;
  }

  // Verificar si la edad es un número
  if (isNaN(edad)) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR DE TIPO: La edad debe ser un número sin comillas.</span>`;
    return;
  }

  // Simulación de guardado en memoria
  terminal.innerHTML = `
    <span class="term-prompt">></span> Accediendo a memoria RAM...<br/>
    <span class="term-prompt">></span> Guardando variable [nombre] = "${nombre}"...<br/>
    <span class="term-prompt">></span> Guardando variable [edad] = ${edad}...<br/>
    <span style="color:#00ff41">> ÉXITO: BYTE ahora te conoce. "Hola ${nombre}, guardaré tus ${edad} años en mi base de datos."</span>
  `;

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS (EL DESAFÍO)
// ===========================
function checkBugClase2() {
  const inputVal = document.getElementById('bug-input').value.trim();
  const output = document.getElementById('bug-output');
  const status = document.getElementById('bug-status');
  const finalScreen = document.getElementById('finalClase2');

  // El error original es "10" (con comillas). La solución es 10 (sin comillas).
  if (inputVal === "10") {
    // ÉXITO
    output.innerHTML = `
      <span style="color:#00ff41">¡SÍ! BUG ELIMINADO.</span><br/>
      Al quitar las comillas, convertiste el texto en un <strong>Número</strong>.<br/>
      Ahora la operación es: 10 + 5 = 15.
    `;
    status.textContent = "SOLUCIONADO";
    status.style.color = "#00ff41";
    output.style.display = "block";
    
    // Mostrar pantalla final después de un pequeño delay
    setTimeout(() => {
      finalScreen.style.display = 'block';
      finalScreen.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

  } else if (inputVal === '"10"' || inputVal === "'10'") {
    // SIGUE EL ERROR
    output.innerHTML = `
      <span style="color:#ff4141">EL BUG PERSISTE:</span><br/>
      Resultado: "10" + 5 = 105.<br/>
      JavaScript está uniendo los textos en lugar de sumar. ¡Quita esas comillas!
    `;
    output.style.display = "block";
  } else {
    // SE EQUIVOCÓ DE NÚMERO O BORRÓ TODO
    output.innerHTML = `<span style="color:#ff4141">¿Qué hiciste? El valor original era 10. Solo debías quitarle las comillas.</span>`;
    output.style.display = "block";
  }
}

// Inicializar
window.onload = () => {
  // Asegurarnos de que el progreso empiece en la primera sección
  document.getElementById('progressBar').style.width = '33%';
  document.getElementById('progressLabel').textContent = '33%';
};
