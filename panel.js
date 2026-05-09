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
  // Cargar mensajes del chat
  cargarChat(data);
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
// ===========================
// CHAT CON INSTRUCTOR
// ===========================
function cargarChat(data) {
  const msgInstructor  = document.getElementById('chat-mensaje-instructor');
  const msgAlumno      = document.getElementById('chat-mensaje-alumno');
  const chatVacio      = document.getElementById('chat-vacio');
  const textoInstructor = document.getElementById('chat-texto-instructor');
  const textoAlumno    = document.getElementById('chat-texto-alumno');

  let hayMensajes = false;

  if (data.mensaje_instructor) {
    textoInstructor.textContent = data.mensaje_instructor;
    msgInstructor.style.display = 'block';
    hayMensajes = true;
  }

  if (data.mensaje_alumno) {
    textoAlumno.textContent = data.mensaje_alumno;
    msgAlumno.style.display = 'block';
    hayMensajes = true;
  }

  chatVacio.style.display = hayMensajes ? 'none' : 'block';
}

async function enviarMensaje() {
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (!texto) return;

  const { data: { user } } = await clienteSupabase.auth.getUser();
  if (!user) return;

  const { error } = await clienteSupabase
    .from('usuarios')
    .update({ mensaje_alumno: texto })
    .eq('id', user.id);

  if (error) {
    console.error('Error al enviar mensaje:', error.message);
    return;
  }

 document.getElementById('chat-texto-alumno').textContent = texto;
document.getElementById('chat-mensaje-alumno').style.display = 'block';
document.getElementById('chat-vacio').style.display = 'none';
  input.value = '';
}

// ===========================
// ESCUCHAR MENSAJES EN TIEMPO REAL
// ===========================
async function activarRealtime() {
  const { data: { user } } = await clienteSupabase.auth.getUser();
  if (!user) return;

  clienteSupabase
    .channel('mensajes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'usuarios',
      filter: `id=eq.${user.id}`
    }, (payload) => {
      cargarChat(payload.new);
    })
    .subscribe();
}

activarRealtime();

verificarSesion();
