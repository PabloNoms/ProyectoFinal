import { supabase } from './supabaseClient';

export async function obtenerPublicaciones() {
  const { data, error } = await supabase
    .from('publicaciones')
    .select('id, titulo, contenido, creado_en')
    .order('creado_en', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function crearPublicacion(titulo, contenido) {
  const { error } = await supabase
    .from('publicaciones')
    .insert({ titulo, contenido });

  if (error) {
    console.log('error al crear:', error);
    alert(error.message);
  }
}

export async function actualizarPublicacion(id, titulo, contenido) {
  const { error } = await supabase
    .from('publicaciones')
    .update({ titulo, contenido })
    .eq('id', id);

  if (error) {
    console.log('error al actualizar:', error);
    alert(error.message);
  }
}

export async function eliminarPublicacion(id) {
  const { error } = await supabase
    .from('publicaciones')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}