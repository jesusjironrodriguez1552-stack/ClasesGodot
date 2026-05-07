// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';

// Usamos window.supabase para evitar conflictos de nombres
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// CAMBIAR ENTRE TABS
// ===========================
function switchTab(tab) {
  const formLogin    = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');

  // Limpiamos mensajes de error al cambiar de pestaña
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

  const email = document.getElementById('login-user').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errorDiv = document.getElementById('login-error');

  // Validación básica
  if (!email || !pass) {
    errorDiv.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  // Aviso visual de carga
  errorDiv.style.color = '#00ff41';
  errorDiv.textContent = 'AUTENTICANDO...';

  // Llamada a Supabase
  const { data, error } = await clienteSupabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });

  // Restauramos color rojo para errores
  errorDiv.style.color = '#ff4141';

  if (error) {
    if (error.message === "Invalid login credentials") {
      errorDiv.textContent = 'ERROR: Credenciales incorrectas.';
    } else {
      errorDiv.textContent = 'ERROR DEL SISTEMA: ' + error.message;
    }
    return false;
  }

  // Éxito
  errorDiv.textContent = '';
  console.log("Sesión iniciada:", data.user);
  alert('¡ACCESO CONCEDIDO! Conectando al sistema...');

  Descomenta la siguiente línea para redirigir a tu panel cuando el usuario entre
  window.location.href = 'panel.html';

  return false;
}

// ===========================
// REGISTRARSE
// ===========================
async function doRegister(event) {
  event.preventDefault();

  const alias = document.getElementById('reg-user').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const errorDiv = document.getElementById('reg-error');

  // Validación
  if (!alias || !email || !pass) {
    errorDiv.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  // Aviso visual
  errorDiv.style.color = '#00ff41';
  errorDiv.textContent = 'CREANDO CUENTA...';

  // Registrar en Supabase enviando el alias en la metadata
  const { data, error } = await clienteSupabase.auth.signUp({
    email: email,
    password: pass,
    options: {
      data: {
        username: alias
      }
    }
  });

  errorDiv.style.color = '#ff4141';

  if (error) {
    errorDiv.textContent = 'ERROR: ' + error.message;
    return false;
  }

  // Éxito
  errorDiv.textContent = '';
  alert('¡CUENTA CREADA CON ÉXITO! Ahora inicia sesión.');
  
  // Reseteamos formulario y volvemos al login
  document.getElementById('form-register').reset();
  switchTab('login');
  
  // Autocompletamos el correo para facilitarle el inicio de sesión
  document.getElementById('login-user').value = email;

  return false;
}
