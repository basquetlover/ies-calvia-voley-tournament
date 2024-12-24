// src/pages/api/sesiones/usuarios.ts
import { supabaseAdmin } from '../../../lib/supabase';

export async function get() {
    const { data: Usuarios, error } = await supabaseAdmin
        .from('Usuarios')
        .select('nombre, email');

    if (error) {
        return {
            status: 500,
            body: { error: error.message },
        };
    }

    return {
        status: 200,
        body: Usuarios,
    };
}