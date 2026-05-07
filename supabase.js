// ===========================
// GUARDAR PROGRESO
// ===========================
// El cliente "supabase" ya está declarado en tu archivo de auth.
// Este archivo solo agrega funciones reutilizables.
//
// Uso desde cualquier clase:
// await guardarProgreso({ clase1_completada: true })
// await guardarProgreso({ clase2_completada: true })
// Uso futuro con XP y nivel:
// await guardarProgreso({ xp: 300, nivel: 2 })
async function guardarProgreso(campos) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('No hay usuario logueado.');
      return false;
    }

    const { data, error } = await supabase
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
