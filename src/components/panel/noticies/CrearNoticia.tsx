import { useEffect, useState, useRef } from "react";
import { useToast } from '@components/panel/Toast';
import "../StylesReact.css"
    type BloqueTexto = {
        id: string;
        order: number;
        type: "text";
        title: string;
        body: string;
    };

type BloqueImagen = {
    id: string;
    order: number;
    type: "imagen"; // 👈 IMPORTANTE
    title: string;
    body: ImagenBloque;
};

    type ImagenBloque = {
    file?: File;
    url: string;
    id: string;
    alt?: string;
    autor?: string;
};

    type BloqueCita = {
        id: string;
        order: number;
        type: "cita";
        title: string;
        body: {
            text: string;
            autor: string;
        };
    };

    type BloqueGaleria = {
        id: string;
        order: number;
        type: "galeria";
        title: string;
        body: any[];
    };

    type Bloque = BloqueTexto | BloqueImagen | BloqueCita | BloqueGaleria;

    type NoticiaData = {
        id: string;
        titular: string;
        subtitulo: string;
        cover_image: string;
        slug: string;
        author: string;
        author_curso: string;
        status: string;
        created_at: string;
        publication_date: string;
        content: Bloque[];
        last_save?: string;
        tiempo_lectura: string;
        categoria: string;
    };

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

const CATEGORIAS = [
    "Bases de Competició",
    "Normativa",
    "Inscripció",
    "Equips",
    "Voluntaris",
    "Actualitat",
    "Clasificació"

]
export default function CrearNoticia({user}:{user:any}) {
    const { addToast } = useToast();
    
    


    const crearBloque = (tipo: "text" | "imagen" | "cita" | "galeria", order: number): Bloque => {
        const id = `bloque_${order}`;

        switch (tipo) {
            case "text":
                return {
                    id,
                    order,
                    type: "text",
                    title: "",
                    body: ""
                };

            case "imagen":
                return {
                    id,
                    order,
                    type: "imagen",
                    title: "",
                    body: {
                        file: undefined,
                        id: "",
                        url: "",
                        alt: "",
                        autor: "",
                    }
                };

            case "cita":
                return {
                    id,
                    order,
                    type: "cita",
                    title: "",
                    body: {
                        text: "",
                        autor: ""
                    }
                };

            case "galeria":
                return {
                    id,
                    order,
                    type: "galeria",
                    title: "",
                    body: []
                };
        }
};


    const defaultData: NoticiaData = {
        "id": "",
        "titular": "",
        "subtitulo": "",
        "cover_image": "",
        "slug": "",
        "tiempo_lectura": "",
        "categoria": "",
        "author": `${user?.nombre_real} ${user?.apellidos}` || "",
        "author_curso": `${user?.curso || ""}`,
        "status": "Esborrany",
        "created_at": new Date().toISOString(),
        "publication_date": new Date().toISOString(),
        "content": [
            crearBloque("text", 1)
        ]
    };

   
    const [data, setData] = useState<NoticiaData>(defaultData);
    const [bloqueActivo, setBloqueActivo] = useState<string | null>(null);
    const [cantidadBloques, setCantidadBloques] = useState(1);
    const [ borradorCargado, setBorradorCargado] = useState(false);
    const editorRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [slug, setSlug] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [imgSubidas, setImgSubidas] = useState(false);


//     useEffect(() => {
//     const borrador = recuperarPrimerBorrador();

//     if (borrador) {

//         setData(borrador);
//         addToast({
//         type: "info",
//         message: "Esborrany carregat correctament",
//         duration: 5000,
//         });
//         setBorradorCargado(true);
//     } else{
//         setData(defaultData);
//     }
// }, []);

const obtenerUltimoNumeroBloque = (content: Bloque[]) => {
    return content.reduce((max, bloque) => {
        const numero = Number(
            bloque.id.replace("bloque_", "")
        );

        return numero > max ? numero : max;
    }, 0);
};

const recuperarPrimerBorrador = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (!key?.startsWith("noticia_")) continue;

        const contenido = localStorage.getItem(key);

        if (!contenido) continue;


        try {
            const parsedContenido = JSON.parse(contenido);

            setCantidadBloques(
                obtenerUltimoNumeroBloque(parsedContenido.content ?? [])
            );

            setSlug(parsedContenido.slug ?? "");
            if(parsedContenido.cover_image){
                setPreview(parsedContenido.cover_image)
            }
            return parsedContenido;
        } catch (error) {
            console.error(`Error leyendo ${key}:`, error);
        }

        
    }

    return null;
};
    

    const [enlaceOpen, setEnlaceOpen] = useState(false);
    const [enlaceTexto, setEnlaceTexto] = useState("");
    const [enlaceUrl, setEnlaceUrl] = useState("");
    const [selectionRange, setSelectionRange] = useState<Range | null>(null);
    const [modoEnlace, setModoEnlace] = useState<"create" | "edit">("create");
    

    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
    // No guardar si no hay título
    if (!data.titular.trim()) return;

    const timeout = setTimeout(() => {
        const clave = `noticia_${generarSlug(data.slug)}`;
        const minutosLectura = calcularTiempoLectura(data.content);
        localStorage.setItem(
            clave,
            
            JSON.stringify({
                ...data,
                tiempo_lectura: minutosLectura,
                last_save: new Date().toISOString()
            })
        );

        console.log(`Guardado automático: ${clave}`);
        addToast({
        type: "localSave",
        message: "Esborrany guardat correctament",
        duration: 3000,
        });
    }, 10000); // 10 segundos

    return () => clearTimeout(timeout);
}, [data]);
    
    const tiposBloque = [
        {
            nombre: "Text",
            icono: "M280-160v-520H80v-120h520v120H400v520zm360 0v-320H520v-120h360v120H760v320z",
            id: "text"
        },
        {
            nombre: "Imatge",
            icono: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120zm0-80h560v-560H200zm40-80h480L570-480 450-320l-90-120zm-40 80v-560z",
            id: "imagen"
        },
        {
            nombre: "Cita",
            icono: "m228-240 92-160q-66 0-113-47t-47-113 47-113 113-47 113 47 47 113q0 23-5.5 42.5T458-480L320-240zm360 0 92-160q-66 0-113-47t-47-113 47-113 113-47 113 47 47 113q0 23-5.5 42.5T818-480L680-240zM362.5-517.5Q380-535 380-560t-17.5-42.5T320-620t-42.5 17.5T260-560t17.5 42.5T320-500t42.5-17.5m360 0Q740-535 740-560t-17.5-42.5T680-620t-42.5 17.5T620-560t17.5 42.5T680-500t42.5-17.5M320-560",
            id: "cita"
        },
        // {
        //     nombre: "Galeria",
        //     icono: "M360-400h400L622-580l-92 120-62-80zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240zm0-80h480v-480H320zM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80zm160-720v480z",
        //     id: "galeria"
        // },
    ]

    const estilosTexto = [
        {
            seccion: "Tipografia",
            opciones: [
                {
                    icono:"M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200zm121-112h104q48 0 58.5-24.5T566-372t-10.5-35.5T494-432H393zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95z",
                    id: "bold"
                },
                {
                    icono:"M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100z",
                    id: "italic"
                },
                {
                    icono:"M200-120v-80h560v80zm123-223q-56-63-56-167v-330h103v336q0 56 28 91t82 35 82-35 28-91v-336h103v330q0 104-56 167t-157 63-157-63",
                    id: "underline"
                }
            ]
        },
        {
            seccion: "enlaces",
            opciones: [
                {
                    icono:"M440-280H280q-83 0-141.5-58.5T80-480t58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85 35 85 85 35h160zM320-440v-80h320v80zm200 160v-80h160q50 0 85-35t35-85-35-85-85-35H520v-80h160q83 0 141.5 58.5T880-480t-58.5 141.5T680-280z",
                    id: "enlace"
                },
                {
                    icono:"M360-200v-80h480v80zm0-240v-80h480v80zm0-240v-80h480v80zM200-160q-33 0-56.5-23.5T120-240t23.5-56.5T200-320t56.5 23.5T280-240t-23.5 56.5T200-160m0-240q-33 0-56.5-23.5T120-480t23.5-56.5T200-560t56.5 23.5T280-480t-23.5 56.5T200-400m-56.5-263.5Q120-687 120-720t23.5-56.5T200-800t56.5 23.5T280-720t-23.5 56.5T200-640t-56.5-23.5",
                    id: "ul"
                },
                {
                    icono:"M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60zm60-280v-180h-60v-60h120v240zm180 440v-80h480v80zm0-240v-80h480v80zm0-240v-80h480v80z",
                    id: "ol"
                }
            ]
        },
       

        {
            seccion: "Alineació",
            opciones: [
                {
                    icono:"M120-120v-80h720v80zm0-160v-80h480v80zm0-160v-80h720v80zm0-160v-80h480v80zm0-160v-80h720v80z",
                    id: "left"
                },
                {
                    icono:"M120-120v-80h720v80zm160-160v-80h400v80zM120-440v-80h720v80zm160-160v-80h400v80zM120-760v-80h720v80z",
                    id: "center"
                }
            ]
        }
        
    ]

useEffect(() => {
    data.content.forEach((bloque) => {
        if (bloque.type !== "text") return;

        const el = editorRefs.current.get(bloque.id);
        if (el && el.innerHTML === "") {
            el.innerHTML = bloque.body;
        }
    });
}, [borradorCargado]);

const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida");
        return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
    setFileName(file.name);
    setCoverFile(file);
};

useEffect(() => {
    logImagenesInfo();
}, [coverFile, data.content]);

const obtenerImagenes = () => {
    const imagenes: {
        tipo: "cover" | "bloque";
        file: File;
        bloqueId?: string;
    }[] = [];

    if (coverFile) {
        imagenes.push({
            tipo: "cover",
            file: coverFile
        });
    }

    data.content.forEach((bloque) => {
        if (
            bloque.type === "imagen" &&
            bloque.body?.file
        ) {
            imagenes.push({
                tipo: "bloque",
                file: bloque.body.file,
                bloqueId: bloque.id
            });
        }
    });

    return imagenes;
};

const logImagenesInfo = () => {
    const imagenes = obtenerImagenes();

    if (imagenes.length === 0) {
        console.log("No hay imágenes cargadas.");
        return;
    }

    console.log(`Total de imágenes: ${imagenes.length}`);

    imagenes.forEach((imagen) => {
        const { file, tipo, bloqueId } = imagen;

        console.log(
            `Imagen ${tipo}${bloqueId ? ` (${bloqueId})` : ""}: ` +
            `nombre="${file.name}", ` +
            `tamaño=${file.size} bytes, ` +
            `formato=${file.type}`
        );
    });
};

    // Función principal
const actualizarTitular = (nuevoTitular: string) => {
  const nuevoSlug = generarSlug(nuevoTitular);

  setData((prev: any) => ({
    ...prev,
    titular: nuevoTitular,
    slug: nuevoSlug,
  }));
  setSlug(nuevoSlug)
};

// Función generarSlug (necesaria)
const generarSlug = (titulo: string): string => {
  if (!titulo) return '';

  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // Elimina acentos
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

    const removeImage = () => {
        if (preview) {
        URL.revokeObjectURL(preview); // Liberar memoria
        }
        setPreview(null);
        setFileName('');
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const calcularTiempoLectura = (content: Bloque[]): number => {
    let totalPalabras = 0;

    content.forEach((bloque) => {
        if (bloque.type !== "text") return;

        // Eliminar etiquetas HTML
        const textoPlano = bloque.body.replace(/<[^>]*>/g, " ");

        const palabras = textoPlano
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        totalPalabras += palabras.length;
    });

    return Math.max(1, Math.ceil(totalPalabras / 200));
};

    
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

    // const actualizarContenido = () => {
    //     if (!editorRef.current) return;
    //     editorRef.current.focus();
    //     setContenido(editorRef.current.innerHTML);

    //     //console.log("Contenido actualizado:", editorRef.current.innerHTML);
    // };

    const aplicarFormato = (comando: string, valor?: string) => {
        document.execCommand(comando, false, valor);

        if(comando === "enlace") {
            solicitudEnlace();
        }
        actualizarEstadoFormato();
    };

    const actualizarEstadoFormato = () => {
    const formats = new Set<string>();

    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("enlace")) formats.add("enlace");
    if (document.queryCommandState("justifyLeft")) formats.add("left");
    if (document.queryCommandState("justifyCenter")) formats.add("center");
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
    if (document.queryCommandState("insertOrderedList")) formats.add("ol");

    setActiveFormats(formats);
};

        const actualizarBloque = (
            id: string,
            campo: "title" | "body",
            valor: string
        ) => {
            
            setData(prev => ({
                ...prev,
                content: prev.content.map(bloque =>
                    bloque.id === id
                        ? {
                            ...bloque,
                            [campo]: valor
                        }
                        : bloque
                )
            }));
        };

const actualizarBloqueImagen = (
    id: string,
    valor: ImagenBloque
) => {
    setData((prev) => ({
        ...prev,
        content: prev.content.map((bloque): Bloque => {
            if (
                bloque.id !== id ||
                bloque.type !== "imagen"
            ) {
                return bloque;
            }

            return {
                ...bloque,
                body: valor
            };
        })
    }));
};

    const crearEnlace = () => {
        if (!enlaceUrl || !enlaceTexto) return;

        const selection = window.getSelection();

        if (selection && selectionRange) {
            selection.removeAllRanges();
            selection.addRange(selectionRange);
        }

        if (modoEnlace === "edit") {
            const link = getLinkFromSelection();

            if (link) {
                link.setAttribute("href", enlaceUrl);
                link.textContent = enlaceTexto;
            }
        } else {
            document.execCommand(
                "insertHTML",
                false,
                `<a href="${enlaceUrl}" class="text-primary underline" target="_blank">${enlaceTexto}</a>`
            );
        }

        setEnlaceOpen(false);
        setEnlaceUrl("");
        setEnlaceTexto("");
        setSelectionRange(null);
    };

    const eliminarEnlace = () => {
        const link = getLinkFromSelection();

        if (!link) return;

        const text = link.textContent || "";

        link.replaceWith(document.createTextNode(text));

        setEnlaceOpen(false);
    };

    const getLinkFromSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const node = selection.anchorNode as HTMLElement | null;

        if (!node) return null;

        const link = node.parentElement?.closest("a");
        console.log("Link encontrado:", link);
        return link;
    };

    const solicitudEnlace = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        const existingLink = getLinkFromSelection();
        const enlaceUrl = existingLink?.getAttribute("href") || "";
        
        console.log("URL del enlace:", enlaceUrl);
        setSelectionRange(range);
        setEnlaceTexto(selectedText);

        if (existingLink) {
            setEnlaceUrl(enlaceUrl);
            setModoEnlace("edit"); // opcional
        } else {
            setEnlaceUrl("");
            setModoEnlace("create");
        }

        setEnlaceOpen(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!e.ctrlKey) return;

        switch (e.key.toLowerCase()) {
            case "b":
                e.preventDefault();
                aplicarFormato("bold");
                break;

            case "i":
                e.preventDefault();
                aplicarFormato("italic");
                break;

            case "u":
                e.preventDefault();
                aplicarFormato("underline");
                break;

            case "k":
                e.preventDefault();
                    solicitudEnlace();
                break;

            case "l":
                e.preventDefault();
                aplicarFormato("justifyLeft");
                break;

            case "c":
                e.preventDefault();
                aplicarFormato("justifyCenter");
                break;
            
            case "Enter":
                e.preventDefault();
                document.execCommand("insertLineBreak");
                break;

            default:
                break;
        }
    };

    const elminarBloque = (id: string) => {
        setData(prev => ({
            ...prev,
            content: prev.content.filter((bloque: any) => bloque.id !== id)
        }));
    };

    const actualizarBodyCampo = (
    id: string,
    campo: string,
    valor: any
) => {
    setData(prev => ({
        ...prev,
        content: prev.content.map(bloque =>
            bloque.id === id
                ? {
                    ...bloque,
                    body: typeof bloque.body === 'object' && bloque.body !== null
                        ? {
                            ...bloque.body,
                            [campo]: valor
                        }
                        : valor
                }
                : bloque
        )
    }));
};



const bajarBloque = (bloqueId: string) => {
    setData(prev => {
        const content = [...prev.content];

        const ordenados = [...content].sort((a, b) => a.order - b.order);

        const indice = ordenados.findIndex(b => b.id === bloqueId);

        // Ya está arriba del todo
        if (indice <= 0) return prev;

        const bloqueActual = ordenados[indice];
        const bloqueSuperior = ordenados[indice - 1];

        const ordenActual = bloqueActual.order;

        bloqueActual.order = bloqueSuperior.order;
        bloqueSuperior.order = ordenActual;

        return {
            ...prev,
            content
        };
    });
};

const subirBloque = (bloqueId: string) => {
    setData(prev => {
        const content = [...prev.content];

        const ordenados = [...content].sort((a, b) => a.order - b.order);

        const indice = ordenados.findIndex(b => b.id === bloqueId);

        // Ya está abajo del todo
        if (indice === -1 || indice >= ordenados.length - 1) return prev;

        const bloqueActual = ordenados[indice];
        const bloqueInferior = ordenados[indice + 1];

        const ordenActual = bloqueActual.order;

        bloqueActual.order = bloqueInferior.order;
        bloqueInferior.order = ordenActual;

        return {
            ...prev,
            content
        };
    });
};

const subirImagenes = async () => {
    const imagenes = obtenerImagenes();

    let nuevoData = structuredClone(data);

    for (const imagen of imagenes) {
        const formData = new FormData();

        formData.append("file", imagen.file);
        formData.append("tipo", imagen.tipo);

        if (imagen.bloqueId) {
            formData.append("bloqueId", imagen.bloqueId);
        }

        const response = await fetch(
            "/api/panel/noticias/upload-imagen",
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error("Upload failed");
        }

        if (imagen.tipo === "cover") {
            nuevoData.cover_image = result.url;
        }

        if (imagen.tipo === "bloque") {
            nuevoData.content = nuevoData.content.map((bloque) => {
                if (
                    bloque.id === imagen.bloqueId &&
                    bloque.type === "imagen"
                ) {
                    return {
                        ...bloque,
                        body: {
                            ...bloque.body,
                            url: result.url,
                        },
                    };
                }

                return bloque;
            });
        }
    }

    setData(nuevoData);
    setImgSubidas(true);

    return nuevoData;
};

const publicarNotiAhora = async () => {
    setEnviando(true);

    try {
        let noticiaFinal = data;

        if (!imgSubidas) {
            noticiaFinal = await subirImagenes();
        }

        const respuesta = await fetch(
            "/api/panel/noticias/crear-noticia",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(noticiaFinal),
            }
        );

        const result = await respuesta.json();

        if (!result.ok) {
            console.log(result.error);
            setEnviando(false);
            return;
        }

        window.location.replace("/panel/noticies");
    } catch (error) {
        console.error(error);
        setEnviando(false);
    }
};



    return(<>
    <div className="w-full h-full grid grid-rows-[auto_1fr] gap-y-4 overflow-hidden">
        <div className="w-full h-auto py-2 border-b flex items-center place-content-around border-gris-claro">
            {/* <a href={`/panel/info/noticia?accio=ver&slug=${slug}`} target="_blank">Previsualització</a> */}
            <p className="max-md:hidden flex items-center gap-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-blanco" viewBox="0 -960 960 960">
                    <path d="m612-292 56-56-148-148v-184h-80v216zM480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q133 0 226.5-93.5T800-480t-93.5-226.5T480-800t-226.5 93.5T160-480t93.5 226.5T480-160"/>
                </svg>
                    <span className="max-md:hidden">Temps de lectura:</span> {data.tiempo_lectura} min
            </p>
            <div onClick={() => publicarNotiAhora()} className="w-max h-max rounded-2xl px-3 py-2 bg-azul-suave cursor-pointer">
                Publicar Notícia
            </div>
            
            <select
                value={data.categoria}
                onChange={(e) =>
                    setData((prev) => ({
                        ...prev,
                        categoria: e.target.value
                    }))
                }
                className="border border-primary mt-2 bg-gris rounded px-3 py-2"
            >
                <option value="">Selecciona una categoría</option>

                {CATEGORIAS.map((categoria) => (
                    <option
                        key={categoria}
                        value={categoria}
                    >
                        {categoria}
                    </option>
                ))}
            </select>
            
        </div>
        <div className="w-full h-full flex flex-col items-center gap-y-4 relative max-md:p-2 overflow-y-scroll ">
        
        <div className="max-w-200 w-full h-full mb-20">
            {/* Imatge de portada */}
            <div className="max-w-200 w-full h-100 bg-gris-claro/50 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-y-3 border border-dashed border-gray-400 hover:border-gray-500 transition-colors">

                {preview ? (
                    // Vista de previsualización (AHORA ES CLICKABLE)
                    <div 
                    className="relative flex-1 rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}  // ← Esto es lo importante
                    >
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay al pasar el mouse */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Canviar imatge</p>
                    </div>

                    {/* Botón para eliminar */}
                    {/* <button
                        onClick={(e) => {
                        e.stopPropagation(); // ← Importante: evita que se abra el input
                        removeImage();
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                        ✕
                    </button> */}

                    {fileName && (
                        <p className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate max-w-35">
                        {fileName}
                        </p>
                    )}
                    </div>
                ) : (
                    // Zona de carga (cuando no hay imagen)
                    <label 
                    htmlFor="image-upload"
                    className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
                    >
                    <p className="text-sm text-gray-400 text-center">
                        Fes clic per a pujar una imatge<br />
                        <span className="text-xs">PNG, JPG, WEBP</span>
                    </p>
                    </label>
                )}

                <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {!preview && (
                    <p className="text-center text-xs text-gray-500">
                    Tamaño recomendado: 1920x1080 px
                    </p>
                )}
            </div>
            
            {/* Titular, subtitulo, autor, fecha, slug */}
            
            <input type="text" value={data.titular} onChange={(e) => actualizarTitular(e.target.value)} placeholder="Titular" className="w-full text-2xl mt-10 font-bold bg-transparent border-b border-gris-claro focus:border-primary outline-none transition-colors" />
            <input type="text" value={data.subtitulo} onChange={(e) => setData({...data, subtitulo: e.target.value})} placeholder="Subtítol" className="w-full text-lg mt-5 font-light bg-transparent border-b border-gris-claro focus:border-primary outline-none transition-colors" />
            {/* Seleccionar categoria, con desplegable y en el caso de otros, con input */}
            
            {/* Datos generales: autor, fecha, slug */}
            <div className="w-full grid md:grid-cols-[1fr_1fr_2fr] space-y-4 gap-x-6 mt-5">
                <div className="flex flex-col gap-y-1">
                    <p>Autor</p>
                    <p className="font-light">{data.author} <br/> {data.author_curso}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p>Data de publicació</p>
                    <p className="font-light">{formatDataCatalaFromISO(data.publication_date)}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p>Slug</p>
                    <p className="font-light overflow-hidden text-primary text-ellipsis"><span className="text-gray-500">/noticia/</span>{data.slug}</p>
                </div>
            </div>

            {/* Sección de contenido (bloques) */}
            <div className="w-full h-auto mb-20">
                {/* Contenedor 1 (solo texto) */}
                {data.content.sort((a, b) => a.order - b.order).map((bloque) => {
                    if (bloque.type === "text") {
                        return(
                            <div key={bloque.id} className="w-full h-auto mt-10 rounded-2xl relative group">
                                <input
                                    type="text"
                                    placeholder="Títol del bloc (opcional)"
                                    value={bloque.title}
                                    onChange={(e) =>
                                        actualizarBloque(
                                            bloque.id,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full text-lg font-bold bg-transparent border-b border-gris-claro focus:border-primary outline-none transition-colors"
                                />

                                <div className="relative mt-5">
                    
                                {!bloque.body && (
                                    <p className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                                        Comença a escriure...
                                    </p>
                                )}
                                <p
                                ref={(el) => {
                                    if (el) {
                                        editorRefs.current.set(bloque.id, el);
                                    }
                                }}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setBloqueActivo(bloque.id)}
                                    onInput={(e) => {
                                        let html = e.currentTarget.innerHTML;

                                        html = html
                                            .replace(/<div>/g, "<p>")
                                            .replace(/<\/div>/g, "</p>");

                                        actualizarBloque(
                                            bloque.id,
                                            "body",
                                            html
                                        );

                                        actualizarEstadoFormato();
                                    }}
                                    onKeyUp={actualizarEstadoFormato}
                                    onMouseUp={actualizarEstadoFormato}
                                    onKeyDown={handleKeyDown}
                                    // dangerouslySetInnerHTML={{
                                    //     __html: bloque.body
                                    // }}
                                    className=" w-full min-h-20 mb-10 border border-dashed border-gray-500 rounded-2xl p-4 outline-none focus:border-primary"
                                />
                            </div>
                            {/* Menu lateral acciones bloque */}
                            <div className={`absolute md:w-10  md:top-0 md:-right-16 max-md:-top-10 opacity-0 group-hover:opacity-100 flex max-md:flex-row md:flex-col gap-y-4  transition-opacity ${bloqueActivo === bloque.id ? "opacity-100" : ""} rounded-lg p-2 cursor-pointer z-10`}>
                                <div onClick={() => elminarBloque(bloque.id)} className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center place-content-center fill-red-400 hover:bg-red-700 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                    </svg>
                                </div>

                                <div onClick={() => bajarBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56z"/>
                                    </svg>
                                </div>
                                <div onClick={() => subirBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56z"/>
                                    </svg>
                                </div>
                            </div>
                            </div>
                        )
                    }

                    if (bloque.type === "imagen") {
                        return (
                            <div
                                key={bloque.id}
                                className="w-full h-auto mt-10 rounded-2xl relative group border border-dashed border-gray-500 p-4"
                            >
                                {/* INPUT FILE */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    name={`file_input_${bloque.id}`}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) return;

                                        const previewUrl = URL.createObjectURL(file);

                                        actualizarBloqueImagen(
                                            bloque.id,
                                            {
                                                ...bloque.body,
                                                file,
                                                url: previewUrl,
                                                id: `${bloque.id}_img`
                                            }
                                        );
                                    }}
                                    className="mb-4"
                                />

                                {/* PREVIEW */}
                                {bloque.body?.url && (
                                    <div className="w-full h-64 rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={bloque.body.url}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* ALT */}
                                <input
                                    type="text"
                                    value={bloque.body?.alt || ""}
                                    placeholder="Alt de la imagen"
                                    onChange={(e) =>
                                        actualizarBloqueImagen(
                                            bloque.id,
                                            {
                                                ...bloque.body,
                                                alt: e.target.value
                                            }
                                        )
                                    }
                                    className="w-full text-sm bg-transparent border-b border-gray-400 focus:border-primary outline-none mt-2"
                                />

                                {/* PIE DE FOTO / AUTOR */}
                                <input
                                    type="text"
                                    value={bloque.body?.autor || ""}
                                    placeholder="Pie de foto / autor"
                                    onChange={(e) =>
                                        actualizarBloqueImagen(
                                            bloque.id,
                                            {
                                                ...bloque.body,
                                                autor: e.target.value
                                            }
                                        )
                                    }
                                    className="w-full text-sm bg-transparent border-b border-gray-400 focus:border-primary outline-none mt-2"
                                />

                                {/* DELETE BLOQUE */}
                                <div className={`absolute w-10  top-0 -right-16 opacity-0 group-hover:opacity-100 flex flex-col gap-y-4  transition-opacity ${bloqueActivo === bloque.id ? "opacity-100" : ""} rounded-lg p-2 cursor-pointer z-10`}>
                                <div onClick={() => elminarBloque(bloque.id)} className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center place-content-center fill-red-400 hover:bg-red-700 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                    </svg>
                                </div>

                                <div onClick={() => bajarBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56z"/>
                                    </svg>
                                </div>
                                <div onClick={() => subirBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56z"/>
                                    </svg>
                                </div>
                            </div>
                            </div>
                        );
                    }

                    if(bloque.type === "cita") {
                        return(
                            <div key={bloque.id} className="w-full h-auto mt-10 rounded-2xl relative group border-l-4 border-primary pl-6 py-4">
                                <input value={bloque.body?.text || ""} placeholder="Text de la cita" onChange={(e) => actualizarBodyCampo( bloque.id, "text", e.target.value )} className="w-full text-sm bg-transparent border-b border-gray-400 focus:border-primary outline-none mt-2" />
                                <input value={bloque.body?.autor || ""} placeholder="Autor de la cita" onChange={(e) => actualizarBodyCampo( bloque.id, "autor", e.target.value )} className="w-full text-sm bg-transparent border-b border-gray-400 focus:border-primary outline-none mt-2" />
                             {/* DELETE BLOQUE */}
                                <div className={`absolute w-10  top-0 -right-16 opacity-0 group-hover:opacity-100 flex flex-col gap-y-4  transition-opacity ${bloqueActivo === bloque.id ? "opacity-100" : ""} rounded-lg p-2 cursor-pointer z-10`}>
                                <div onClick={() => elminarBloque(bloque.id)} className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center place-content-center fill-red-400 hover:bg-red-700 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                    </svg>
                                </div>

                                <div onClick={() => bajarBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56z"/>
                                    </svg>
                                </div>
                                <div onClick={() => subirBloque(bloque.id)} className="w-8 h-8 rounded-md text-white flex items-center place-content-center fill-gray-500 hover:bg-gris-claro/40 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56z"/>
                                    </svg>
                                </div>
                            </div>
                            </div>
                        )
                    }
                })}
                
                {/* Fin contenedor 1 */}

                {/* Botón para añadir nuevo bloque */}
                <div className="w-max h-max px-4 py-2 mx-auto flex flex-row items-center place-content-center gap-x-2  rounded-2xl border border-gris-claro cursor-pointer border-dashed relative hover:border-primary hover:text-primary hover:fill-primary transition-colors duration-300 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80z"/>
                    </svg>
                    <p>Afegir bloc</p>

                   
                    <div className="absolute -top-30 mt-2 w-max h-max px-4 py-2 rounded-2xl border border-gris-claro bg-gris shadow-lg opacity-0 group-hover:opacity-100 flex flex-row gap-2 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10 ">
                        {tiposBloque.map((tipo) => (
                        <div
                        onClick={() => {
                            const nuevoOrder = cantidadBloques + 1;

                            setData(prev => ({
                                ...prev,
                                content: [
                                    ...prev.content,
                                    crearBloque(tipo.id as "text" | "imagen" | "cita" | "galeria", nuevoOrder)
                                ]
                            }));

                            setCantidadBloques(nuevoOrder);
                        }}
                        key={tipo.id} className="w-30 h-24 flex flex-col gap-y-1.5 items-center place-content-center rounded-2xl border text-blanco fill-blanco hover:border-primary hover:text-primary hover:fill-primary hover:bg-primary/10 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                <path d={tipo.icono}/>
                            </svg>
                            <p className="text-sm">{tipo.nombre}</p>
                        </div>
                    ))}
                    </div>
                </div>
                
                

            </div>
            
            <div className="w-full h-20"></div>

            {
                enlaceOpen && (
                    <>
                    {enlaceOpen && (
                        <div className="fixed inset-0 bg-gris/50 backdrop-blur-sm flex items-center justify-center z-20">
                            
                            <div className="w-86 h-60 bg-gris-claro rounded-2xl p-6 flex flex-col gap-y-4">
    
                                <h3 className="text-lg font-bold">Crear enlace</h3>

                                {/* TEXTO DEL ENLACE */}
                                <input
                                    value={enlaceTexto}
                                    onChange={(e) => setEnlaceTexto(e.target.value)}
                                    type="text"
                                    placeholder="Texto del enlace"
                                    className="w-full border border-gray-500 rounded-md px-3 py-2 focus:border-primary outline-none transition-colors"
                                />

                                {/* URL */}
                                <input
                                value={enlaceUrl}
                                    onChange={(e) => setEnlaceUrl(e.target.value)}
                                    type="text"
                                    placeholder="Introdueix la URL"
                                    className="w-full border border-gray-500 rounded-md px-3 py-2 focus:border-primary outline-none transition-colors"
                                />

                                <div className="flex items-center justify-between gap-x-4 mt-auto">

                                    {/* Cancelar */}
                                    <button
                                        className="px-4 py-2 rounded-md border hover:bg-gray-500 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setEnlaceOpen(false);
                                            setEnlaceUrl("");
                                            setEnlaceTexto("");
                                            setSelectionRange(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    {/* BORRAR (solo en edit) */}
                                        {modoEnlace === "edit" && (
                                            <button
                                                className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                onClick={eliminarEnlace}
                                            >
                                                Eliminar
                                            </button>
                                        )}

                                    {/* Crear */}
                                    <button
                                        className="px-4 py-2 rounded-md bg-primary text-blanco hover:bg-primary/90 transition-colors cursor-pointer"
                                        onClick={crearEnlace}
                                    >
                                        Crear
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                    </>
                )
            }
        </div>
            
            



            {/* Menu estilos texto, imagen, galeria, cita, etc */}
            <div className="fixed bottom-5 bg-gris-claro/50 backdrop-blur-sm rounded-2xl p-4 flex gap-x-6">
                {estilosTexto.map((estilo) => (
                    <div key={estilo.seccion} className="flex gap-2">
                        {estilo.opciones.map((opcion) => {

                            const isActive =
                                activeFormats.has(opcion.id) ||
                                (opcion.id === "left" && activeFormats.has("left")) ||
                                (opcion.id === "center" && activeFormats.has("center")) ||
                                (opcion.id === "enlace" && activeFormats.has("enlace"));

                            return (
                                <div
                                    key={opcion.id}
                                    onMouseDown={(e) => {
                                        e.preventDefault();

                                        // map UI id -> execCommand
                                        const map: Record<string, string> = {
                                            bold: "bold",
                                            italic: "italic",
                                            underline: "underline",
                                            left: "justifyLeft",
                                            center: "justifyCenter",
                                            enlace: "enlace",
                                            ul: "insertUnorderedList",
                                            ol: "insertOrderedList"
                                        };

                                        aplicarFormato(map[opcion.id]);
                                    }}
                                    className={`
                                        w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors
                                        ${isActive ? "bg-primary/20" : "hover:bg-gris-claro"}
                                    `}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-6 h-6 ${isActive ? "fill-primary" : ""}`}
                                        viewBox="0 -960 960 960"
                                    >
                                        <path d={opcion.icono} />
                                    </svg>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>

        {/* Menu lateral bloques */}
        {/* <div className="flex flex-col w-74 border-l border-gris-claro font-light overflow-hidden">
            <h3 className="text-lg text-center  uppercase">Propietats del bloc</h3>
            <div className="h-px w-full bg-gris-claro my-2">&nbsp;</div>
            <div className="flex flex-col gap-y-4 w-full h-full overflow-y-auto px-4">
                <p className="text-lg font-normal">Tipus de bloc</p>
                <div className="grid grid-cols-2 grid-rows-2 place-items-center gap-y-2">
                    {tiposBloque.map((tipo) => (
                        <div key={tipo.id} className="w-30 h-24 flex flex-col gap-y-1.5 items-center place-content-center rounded-2xl border fill-blanco border-gris-claro cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                <path d={tipo.icono}/>
                            </svg>
                            <p className="text-sm">{tipo.nombre}</p>
                        </div>
                    ))}
                </div>
                <p className="text-lg font-normal">Disposició i espaiat</p>
                
                <div className="w-full  flex place-content-between items-center">
                    <label>Marge superior</label>
                    <input  type="range" className="w-30 accent-primary" min={0} max={100}  />
                </div>
                
                <div className="w-full  flex place-content-between items-center">
                    <label>Marge inferior</label>
                    <input  type="range" className="w-30 accent-primary" min={0} max={100}  />
                </div>
                
            </div>
        </div> */}
        {
            enviando &&(
                <div className="w-full h-full fixed z-20 top-0 left-0 flex flex-col items-center place-content-center bg-gris/60 backdrop-blur-sm">
                    <div className="w-full max-w-100 bg-gris p-10 dark:bg-gris rounded-xl p-xl shadow-xxl border border-primary/30 flex flex-col gap-y-3 items-center text-center animate-in fade-in zoom-in duration-300">
                    {/* <!-- Loading Illustration/Animation Container --> */}
                    <div className="relative w-20 h-20 mb-lg">
                    {/* <!-- Circular Spinner Base --> */}
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                    {/* <!-- Spinning Top Part --> */}
                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    {/* <!-- Icon in the middle --> */}
                    <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined fill-primary text-4xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 -960 960 960">
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71-29-71-71-29h-60v-80q0-83-58.5-141.5T480-720t-141.5 58.5T280-520h-20q-58 0-99 41t-41 99 41 99 99 41h100v80zm220-280"/>
                        </svg>
                    </span>
                    </div>
                    </div>
                    {/* <!-- Text Content --> */}
                    <h3 className="text-lg font-semibold mb-sm">Enviant dades...</h3>
                    <p className="text-gray-300 font-light mb-xl px-md">
                                    Si us plau, espera mentre s'actualitza la configuració del torneig. No tanquis aquesta finestra.
                                </p>
                    {/* <!-- Custom Progress Bar --> */}
                    <div className="loading-progress-bar">
                    <div className="loading-progress-fill"></div>
                    </div>
                    {/* <!-- Footer Help Text --> */}
                    <div className="mt-lg flex items-center gap-xs text-primary/60">
                    <span className="fill-primary" >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                            <path d="m438-338 226-226-57-57-169 169-84-84-57 57zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80m0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132m0-316"/>
                        </svg>
                    </span>
                    <span className="font-ajuda-text text-ajuda-text">Connexió segura establerta</span>
                    </div>
                    </div>
                </div>
            )
        }
    </div>
        
    </>)
}