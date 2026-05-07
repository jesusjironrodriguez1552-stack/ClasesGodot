// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// INICIAR SESIÓN
// ===========================
async function doLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-user').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errorDiv = document.getElementById('login-error');

  // Validación básica de campos vacíos
  if (!email || !pass) {
    errorDiv.textContent = 'ERROR: Completa todos los campos.';
    return false;
  }

  // Mensaje de carga mientras se conecta a la base de datos
  errorDiv.style.color = '#00ff41';
  errorDiv.textContent = 'AUTENTICANDO...';

  // Llamada a Supabase para validar credenciales
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: pass,
  });

  // Restaurar el color rojo para los errores
  errorDiv.style.color = '#ff4141';

  if (error) {
    if (error.message === "Invalid login credentials") {
      errorDiv.textContent = 'ERROR: Credenciales incorrectas.';
    } else {
      errorDiv.textContent = 'ERROR DEL SISTEMA: ' + error.message;
    }
    return false;
  }

  // Login exitoso
  errorDiv.textContent = '';
  console.log("Sesión iniciada con éxito:", data.user);
  alert('¡ACCESO CONCEDIDO! Conectando al sistema...');

  // window.location.href = 'panel_principal.html';
  return false;
}
