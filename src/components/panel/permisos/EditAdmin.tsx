import { useEffect, useState, useRef } from "react";
import { useToast } from '@components/panel/Toast';
import "@components/panel/StylesReact.css"
type Props = {

admin:any;
setTipoAccion: React.Dispatch<React.SetStateAction<"ver" | "editar" | "crear">>;
};
interface Admins {
email_microsoft: string;
id: number;
nombre_real: string;
apellidos: string;
rango: string;
permisos_panel: any;
}
type ErrorData = {
    mensaje: string;
};
type ApiResponse = {
    ok: boolean;
    data?: string;
    error?: ErrorData;
};

import { Menu } from "@const/menuPanel";
type PermisoKey = (typeof Menu)[number]["id"];
type TipoAccion = "crear" | "editar";
type PermisoItem = Record<string, boolean>;
type PermisosUI = Record<PermisoKey, PermisoItem>;
const roles = ["Voluntari", "Staff", "Admin", "Co-Owner", "Owner"] as const;

type Role = (typeof roles)[number];

const selectStyles: Record<string, string> = {
Owner: "border-red-500 bg-red-500/40",
"Co-Owner": "border-purple-500 bg-purple-500/40",
Admin: "border-blue-500 bg-blue-500/40",
Staff: "border-green-500 bg-green-500/40",
Voluntari: "border-gray-400 bg-gray-400/40",
};

type MenuPermiso = (typeof Menu)[number] & {
  permisos: PermisoItem;
};

export default function EditAdmin({admin, setTipoAccion}:Props) {
   
    const { addToast } = useToast();



const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Admins | null>(admin);


const [nuevoRango, setNuevoRango] = useState<Role>(admin.rango);
const [nuevoNS, setNuevoNS] = useState<number>(0);
const [open, setOpen] = useState(false);

const [inputActivo, setInputActivo] = useState(false);

const [menuPermisos, setMenuPermisos] = useState<MenuPermiso[]>([]);
const [permisos, setPermisos] = useState(admin.permisos_panel)
const [permisosEstablecidos, setPermisosEstablecidos] = useState(permisos)

const [enviando, setEnviando] = useState(false)
const [loading, setLoading] = useState(true);
const [error, setError] = useState<ErrorData | null>(null);
const errorRef = useRef<HTMLDivElement | null>(null);
const [eliminar, setEliminar] = useState(false)
const [permAdmin, setPermAdmin] = useState(admin.panel_concedido)



// USUARIOS


useEffect(() => {
  const menuOrdenado = Menu.map((item) => {
    const nivelSeguridad = (item as any).nivel_seguridad ?? 999;

    const permisosFinales = {
      ...permisos[item.id as PermisoKey], // plantilla false
      ...permisosEstablecidos[item.id as PermisoKey], // BD
    };

    // Si el usuario NO llega al nivel de la sección
    if (nuevoNS < nivelSeguridad) {
      Object.keys(permisosFinales).forEach((key) => {
        permisosFinales[key as keyof typeof permisosFinales] = false;
      });
    }

    // Tiene acceso a la sección
    if (nuevoNS >= nivelSeguridad) {
      if ("ver" in permisosFinales) {
        permisosFinales.ver = true;
      }

      if ("editar" in permisosFinales) {
        permisosFinales.editar = true;
      }
    }

    // Regla especial: eliminar necesita nivel 3
    if ("eliminar" in permisosFinales && nuevoNS < 3) {
      permisosFinales.eliminar = false;
    }

    return {
      ...item,
      permisos: permisosFinales,
    };
  }).sort((a, b) => {
    const nivelA = (a as any).nivel_seguridad ?? 999;
    const nivelB = (b as any).nivel_seguridad ?? 999;
    return nivelA - nivelB;
  });

  setMenuPermisos(menuOrdenado);

  const timer = setTimeout(() => {
    setLoading(false);
  }, 500); // 👈 1 segundo fijo

  return () => clearTimeout(timer);

}, [nuevoNS, permisosEstablecidos]);


useEffect(() => {
  setNuevoNS(getSecurityLevel(nuevoRango));
}, [nuevoRango]);

const getSecurityLevel = (role: Role): number => {
  const levels: Record<Role, number> = {
    Owner: 4,
    "Co-Owner": 3,
    Admin: 3,
    Staff: 2,
    Voluntari: 1,
  };

  return levels[role];
};

const cambiarPermiso = (idMenu: string, nombrePermiso: string) => {
  setMenuPermisos(prev =>
    prev.map(item => {
      if (item.id !== idMenu) return item;

      return {
        ...item,
        permisos: {
          ...item.permisos,
          [nombrePermiso]: !item.permisos[nombrePermiso]
        }
      };
    })
  );
};

// CHECK ADMIN POR RANGO


//Enviar datos:
const handleSave = async () => {
    // datos a enviar:
    //console.log("Datos a enviar a la api: ", usuarioSeleccionado, menuPermisos, nuevoRango)

      setEnviando(true)
    try {
         setError(null);

        const res = await fetch("/api/panel/CrearAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioSeleccionado, menuPermisos, nuevoRango
            })
        });

        const result: ApiResponse = await res.json();

        // error de API
        if (!res.ok || !result.ok) {

            if (result.error) {

                setError(result.error);
                errorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                });

            }
            setEnviando(false)
            return;
        }

        // éxito
        
        addToast({
        type: 'success',
        message: 'Configuració actualitzada correctament',
        duration: 5000,
        });
        setError(null);
        
        setTimeout(() => {

        setEnviando(false);
        setTipoAccion("ver");

        }, 500);
        // window.location.reload();
        //console.log(result.data);

    } catch (e) {
        console.error(e);

        setError({
            mensaje: "Error del servidor"
        });
    }
};

const handleDelete = async () => {
    // datos a enviar:
    //console.log("Datos a enviar a la api: ", usuarioSeleccionado, menuPermisos, nuevoRango)

      setEnviando(true)
    try {
         setError(null);

        const res = await fetch("/api/panel/EliminarAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioSeleccionado,
            })
        });

        const result: ApiResponse = await res.json();

        // error de API
        if (!res.ok || !result.ok) {

            if (result.error) {

                setError(result.error);
                errorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                });

            }
            setEnviando(false)
            return;
        }

        // éxito
        
        addToast({
        type: 'success',
        message: 'Administrador eliminat correctament.',
        duration: 5000,
        });
        setError(null);
        
        setTimeout(() => {

        setEnviando(false);
        setTipoAccion("ver");

        }, 500);
        // window.location.reload();
        //console.log(result.data);

    } catch (e) {
        console.error(e);

        setError({
            mensaje: "Error del servidor"
        });
    }
};

const handlePermiso = async () => {
    setUsuarioSeleccionado(prev =>
  prev
    ? {
        ...prev,
        panel_concedido: "manual",
      }
    : prev
);
    try {
         setError(null);

        const res = await fetch("/api/panel/PermAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioSeleccionado,
            })
        });

        const result: ApiResponse = await res.json();

        // error de API
        if (!res.ok || !result.ok) {

            if (result.error) {

                setError(result.error);
                errorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                });

            }
            setEnviando(false)
            return;
        }

        // éxito
        
        addToast({
        type: 'success',
        message: 'Acces a administrador permanent.',
        duration: 5000,
        });
        setPermAdmin("manual")
        setError(null);
        
        

    } catch (e) {
        console.error(e);

        setError({
            mensaje: "Error del servidor"
        });
    }
}


// console.log(menuRender)

return (
    <div className="w-full h-full min-h-0">
    <div className="w-full h-full min-h-0 grid grid-rows-[auto_1fr] rounded-2xl md:overflow-hidden">

        {/* HEADER */}
        <div className="border-b border-gris-claro p-4 bg-gris-claro h-auto rounded-2xl min-h-0 flex flex-col gap-4">


            {/* USER + ROL */}
            <div className="w-full md:grid grid-cols-[1fr_auto] gap-x-4">

                <div>
                {usuarioSeleccionado ? (
                    <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2">

                        <div className="p-4 rounded-xl flex flex-col">
                        <p className="text-white font-bold">
                            Usuari seleccionat:
                        </p>

                        <p className="text-gray-300">
                            {usuarioSeleccionado.nombre_real} {usuarioSeleccionado.apellidos}
                        </p>

                        <p className="text-xs text-gray-400">
                            {usuarioSeleccionado.email_microsoft}
                        </p>
                        </div>
                        <span onClick={() => setEliminar(true)} className="w-max h-max flex items-center cursor-pointer bg-red-600/30 border border-red-400 rounded-lg p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-400" viewBox="0 -960 960 960">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                            </svg>
                        </span>
                    </div>
                ) : (
                    <p className="text-gray-400">
                    Seleccionar un usuario per continuar
                    </p>
                )}

                

                </div>

                {/* SELECT ROL */}
                <div className="relative max-md:p-4 w-48 mt-2 flex flex-col">

                <p className="text-sm mb-1 text-gray-200">
                    Rol d'usuari
                </p>

                <div
                    onClick={() => setOpen(!open)}
                    className={`
                    h-12 px-3 rounded-xl flex items-center justify-between
                    cursor-pointer border transition text-white
                    ${selectStyles[nuevoRango]}
                    `}
                >
                    <span>{nuevoRango}</span>

                    <svg
                    className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="white"
                    >
                    <path d="M480-360 280-560h400L480-360Z" />
                    </svg>
                </div>

                {open && (
                    <div className="absolute top-full left-0 mt-2 w-full rounded-xl overflow-hidden border border-gray-600 bg-gray-800 shadow-xl z-50">
                    {roles.map((role) => (
                        <div
                        key={role}
                        onClick={() => {
                            setNuevoRango(role);
                            setOpen(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-white/10"
                        >
                        {role}
                        </div>
                    ))}
                    </div>
                )}
                </div>

            </div>
                {
                    permAdmin !== "manual" && (
                        <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-orange-500/15 border border-orange-400/40 text-orange-200">

                            {/* Mensaje */}
                            
                            <div className="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-orange-300" viewBox="0 -960 960 960">
                                    <path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                </svg>

                                <p>
                                    Aquest usuari té accés generat automàticament pel sistema
                                </p>
                            </div>

                            {/* Acción */}
                            <div onClick={() => handlePermiso()} className="px-3 py-1.5 rounded-lg cursor-pointer bg-orange-400/20 hover:bg-orange-400/30 text-orange-200 text-sm font-medium transition">
                                Concedir accés permanent
                            </div>

                        </div>
                    )
                }


        </div>

        {/* BODY CON USUARIO SELECCIONADO*/}
        {usuarioSeleccionado ? (
            <div className={`min-h-0 max-md:h-full md:overflow-y-auto p-4 flex bg-gris-claro/60 flex-wrap gap-4  max-md:pb-2 ${eliminar ? 'overflow-hidden':'md:overflow-y-auto'}`}>
                {
                    loading ? (

                    <div className="w-full flex justify-center py-20">
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
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99 41 99 99 41h480q42 0 71-29t29-71-29-71-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160zm220-358"/>
                        </svg>
                    </span>
                    </div>
                    </div>
                    {/* <!-- Text Content --> */}
                    <h3 className="text-lg font-semibold mb-sm">Carregant dades...</h3>
                    <p className="text-gray-300 font-light mb-xl px-md">
                        Si us plau, espera mentre es processen les dades. No tanquis aquesta finestra.
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

                    ) : (
                        <>
                                    <div ref={errorRef}>
                                        {
                                        error && (
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
                                    </div>
                                    
                                    {
                                        menuPermisos.map((permiso) =>(
                                            
                                            <div className={`max-w-full w-full min-w-[48%]  p-4 rounded-2xl ${permiso.nivel_seguridad <= nuevoNS ? 'bg-gris-claro':'bg-gris/40'}`}>
                                                <div className="flex gap-x-2 text-lg items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 -960 960 960"
                                                        fill="currentColor"
                                                        className={`w-6 h-6  ${permiso.nivel_seguridad <= nuevoNS ? 'text-azul-claro':'text-red-300'}`}
                                                        dangerouslySetInnerHTML={{
                                                        __html: permiso.icono,
                                                        }}
                                                    />
                                                    <p>{permiso.nombre}</p>
                                                </div>
                                                <div className="w-full relative flex flex-wrap items-center gap-10 mt-2">
                                                    
                                                {
                                                    permiso.nivel_seguridad <= nuevoNS ? (
                                                        <>
                                                            {Object.entries(permiso.permisos).map(([nombrePermiso, activo]) => {
                                                                const editable = permiso.nivel_seguridad <= nuevoNS;

                                                                const bloqueadoGlobal =
                                                                    nombrePermiso === "eliminar" && nuevoNS < 3;

                                                                const puedeEditar = editable && !bloqueadoGlobal;

                                                                return (
                                                                    <>
                                                                    {puedeEditar ? (
                                                                        <div key={nombrePermiso} className="flex items-center gap-x-2">
                                                                            <p className="first-letter:uppercase">{nombrePermiso}</p>
                                                                        <button
                                                                        onClick={() => cambiarPermiso(permiso.id, nombrePermiso)}
                                                                        className={`w-12 h-6 cursor-pointer rounded-full p-1 flex items-center ${
                                                                            activo ? "justify-end bg-azul-claro" : "justify-start bg-gray-500"
                                                                        }`}
                                                                        >
                                                                        <div className="w-4 h-4 bg-white rounded-full" />
                                                                        </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div key={nombrePermiso} className={`flex flex-row items-center gap-x-2 text-lg px-3 py-2 text-gray-400 bg-gris/60 rounded-2xl`} >
                                                                            <p className="first-letter:uppercase">{nombrePermiso}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-400" viewBox="0 -960 960 960">
                                                                                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920t141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80zm0-80h480v-400H240zm296.5-143.5Q560-327 560-360t-23.5-56.5T480-440t-56.5 23.5T400-360t23.5 56.5T480-280t56.5-23.5M360-640h240v-80q0-50-35-85t-85-35-85 35-35 85zM240-160v-400z"/>
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    </>
                                                                    
                                                                );
                                                                })}
                                                        </>
                                                    ):(
                                                        <>
                                                            {Object.entries(permiso.permisos).map(
                                                                ([nombrePermiso, activo]) => (
                                                                    <div key={nombrePermiso} className={`flex flex-row items-center gap-x-2 text-lg px-3 py-2 text-gray-400 bg-gris/60 rounded-2xl`} >
                                                                    <p className="first-letter:uppercase">{nombrePermiso}</p>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-400" viewBox="0 -960 960 960">
                                                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920t141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80zm0-80h480v-400H240zm296.5-143.5Q560-327 560-360t-23.5-56.5T480-440t-56.5 23.5T400-360t23.5 56.5T480-280t56.5-23.5M360-640h240v-80q0-50-35-85t-85-35-85 35-35 85zM240-160v-400z"/>
                                                                    </svg>
                                                                    </div>
                                                                )
                                                                )}
                                                        </>
                                                    )
                                                }
                                                </div>
                                                {
                                                    permiso.nivel_seguridad > nuevoNS && (
                                                        <p className="text-xs mt-2 italic font-light">Només els administradors principals poden modificar aquets permisos de seguretat</p>
                                                )}
                                            </div>
                                            
                                        ))
                                    }

                                    <div className="w-full grid grid-cols-2 gap-x-4">
                                        <div onClick={ () => handleSave()} className="w-full cursor-pointer bg-accent text-center rounded-2xl py-3 px-4">
                                            Guardar Canvis
                                        </div>
                                        <div onClick={() => setTipoAccion("ver")} className="w-full bg-gray-600 cursor-pointer text-red-400 border border-red-400 text-center rounded-2xl py-3 px-4">
                                            Cancelar
                                        </div>
                                    </div>
                                    <div className="w-full h-20">
                                        &nbsp;
                                    </div>

                                    
                            </>
                    )}
                    {
                        eliminar && (
                            <div className="w-full h-full flex items-center place-content-center absolute top-0 left-0 bg-gris/60">
                                <div className="max-w-115 w-full min-h-86 h-max bg-gris-claro rounded-2xl p-4 border border-red-500/30 flex flex-col gap-3">

                                    {/* Header */}
                                    <div className="flex items-center gap-2 text-red-400 font-semibold text-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-red-400" viewBox="0 -960 960 960">
                                            <path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                        </svg>
                                        <p>Eliminar accés al panell</p>
                                    </div>

                                    {/* Warning text */}
                                    <p className="text-gray-200 text-sm leading-relaxed">
                                        Estàs a punt de revocar completament l’accés d’aquest usuari al sistema d’administració.
                                        Aquesta acció bloquejarà immediatament totes les funcionalitats del panell.
                                    </p>

                                    {/* Consequences */}
                                    <div className="flex flex-col gap-1 text-sm text-gray-300 bg-gris/40 p-3 rounded-xl">
                                        <p>• No podrà accedir al panell d’administració</p>
                                        <p>• No podrà gestionar cap secció ni dades del sistema</p>
                                        <p>• Es perdran tots els permisos assignats actualment</p>
                                    </div>

                                    {/* Warning footer */}
                                    <p className="text-red-300 text-xs font-medium">
                                        ⚠ Aquesta acció no es pot desfer fàcilment
                                    </p>

                                    {/* Buttons */}
                                    <div className="mt-auto flex gap-3 pt-2">
                                        
                                        {/* Cancelar */}
                                        <div onClick={() => setEliminar(false)} className="w-full text-center cursor-pointer py-2 rounded-xl bg-gray-600 text-gray-200 hover:bg-gray-500 transition" >
                                            Cancel·lar
                                        </div>

                                        {/* Eliminar */}
                                        <div onClick={() => handleDelete()} className="w-full text-center cursor-pointer py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md"  >
                                            Eliminar accés
                                        </div>

                                    </div>

                                </div>
                            </div>
                        )
                    }
        </div>
        ):(
            // {/* BODY CON USUARIO SELECCIONADO*/}
            <div className="min-h-0 overflow-y-auto flex items-center place-content-center p-4 bg-gris-claro/60 flex-wrap gap-4">
                <div className="w-96 h-74 bg-gris flex flex-col items-center gap-y-3 rounded-2xl p-4">
                    <span className=" w-max h-max rounded-full flex place-items-center border-3 border-primary mt-5 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 fill-primary" viewBox="0 -960 960 960">
                            <path d="M440-480q-66 0-113-47t-47-113 47-113 113-47 113 47 47 113-47 113-113 47m0-80q33 0 56.5-23.5T520-640t-23.5-56.5T440-720t-56.5 23.5T360-640t23.5 56.5T440-560M884-20 756-148q-21 12-45 20t-51 8q-75 0-127.5-52.5T480-300t52.5-127.5T660-480t127.5 52.5T840-300q0 27-8 51t-20 45L940-76zM731-229q29-29 29-71t-29-71-71-29-71 29-29 71 29 71 71 29 71-29m-611 69v-111q0-34 17-63t47-44q51-26 115-44t142-18q-12 18-20.5 38.5T407-359q-60 5-107 20.5T221-306q-10 5-15.5 14.5T200-271v31h207q5 22 13.5 42t20.5 38zm287-80"/>
                        </svg>
                    </span>
                    <p className="text-2xl text-primary font-bold mt-3">Selecció d’usuari</p>
                    <p className="text-center font-light">És necessari seleccionar un usuari per continuar amb la gestió d’accessos i permisos.</p>
                    <div onClick={() => setTipoAccion("ver")} className="text-red-400 hover:underline">Cancelar</div>
                </div>
            </div>
        )}
        

        

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
    </div>
);
}