import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@components/panel/StylesReact.css"
import { useToast } from '@components/panel/Toast';
type Props = {
torneoID?: string | null;
url: string;
accion: string;
usuario: any;
importar?:string |null;
};

type Seccion =
    | "info"
    | "equipos"
    | "voluntarios"
    | "reglas"
    | "entrenador"
    | "profesores"
    | "general"
    | "cursos"
    | "dominios";

type ErrorData = {
    seccion: Seccion;
    mensaje: string;
};


interface Edicio {
  id: number | null,
  id_torneo: string,
  nombre: string,
  fecha: string,
  estado: string,
  in_inicio: string,
  in_fin: string,
  vo_inicio: string,
  cursos: any,
  vo_fin: string,
  min_jugadores: number,
  max_jugadores: number,
  min_staff: number,
  max_staff: number,
  entrenador: string,
  profesor: string,
  dom_alumnos: string,
  dom_profesores: string,
  equipo_mixto: string,
  min_masc: number,
  min_fem: number
}



type ApiResponse = {
    ok: boolean;
    data?: string;
    error?: ErrorData;
};

export default function CrearEdicion({torneoID, url, accion, usuario, importar} : Props){
    const { addToast } = useToast();
    const [data, setData] = useState<Edicio | null>(null);
    const [error, setError] = useState<ErrorData | null>(null);
    const [enviando, setEnviando] = useState(false)
    const [importarID, setImportarID] = useState(importar)
    const [importarMenu, setImportarMenu] = useState(false)
    const [importarTipo, setImportarTipo] = useState<"tot" | "cursos">("tot")
    const [ediciones, setEdiciones] = useState<any[]>([])
    const [noImportar, setNoImportar] = useState(false)

    const STORAGE_KEY = "crearEdicionDraft";
    const EXPIRACION_MS = 15 * 60 * 1000; // 15 min
    const DELAY_GUARDADO = 5 * 1000; // 15 s

    // GUARDAR automáticamente 15s después del último cambio
    useEffect(() => {

    const timeout = setTimeout(() => {

        const confEdicion = {
        timestamp: Date.now(),
        contenido: data
        };

        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(confEdicion)
        );

        console.log("Array guardado");

        addToast({
        type: "localSave",
        message: "Esborrany guardat correctament",
        duration: 3000,
        });

    }, DELAY_GUARDADO);

    return () => clearTimeout(timeout);

    }, [data]);

useEffect(() => {

  const guardado = localStorage.getItem(STORAGE_KEY);

  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);

      const expirado =
        Date.now() - parsed.timestamp > EXPIRACION_MS;

      if (!expirado) {
        addToast({
        type: "info",
        message: "Esborrany carregat correctament",
        duration: 5000,
        });
        setData(parsed.contenido);
        setNoImportar(true);
        console.log("Draft cargado");
        return; // 👈 IMPORTANTE: no seguir
      }

      localStorage.removeItem(STORAGE_KEY);

    } catch (e) {
      console.error(e);
    }
  }

  if(importar && !noImportar){
            fetch("/api/panel/ImportarEdicion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ importarID }),
        })
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    
                    return;
                }

                const camposAVaciar = [
                    'id',
                    'id_torneo',
                    'nombre',
                    'fecha',
                    'in_inicio',
                    'in_fin',
                    'vo_inicio',
                    'vo_fin',
                    'fecha_cierre'
                    ];

                    // crear objeto con mismos campos pero algunos vacíos
                    const ConfiguracionLimpia = Object.fromEntries(
                    Object.entries(json).map(([key, value]) => [
                        key,
                        key === 'estado'
                        ? 'En Preparació'
                        : camposAVaciar.includes(key)
                            ? ''
                            : value
                    ])
                    ) as unknown as Edicio;

                setData(ConfiguracionLimpia); // 👈 FIX IMPORTANTE
                
            })
            .catch(() => {
                setError({
                    seccion: "general",
                    mensaje: "Error al cargar los datos"
                });
            });
    }

  // SOLO si no hay draft válido inicializas
//   inicializar();
    if(!importar || noImportar){
        setData({
                    id: 0,
                    id_torneo: "",           // se puede auto-generar después
                    nombre: "",
                    fecha: "",
                    estado: "En Preparació",
                    in_inicio: "",
                    in_fin: "",
                    vo_inicio: "",
                    vo_fin: "",
                    min_jugadores: 6,
                    max_jugadores: 9,
                    min_staff: 0,
                    max_staff: 0,
                    entrenador: "Permitido",
                    profesor: "Permitido",
                    dom_alumnos: "@alu.ibeducacio.eu",
                    dom_profesores: "@ibeducacio.eu",
                    equipo_mixto: "Denegado",
                    min_masc: 1,
                    min_fem: 1,
                    cursos: { cursos: [] }   // estructura correcta
                });
    }

}, [accion]);

useEffect(() => {
    if(importarMenu){
        fetch("/api/panel/Ediciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    
                    return;
                }

                setEdiciones(json); // 👈 FIX IMPORTANTE
                
            })
            .catch(() => {
                setError({
                    seccion: "general",
                    mensaje: "Error al cargar los datos"
                });
            });
    }
}, [importarMenu]);

    // useEffect(() => {
    //     const inicializar = async () => {
            

                
    //         }
        
        
        
    //     inicializar();
    // }, [importar]);



    const handleChange=(
        field:keyof Edicio,
        value:string|number
    )=>{

        setData(prev=>
            prev
            ?{
                ...prev,
                [field]:value
            }
            :null
        )

    }

    const handleToggle=(
        field:"entrenador"|"profesor"|"equipo_mixto"
    )=>{

        setData(prev=>
            prev
            ?{
                ...prev,
                [field]:
                    prev[field]==="Permitido"
                    ?"Denegado"
                    :"Permitido"
            }
            :null
        )

    }

const generarIdTorneo = (nombre: string): string => {

  const palabras = nombre
    .trim()
    .split(/\s+/)
    .filter((p: string) => p.length > 0);

  const iniciales = palabras
    .filter((p: string) => !/^\d+$/.test(p))
    .map((p: string) => p.charAt(0).toUpperCase())
    .join('');

  const matchNumeros = nombre.match(/(\d+)$/);

  const numeros = matchNumeros
    ? matchNumeros[1].slice(-2)
    : '';

  return `${iniciales}${numeros}`;
};
const handleNombreChange = (value: string) => {

  const idGenerada = generarIdTorneo(value);

  setData(prev =>
    prev
      ? {
          ...prev,
          nombre: value,
          id_torneo: idGenerada
        }
      : null
  );

};

    const refs: Record<Seccion, React.RefObject<HTMLDivElement | null>> = {
    info: useRef<HTMLDivElement>(null),
    equipos: useRef<HTMLDivElement>(null),
    voluntarios: useRef<HTMLDivElement>(null),
    reglas: useRef<HTMLDivElement>(null),
    entrenador: useRef<HTMLDivElement>(null),
    profesores: useRef<HTMLDivElement>(null),
    general: useRef<HTMLDivElement>(null),
    cursos: useRef<HTMLDivElement>(null),
    dominios: useRef<HTMLDivElement>(null),
};

    const handleSave = async () => {
    // if(noedit === true){
    //     addToast({
    //     type: 'warning',
    //     message: 'No es pot editar una edició ja finalitzada.',
    //     duration: 0,
    //     });
    //     return
    // }
    setEnviando(true)
    try {
        setError(null);

        const res = await fetch("/api/panel/CrearEdicion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data,
                url,
                accion,
                usuario
            })
        });

        const result: ApiResponse = await res.json();

        // error de API
        if (!res.ok || !result.ok) {

            if (result.error) {
                console.log("Error de API:", result.error);
                setError(result.error);

                refs[result.error.seccion]
                    ?.current
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
            }
            setEnviando(false)
            return;
        }

        // éxito
        
        addToast({
        type: 'success',
        message: 'Edició creada correctament',
        duration: 5000,
        });
        setError(null);
        setEnviando(false)
        window.location.replace("/panel/edicions");
        console.log(result.data);

    } catch (e) {
        console.error(e);

        setError({
            seccion: "info",
            mensaje: "Error del servidor"
        });
    }
};
    // Añadir nuevo curso
const addNewCurso = () => {
    setData(prev => {
        if (!prev) return prev;
        
        const newCurso = {
            curso: "Nuevo Curso",
            grupos: []
        };

        return {
            ...prev,
            cursos: {
                ...prev.cursos,
                cursos: [...(prev.cursos.cursos || []), newCurso]
            }
        };
    });
};

// Actualizar nombre del curso
const updateCursoName = (cursoIndex: number, newName: string) => {
    setData(prev => {
        if (!prev) return prev;
        const updatedCursos = [...prev.cursos.cursos];
        updatedCursos[cursoIndex].curso = newName;
        return {
            ...prev,
            cursos: { ...prev.cursos, cursos: updatedCursos }
        };
    });
};

// Añadir nuevo grupo
const addNewGrupo = (cursoIndex: number) => {
    setData(prev => {
        if (!prev) return prev;
        const updatedCursos = [...prev.cursos.cursos];
        updatedCursos[cursoIndex].grupos = [
            ...(updatedCursos[cursoIndex].grupos || []),
            "Nuevo Grupo"
        ];
        return {
            ...prev,
            cursos: { ...prev.cursos, cursos: updatedCursos }
        };
    });
};

// Actualizar grupo
const updateGrupo = (cursoIndex: number, grupoIndex: number, newValue: string) => {
    setData(prev => {
        if (!prev) return prev;
        const updatedCursos = [...prev.cursos.cursos];
        updatedCursos[cursoIndex].grupos[grupoIndex] = newValue;
        return {
            ...prev,
            cursos: { ...prev.cursos, cursos: updatedCursos }
        };
    });
};

// Eliminar grupo
const deleteGrupo = (cursoIndex: number, grupoIndex: number) => {
    setData(prev => {
        if (!prev) return prev;
        const updatedCursos = [...prev.cursos.cursos];
        updatedCursos[cursoIndex].grupos.splice(grupoIndex, 1);
        return {
            ...prev,
            cursos: { ...prev.cursos, cursos: updatedCursos }
        };
    });
};

// Eliminar curso completo
const deleteCurso = (cursoIndex: number) => {
    // if (!confirm("¿Eliminar este curso y todos sus grupos?")) return;

    setData(prev => {
        if (!prev) return prev;
        const updatedCursos = prev.cursos.cursos.filter((_: any, i: number) => i !== cursoIndex);
        return {
            ...prev,
            cursos: { ...prev.cursos, cursos: updatedCursos }
        };
    });
};

const importarEdicion = (edicionId: string) => {

    console.log("Importando edición con ID:", edicionId);

fetch("/api/panel/ImportarEdicion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ importarID: edicionId }),
})
    .then(async (res) => {
    const json = await res.json();

    if (!res.ok) return;

    const importado = json;

    console.log("Datos importados:", importado);

    if (importarTipo === "tot") {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...importado, // 🔥 aquí sí usas lo importado
        estado: "En Preparació",

        id: prev.id,
        id_torneo: prev.id_torneo,
        nombre: prev.nombre,
        fecha: prev.fecha,
        in_inicio: prev.in_inicio,
        in_fin: prev.in_fin,
        vo_inicio: prev.vo_inicio,
        vo_fin: prev.vo_fin,
      };
    });
  }

    if (importarTipo === "cursos") {
        console.log("Importando solo cursos");
        setData((prev) => {
        if (!prev) return prev;

        return {
            ...prev,
            cursos: importado.cursos,
        };
        });
    }

    setImportarMenu(false);
    })
    .catch(() => {
    setError({
        seccion: "general",
        mensaje: "Error al cargar los datos",
    });
    });
};



//     const DateInput = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(
//     value ? new Date(value) : null
//   );

  const DateInput = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value ? new Date(value) : null
    );

    return (
      <div className="relative mt-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            setSelectedDate(date);
            onChange(date ? date.toISOString().split("T")[0] : "");
          }}
          dateFormat="dd/MM/yyyy"
          className="w-full rounded-xl px-3 py-2 h-10 bg-gris text-white 
                     focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          wrapperClassName="w-full"
          popperClassName="custom-datepicker-popper"
          calendarClassName="custom-datepicker-calendar"
          placeholderText="Selecciona una fecha"
        />

        {/* Icono de calendario */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
          </svg>
        </div>
      </div>
    );
  };

  const DateTimePicker = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (date: string) => void 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  return (
    <div className="relative mt-2">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          setSelectedDate(date);
          onChange(date ? date.toISOString() : ""); // Guardamos como ISO timestamp
        }}
        dateFormat="dd/MM/yyyy HH:mm"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        className="w-full rounded-xl px-3 py-2 h-10 bg-gris text-white 
                   focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        wrapperClassName="w-full"
        popperClassName="custom-datepicker-popper"
        calendarClassName="custom-datepicker-calendar"
        placeholderText="Selecciona data i hora"
      />

      {/* Icono */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
        </svg>
      </div>
    </div>
  );
};


    return(
        
        <div className="max-w-7xl relative mx-auto flex flex-col gap-10 items-center mb-10">
            <div className="w-full  flex flex-row items-center place-content-between border-b border-gray-500 px-4 py-2 shrink-0">
                        <a href={`/panel/edicions?torneoID=${torneoID}`} className="flex items-center px-2 py-1 rounded-full hover:bg-gris-claro/50 duration-300 gap-x-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224z"/>
                                </svg>
                            </span>
                            Tancar
                        </a>
                        <div className="flex items-center gap-10">
                            <div onClick={() => { setImportarMenu(true); setImportarTipo("tot");}} className="p-2 border border-primary cursor-pointer rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg"className="w-5 h-5 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326zM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160z"/>
                                </svg>
                            </div>
                            <div onClick={handleSave} className="px-3 py-2 cursor-pointer rounded-xl flex flex-row items-center gap-x-2 bg-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480zm-80 34L646-760H200v560h560zM565-275q35-35 35-85t-35-85-85-35-85 35-35 85 35 85 85 35 85-35M240-560h360v-160H240zm-40-86v446-560z"/>
                                </svg>
                                Crear Edició
                            </div>
                        </div>
                    </div>

                    {
            error?.seccion === "general" && (
                <div className="max-w-150 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                    <p className="text-red-500 uppercase text-lg flex items-center gap-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                        </svg>
                        {error.mensaje}
                    </p>
                </div>
            )
        }
        {
            data ? (
                <>
                    

                    <div ref={refs.info} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "info"  ? "border-red-500" : "border-transparent"  }`}>
                        <div className="flex flex-wrap place-content-between">
                            <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                </svg>
                                Informació bàsica
                            </p>
                            <p
                                    className={`text-xs justify-end uppercase w-max h-max px-2 py-1 border rounded-full ${
                                        data.estado === "Actual"
                                        ? "bg-green-400/30 border-green-500 text-green-400"
                                        : data.estado === "En Preparació"
                                        ? "bg-azul-claro/30 border-azul-claro text-azul-claro"
                                        : "bg-gray-600/30 border-gray-500 text-gray-500"
                                    }`}
                                >
                                    {data.estado}
                                </p>
                            </div>
                            <select
                                value={data.estado}
                                onChange={(e)=>handleChange(
                                    "estado",
                                    e.target.value
                                )}
                                className="bg-gris px-3 py-2 rounded-xl mt-4 w-full"
                                >
                                    <option>Actual</option>
                                    <option>En Preparació</option>
                                    <option>Finalitzat</option>
                                </select>
                        <div className="mt-5">
                            <p>Tournament ID</p>
                            <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{data.id_torneo}</p>
                        </div>
                        <div className="mt-5">
                            <p>Nom del torneig</p>
                            <input type="text" value={data.nombre} onChange={(e) => handleNombreChange(e.target.value)} className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris" />
                        </div>
                        <div className="mt-5">
                            <p>Data del torneig</p>
                            <DateInput
                                    value={data.fecha}
                                    onChange={(newDate) => handleChange("fecha", newDate)}
                                />
                            
                        </div>
                        {
                            error?.seccion === "info" && (
                                <div className="max-w-150 mt-5 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                                    <p className="text-red-500 uppercase  flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                        </svg>
                                        {error.mensaje}
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div ref={refs.equipos} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "equipos"  ? "border-red-500" : "border-transparent"  }`}>
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M500-482q29-32 44.5-73t15.5-85-15.5-85-44.5-73q60 8 100 53t40 105-40 105-100 53m220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80zm-593-87q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440t130 15.5T576-378q29 15 46.5 43.5T640-272v112zm320-400q33 0 56.5-23.5T400-640t-23.5-56.5T320-720t-56.5 23.5T240-640t23.5 56.5T320-560M80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360t-111 13.5T100-306q-9 5-14.5 14T80-272zm240 0"/>
                            </svg>
                            Inscripció equips
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 mt-5">
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data inici</p>
                                <input 
                                    type="datetime-local" 
                                    value={data.in_inicio ? data.in_inicio.slice(0,16) : ""} 
                                    onChange={(e) => handleChange("in_inicio", e.target.value)}
                                    className="w-full rounded-xl px-3 py-2 mt-2 h-10 bg-gris text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primarycursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data fi</p>
                                <input 
                                    type="datetime-local" 
                                    value={data.in_fin ? data.in_fin.slice(0,16) : ""} 
                                    onChange={(e) => handleChange("in_fin", e.target.value)}
                                    className="w-full rounded-xl px-3 py-2 mt-2 h-10 bg-gris text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primarycursor-pointer"
                                />
                            </div>
                        </div>
                        {
                            error?.seccion === "equipos" && (
                                <div className="max-w-150 mt-5 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                                    <p className="text-red-500 uppercase  flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                        </svg>
                                        {error.mensaje}
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div ref={refs.voluntarios} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "voluntarios"  ? "border-red-500" : "border-transparent"  }`}>
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5zM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64zM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58zm80-80h80v-280h-80zm520-546"/>
                            </svg>
                            Inscripció voluntaris
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 mt-5">
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data inici</p>
                                <input 
                                    type="datetime-local" 
                                    value={data.vo_inicio ? data.vo_inicio.slice(0,16) : ""} 
                                    onChange={(e) => handleChange("vo_inicio", e.target.value)}
                                    className="w-full rounded-xl px-3 py-2 mt-2 h-10 bg-gris text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primarycursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data fi</p>
                                <input 
                                    type="datetime-local" 
                                    value={data.vo_fin ? data.vo_fin.slice(0,16) : ""} 
                                    onChange={(e) => handleChange("vo_fin", e.target.value)}
                                    className="w-full rounded-xl px-3 py-2 mt-2 h-10 bg-gris text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primarycursor-pointer"
                                />
                            </div>
                        </div>
                        {
                            error?.seccion === "voluntarios" && (
                                <div className="max-w-150 mt-5 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                                    <p className="text-red-500 uppercase  flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                        </svg>
                                        {error.mensaje}
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div ref={refs.reglas} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "reglas"  ? "border-red-500" : "border-transparent"  }`}>
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="m576-160-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104-56 56-104-104zm79-360L513-662l56-56 85 85 170-170 56 57zM80-280v-80h360v80zm0-320v-80h360v80z"/>
                            </svg>
                            Regla d'equips
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 text-blanco max-md:text-sm mt-5">
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim jugadors</p>
                                <input 
                                    type="number" 
                                    min={0} 
                                    value={data.min_jugadores} 
                                    onChange={(e) => handleChange("min_jugadores", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>

                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Máxim jugadors</p>
                                <input 
                                    type="number" 
                                    min={data.min_jugadores} 
                                    value={data.max_jugadores} 
                                    onChange={(e) => handleChange("max_jugadores", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>
                        </div>

                        <div className="w-full gap-x-4 grid grid-cols-2 text-blanco max-md:text-sm mt-5">
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim  staff</p>
                                <input 
                                    type="number" 
                                    min={0} 
                                    value={data.min_staff} 
                                    onChange={(e) => handleChange("min_staff", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Máxim  staff</p>
                                <input 
                                    type="number" 
                                    min={data.min_staff} 
                                    value={data.max_staff} 
                                    onChange={(e) => handleChange("max_staff", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>
                        </div>

                        <div className="w-full gap-x-4  mt-5">
                            <div className="w-full grid grid-cols-[1fr_auto] items-center gap-x-4 bg-gris rounded-xl p-4">
                                <div>
                                    <p className="text-lg">Fer equips mixtes</p>
                                    <p className="font-light text-gray-300">Obligar a realitzar equips mixtes</p>
                                </div>
                                <button onClick={()=>  handleToggle("equipo_mixto")} className={`w-12 h-6  cursor-pointer rounded-full p-1 flex items-center ${data.equipo_mixto === "Permitido" ? "justify-end bg-primary":"justify-start bg-primary/50"}`}>
                                    <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                                </button>
                            </div>
                        </div>
                        {
                            data.equipo_mixto === "Permitido" && (
                                <div className="w-full gap-x-4 grid grid-cols-2 text-blanco max-md:text-sm mt-5">
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim  Masc.</p>
                                <input 
                                    type="number" 
                                    min={0} 
                                    value={data.min_masc} 
                                    onChange={(e) => handleChange("min_masc", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim  Fem.</p>
                                <input 
                                    type="number" 
                                    min={0} 
                                    value={data.min_fem} 
                                    onChange={(e) => handleChange("min_fem", e.target.value)} 
                                    className="text-primary w-14 px-2 py-1 h-10 bg-transparent border border-transparent focus:border-primary rounded-lg text-center"
                                />
                            </div>
                        </div>
                            )
                        }
                        
                        {
                            error?.seccion === "reglas" && (
                                <div className="max-w-150 mt-5 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                                    <p className="text-red-500 uppercase  flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                        </svg>
                                        {error.mensaje}
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div ref={refs.entrenador} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "entrenador"  ? "border-red-500" : "border-transparent"  }`}>
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240zm0-332 274-148-274-148-274 148zm0 241 200-108v-151L480-360 280-470v151zm0-151"/>
                            </svg>
                            Entrenador
                        </p>

                        <div className="w-full gap-x-4  mt-5">
                            <div className="w-full grid grid-cols-[1fr_auto] items-center gap-x-4 bg-gris rounded-xl p-4">
                                <div>
                                    <p className="text-lg">Permetre entrenador</p>
                                    <p className="font-light text-gray-300">Permet incloure un entrenador</p>
                                </div>
                                <button onClick={()=>  handleToggle("entrenador")} className={`w-12 h-6  cursor-pointer rounded-full p-1 flex items-center ${data.entrenador === "Permitido" ? "justify-end bg-primary":"justify-start bg-primary/50"}`}>
                                    <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                                </button>
                            </div>
                        </div>

                        
                        
                    </div>

                    <div ref={refs.profesores} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "profesores"  ? "border-red-500" : "border-transparent"  }`}>
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240zm0-332 274-148-274-148-274 148zm0 241 200-108v-151L480-360 280-470v151zm0-151"/>
                            </svg>
                            Professors
                        </p>

                        <div className="w-full gap-x-4  mt-5">
                            <div className="w-full grid grid-cols-[1fr_auto] items-center gap-x-4 bg-gris rounded-xl p-4">
                                <div>
                                    <p className="text-lg">Permetre professor</p>
                                    <p className="font-light text-gray-300">Permet incloure docents a l'equip</p>
                                </div>
                                <button onClick={()=>  handleToggle("profesor")} className={`w-12 h-6  cursor-pointer rounded-full p-1 flex items-center ${data.profesor === "Permitido" ? "justify-end bg-primary":"justify-start bg-primary/50"}`}>
                                    <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                                </button>
                            </div>
                        </div>

                        
                    </div>

                    <div ref={refs.cursos} className={`max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border ${error?.seccion === "cursos"  ? "border-red-500" : "border-transparent"  }`}>
                        <div className="flex flex-wrap place-content-between mb-5">
                            <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564m0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27m0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6m260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59M280-494"/>
                                </svg>
                                Cursos permesos
                            </p>
                            <div onClick={() => { setImportarMenu(true); setImportarTipo("cursos");}} className="p-2 border border-primary cursor-pointer rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg"className="w-5 h-5 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326zM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160z"/>
                                </svg>
                            </div>
                        </div>
                        

                        <div className="flex flex-col gap-4">
        {data?.cursos?.cursos?.length ? (
            data.cursos.cursos
                // .sort((a: any, b: any) => a.curso.localeCompare(b.curso)) // Orden alfabético
                .map((curso: any, idx: number) => (
                    <div key={idx} className="bg-gris rounded-2xl p-4 border border-gray-700">
                        
                        {/* Nombre del Curso */}
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="text"
                                value={curso.curso}
                                onChange={(e) => updateCursoName(idx, e.target.value)}
                                className="flex-1 bg-transparent border-b border-gray-600 focus:border-primary text-white font-semibold text-lg outline-none px-1 py-1"
                                placeholder="Nombre del curso"
                            />
                            <button
                                onClick={() => deleteCurso(idx)}
                                className="fill-red-500 hover:fill-red-400 cursor-pointer p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                </svg>
                            </button>
                        </div>

                        {/* Grupos */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {curso.grupos?.sort().map((grupo: string, gIdx: number) => (
                                        <div
                                            key={gIdx}
                                            className="group flex items-center gap-1 bg-gris-claro border border-gray-600 rounded-full px-3 py-1 text-sm"
                                        >
                                            <input
                                                type="text"
                                                value={grupo}
                                                onChange={(e) => updateGrupo(idx, gIdx, e.target.value)}
                                                className="bg-transparent outline-none min-w-15 text-center"
                                            />
                                            <button
                                                onClick={() => deleteGrupo(idx, gIdx)}
                                                className="text-gray-400 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                            {/* Botón Añadir Grupo */}
                                            <button
                                                onClick={() => addNewGrupo(idx)}
                                                className="flex items-center mt-2 mx-auto gap-1.5 text-primary hover:text-primary/80 text-sm font-medium"
                                            >
                                                <span className="text-xl leading-none">+</span>
                                                <span>Añadir grupo</span>
                                            </button>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-gray-400 text-sm py-8 text-center border border-dashed border-gray-700 rounded-2xl">
                                    No hay cursos. Añade uno con el botón superior.
                                </p>
                            )}
                        </div>
                        <button
            onClick={addNewCurso}
            className="flex items-center gap-2  mt-2 mx-auto bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-xl transition"
        >
            <span>+</span>
            <span>Nuevo Curso</span>
        </button>
        {
                            error?.seccion === "cursos" && (
                                <div className="max-w-150 mt-5 w-full p-4 bg-red-500/30 rounded-2xl border-l-5 border-red-500">
                                    <p className="text-red-500 uppercase  flex items-center gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-500" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                        </svg>
                                        {error.mensaje}
                                    </p>
                                </div>
                            )
                        }
                        </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480t58.5-141.5T480-680t141.5 58.5T680-480v58q0 26 17 44t43 18 43-18 17-44v-58q0-134-93-227t-227-93-227 93-93 227 93 227 227 93h200v80zm85-315q35-35 35-85t-35-85-85-35-85 35-35 85 35 85 85 35 85-35"/>
                            </svg>
                            Dominis de correu
                        </p>

                        <div className="w-full h-22 grid grid-cols-[auto_1fr] items-center gap-x-4 bg-gris p-4 rounded-xl my-5">
                            <span className="w-max h-max p-2 flex items-center place-content-center bg-orange-700/60 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-orange-400" viewBox="0 -960 960 960">
                                    <path d="M367-527q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440t130 15.5T736-378q29 15 46.5 43.5T800-272v112zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360t-111 13.5T260-306q-9 5-14.5 14t-5.5 20zm296.5-343.5Q560-607 560-640t-23.5-56.5T480-720t-56.5 23.5T400-640t23.5 56.5T480-560t56.5-23.5M480-240"/>
                                </svg>
                            </span>
                            <div>
                                <p>Alumnes</p>
                                <input type="text" value={data.dom_alumnos} onChange={(e)=> handleChange( "dom_alumnos", e.target.value)} className="w-full rounded-xl items-center flex px-1 py-1  h-max " />
                            </div>
                        </div>

                        <div className="w-full h-22 grid grid-cols-[auto_1fr] gap-x-4 bg-gris p-4 rounded-xl">
                            <span className="w-max h-max p-2 flex items-center place-content-center bg-azul-claro/50 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330t-43.5 4.5T276-312q-17 8-26.5 22.5T240-258zm320-60h160v-60H560zm-157.5-77.5Q420-395 420-420t-17.5-42.5T360-480t-42.5 17.5T300-420t17.5 42.5T360-360t42.5-17.5M560-420h160v-60H560zM440-600h80v-200h-80zm40 220"/>
                                </svg>
                            </span>
                            <div>
                                <p>Professors</p>
                                <input type="text" value={data.dom_profesores} onChange={(e)=> handleChange( "dom_profesores", e.target.value)} className="w-full rounded-xl items-center flex px-1 py-1  h-max " />
                            </div>
                        </div>
                        
                        
                    </div>


                </>
            ):(
                <></>
            )
        }
        {
            importarMenu && (
                
                <>
                {/* Menu con seleccion de otras ediciones */}
                <div className="fixed inset-0 z-100 flex items-center justify-center p-lg glass-overlay bg-gris/60">
                    <div className="w-full mx-5 h-max min-h-80: max-w-150 bg-gris p-10 dark:bg-gris rounded-xl p-xl shadow-xxl border border-primary/30 flex flex-col gap-y-3 items-center text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-lg font-semibold mb-sm">Importar dades d'una edició anterior</p>
                    <p className="text-gray-300 font-light mb-xl px-md">
                        Selecciona una edició de la llista per importar la seva configuració.
                    </p>
                    <div className="w-full">
                        <div  className="w-full rounded-xl px-3 py-2 mt-2 h-40 overflow-y-auto bg-gris text-white border border-transparent flex flex-col gap-y-2 focus:outline-none focus:ring-2 focus:ring-primarycursor-pointer">
                            
                            {ediciones.map((edicion: any) => (
                                <div key={edicion.id} onClick={() => importarEdicion(edicion.id_torneo)} className="cursor-pointer p-2 rounded-lg bg-gris-claro transition hover:bg-gris-claro/60">
                                    {edicion.nombre}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
                </>
                    
            )
        }

        {
            enviando && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-lg glass-overlay bg-gris/60">
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
        
        
    )
    
}