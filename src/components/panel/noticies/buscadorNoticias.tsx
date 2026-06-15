import { useEffect, useState, useRef } from "react";
import { useToast } from '@components/panel/Toast';
import "../StylesReact.css"


const mesosCatala = ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'];
export function formatDataCatalaFromISO(isoString: string): string {
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  const dia = date.getDate();
  const mes = mesosCatala[date.getMonth()];
  const any = date.getFullYear();

  return `${dia} ${mes} ${any}`;
}

interface Noticia {
  titular: string;
  subtitulo: string;
  cover_image: string;
  slug: string;
  author: string;
  author_curso: string;
  publication_date: string;
  categoria: string;
}

interface Categoria {
  nombre: string;
  cantidad: number;
}

export default function BuscadorNoticias() {

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [todasNoticias, setTodasNoticias] = useState<Noticia[]>([]);
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [filtro, setFiltro] = useState<string>("Totes");
    
    useEffect(() => {
        cargarNoticias();
        console.log(categorias, noticias)
    }, []);

    useEffect(() => {
        if (filtro === "Totes") {
        setNoticias(todasNoticias);
        return;
        }

        setNoticias(
        todasNoticias.filter(
            (noticia) => noticia.categoria === filtro
        )
        );
    }, [filtro, todasNoticias]);

    const cargarNoticias = async () => {
        try {
        const res = await fetch("/api/panel/noticias/ListaNoticias");

        if (!res.ok) {
            throw new Error("Error al cargar noticias");
        }

        const data = await res.json();

        setCategorias(data.categorias);
        setTodasNoticias(data.noticias);
        setNoticias(data.noticias);
        } catch (error) {
        console.error(error);
        }
    };

    return(<>
        <div className="max-w-6xl mx-auto">
           

            <div className="mt-10">
                <div className="flex items-center gap-x-2 fill-amarillo text-amarillo">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                        <path d="M400-240v-80h160v80zM240-440v-80h480v80zM120-640v-80h720v80z"/>
                    </svg>
                    <p>Filtrar per categoria</p>
                </div>

                <div className="flex flex-row items-center gap-x-2 mt-2">
                    {
                        categorias.map((categoria) =>(
                            <div key={categoria.nombre} onClick={() => setFiltro(categoria.nombre)} className={` px-3 py-2 rounded-full text-blanco cursor-pointer ${filtro === categoria.nombre ? 'bg-primary text-gris':'bg-gris-claro/30'}`}>
                                <p>
                                    {categoria.nombre}

                                    {/* <span className="ml-2">
                                        ({categoria.cantidad})
                                    </span> */}
                                </p>
                            </div>
                        ))
                    }
                </div>

                        {/* Resto de noticias */}
                                <div className="w-full p-4 flex flex-col gap-4">
                                    {noticias.map((noticia) => (
                                    <article key={noticia.slug} className="w-full grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-x-2">
                                        <img
                                        src={noticia.cover_image}
                                        alt={noticia.titular}
                                        className="w-full h-full object-cover rounded-2xl"
                                        />

                                        <h3>{noticia.titular}</h3>

                                        <p>{noticia.subtitulo}</p>

                                        <span className="text-center">{noticia.categoria}</span>

                                        <div className="flex flex-col items-center">
                                        <span>{noticia.author}</span>
                                        <span>{formatDataCatalaFromISO(noticia.publication_date)}</span>
                                        </div>
                                    </article>
                                    ))}
                                </div>
                
            </div>

        </div>
        
    </>)
}