// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';

// Usamos window.supabase para asegurar que cargue la librería correctamente
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// PROTEGER LA PÁGINA (Auth Guard)
// ===========================
// Esta función verifica en tiempo real si el usuario tiene permiso para estar aquí.
async function verificarSesion() {
  const { data: { session }, error } = await clienteSupabase.auth.getSession();

  // Si NO hay sesión iniciada:
  if (!session) {
    // Usamos replace para que el panel desaparezca del historial
    window.location.replace('index.html');
    return;
  }

  // Si SÍ hay sesión, extraemos el nombre de usuario
  const user = session.user;
  let alias = "Usuario";

  // Intentamos sacar el alias de la metadata (el que puso al registrarse)
  if (user.user_metadata && user.user_metadata.username) {
    alias = user.user_metadata.username;
  } else {
    // Si por alguna razón no hay metadata, usamos el correo
    alias = user.email.split('@')[0];
  }

  // Lo mostramos en el HTML
  const displayUser = document.getElementById('display-user');
  if (displayUser) {
    displayUser.textContent = `Acceso: ${alias.toUpperCase()}`;
  }

  // ---> NUEVO: CARGAMOS EL PROGRESO DEL USUARIO <---
  cargarProgreso(user.id);
}

// ===========================
// CARGAR PROGRESO DE SUPABASE
// ===========================
async function cargarProgreso(userId) {
  // Consultamos tu tabla 'usuarios' buscando las columnas booleanas
  const { data: usuarioData, error } = await clienteSupabase
    .from('usuarios')
    .select('clase1_completada, clase2_completada')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error al cargar el progreso:", error.message);
    return; // Si hay error, no hacemos nada y los botones se quedan normales
  }

  if (usuarioData) {
    // Si pasó la Clase 1, transformamos el botón
    if (usuarioData.clase1_completada) {
      const btn1 = document.querySelector('button[onclick*="clase1.html"]');
      if (btn1) {
        btn1.style.borderColor = '#00ff41';
        btn1.style.color = '#00ff41';
        btn1.innerHTML = 'CLASE_01 [ COMPLETADA ] <br><span style="font-size: 0.8rem; font-weight: normal; color:#00ff41;">Misión Superada</span>';
      }
    }

    // Si pasó la Clase 2, transformamos el botón
    if (usuarioData.clase2_completada) {
      const btn2 = document.querySelector('button[onclick*="clase2.html"]');
      if (btn2) {
        btn2.style.borderColor = '#00ff41';
        btn2.style.color = '#00ff41';
        btn2.innerHTML = 'CLASE_02 [ COMPLETADA ] <br><span style="font-size: 0.8rem; font-weight: normal; color:#00ff41;">Memoria Dominada</span>';
      }
    }
  }
}

// ===========================
// CERRAR SESIÓN
// ===========================
async function cerrarSesion() {
  // Solicitamos a Supabase que termine la sesión
  const { error } = await clienteSupabase.auth.signOut();
  
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
    alert("Error al desconectar.");
  } else {
    // Al cerrar sesión con éxito, mandamos al login y borramos el historial
    window.location.replace('index.html');
  }
}

// Escuchador de cambios de sesión (por si la sesión expira mientras el usuario está viendo la página)
clienteSupabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.replace('index.html');
  }
});

// Iniciamos la verificación nada más cargar el script
verificarSesion();
