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
// SECCIÓN 2: LABORATORIO — CARRITO DE COMPRAS
// ===========================
function ejecutarLab() {
  const precioVal = document.getElementById('labPrecio').value.trim();
  const envioVal  = document.getElementById('labEnvio').value.trim();
  const terminal  = document.getElementById('termLab');
  const btnNext   = document.getElementById('btnNextLab');

  if (precioVal === "" || envioVal === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Las variables están vacías. El sistema necesita un precio y un costo de envío.</span>`;
    return;
  }

  const precio = parseFloat(precioVal);
  const envio  = parseFloat(envioVal);

  if (isNaN(precio) || isNaN(envio)) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR DE TIPO: Esos valores no son números válidos. Recuerda: solo dígitos, sin letras ni símbolos.</span>`;
    return;
  }

  const total = precio + envio;

  terminal.innerHTML = `
    <span class="term-prompt">></span> Guardando [ let precio = ${precio} ]... OK.<br/>
    <span class="term-prompt">></span> Guardando [ let envio = ${envio} ]... OK.<br/>
    <span class="term-prompt">></span> Calculando [ let total = ${precio} + ${envio} ]...<br/>
    <span style="color:#00ff41">> El total a cobrar es: $${total}</span>
  `;

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS — PROMEDIO DE LIKES
// ===========================
function checkBug() {
  const inputVal = document.getElementById('bugInput').value.trim();
  const output   = document.getElementById('bugOutput');
  const status   = document.getElementById('bugStatus');
  const btnNext  = document.getElementById('btnNextBug');

  // Evaluar la expresión que escribió el alumno de forma segura
  let resultado;
  try {
    resultado = eval(inputVal);
  } catch (e) {
    output.innerHTML = `<span style="color:#ff4141">> ERROR DE SINTAXIS: Revisa que los paréntesis estén bien cerrados.</span>`;
    output.style.display = 'block';
    return;
  }

  if (resultado === 200) {
    output.innerHTML = `
      <span style="color:#00ff41">¡BUG ELIMINADO! Promedio correcto: 200.</span><br/>
      Al agrupar los tres números con paréntesis <strong>(100 + 200 + 300)</strong>, la suma ocurrió primero y luego se dividió entre 3. ¡Así funciona la prioridad matemática!
    `;
    status.textContent = "SOLUCIONADO";
    status.style.color = "#00ff41";
    document.getElementById('ch-bug').classList.add('success');
    btnNext.style.display = 'block';
  } else if (resultado === 400) {
    output.innerHTML = `
      <span style="color:#ff4141">> RESULTADO EN CONSOLA: 400. ¡Incorrecto!</span><br/>
      La computadora hizo primero <strong>300 / 3 = 100</strong> y luego sumó todo. Agrega paréntesis alrededor de los tres números para que se sumen primero.
    `;
  } else {
    output.innerHTML = `
      <span style="color:#ff4141">> Resultado: ${resultado}. Ese no es el correcto.</span><br/>
      El resultado esperado es <strong>200</strong>. Asegúrate de solo agregar paréntesis, no cambiar los números.
    `;
  }

  output.style.display = 'block';
}

// ===========================
// SECCIÓN 4: RETO FINAL — CREADOR DE PERSONAJES
// ===========================
function ejecutarJuego() {
  const code          = document.getElementById('gameEditor').value;
  const terminal      = document.getElementById('termGame');
  const victoryScreen = document.getElementById('victoryClase3');

  const hasLet        = code.includes('let');
  const hasNombre     = code.includes('nombre');
  const hasClase      = code.includes('clase');
  const hasVida       = code.includes('vida');
  const hasAtaque     = code.includes('ataqueBase');
  const hasNivel      = code.includes('nivel');
  const hasDanio      = code.includes('danioTotal');
  const hasMulti      = code.includes('*');
  const hasConsoleLog = code.includes('console.log');
  const hasQuotes     = code.includes('"') || code.includes("'");

  if (code.trim() === "") {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: El archivo está vacío. Lee los comentarios y empieza a escribir tu código.</span>`;
    return;
  }
  if (!hasLet) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR DE SINTAXIS: Falta la palabra clave 'let' para crear variables.</span>`;
    return;
  }
  if (!hasNombre || !hasClase) {
    terminal.innerHTML = `<span style="color:#ff4141">> ALERTA: Faltan las variables de texto. Necesitas 'nombre' y 'clase' entre comillas.</span>`;
    return;
  }
  if (!hasQuotes) {
    terminal.innerHTML = `<span style="color:#ff4141">> BUG: Los textos deben ir entre comillas "". Sin ellas la máquina no sabe que son palabras.</span>`;
    return;
  }
  if (!hasVida || !hasAtaque || !hasNivel) {
    terminal.innerHTML = `<span style="color:#ff4141">> ALERTA: Faltan variables numéricas. Necesitas 'vida', 'ataqueBase' y 'nivel' sin comillas.</span>`;
    return;
  }
  if (!hasMulti || !hasDanio) {
    terminal.innerHTML = `<span style="color:#ff4141">> ALERTA: Falta calcular el daño. Crea la variable 'danioTotal' multiplicando ataqueBase * nivel.</span>`;
    return;
  }
  if (!hasConsoleLog) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Creaste todo, pero falta imprimirlo. Usa console.log() para mostrar la ficha.</span>`;
    return;
  }

  // Extraer valores del código para mostrarlos en la terminal
  const nombreMatch = code.match(/let\s+nombre\s*=\s*["'](.+?)["']/);
  const claseMatch  = code.match(/let\s+clase\s*=\s*["'](.+?)["']/);
  const vidaMatch   = code.match(/let\s+vida\s*=\s*(\d+)/);
  const ataqueMatch = code.match(/let\s+ataqueBase\s*=\s*(\d+)/);
  const nivelMatch  = code.match(/let\s+nivel\s*=\s*(\d+)/);

  const nombreVal = nombreMatch ? nombreMatch[1] : "Desconocido";
  const claseVal  = claseMatch  ? claseMatch[1]  : "Sin clase";
  const vidaVal   = vidaMatch   ? vidaMatch[1]   : "?";
  const ataqueVal = ataqueMatch ? parseInt(ataqueMatch[1]) : 0;
  const nivelVal  = nivelMatch  ? parseInt(nivelMatch[1])  : 0;
  const danioVal  = ataqueVal * nivelVal;

  terminal.innerHTML = `
    <span class="term-prompt">></span> Compilando ficha de personaje...<br/>
    <span class="term-prompt">></span> Variables de texto detectadas... OK.<br/>
    <span class="term-prompt">></span> Variables numéricas detectadas... OK.<br/>
    <span class="term-prompt">></span> Calculando daño: ${ataqueVal} * ${nivelVal} = ${danioVal}... OK.<br/>
    <br/>
    <span style="color:#00ff41">=== FICHA DE PERSONAJE ===</span><br/>
    <span style="color:#00ff41">Nombre    : ${nombreVal}</span><br/>
    <span style="color:#00ff41">Clase     : ${claseVal}</span><br/>
    <span style="color:#00ff41">Vida      : ${vidaVal} HP</span><br/>
    <span style="color:#00ff41">Daño Total: ${danioVal} pts</span><br/>
    <span style="color:#00ff41">========================</span>
  `;

  setTimeout(async () => {
    document.querySelector('.editor-wrap').style.display = 'none';
    victoryScreen.style.display = 'block';
    victoryScreen.scrollIntoView({ behavior: 'smooth' });

    // Guarda el progreso en Supabase usando la función de supabase.js
    await guardarProgreso({ clase3_completada: true });
  }, 1500);
}

// ===========================
// PISTA DEL RETO FINAL
// ===========================
function mostrarPista() {
  alert(
    "PISTA:\n\n" +
    "let nombre = \"Shadow\";\n" +
    "let clase = \"Mago Oscuro\";\n" +
    "let vida = 80;\n" +
    "let ataqueBase = 15;\n" +
    "let nivel = 3;\n" +
    "let danioTotal = ataqueBase * nivel;\n\n" +
    "console.log(\"Nombre:\", nombre);\n" +
    "console.log(\"Daño Total:\", danioTotal);"
  );
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
