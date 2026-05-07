// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';

const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// PROTEGER LA PÁGINA (Auth Guard)
// ===========================
async function verificarSesion() {
  // Pedimos a Supabase la sesión actual
  const { data: { session }, error } = await clienteSupabase.auth.getSession();

  // Si no hay sesión, regresamos al usuario al index
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  // Si hay sesión, mostramos el nombre de usuario o el correo
  const user = session.user;
  let alias = user.email.split('@')[0]; // Por defecto mostramos la parte antes del @

  // Si el usuario tiene un 'username' guardado en su metadata (cuando se registró)
  if (user.user_metadata && user.user_metadata.username) {
    alias = user.user_metadata.username;
  }

  // Lo colocamos en la barra superior
  document.getElementById('display-user').textContent = `Usuario: ${alias}`;
}

// ===========================
// CERRAR SESIÓN
// ===========================
async function cerrarSesion() {
  const { error } = await clienteSupabase.auth.signOut();
  if (!error) {
    // Redirigir al login después de cerrar sesión
    window.location.href = 'index.html';
  }
}

// Ejecutar la verificación al cargar la página
verificarSesion();
