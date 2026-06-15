import { useEffect, useState, useRef } from "react";
import { useToast } from '@components/panel/Toast';
import "../components/panel/StylesReact.css"


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

export default function NoticiaList() {

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

    const noticiaPrincipal =
        filtro === "Totes" && noticias.length > 0
        ? noticias[0]
        : null;

    const restoNoticias =
        filtro === "Totes"
        ? noticias.slice(1)
        : noticias;

    return(<>
        <div className="max-w-6xl mx-auto">
            <div>
                <h1 className="font-bold text-6xl text-blanco">Notícies del torneig</h1>
                <h2 className="font-medium text-2xl text-gray-300">Tota l'actualitat en un sol lloc.</h2>
            </div>

            <div className="mt-10">
                <div className="flex items-center gap-x-2 fill-amarillo text-amarillo">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                        <path d="M400-240v-80h160v80zM240-440v-80h480v80zM120-640v-80h720v80z"/>
                    </svg>
                    <p>Filtrar per categoria</p>
                </div>

                <div className="flex flex-row items-center gap-x-2 mt-2 overflow-x-auto relative">
                    {
                        categorias.map((categoria) =>(
                            <div onClick={() => setFiltro(categoria.nombre)} className={` px-3 py-2 rounded-full text-blanco cursor-pointer ${filtro === categoria.nombre ? 'bg-primary text-gris':'bg-gris-claro/30'}`}>
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

                {
                    filtro === "Totes" ? (
                        <>
                             {/* Noticia destacada solo cuando se muestran todas */}
                                {noticiaPrincipal && (
                                    <article className="w-full md:h-1/2 max-md:h-150 mt-5 relative group overflow-hidden rounded-2xl" >
                                    <img
                                        src={noticiaPrincipal.cover_image}
                                        alt={noticiaPrincipal.titular}
                                        className="w-full h-full object-cover degradado-img group-hover:scale-105 duration-300 transition-all rounded-2xl"
                                    />

                                    <div className="absolute left-5 flex flex-col gap-y-5 max-md:gap-y-1.5  bottom-5 w-2/3">
                                        <span className="w-max px-2 py-0.5 rounded text-gris font-medium max-md:text-sm bg-amarillo">{noticiaPrincipal.categoria}</span>

                                        <h2 className="text-4xl max-md:text-xl font-extrabold text-blanco max-md:line-clamp-2">{noticiaPrincipal.titular}</h2>
                                        <p className="text-2xl max-md:text-lg italic font-medium text-gray-300 max-md:line-clamp-1">{noticiaPrincipal.subtitulo}</p>

                                        <div className="w-full text-base max-md:text-xs flex flex-wrap md:gap-10 max-md:gap-2 text-gray-300 fill-gray-300">
                                            <span className="flex items-center gap-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 max-md:w-3 max-md:h-3" viewBox="0 -960 960 960">
                                                    <path d="M367-527q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440t130 15.5T736-378q29 15 46.5 43.5T800-272v112zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360t-111 13.5T260-306q-9 5-14.5 14t-5.5 20zm296.5-343.5Q560-607 560-640t-23.5-56.5T480-720t-56.5 23.5T400-640t23.5 56.5T480-560t56.5-23.5M480-240"/>
                                                </svg>
                                                {noticiaPrincipal.author}
                                            </span>
                                            <span className="flex items-center gap-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 max-md:w-3 max-md:h-3" viewBox="0 -960 960 960">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80zm0-80h560v-400H200zm0-480h560v-80H200zm0 0v-80z"/>
                                                </svg>
                                                {formatDataCatalaFromISO(noticiaPrincipal.publication_date)}
                                            </span>
                                        </div>

                                        <a href={`/noticias/${noticiaPrincipal.slug}`} className="max-w-40 py-3 flex items-center gap-x-2 place-content-center rounded-2xl bg-primary text-azul fill-azul hover:bg-accent duration-300">
                                            Llegir més
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56z"/>
                                            </svg>
                                        </a>
                                    </div>
                                    

                                    

                                    
                                    </article>
                                )}

                                {/* Resto de noticias */}
                                <div className="w-full grid md:grid-cols-3 max-md:grid-cols-1 place-items-center gap-6 mt-10">
                                    {restoNoticias.map((noticia) => (
                                    <a href={`/noticias/${noticia.slug}`} key={noticia.slug} className="w-90 h-96 bg-gris-claro grid grid-rows-[auto_1fr] rounded-2xl overflow-hidden duration-300 hover:-translate-y-4 border border-transparent hover:border-primary">
                                        <img
                                        src={noticia.cover_image}
                                        alt={noticia.titular}
                                        className="w-full h-50 object-cover"
                                        />
                                        <div className="w-full h-full p-2 grid grid-rows-[1fr_auto] grid-cols-1 gap-y-2 text-blanco">
                                            <div className="flex flex-col gap-y-2">
                                                <span className="w-max px-2 py-0.5 rounded text-gris font-medium text-sm bg-amarillo">{noticia.categoria}</span>

                                                <h3 className="font-bold text-xl line-clamp-2">{noticia.titular}</h3>

                                                <p className="italic text-base text-gray-400 line-clamp-1">{noticia.subtitulo}</p>
                                            </div>
                                            

                                            <div className="flex flex-row items-center place-content-between border-t border-gray-500 py-1 text-gray-300">
                                                <span>{noticia.author}</span>
                                                <span>{formatDataCatalaFromISO(noticia.publication_date)}</span>
                                            </div>
                                        </div>
                                        
                                    </a>
                                    ))}
                                </div>
                        </>
                    ):(
                        <>
                        {/* Resto de noticias */}
                                <div className="w-full grid md:grid-cols-3 max-md:grid-cols-1 place-items-center gap-6 mt-10">
                                    {noticias.map((noticia) => (
                                    <a href={`/noticias/${noticia.slug}`} key={noticia.slug} className="w-90 h-96 bg-gris-claro grid grid-rows-[auto_1fr] rounded-2xl overflow-hidden duration-300 hover:-translate-y-4 border border-transparent hover:border-primary">
                                        <img
                                        src={noticia.cover_image}
                                        alt={noticia.titular}
                                        className="w-full h-50 object-cover"
                                        />
                                        <div className="w-full h-full p-2 grid grid-rows-[1fr_auto] grid-cols-1 gap-y-2 text-blanco">
                                            <div className="flex flex-col gap-y-2">
                                                <span className="w-max px-2 py-0.5 rounded text-gris font-medium text-sm bg-amarillo">{noticia.categoria}</span>

                                                <h3 className="font-bold text-xl line-clamp-2">{noticia.titular}</h3>

                                                <p className="italic text-base text-gray-400 line-clamp-1">{noticia.subtitulo}</p>
                                            </div>
                                            

                                            <div className="flex flex-row items-center place-content-between border-t border-gray-500 py-1 text-gray-300">
                                                <span>{noticia.author}</span>
                                                <span>{formatDataCatalaFromISO(noticia.publication_date)}</span>
                                            </div>
                                        </div>
                                        
                                    </a>
                                    ))}
                                </div>
                        </>
                    )
                }
                
            </div>

        </div>
        
    </>)
}