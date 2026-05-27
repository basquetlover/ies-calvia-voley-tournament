import { useEffect, useState } from "react";
import CrearAdmin from "./crearAdmin";
import EditAdmin from "./EditAdmin";

type Props = {
torneoID?: string | null;
accion: string;
usuario: any;
};

interface Admins {
  email_microsoft: string,
  id: number,
  nombre_real: string,
  apellidos: string,
  rango: string,
  permisos_panel: any,
  panel_concedido: string,
}

export default function BuscadorAdmin({accion, torneoID, usuario}:Props) {
    
    const [data, setData] = useState<Admins[]>([])
    const [admin, setAdmin] = useState<Admins[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const [adminSeleccionado, setAdminSeleccionado] = useState<Admins | null>(null);
    const [tipoAccion, setTipoAccion] = useState<"ver" | "editar" | "crear">("ver");
    const [accionesDesp, setAccionesDesp] = useState(false)
    console.log(tipoAccion)

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
  },[tipoAccion]);

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
    setAccionesDesp(true)
};


// Preparar creación de usuario nuevo
const crearNuevoAdmin = () => {
    setAdminSeleccionado(null);
    setAccionesDesp(true)
    setTipoAccion("crear");
};

  const rangoStyles = {
  Owner: "border-red-500 bg-red-500/40",
"Co-Owner": "border-purple-500 bg-purple-500/40",
Admin: "border-blue-500 bg-blue-500/40",
Staff: "border-green-500 bg-green-500/40",
Voluntari: "border-gray-400 bg-gray-400/40",
} as const;

const ordenRangos = {
  Owner: 1,
  "Co-Owner": 2,
  Admin: 3,
  Staff: 4,
  Voluntario: 5,
};


    return(
        <>
        <div className="max-w-7xl w-full h-full md:overflow-hidden max-md:overflow-y-auto mx-auto md:grid relative gap-x-2 grid-cols-[auto_1fr] min-h-0">

            {/* Menu lateral */}
            <div className="md:w-80 max-md:w-full min-h-0 z-0 overflow-y-auto flex flex-col gap-y-2">
                <div className="w-wull max-md:w-full rounded-2xl h-14 bg-gray-600 border border-gray-500 flex flex-row relative items-center gap-x-2">
                    <input type="text" className="w-48 ml-4 rounded-xl h-10 px-2 text-blanco bg-transparent" onChange={(e) => setBusqueda(e.target.value)} placeholder="Cercar administrador..." />
                    <span className="cursor-pointer absolute right-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/>
                        </svg>
                    </span>
                </div>
                <div onClick={() => crearNuevoAdmin()} className={`w-full p-3 flex place-content-center fill-blanco cursor-pointer gap-x-2 items-center rounded-xl border transition  hover:fill-primary hover:text-primary hover:border-primary duration-300`}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 -960 960 960" >
                                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Zm180 334h40v-100h100v-40H700v-100h-40v100H560v40h100v100Z"/>
                            </svg>
                        </span> 
                        <p>Afegir Administrador</p> 
                </div>
                {
                    admin.sort((a, b) => (ordenRangos[b.rango as keyof typeof ordenRangos] ?? 999) - (ordenRangos[a.rango as keyof typeof ordenRangos] ?? 999)).map((user) =>(
                        <div
                        className={`w-full p-3 grid grid-cols-[auto_1fr_auto] gap-x-2 items-center rounded-xl border transition 
                        ${rangoStyles[user.rango as keyof typeof rangoStyles] ?? "bg-gray-100"}`}
                        >
                        <span>
                            {
                                user.panel_concedido === "manual" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M430-200h100v-180h60v-184q0-27-28.5-41.5T480-620t-81.5 14.5T370-564v184h60zm-105 88.5q-73-31.5-127.5-86t-86-127.5T80-480.5t31.5-155 86-127 127.5-86T480.5-880t155 31.5 127 86 86 127 31.5 155T848.5-325t-86 127.5-127 86-155 31.5T325-111.5m381.5-142Q800-347 800-480t-93.5-226.5T480-800t-226.5 93.5T160-480t93.5 226.5T480-160t226.5-93.5M523-657q17-17 17-43t-17-43-43-17-43 17-17 43 17 43 43 17 43-17m-43 177"/>
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M296-270q-42 35-87.5 32T129-269t-46.5-73.5T99-436l75-124q-25-22-39.5-53T120-680q0-66 47-113t113-47 113 47 47 113-47 113-113 47q-9 0-18-1t-17-3l-77 130q-11 18-7 35.5t17 28.5 31 12.5 35-12.5l420-361q42-35 88-31.5t80 31.5 46 73.5-17 93.5l-75 124q25 22 39.5 53t14.5 67q0 66-47 113t-113 47-113-47-47-113 47-113 113-47q9 0 17.5 1t16.5 3l78-130q11-18 7-35.5T782-630t-31-12.5-35 12.5zm40.5-353.5Q360-647 360-680t-23.5-56.5T280-760t-56.5 23.5T200-680t23.5 56.5T280-600t56.5-23.5m400 400Q760-247 760-280t-23.5-56.5T680-360t-56.5 23.5T600-280t23.5 56.5T680-200t56.5-23.5M680-280"/>
                                    </svg>
                                )
                            }
                        </span>
                        <div className="flex flex-col gap-1">
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                            <p className="font-semibold text-sm text-blanco">
                                {user.nombre_real} {user.apellidos}
                            </p>

                            <span
                                className="text-xs px-2 py-0.5 h-max rounded-full inline font-medium border"
                            >
                                {user.rango}
                            </span>
                            </div>

                            <p className="text-xs text-gray-500">{user.email_microsoft}</p>
                        </div>

                            <div onClick={() => seleccionarAdmin(user)}  className="flex items-center gap-2 cursor-pointer relative group">
                                
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

            {/* Acciones */}
            
                <div className={`w-full min-h-0 md:overflow-hidden  z-10 bg-gris ${accionesDesp ? 'max-md:absolute max-md:top-0 max-md:h-screen':'max-md:hidden'}`}>
                {
                   tipoAccion === "crear" && (
                        <CrearAdmin setTipoAccion={setTipoAccion} />
                    )
                }
                {
                   tipoAccion === "editar" && adminSeleccionado && (
                        <EditAdmin key={adminSeleccionado.id} admin={adminSeleccionado} usuario={usuario} setTipoAccion={setTipoAccion} />
                    )
                }
                {
                   tipoAccion === "ver" && (
                    <div className="w-full h-full">
                        <div className="w-full h-full min-h-0 bg-gris-claro rounded-2xl overflow-hidden overflow-y-auto">

                            <div className="w-96 h-74 bg-gris mt-5 mx-auto flex flex-col items-center gap-y-3 rounded-2xl p-4">
                                <span className=" w-max h-max rounded-full flex place-items-center border-3 border-primary mt-5 p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 fill-primary" viewBox="0 -960 960 960">
                                        <path d="M440-480q-66 0-113-47t-47-113 47-113 113-47 113 47 47 113-47 113-113 47m0-80q33 0 56.5-23.5T520-640t-23.5-56.5T440-720t-56.5 23.5T360-640t23.5 56.5T440-560M884-20 756-148q-21 12-45 20t-51 8q-75 0-127.5-52.5T480-300t52.5-127.5T660-480t127.5 52.5T840-300q0 27-8 51t-20 45L940-76zM731-229q29-29 29-71t-29-71-71-29-71 29-29 71 29 71 71 29 71-29m-611 69v-111q0-34 17-63t47-44q51-26 115-44t142-18q-12 18-20.5 38.5T407-359q-60 5-107 20.5T221-306q-10 5-15.5 14.5T200-271v31h207q5 22 13.5 42t20.5 38zm287-80"/>
                                    </svg>
                                </span>
                                <p className="text-2xl text-primary font-bold mt-3">Selecció d’usuari</p>
                                <p className="text-center font-light">És necessari seleccionar un usuari per continuar amb la gestió d’accessos i permisos.</p>
                                
                            </div>

                            <div className="max-w-4xl  bg-gris rounded-2xl overflow-hidden mx-2 shadow-lg m-5">

                                <table className="w-full text-left text-sm ">

                                <thead className="bg-primary text-gris">
                                    <tr>
                                    <th className="p-4">Nivell</th>
                                    <th className="p-4">Rang d’usuari</th>
                                    <th className="p-4">Accés</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-300">

                                    <tr className="bg-gris/30">
                                    <td className="p-4 font-bold text-primary">1</td>
                                    <td className="p-4 font-semibold">Voluntari</td>
                                    <td className="p-4">
                                        Pot veure i editar seccions com acta digital.
                                    </td>
                                    </tr>

                                    <tr className="bg-gris/90">
                                    <td className="p-4 font-bold text-primary">2</td>
                                    <td className="p-4 font-semibold">Staff</td>
                                    <td className="p-4">
                                        Pot gestionar equips, voluntaris i partits. Permisos d’edició amplis.
                                    </td>
                                    </tr>

                                    <tr className="bg-gris/30">
                                    <td className="p-4 font-bold text-primary">3</td>
                                    <td className="p-4 font-semibold">Admin</td>
                                    <td className="p-4">
                                        Accés complet al sistema. Pot gestionar usuaris i permisos.
                                    </td>
                                    </tr>

                                    <tr className="bg-gris/90">
                                    <td className="p-4 font-bold text-primary">4</td>
                                    <td className="p-4 font-semibold">Co-Owner</td>
                                    <td className="p-4">
                                        Control total del sistema, incloent configuració global i seguretat.
                                    </td>
                                    </tr>

                                    <tr className="bg-gris/90">
                                    <td className="p-4 font-bold text-primary">4</td>
                                    <td className="p-4 font-semibold">Owner</td>
                                    <td className="p-4">
                                        Control total del sistema, incloent configuració global i seguretat.
                                    </td>
                                    </tr>

                                </tbody>

                                </table>

                            </div>

                            <div className="grid grid-cols-2 place-items-center gap-4">
                                <div className="w-60 h-16 rounded-2xl bg-gris grid grid-cols-[auto_1fr] gap-x-2 items-center p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M430-200h100v-180h60v-184q0-27-28.5-41.5T480-620t-81.5 14.5T370-564v184h60zm-105 88.5q-73-31.5-127.5-86t-86-127.5T80-480.5t31.5-155 86-127 127.5-86T480.5-880t155 31.5 127 86 86 127 31.5 155T848.5-325t-86 127.5-127 86-155 31.5T325-111.5m381.5-142Q800-347 800-480t-93.5-226.5T480-800t-226.5 93.5T160-480t93.5 226.5T480-160t226.5-93.5M523-657q17-17 17-43t-17-43-43-17-43 17-17 43 17 43 43 17 43-17m-43 177"/>
                                    </svg>
                                    <p>Accés manual</p>
                                </div>

                                <div className="w-60 h-16 rounded-2xl bg-gris grid grid-cols-[auto_1fr] gap-x-2 items-center p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M296-270q-42 35-87.5 32T129-269t-46.5-73.5T99-436l75-124q-25-22-39.5-53T120-680q0-66 47-113t113-47 113 47 47 113-47 113-113 47q-9 0-18-1t-17-3l-77 130q-11 18-7 35.5t17 28.5 31 12.5 35-12.5l420-361q42-35 88-31.5t80 31.5 46 73.5-17 93.5l-75 124q25 22 39.5 53t14.5 67q0 66-47 113t-113 47-113-47-47-113 47-113 113-47q9 0 17.5 1t16.5 3l78-130q11-18 7-35.5T782-630t-31-12.5-35 12.5zm40.5-353.5Q360-647 360-680t-23.5-56.5T280-760t-56.5 23.5T200-680t23.5 56.5T280-600t56.5-23.5m400 400Q760-247 760-280t-23.5-56.5T680-360t-56.5 23.5T600-280t23.5 56.5T680-200t56.5-23.5M680-280"/>
                                    </svg>
                                    <p>Accés automàtic</p>
                                </div>
                            </div>
                            <div className="w-full h-20">
                                        &nbsp;
                                    </div>

                        </div>
                    </div>
                    )
                }
                
                
                
            </div>
            
        </div>
        <div  className="md:hidden z-40 w-full h-14 bg-gris border-t border-gray-400 fixed bottom-0 left-0 grid grid-cols-2 place-items-center gap-x-4">
                <div onClick={() => setAccionesDesp(false)} className={` w-40 h-10 flex place-content-center items-center gap-x-2 text-sm border-t-4 rounded  ${accionesDesp ? 'border-transparent fill-blanco':'border-azul-suave text-primary fill-primary'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                        <path d="M280-600v-80h560v80zm0 160v-80h560v80zm0 160v-80h560v80zM160-600q-17 0-28.5-11.5T120-640t11.5-28.5T160-680t28.5 11.5T200-640t-11.5 28.5T160-600m0 160q-17 0-28.5-11.5T120-480t11.5-28.5T160-520t28.5 11.5T200-480t-11.5 28.5T160-440m0 160q-17 0-28.5-11.5T120-320t11.5-28.5T160-360t28.5 11.5T200-320t-11.5 28.5T160-280"/>
                    </svg>
                    <p>Administradors</p>
                </div>

                <div onClick={() => setAccionesDesp(true)} className={` w-40 h-10 flex place-content-center items-center gap-x-2 text-sm border-t-4 rounded  ${accionesDesp ? 'border-azul-suave text-primary fill-primary':'border-transparent fill-blanco'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22 68.5 22 43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38zm0-120v40-560 243-3zm80-40h163q3-21 9.5-41t14.5-39H280zm0-160h244q32-30 71.5-50t84.5-27v-3H280zm0-160h400v-80H280zm221.5-198.5Q510-807 510-820t-8.5-21.5T480-850t-21.5 8.5T450-820t8.5 21.5T480-790t21.5-8.5M720-40q-83 0-141.5-58.5T520-240t58.5-141.5T720-440t141.5 58.5T920-240 861.5-98.5 720-40m-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100z"/>
                    </svg>
                    <p>Accions</p>
                </div>
        </div>
        </>
    )
}