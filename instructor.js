// ===========================
// CONFIGURACIÓN DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===========================
// ESTADO GLOBAL
// ===========================
let alumnoActivo = null;
let todosLosAlumnos = [];
let filtroActivo = 'pendientes';

// ===========================
// PROTEGER LA PÁGINA
// ===========================
async function verificarInstructor() {
  const { data: { session } } = await clienteSupabase.auth.getSession();
  if (!session) {
    window.location.replace('index.html');
    return;
  }

  const { data, error } = await clienteSupabase
    .from('usuarios')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !data || data.rol !== 'instructor') {
    window.location.replace('panel.html');
    return;
  }

  const alias = session.user.user_metadata?.username || session.user.email.split('@')[0];
  document.getElementById('display-user').textContent = `Instructor: ${alias.toUpperCase()}`;

  cargarAlumnos();
}

// ===========================
// CARGAR TODOS LOS ALUMNOS
// ===========================
async function cargarAlumnos() {
  const { data, error } = await clienteSupabase
    .from('usuarios')
    .select('*')
    .eq('rol', 'alumno');

  if (error) {
    console.error('Error al cargar alumnos:', error.message);
    return;
  }

  todosLosAlumnos = data;
  actualizarResumen();
  renderizarLista(filtroActivo);
}

// ===========================
// ACTUALIZAR TARJETAS DE RESUMEN
// ===========================
function actualizarResumen() {
  const total      = todosLosAlumnos.length;
  const pendientes = todosLosAlumnos.filter(a => a.clase6_proyecto_enviado && !a.clase6_aprobada && !a.clase6_rechazada).length;
  const aprobados  = todosLosAlumnos.filter(a => a.clase6_aprobada).length;
  const rechazados = todosLosAlumnos.filter(a => a.clase6_rechazada).length;

  document.getElementById('total-alumnos').textContent    = total;
  document.getElementById('total-pendientes').textContent = pendientes;
  document.getElementById('total-aprobados').textContent  = aprobados;
  document.getElementById('total-rechazados').textContent = rechazados;
}

// ===========================
// FILTRAR LISTA
// ===========================
function filtrar(tipo) {
  filtroActivo = tipo;

  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  renderizarLista(tipo);
}

// ===========================
// RENDERIZAR LISTA DE ALUMNOS
// ===========================
function renderizarLista(filtro) {
  const lista = document.getElementById('alumnos-lista');

  let alumnos = todosLosAlumnos;

  if (filtro === 'pendientes') {
    alumnos = todosLosAlumnos.filter(a => a.clase6_proyecto_enviado && !a.clase6_aprobada && !a.clase6_rechazada);
  } else if (filtro === 'aprobados') {
    alumnos = todosLosAlumnos.filter(a => a.clase6_aprobada);
  } else if (filtro === 'rechazados') {
    alumnos = todosLosAlumnos.filter(a => a.clase6_rechazada);
  } else {
    alumnos = todosLosAlumnos.filter(a => a.clase6_proyecto_enviado);
  }

  if (alumnos.length === 0) {
    lista.innerHTML = `<div class="cargando">// No hay proyectos en esta categoría.</div>`;
    return;
  }

  lista.innerHTML = alumnos.map(alumno => {
    let estadoBadge = '';
    if (alumno.clase6_aprobada) {
      estadoBadge = `<span class="badge badge-aprobado">✅ APROBADO</span>`;
    } else if (alumno.clase6_rechazada) {
      estadoBadge = `<span class="badge badge-rechazado">❌ RECHAZADO</span>`;
    } else {
      estadoBadge = `<span class="badge badge-pendiente">⏳ PENDIENTE</span>`;
    }

    const alias = alumno.username || alumno.email || alumno.id;

    return `
      <div class="alumno-card" onclick="abrirModal('${alumno.id}')">
        <div class="alumno-info">
          <div class="alumno-nombre">${alias}</div>
          <div class="alumno-clase">// CLASE 06 — Sistema de Login</div>
          ${alumno.mensaje_instructor ? `<div class="alumno-mensaje-prev">💬 Mensaje enviado</div>` : ''}
        </div>
        <div class="alumno-acciones">
          ${estadoBadge}
          <span class="alumno-xp">XP: ${alumno.xp || 0}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===========================
// ABRIR MODAL
// ===========================
function abrirModal(alumnoId) {
  alumnoActivo = todosLosAlumnos.find(a => a.id === alumnoId);
  if (!alumnoActivo) return;

  const alias = alumnoActivo.username || alumnoActivo.email || alumnoActivo.id;

  document.getElementById('modal-alumno-nombre').textContent = `// ${alias.toUpperCase()}`;
  document.getElementById('modal-alumno-email').textContent  = alumnoActivo.email || '—';
  document.getElementById('modal-codigo').textContent        = alumnoActivo.clase6_codigo || '// Sin código enviado';
  document.getElementById('modal-mensaje').value             = alumnoActivo.mensaje_instructor || '';

  let estado = 'EN REVISIÓN';
  if (alumnoActivo.clase6_aprobada)  estado = '✅ APROBADO';
  if (alumnoActivo.clase6_rechazada) estado = '❌ RECHAZADO';
  document.getElementById('modal-estado').textContent = estado;

  document.getElementById('modal-proyecto').style.display = 'flex';
}

// ===========================
// CERRAR MODAL
// ===========================
function cerrarModal() {
  document.getElementById('modal-proyecto').style.display = 'none';
  alumnoActivo = null;
}

// ===========================
// APROBAR PROYECTO
// ===========================
async function aprobar() {
  if (!alumnoActivo) return;

  const mensaje = document.getElementById('modal-mensaje').value.trim();
  const xpActual = alumnoActivo.xp || 0;

  const { error } = await clienteSupabase
    .from('usuarios')
    .update({
      clase6_aprobada:          true,
      clase6_rechazada:         false,
      clase6_completada:        true,
      clase6_estado:            'aprobado',
      mensaje_instructor:       mensaje,
      xp:                       xpActual + 100,
      rango:                    calcularRango({ ...alumnoActivo, clase6_completada: true })
    })
    .eq('id', alumnoActivo.id);

  if (error) {
    alert('Error al aprobar: ' + error.message);
    return;
  }

  cerrarModal();
  cargarAlumnos();
}

// ===========================
// RECHAZAR PROYECTO
// ===========================
async function rechazar() {
  if (!alumnoActivo) return;

  const mensaje = document.getElementById('modal-mensaje').value.trim();

  const { error } = await clienteSupabase
    .from('usuarios')
    .update({
      clase6_rechazada:   true,
      clase6_aprobada:    false,
      clase6_estado:      'rechazado',
      mensaje_instructor: mensaje
    })
    .eq('id', alumnoActivo.id);

  if (error) {
    alert('Error al rechazar: ' + error.message);
    return;
  }

  cerrarModal();
  cargarAlumnos();
}

// ===========================
// CALCULAR RANGO
// ===========================
function calcularRango(alumno) {
  if (alumno.clase14_completada) return 'Oro';
  if (alumno.clase10_completada) return 'Bronce';
  if (alumno.clase8_completada)  return 'Plata';
  if (alumno.clase6_completada)  return 'Madera';
  return 'Sin rango';
}

// ===========================
// CERRAR SESIÓN
// ===========================
async function cerrarSesion() {
  await clienteSupabase.auth.signOut();
  window.location.replace('index.html');
}

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarModal();
});

// ===========================
// INICIAR
// ===========================
verificarInstructor();
