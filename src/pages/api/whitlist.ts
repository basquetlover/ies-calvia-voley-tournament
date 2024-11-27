import { supabaseAdmin } from '../../lib/supabase';

export async function authorizeUser(email: string, page: string){
  // Obtener el rol del usuario
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error('Error obteniendo el usuario o usuario no encontrado:', userError?.message);
    return false;
  }

  // Obtener las reglas de acceso de la página
  const { data: pageAccess, error: pageError } = await supabaseAdmin
    .from('Whitlist')
    .select('*')
    .eq('page', page)
    .single();

  if (pageError || !pageAccess) {
    console.error('Error obteniendo acceso a la página o página no encontrada:', pageError?.message);
    return false;
  }


}

