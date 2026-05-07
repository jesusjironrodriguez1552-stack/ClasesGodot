// ===========================
// NAVEGACIÓN Y PROGRESO
// ===========================
const totalSections = 6;
const sectionIds = ['sec-intro', 'sec-historia', 'sec-editor', 'sec-explicacion', 'sec-quiz', 'sec-ejercicio'];

function goTo(targetId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const currentIndex = sectionIds.indexOf(targetId) + 1;
  const progressPercent = Math.floor((currentIndex / totalSections) * 100);
  
  document.getElementById('progressBar').style.width = progressPercent + '%';
  document.getElementById('progressLabel').textContent = progressPercent + '%';

  if(targetId === 'sec-quiz' && currentQuestion === 0) {
    renderQuestion();
  }
}

// ===========================
// SECCIÓN 3: EL EDITOR FALSO Y BYTE
// ===========================
function ejecutarCodigo() {
  const inputVal = document.getElementById('codeInput').value.trim();
  const terminalBody = document.getElementById('terminalBody');
  const termStatus = document.getElementById('termStatus');
  const byteReaction = document.getElementById('byteReaction');
  const byteMsg = document.getElementById('byteMsg');
  const eyes = document.querySelectorAll('.robot-eye');
  
  if(inputVal === "") {
    terminalBody.innerHTML = `<span class="term-prompt">></span> <span style="color:#ff4141">Error: SyntaxError. El mensaje no puede estar vacío.</span>`;
    return;
  }

  termStatus.textContent = "EJECUTADO";
  termStatus.style.color = "#00ff41";
  terminalBody.innerHTML = `<span class="term-prompt">></span> ${inputVal}`;

  eyes.forEach(eye => {
    eye.style.background = '#00ff41';
    eye.style.boxShadow = '0 0 15px #00ff41';
  });
  
  byteMsg.innerHTML = `¡Guau! <strong>"${inputVal}"</strong>.<br/> ¡He dicho mi primera palabra! Eres genial.`;
  byteReaction.style.display = 'flex';
  
  document.getElementById('btnSiguienteEditor').style.display = 'block';
}

function mostrarHint() {
  const hint = document.getElementById('hintBox');
  hint.style.display = (hint.style.display === 'none' || hint.style.display === '') ? 'block' : 'none';
}

function resetEditor() {
  document.getElementById('codeInput').value = "";
  document.getElementById('terminalBody').innerHTML = `<span class="term-prompt">></span> <span class="term-wait">esperando ejecución...</span>`;
  document.getElementById('termStatus').textContent = "LISTO";
  document.getElementById('termStatus').style.color = "#666";
  
  document.getElementById('byteReaction').style.display = 'none';
  document.getElementById('btnSiguienteEditor').style.display = 'none';
  
  document.querySelectorAll('.robot-eye').forEach(eye => {
    eye.style.background = '#ff4141';
    eye.style.boxShadow = '0 0 10px #ff4141';
  });
}

// ===========================
// SECCIÓN 4: EXPLICACIÓN (HOVER)
// ===========================
function highlightPart(part) {
  document.querySelectorAll('.part-card').forEach(c => c.classList.remove('active-part'));
  document.getElementById('part-' + part).classList.add('active-part');
}

// ===========================
// SECCIÓN 5: QUIZ INTERACTIVO
// ===========================
const questions = [
  {
    q: "¿Qué instrucción le dice a JavaScript que muestre algo en la consola?",
    options: ["mostrar()", "console.log()", "escribir()"],
    answer: 1 
  },
  {
    q: "¿Para qué sirven las comillas ( \" \" ) dentro de console.log?",
    options: [
      "Para que se vea más bonito.",
      "Para indicarle a la PC que es un texto y no código.",
      "Para cerrar el programa."
    ],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;

function renderQuestion() {
  const container = document.getElementById('quizContainer');
  const qData = questions[currentQuestion];
  
  let html = `<div class="q-title">Pregunta ${currentQuestion + 1} de ${questions.length}:<br/>${qData.q}</div>`;
  
  qData.options.forEach((opt, index) => {
    html += `<button class="q-opt" onclick="checkAnswer(${index}, this)">${opt}</button>`;
  });
  
  container.innerHTML = html;
}

function checkAnswer(selectedIndex, btnElement) {
  const btns = document.querySelectorAll('.q-opt');
  btns.forEach(b => b.style.pointerEvents = 'none');
  
  const correctIndex = questions[currentQuestion].answer;
  
  if(selectedIndex === correctIndex) {
    btnElement.classList.add('correct');
    score++;
  } else {
    btnElement.classList.add('wrong');
    btns[correctIndex].classList.add('correct'); 
  }
  
  setTimeout(() => {
    currentQuestion++;
    if(currentQuestion < questions.length) {
      renderQuestion();
    } else {
      showQuizResult();
    }
  }, 1500);
}

function showQuizResult() {
  document.getElementById('quizContainer').style.display = 'none';
  const resDiv = document.getElementById('quizResult');
  const scoreDiv = document.getElementById('qrScore');
  const msgDiv = document.getElementById('qrMsg');
  
  resDiv.style.display = 'block';
  scoreDiv.textContent = `${score} / ${questions.length} CORRECTAS`;
  
  if(score === questions.length) {
    msgDiv.textContent = "¡Perfecto! Entendiste la lógica a la primera.";
  } else {
    msgDiv.textContent = "¡Buen intento! Lo importante es que ya sabes cómo hablar con la PC.";
  }
}

// ===========================
// SECCIÓN 6: RETOS FINALES
// ===========================
let challengesDone = { 1: false, 2: false, 3: false };

function checkChallenge(num) {
  const output = document.getElementById(`ch${num}-output`);
  const status = document.getElementById(`ch${num}-status`);
  const challengeDiv = document.getElementById(`ch${num}`);
  let resultText = "";
  let isValid = false;

  if (num === 1) {
    const val = document.getElementById('ch1-input').value.trim();
    if (val !== "") { resultText = val; isValid = true; }
  } 
  else if (num === 2) {
    const val1 = document.getElementById('ch2-input1').value.trim();
    const val2 = document.getElementById('ch2-input2').value.trim();
    if (val1 !== "" && val2 !== "") { 
      resultText = `${val1}<br/>${val2}`; 
      isValid = true; 
    }
  } 
  else if (num === 3) {
    const val = document.getElementById('ch3-input').value.trim();
    if (val !== "") { resultText = val; isValid = true; }
  }

  if (isValid) {
    output.innerHTML = `<span style="color:#555">Salida de consola:</span><br/>${resultText}`;
    output.style.display = "block";
    status.textContent = "COMPLETADO";
    challengeDiv.classList.add('success');
    challengesDone[num] = true;
    
    if(challengesDone[1] && challengesDone[2] && challengesDone[3]) {
      setTimeout(() => {
        document.querySelector('.challenges-wrap').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'block';
      }, 1000);
    }
  } else {
    output.innerHTML = `<span style="color:#ff4141">Error: Debes escribir algo entre las comillas.</span>`;
    output.style.display = "block";
  }
}

window.onload = () => {
  goTo('sec-intro');
};
