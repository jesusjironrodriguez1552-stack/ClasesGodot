// ===========================
// CLIENTE DE SUPABASE
// ===========================
const supabaseUrl = 'https://vnuuegjfkrirttcwguvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVlZ2pma3JpcnR0Y3dndXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTUyNzQsImV4cCI6MjA5MzczMTI3NH0.9R-qiuZBnxB0HIAggVGN8OzavK-fBtGMQQ9fu8If9jo';
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);
// ===========================
// GUARDAR PROGRESO
// ===========================
// Uso desde cualquier clase:
// await guardarProgreso({ clase1_completada: true })
// await guardarProgreso({ clase2_completada: true })
// Uso futuro con XP y nivel:
// await guardarProgreso({ xp: 300, nivel: 2 })
async function guardarProgreso(campos) {
  try {
    const { data: { user } } = await clienteSupabase.auth.getUser();
    if (!user) {
      console.warn('No hay usuario logueado.');
      return false;
    }
    const { data, error } = await clienteSupabase
      .from('usuarios')
      .update(campos)
      .eq('id', user.id)
      .select();
    if (error) {
      console.error('❌ Error al guardar:', error.message);
      return false;
    }
    console.log('✅ Guardado:', campos);
    return true;
  } catch (err) {
    console.error('Error inesperado:', err);
    return false;
  }
}
// ===========================
// BLOQUEAR BOTÓN ATRÁS
// ===========================
history.pushState(null, null, location.href);
window.addEventListener('popstate', () => {
  history.pushState(null, null, location.href);
});
