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
// MODAL DE PISTA
// ===========================
function mostrarPista() {
  document.getElementById('modalContenido').innerHTML = `
    <div class="pista-code">
      <span class="comment">// PASO 1 y 2: Variables</span><br/>
      <span class="kw">let</span> usuarioCorrecto = <span class="val-str">"admin"</span>;<br/>
      <span class="kw">let</span> clavecorrecta = <span class="val-str">"1234"</span>;<br/>
      <span class="kw">let</span> usuarioIngresado = <span class="val-str">"admin"</span>;<br/>
      <span class="kw">let</span> claveIngresada = <span class="val-str">"0000"</span>;<br/>
      <br/>
      <span class="comment">// PASO 3: Booleanos de comparación</span><br/>
      <span class="kw">let</span> usuarioOk = usuarioIngresado == usuarioCorrecto;<br/>
      <span class="kw">let</span> claveOk = claveIngresada == clavecorrecta;<br/>
      <br/>
      <span class="comment">// PASO 4: Los 4 casos con if / else if / else</span><br/>
      <span class="kw">if</span> (usuarioOk &amp;&amp; claveOk) {<br/>
      &nbsp;&nbsp;<span class="kw">console.log</span>(<span class="val-str">"✅ Acceso concedido."</span>);<br/>
      } <span class="kw">else if</span> (usuarioOk) {<br/>
      &nbsp;&nbsp;<span class="kw">console.log</span>(<span class="val-str">"❌ Contraseña incorrecta."</span>);<br/>
      } <span class="kw">else if</span> (claveOk) {<br/>
      &nbsp;&nbsp;<span class="kw">console.log</span>(<span class="val-str">"❌ Usuario no encontrado."</span>);<br/>
      } <span class="kw">else</span> {<br/>
      &nbsp;&nbsp;<span class="kw">console.log</span>(<span class="val-str">"🔴 Usuario y contraseña incorrectos."</span>);<br/>
      }
    </div>
  `;
  document.getElementById('modalPista').style.display = 'flex';
}

function cerrarPista() {
  document.getElementById('modalPista').style.display = 'none';
}

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarPista();
});

// ===========================
// SECCIÓN 2: LABORATORIO — SEMÁFORO
// ===========================
function ejecutarLab() {
  const velVal  = document.getElementById('labVel').value.trim();
  const terminal = document.getElementById('termLab');
  const btnNext  = document.getElementById('btnNextLab');

  if (velVal === '') {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Ingresa la velocidad del vehículo antes de ejecutar.</span>`;
    return;
  }

  const velocidad = parseFloat(velVal);

  if (isNaN(velocidad) || velocidad < 0) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Eso no es una velocidad válida. Escribe un número positivo.</span>`;
    return;
  }

  let mensaje, color, ruta;

  if (velocidad <= 60) {
    mensaje = '🟢 Velocidad normal. Sin infracciones.';
    color   = '#00ff41';
    ruta    = 'Rama 1 (velocidad <= 60) → TRUE';
  } else if (velocidad <= 100) {
    mensaje = '🟡 Velocidad elevada. Reduce la marcha.';
    color   = '#f5a623';
    ruta    = 'Rama 1 → FALSE | Rama 2 (velocidad <= 100) → TRUE';
  } else {
    mensaje = '🔴 EXCESO DE VELOCIDAD. Multa automática.';
    color   = '#ff4141';
    ruta    = 'Rama 1 → FALSE | Rama 2 → FALSE | else → ejecutado';
  }

  terminal.innerHTML = `
    <span class="term-prompt">></span> Leyendo sensor de velocidad...<br/>
    <span class="term-prompt">></span> velocidad = <strong>${velocidad} km/h</strong><br/>
    <span class="term-prompt">></span> Evaluando condicionales...<br/>
    <span class="term-prompt">></span> <span style="color:#888">${ruta}</span><br/>
    <br/>
    <span style="color:${color}">> ${mensaje}</span>
  `;

  btnNext.style.display = 'block';
}

// ===========================
// SECCIÓN 3: CAZADOR DE BUGS — 3 ERRORES
// ===========================
function checkBug() {
  const input1 = document.getElementById('bugInput1').value.trim();
  const input2 = document.getElementById('bugInput2').value.trim();
  const input3 = document.getElementById('bugInput3').value.trim();
  const output  = document.getElementById('bugOutput');
  const status  = document.getElementById('bugStatus');
  const btnNext = document.getElementById('btnNextBug');

  const bug1Ok = input1 === '==';
  const bug2Ok = input2 === '{';
  const bug3Ok = input3 === 'else';

  const bugsRestantes = [!bug1Ok, !bug2Ok, !bug3Ok].filter(Boolean).length;

  if (bug1Ok && bug2Ok && bug3Ok) {
    output.innerHTML = `
      <span style="color:#00ff41">✅ ¡TODOS LOS BUGS ELIMINADOS! Sistema de acceso reparado.</span><br/><br/>
      <strong>Bug 1:</strong> <span style="color:#00ff41">==</span> — para comparar necesitas dos iguales, no uno.<br/>
      <strong>Bug 2:</strong> <span style="color:#00ff41">{</span> — la llave de apertura le dice a JavaScript dónde empieza el bloque.<br/>
      <strong>Bug 3:</strong> <span style="color:#00ff41">else</span> — el último caso debe cubrir cualquier otro valor, no solo el 3.
    `;
    status.textContent = 'SISTEMA REPARADO';
    status.style.color = '#00ff41';
    document.getElementById('ch-bug').classList.add('success');
    btnNext.style.display = 'block';
    output.style.display = 'block';
    return;
  }

  let feedback = `<span style="color:#f5a623">> ${bugsRestantes} bug${bugsRestantes > 1 ? 's' : ''} sin corregir:</span><br/><br/>`;

  if (!bug1Ok) {
    if (input1 === '=') {
      feedback += `🐛 <strong>Bug 1:</strong> Con un solo <strong>=</strong> estás <em>asignando</em> un valor, no comparando. Necesitas <strong>==</strong><br/>`;
    } else if (input1 === '') {
      feedback += `🐛 <strong>Bug 1:</strong> Falta el operador de comparación. ¿Qué símbolo usas para comparar dos valores?<br/>`;
    } else {
      feedback += `🐛 <strong>Bug 1:</strong> "<strong>${input1}</strong>" no es correcto. El operador de comparación es <strong>==</strong><br/>`;
    }
  } else {
    feedback += `✅ <strong>Bug 1:</strong> Correcto.<br/>`;
  }

  if (!bug2Ok) {
    if (input2 === '}') {
      feedback += `🐛 <strong>Bug 2:</strong> Eso es una llave de cierre. Necesitas la de <em>apertura</em>: <strong>{</strong><br/>`;
    } else if (input2 === '') {
      feedback += `🐛 <strong>Bug 2:</strong> Falta algo después del paréntesis. ¿Qué símbolo abre un bloque en JavaScript?<br/>`;
    } else {
      feedback += `🐛 <strong>Bug 2:</strong> "<strong>${input2}</strong>" no es lo que falta. Busca el símbolo que abre un bloque: <strong>{</strong><br/>`;
    }
  } else {
    feedback += `✅ <strong>Bug 2:</strong> Correcto.<br/>`;
  }

  if (!bug3Ok) {
    if (input3.includes('else if')) {
      feedback += `🐛 <strong>Bug 3:</strong> <strong>else if</strong> requiere una condición entre paréntesis. El último caso debe cubrir <em>cualquier otro</em> valor, sin condición: usa solo <strong>else</strong><br/>`;
    } else if (input3 === '') {
      feedback += `🐛 <strong>Bug 3:</strong> Falta la palabra clave. El último bloque no necesita condición, solo la palabra que cubre "cualquier otro caso".<br/>`;
    } else {
      feedback += `🐛 <strong>Bug 3:</strong> "<strong>${input3}</strong>" no es correcto. La palabra que cubre cualquier otro caso es <strong>else</strong><br/>`;
    }
  } else {
    feedback += `✅ <strong>Bug 3:</strong> Correcto.<br/>`;
  }

  status.textContent = `${bugsRestantes} BUG${bugsRestantes > 1 ? 'S' : ''} ACTIVO${bugsRestantes > 1 ? 'S' : ''}`;
  status.style.color = '#ff4141';
  output.innerHTML = feedback;
  output.style.display = 'block';
}

// ===========================
// SECCIÓN 4: PROYECTO FINAL — SISTEMA DE LOGIN
// ===========================
function ejecutarJuego() {
  const code     = document.getElementById('gameEditor').value;
  const terminal = document.getElementById('termGame');

  if (code.trim() === '') {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: El archivo está vacío. Sigue los pasos y empieza a escribir.</span>`;
    return;
  }
  if (!code.includes('let')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta la palabra clave 'let' para declarar variables.</span>`;
    return;
  }
  if (!code.includes('usuarioCorrecto') || !code.includes('clavecorrecta')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Faltan las variables 'usuarioCorrecto' y 'clavecorrecta' con los valores válidos.</span>`;
    return;
  }
  if (!code.includes('usuarioIngresado') || !code.includes('claveIngresada')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Faltan las variables 'usuarioIngresado' y 'claveIngresada'.</span>`;
    return;
  }
  if (!code.includes('usuarioOk') || !code.includes('claveOk')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Faltan las variables booleanas 'usuarioOk' y 'claveOk' que comparen con ==.</span>`;
    return;
  }
  if (!code.includes('==')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta el operador == para comparar. Recuerda: un solo = asigna, dos == comparan.</span>`;
    return;
  }
  if (!code.includes('if')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta el condicional if para evaluar los casos.</span>`;
    return;
  }
  if (!code.includes('else')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta el else para cubrir los casos donde algo falla.</span>`;
    return;
  }
  if (!code.includes('&&')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta el operador && para combinar las dos condiciones en el primer if.</span>`;
    return;
  }
  if (!code.includes('console.log')) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: Falta console.log() para mostrar el resultado.</span>`;
    return;
  }

  // Extraer valores con regex
  const usuarioCorrectoMatch  = code.match(/let\s+usuarioCorrecto\s*=\s*["'`](.+?)["'`]/);
  const claveCorrectaMatch    = code.match(/let\s+clavecorrecta\s*=\s*["'`](.+?)["'`]/);
  const usuarioIngresadoMatch = code.match(/let\s+usuarioIngresado\s*=\s*["'`](.+?)["'`]/);
  const claveIngresadaMatch   = code.match(/let\s+claveIngresada\s*=\s*["'`](.+?)["'`]/);

  const usuarioCorrecto  = usuarioCorrectoMatch  ? usuarioCorrectoMatch[1]  : null;
  const clavecorrecta    = claveCorrectaMatch    ? claveCorrectaMatch[1]    : null;
  const usuarioIngresado = usuarioIngresadoMatch ? usuarioIngresadoMatch[1] : null;
  const claveIngresada   = claveIngresadaMatch   ? claveIngresadaMatch[1]   : null;

  if (!usuarioCorrecto || !clavecorrecta) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: No pude leer 'usuarioCorrecto' o 'clavecorrecta'. Asegúrate de asignarles un texto entre comillas.</span>`;
    return;
  }
  if (!usuarioIngresado || !claveIngresada) {
    terminal.innerHTML = `<span style="color:#ff4141">> ERROR: No pude leer 'usuarioIngresado' o 'claveIngresada'. Asegúrate de asignarles un texto entre comillas.</span>`;
    return;
  }

  const usuarioOk = usuarioIngresado == usuarioCorrecto;
  const claveOk   = claveIngresada   == clavecorrecta;

  let resultado, colorResultado, caso;

  if (usuarioOk && claveOk) {
    resultado      = '✅ Acceso concedido. Bienvenido.';
    colorResultado = '#00ff41';
    caso           = 'Caso 1: usuarioOk && claveOk → TRUE';
  } else if (usuarioOk) {
    resultado      = '❌ Contraseña incorrecta.';
    colorResultado = '#f5a623';
    caso           = 'Caso 2: usuarioOk → TRUE | claveOk → FALSE';
  } else if (claveOk) {
    resultado      = '❌ Usuario no encontrado.';
    colorResultado = '#f5a623';
    caso           = 'Caso 3: usuarioOk → FALSE | claveOk → TRUE';
  } else {
    resultado      = '🔴 Usuario y contraseña incorrectos.';
    colorResultado = '#ff4141';
    caso           = 'Caso 4: usuarioOk → FALSE | claveOk → FALSE → else';
  }

  terminal.innerHTML = `
    <span class="term-prompt">></span> Iniciando sistema de autenticación...<br/>
    <span class="term-prompt">></span> usuarioIngresado = <strong>"${usuarioIngresado}"</strong> | usuarioCorrecto = <strong>"${usuarioCorrecto}"</strong><br/>
    <span class="term-prompt">></span> claveIngresada = <strong>"${claveIngresada}"</strong> | clavecorrecta = <strong>"${clavecorrecta}"</strong><br/>
    <span class="term-prompt">></span> usuarioOk = <strong style="color:${usuarioOk ? '#00ff41' : '#ff4141'}">${usuarioOk}</strong> | claveOk = <strong style="color:${claveOk ? '#00ff41' : '#ff4141'}">${claveOk}</strong><br/>
    <span class="term-prompt">></span> <span style="color:#888">${caso}</span><br/>
    <br/>
    <span style="color:${colorResultado}; font-size:1.05em">> ${resultado}</span>
  `;

  // Mostrar zona de envío después de ejecutar
  setTimeout(() => {
    const submitZone = document.getElementById('submitZone');
    submitZone.style.display = 'block';
    submitZone.scrollIntoView({ behavior: 'smooth' });
    // Pre-rellenar el textarea de envío con el código del editor
    document.getElementById('submitEditor').value = document.getElementById('gameEditor').value;
  }, 1000);
}

// ===========================
// ENVÍO DE PROYECTO PARA REVISIÓN
// ===========================
async function enviarProyecto() {
  const codigo      = document.getElementById('submitEditor').value.trim();
  const statusDiv   = document.getElementById('submitStatus');
  const submitBtn   = document.querySelector('.submit-btn');
  const victoryScreen = document.getElementById('victoryClase6');

  if (codigo === '') {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = `<span style="color:#ff4141">❌ El campo está vacío. Pega tu código antes de enviar.</span>`;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Enviando...';
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = `<span style="color:#f5a623">⏳ Enviando proyecto al servidor...</span>`;

  try {
    if (typeof guardarProgreso === 'function') {
      await guardarProgreso({
        clase6_proyecto_enviado: true,
        clase6_codigo: codigo,
        clase6_estado: 'en_revision'
      });
    }

    statusDiv.innerHTML = `<span style="color:#00ff41">✅ Proyecto enviado correctamente. Espera la revisión del instructor.</span>`;
    submitBtn.textContent = '✅ ENVIADO';

    setTimeout(() => {
      document.querySelector('.editor-wrap') && (document.querySelector('#sec-game .editor-wrap').style.display = 'none');
      victoryScreen.style.display = 'block';
      victoryScreen.scrollIntoView({ behavior: 'smooth' });
    }, 1500);

  } catch (err) {
    statusDiv.innerHTML = `<span style="color:#ff4141">❌ Error al enviar. Intenta de nuevo.</span>`;
    submitBtn.disabled = false;
    submitBtn.textContent = '📤 ENVIAR PARA REVISIÓN';
  }
}

// ===========================
// INICIALIZACIÓN
// ===========================
window.onload = () => {
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressLabel').textContent = '25%';
};
