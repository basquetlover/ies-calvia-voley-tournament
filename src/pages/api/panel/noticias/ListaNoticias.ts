import { supabaseAdmin } from "src/lib/supabase";


export async function GET() {
  const { data: noticias, error } = await supabaseAdmin
    .from('Noticis')
    .select(`
      titular,
      subtitulo,
      cover_image,
      slug,
      author,
      author_curso,
      publication_date,
      categoria
    `)
    .order('publication_date', { ascending: false });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const contadorCategorias: Record<string, number> = {};

  noticias.forEach((noticia) => {
    const categoria = noticia.categoria || 'Sin categoría';

    contadorCategorias[categoria] =
      (contadorCategorias[categoria] || 0) + 1;
  });

  const categorias = [
    {
      nombre: 'Totes',
      cantidad: noticias.length
    },
    ...Object.entries(contadorCategorias).map(
      ([nombre, cantidad]) => ({
        nombre,
        cantidad
      })
    )
  ];

  return new Response(
    JSON.stringify({
      categorias,
      noticias
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}