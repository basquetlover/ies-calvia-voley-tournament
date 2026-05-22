import { useEffect, useState } from "react";
import CrearAdmin from "./crearAdmin";

interface Admins {
  email_microsoft: string,
  id: number,
  nombre_real: string,
  apellidos: string,
  rango: string,
  permisos_panel: any,
}
type TipoAccion = "crear" | "editar";
export default function BuscadorAdmin() {
    const [data, setData] = useState<Admins[]>([])
    const [admin, setAdmin] = useState<Admins[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const [adminSeleccionado, setAdminSeleccionado] = useState<Admins | null>(null);
    const [tipoAccion, setTipoAccion] = useState<TipoAccion>("crear");

    useEffect(() => {
    fetch("/api/panel/ListaAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setAdmin(res)
        
      })
      .catch(() => console.log("Error carregant dades"));
  },[]);

   useEffect(() => {
    if (!busqueda.trim()) {
      setAdmin(data);
      return;
    }

    const texto = busqueda.toLowerCase();

    const filtrados = data.filter((admin) => {
      return (
        admin.email_microsoft?.toLowerCase().includes(texto) ||
        admin.nombre_real?.toLowerCase().includes(texto) ||
        admin.apellidos?.toLowerCase().includes(texto) ||
        admin.rango?.toLowerCase().includes(texto)
      );
    });

    setAdmin(filtrados);
  }, [busqueda, data]);


// Seleccionar un usuario para editar
const seleccionarAdmin = (admin: Admins) => {
    setAdminSeleccionado(admin);
    setTipoAccion("editar");
};


// Preparar creación de usuario nuevo
const crearNuevoAdmin = () => {
    setAdminSeleccionado(null);

    setTipoAccion("crear");
};

  const rangoStyles = {
  Owner: "bg-red-500/10 text-red-700 border-red-200",
  Admin: "bg-blue-500/10 text-blue-700 border-blue-200",
  Staff: "bg-green-500/10 text-green-700 border-green-200",
  Voluntari: "bg-gray-500/10 text-gray-700 border-gray-200",
} as const;


    return(
        <div className="max-w-7xl w-full h-full overflow-hidden mx-auto grid gap-x-2 grid-cols-[auto_1fr] min-h-0">

            <div className="w-72 min-h-0 overflow-y-auto flex flex-col gap-y-2">
                <div className="w-wull max-md:w-full rounded-2xl h-14 bg-gray-600 border border-gray-500 flex flex-row relative items-center gap-x-2">
                    <input type="text" className="w-48 ml-4 rounded-xl h-10 px-2 text-blanco bg-transparent" onChange={(e) => setBusqueda(e.target.value)} placeholder="Cercar administrador..." />
                    <span className="cursor-pointer absolute right-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/>
                        </svg>
                    </span>
                </div>
                <div onClick={crearNuevoAdmin} className={`w-full p-3 flex place-content-center fill-blanco cursor-pointer gap-x-2 items-center rounded-xl border transition  hover:fill-primary hover:text-primary hover:border-primary duration-300`}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 -960 960 960" >
                                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Zm180 334h40v-100h100v-40H700v-100h-40v100H560v40h100v100Z"/>
                            </svg>
                        </span> 
                        <p>Afegir Administrador</p> 
                </div>
                {
                    admin.map((user) =>(
                        <div
                        className={`w-full p-3 grid grid-cols-[1fr_auto] items-center rounded-xl border transition 
                        ${rangoStyles[user.rango as keyof typeof rangoStyles] ?? "bg-gray-100"}`}
                        >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-gray-900">
                                {user.nombre_real} {user.apellidos}
                            </p>

                            <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium border"
                            >
                                {user.rango}
                            </span>
                            </div>

                            <p className="text-xs text-gray-500">{user.email_microsoft}</p>
                        </div>

                        <div onClick={() => seleccionarAdmin(user)} className="flex items-center gap-2 cursor-pointer relative group">
                            
                            <div className="absolute inset-0 rounded-lg group-hover:backdrop-blur-md transition"></div>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 fill-white relative z-10"
                                viewBox="0 -960 960 960"
                            >
                                <path d="m321-80-71-71 329-329-329-329 71-71 400 400z"/>
                            </svg>
                            </div>
                        </div>
                    ))
                }
                
            </div>

            <div className="w-full min-h-0 overflow-hidden ">
                <CrearAdmin />
            </div>
        </div>
    )
}