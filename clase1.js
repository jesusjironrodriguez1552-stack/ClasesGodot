// ===========================
// GUARDAR PROGRESO
// ===========================
// Usa "clienteSupabase" declarado en login.js
//
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
