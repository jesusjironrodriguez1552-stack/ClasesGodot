// ===========================
// PROTEGER LA PÁGINA Y CARGAR DATOS
// ===========================
async function verificarSesion() {
  const { data: { session } } = await clienteSupabase.auth.getSession();
  if (!session) {
    window.location.replace('index.html');
    return;
  }
  const user = session.user;
  // Mostrar nombre de usuario
  let alias = user.user_metadata?.username || user.email.split('@')[0];
  const displayUser = document.getElementById('display-user');
  if (displayUser) displayUser.textContent = `Acceso: ${alias.toUpperCase()}`;
  // Cargar progreso
  cargarProgreso(user.id);
}
// ===========================
// CARGAR PROGRESO DE SUPABASE
// ===========================
async function cargarProgreso(userId) {
  const { data, error } = await clienteSupabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .maybeSingle(); // ✅ evita el error 406 si no hay fila
  if (error) {
    console.error('Error al cargar progreso:', error.message);
    return;
  }
  if (!data) {
    console.warn('Usuario no encontrado en tabla usuarios:', userId);
    return;
  }
  // Pasa todos los datos al panel para que aplique el estado de cada clase
  aplicarProgreso(data);
}
// ===========================
// CERRAR SESIÓN
// ===========================
async function cerrarSesion() {
  const { error } = await clienteSupabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    window.location.replace('index.html');
  }
}
// Redirigir si la sesión expira
clienteSupabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    window.location.replace('index.html');
  }
});

// ===========================
// BLOQUEAR BOTÓN ATRÁS
// ===========================
history.pushState(null, null, location.href);
window.addEventListener('popstate', () => {
  history.pushState(null, null, location.href);
});

verificarSesion();
