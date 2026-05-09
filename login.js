// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';

const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// MODAL PERSONALIZADO
// ===========================
function mostrarModal(mensaje, callback) {
  const overlay = document.createElement('div');
  overlay.id = 'cm-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: cmFadeIn 0.2s ease;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #0d0d0d;
    border: 1px solid #00ff41;
    border-radius: 4px;
    padding: 32px 40px;
    max-width: 380px;
    width: 90%;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.15);
    animation: cmSlideIn 0.25s ease;
  `;

  const titulo = document.createElement('div');
  titulo.textContent = '// CODEMATRIX //';
  titulo.style.cssText = `
    color: #00ff41;
    font-size: 11px;
    letter-spacing: 4px;
    margin-bottom: 20px;
    opacity: 0.6;
  `;

  const texto = document.createElement('p');
  texto.textContent = mensaje;
  texto.style.cssText = `
    color: #00ff41;
    font-size: 15px;
    letter-spacing: 1px;
    margin: 0 0 28px 0;
    line-height: 1.6;
  `;

  const boton = document.createElement('button');
  boton.textContent = 'ACEPTAR_';
  boton.style.cssText = `
    background: transparent;
    border: 1px solid #00ff41;
    color: #00ff41;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    letter-spacing: 2px;
    padding: 10px 32px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    border-radius: 2px;
  `;

  boton.onmouseover = () => {
    boton.style.background = '#00ff41';
    boton.style.color = '#000';
  };
  boton.onmouseout = () => {
    boton.style.background = 'transparent';
    boton.style.color = '#00ff41';
  };

  boton.onclick = () => {
    overlay.remove();
    if (callback) callback();
  };

  if (!document.getElementById('cm-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'cm-modal-styles';
    style.textContent = `
      @keyframes cmFadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes cmSlideIn { from { transform: translateY(-16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    `;
    document.head.appendChild(style);
  }

  modal.appendChild(titulo);
  modal.appendChild(texto);
  modal.appendChild(boton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ===========================
// CAMBIAR ENTRE TABS
// ===========================
function switchTab(tab) {
  const formLogin    = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');

  document.getElementById('login-error').textContent = '';
  document.getElementById('reg-error').textContent = '';

  if (tab === 'login') {
    formLogin.style.display    = 'block';
    formRegister.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formLogin.style.display    = 'none';
    formRegister.style.display = 'block';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

// ===========================
// INICIAR SESIÓN
// ===========================
async function doLogin(event) {
  event.preventDefault();

  const email    = document.getElementById('login-user').value.trim();
  const pass     = document.getElementById('login-pass').value;
  const errorDiv = document.getElementById('login-error');

  if (!email || !pass) {
    errorDiv.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  errorDiv.style.color = '#00ff41';
  errorDiv.textContent = 'AUTENTICANDO...';

  const { data, error } = await clienteSupabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });

  errorDiv.style.color = '#ff4141';

  if (error) {
    if (error.message === "Invalid login credentials") {
      errorDiv.textContent = 'ERROR: Credenciales incorrectas.';
    } else {
      errorDiv.textContent = 'ERROR DEL SISTEMA: ' + error.message;
    }
    return false;
  }

  errorDiv.textContent = '';

  // Consultar rol del usuario
  const { data: perfil } = await clienteSupabase
    .from('usuarios')
    .select('rol')
    .eq('id', data.user.id)
    .single();

  const destino = perfil?.rol === 'instructor' ? 'instructor.html' : 'panel.html';

  mostrarModal('¡ACCESO CONCEDIDO!\nConectando al sistema...', () => {
    window.location.replace(destino);
  });

  return false;
}

// ===========================
// REGISTRARSE
// ===========================
async function doRegister(event) {
  event.preventDefault();

  const alias    = document.getElementById('reg-user').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const pass     = document.getElementById('reg-pass').value;
  const errorDiv = document.getElementById('reg-error');

  if (!alias || !email || !pass) {
    errorDiv.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  errorDiv.style.color = '#00ff41';
  errorDiv.textContent = 'CREANDO CUENTA...';

  const { data, error } = await clienteSupabase.auth.signUp({
    email: email,
    password: pass,
    options: {
      data: { username: alias }
    }
  });

  errorDiv.style.color = '#ff4141';

  if (error) {
    errorDiv.textContent = 'ERROR: ' + error.message;
    return false;
  }

  errorDiv.textContent = '';

  mostrarModal('¡CUENTA CREADA CON ÉXITO!\nAhora inicia sesión.', () => {
    document.getElementById('form-register').reset();
    switchTab('login');
    document.getElementById('login-user').value = email;
  });

  return false;
}

// ===========================
// EVITAR QUE REGRESEN AL LOGIN
// ===========================
async function revisarSesionActiva() {
  const { data: { session } } = await clienteSupabase.auth.getSession();
  if (session) {
    const { data: perfil } = await clienteSupabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single();

    const destino = perfil?.rol === 'instructor' ? 'instructor.html' : 'panel.html';
    window.location.replace(destino);
  }
}

revisarSesionActiva();
