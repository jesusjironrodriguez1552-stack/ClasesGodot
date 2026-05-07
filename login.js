// ===========================
// CAMBIAR ENTRE TABS
// ===========================
function switchTab(tab) {
  const formLogin    = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');
  const alertBox     = document.getElementById('alert-box');

  alertBox.style.display = 'none';

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
function doLogin(event) {
  event.preventDefault();

  const user  = document.getElementById('login-user').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const error = document.getElementById('login-error');

  // Validación básica
  if (!user || !pass) {
    error.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  // Buscar usuario guardado en localStorage
  const guardado = JSON.parse(localStorage.getItem('usuario_' + user));

  if (!guardado) {
    error.textContent = 'ERROR: Usuario no encontrado.';
    return false;
  }

  if (guardado.password !== pass) {
    error.textContent = 'ERROR: Contraseña incorrecta.';
    return false;
  }

  // Login exitoso → guardar sesión y redirigir
  error.textContent = '';
  localStorage.setItem('sesion_activa', user);

  // Aquí redirigirías a la página principal
  alert('Bienvenido, ' + user + '! (Aquí irá la redirección al panel)');
  // window.location.href = 'index.html';

  return false;
}

// ===========================
// REGISTRARSE
// ===========================
function doRegister(event) {
  event.preventDefault();

  const user  = document.getElementById('reg-user').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const error = document.getElementById('reg-error');

  // Validaciones
  if (!user || !email || !pass) {
    error.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  if (pass.length < 8) {
    error.textContent = 'ERROR: La contraseña debe tener al menos 8 caracteres.';
    return false;
  }

  if (localStorage.getItem('usuario_' + user)) {
    error.textContent = 'ERROR: Ese usuario ya existe.';
    return false;
  }

  // Guardar usuario en localStorage
  const nuevoUsuario = {
    username: user,
    email:    email,
    password: pass,
    xp:       0,
    clases:   [],
    logros:   []
  };

  localStorage.setItem('usuario_' + user, JSON.stringify(nuevoUsuario));

  // Mostrar alerta y cambiar a login
  error.textContent = '';
  document.getElementById('alert-box').style.display = 'block';
  switchTab('login');
  document.getElementById('login-user').value = user;

  return false;
}
