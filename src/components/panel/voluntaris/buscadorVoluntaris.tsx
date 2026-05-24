import { useEffect, useState } from "react";

type Props = {
  torneoID?: string | null;
  estado?: string | null;
};

type StatItem = {
  total: number;
  percent: number;
};

type Stats = Record<string, StatItem>;

interface Voluntarios {
    id: number,
    nombre: string, 
    _1r_apellido: string,
    _2n_apellido: string, 
    curso: string, 
    tipo:string,
    descripcion:string,
    email: string,
    estado: string,
}

export default function BuscadorVoluntaris({ torneoID, estado }: Props) {
    const [estadoTorneo, setEstadoTorneo] = useState(estado)
    const [data, setData] = useState<Voluntarios[]>([]);
    const [voluntarios, setVoluntarios] = useState<Voluntarios[]>([]);
    const [busqueda, setBusqueda] = useState("");

  const [statsEstado, setStatsEstado] = useState<Stats>({});

    const [totalVoluntarios, setTotalVoluntarios] = useState(0);

  useEffect(() => {
    fetch("/api/panel/ResumenVolunatrios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ torneoID }),
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setVoluntarios(res);
      })
      .catch(() => console.log("Error carregant dades"));
  }, [torneoID]);

useEffect(() => {
    setTotalVoluntarios(data.length)
  if (!data || data.length === 0) return;

  const total = data.length;

  const estadoCount = data.reduce((acc: Record<string, number>, e) => {
    const key = e.estado || "Sense Estat";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});


  // 🔥 ESTADOS FIJOS (IMPORTANTE)
  const estadoFinal = {
    Acceptat: {
      total: estadoCount.Acceptat || 0,
      percent: total ? Math.round(((estadoCount.Acceptat || 0) / total) * 100) : 0,
    },
    Revisant: {
      total: estadoCount.Revisant || 0,
      percent: total ? Math.round(((estadoCount.Revisant || 0) / total) * 100) : 0,
    },
    Denegat: {
      total: estadoCount.Denegat || 0,
      percent: total ? Math.round(((estadoCount.Denegat || 0) / total) * 100) : 0,
    },
  };

  setStatsEstado(estadoFinal);
  
}, [data]);


  // FILTRO BUSCADOR
  useEffect(() => {
    if (!busqueda.trim()) {
      setVoluntarios(data);
      return;
    }

    const texto = busqueda.toLowerCase();

    const filtrados = data.filter((equipo) => {
      return (
        equipo.nombre?.toLowerCase().includes(texto) ||
        equipo._1r_apellido?.toLowerCase().includes(texto)||
        equipo._2n_apellido?.toLowerCase().includes(texto) ||
        equipo.email?.toLowerCase().includes(texto)
      );
    });

    setVoluntarios(filtrados);
  }, [busqueda, data]);


    return(
        <>
        <div className="max-w-6xl mx-auto mt-10 h-auto flex flex-col md:grid grid-cols-[1fr_1fr] gap-3 max-md:gap-4">

            <div className="w-full max-md:w-full h-32 bg-gris-claro border-gray-600 border rounded-2xl flex flex-row max-md:place-content-start max-md:pl-4 items-center pl-10 gap-4 p-2">
                <span className="w-max h-max flex items-center place-content-center bg-azul-claro/30 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-azul-claro w.10 h-10" viewBox="0 -960 960 960">
                        <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65zm240 0v-65q0-32 17.5-58.5T307-410t76.5-30 96.5-10q53 0 97.5 10t76.5 30 49 46.5 17 58.5v65zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63zm-455-80h311q-10-20-55.5-35T480-370t-100.5 15-54.5 35M160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440m640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440m-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480m0-80q17 0 28.5-11.5T520-600t-11.5-28.5T480-640t-28.5 11.5T440-600t11.5 28.5T480-560m0-40"/>
                    </svg>
                </span>
                <div className="flex flex-col">
                    <p className="text-lg uppercase text-gray-300">Total de voluntaris</p>
                    <p className="text-2xl text-blanco font-bold flex gap-2 items-end"><span className="text-4xl">{totalVoluntarios}</span>voluntaris</p>

                </div>
            </div>

            <div className="w-full h-32 bg-gris-claro border-gray-600 border rounded-2xl flex flex-col  gap-4 p-2">
                <p className="text-lg uppercase text-gray-300">Ratio de validació</p>
                <div className="w-[90%]  mx-auto h-5 rounded-full flex overflow-hidden bg-gray-600/40">

                        {/* ACCEPTAT */}
                        <span
                            className="bg-green-600 h-full"
                            style={{ width: `${statsEstado?.Acceptat?.percent}%` }}
                        />

                        {/* REVISANT */}
                        <span
                            className="bg-orange-600 h-full"
                            style={{ width: `${statsEstado?.Revisant?.percent}%` }}
                        />

                        {/* DENEGAT */}
                        <span
                            className="bg-red-600 h-full"
                            style={{ width: `${statsEstado?.Denegat?.percent}%` }}
                        />

                        </div>
                        <div className="flex flex-row max-md:flex-wrap text-xs max-md:text-xs place-content-between gap-2">
                            <p className="flex flex-row gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-green-600">&nbsp;</span>
                                <span>{statsEstado?.Acceptat?.total}</span>
                                Acceptat
                            </p>
                            <p className="flex flex-row gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-orange-600">&nbsp;</span>
                                <span>{statsEstado?.Revisant?.total}</span>
                                Revisant
                            </p>
                            <p className="flex flex-row gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-red-600">&nbsp;</span>
                                <span>{statsEstado?.Denegat?.total}</span>
                                Denegat
                            </p>
                        </div>
            </div>
            

        </div>
        <div className="max-w-6xl mt-10 border border-gray-600 mx-auto min-h-32 rounded-2xl bg-gris-claro p-5 flex flex-wrap gap-y-3 items-center place-content-between">
            <div className="flex flex-col place-content-center gap-y-2 h-full">
                <h2 className="text-3xl text-blanco font-bold">Voluntaris Inscrits</h2>
                <h4 className="text-base text-gray-500">Gestiona i revisa les sol·licituds de participació.</h4>
            </div>

            <div className="w-64 max-md:w-full rounded-2xl h-14 bg-gray-600 border border-gray-500 flex flex-row relative items-center gap-x-2">
                <input type="text" className="w-48 ml-4 rounded-xl h-10 px-2 text-blanco bg-transparent" onChange={(e) => setBusqueda(e.target.value)} placeholder="Cercar equip..." />
                <span className="cursor-pointer absolute right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-blanco" viewBox="0 -960 960 960">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/>
                    </svg>
                </span>
            </div>
        </div>

        <div className="max-w-6xl mt-10 mx-auto h-auto rounded-2xl  p-5 flex flex-wrap items-center place-content-between">
            <div className="w-full h-10 border-b max-md:hidden border-gray-700 grid grid-cols-[200px_1fr_150px_150px_150px_150px] p-2 gap-2">
                
                <p className="px-2">Nom Complet</p>
                <p className="px-2">Curs</p>
                <p className="px-2 text-center">Email</p>
                <p className="px-2 text-center">Tipus</p>
                <p className="px-2 text-center">Estat</p>
                <p className="px-2 text-center">Accions</p>
            </div>
            

            <div className="w-full mt-2 flex flex-col gap-y-2">
                {!voluntarios || voluntarios.length === 0 && (
                <p className="text-center mx-auto">No s'han trobat equips inscrtis.</p>
            )}
                {
                    voluntarios.map((voluntario) =>(
                        <div className="w-full min-h-24 rounded-xl bg-gris-claro border  border-gray-600 max-md:flex flex-wrap md:grid grid-cols-[200px_1fr_150px_150px_150px_150px] items-center p-2 gap-2">
                            
                            
                            <p className="font-semibold text-lg first-letter:uppercaser">{voluntario.nombre} {voluntario._1r_apellido} {voluntario._2n_apellido}</p>
                            <p className="text-lg first-letter:uppercaser">{voluntario.curso}</p>
                            <p className="text-lg first-letter:uppercaser overflow-x-auto no-scrollbar">{voluntario.email}</p>
                            <p className="text-lg max-md:hidden first-letter:uppercaser text-center">{voluntario.tipo}</p>
                            
                            <div className="max-md:hidden w-full my-2 flex flex-row items-center place-content-around">
                                <div className="w-full flex items-center place-content-center">
                                    {
                                        voluntario.estado === "Acceptat" && (
                                            <p className="text-green-300 bg-green-600/60 border-green-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                    {
                                        voluntario.estado === "Denegat" && (
                                            <p className="text-red-300 bg-red-600/60 border-red-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                    {
                                        voluntario.estado === "Revisant" && (
                                            <p className="text-orange-300 bg-orange-600/60 border-orange-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                </div>
                                
                            </div>
                            <div className="md:hidden w-full grid grid-cols-2 place-items-center">

                            <p className="text-lg first-letter:uppercaser text-center">{voluntario.tipo}</p>
                            
                            <div className=" w-full my-2 flex flex-row items-center place-content-around">
                                <div className="w-full flex items-center place-content-center">
                                    {
                                        voluntario.estado === "Acceptat" && (
                                            <p className="text-green-300 bg-green-600/60 border-green-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                    {
                                        voluntario.estado === "Denegat" && (
                                            <p className="text-red-300 bg-red-600/60 border-red-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                    {
                                        voluntario.estado === "Revisant" && (
                                            <p className="text-orange-300 bg-orange-600/60 border-orange-300 rounded-full border  text-sm px-2 py-1">{voluntario.estado}</p>
                                        )
                                    }
                                </div>
                                
                            </div>
                            </div>
                            
                            

                            <div className="w-full flex flex-row items-center place-content-around">
                                <a href={`/panel/info/voluntari?torneoID=${torneoID}&voluntarioID=${voluntario.email}&accio=ver`} className="w-10 h-10 flex items-center place-content-center rounded hover:bg-azul-claro/30 cursor-pointer transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5T480-680t-127.5 52.5T300-500t52.5 127.5T480-320t127.5-52.5m-204-51Q372-455 372-500t31.5-76.5T480-608t76.5 31.5T588-500t-31.5 76.5T480-392t-76.5-31.5M214-281.5Q94-363 40-500q54-137 174-218.5T480-800t266 81.5T920-500q-54 137-174 218.5T480-200t-266-81.5m473.5-58Q782-399 832-500q-50-101-144.5-160.5T480-720t-207.5 59.5T128-500q50 101 144.5 160.5T480-280t207.5-59.5"/>
                                    </svg>
                                </a>
                                {
                                    estadoTorneo === "Finalitzat" ? (
                                        <span className="w-10 h-10 flex items-center place-content-center rounded  cursor-not-allowed">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-600" viewBox="0 -960 960 960">
                                                <path d="M200-200h57l391-391-57-57-391 391zm-80 80v-170l528-527q12-11 26.5-17t30.5-6 31 6 26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120zm640-584-56-56zm-141 85-28-29 57 57z"/>
                                            </svg>
                                        </span>
                                    ):(
                                        <a href={`/panel/info/voluntari?torneoID=${torneoID}&voluntarioID=${voluntario.email}&accio=editar`} className="w-10 h-10 flex items-center place-content-center rounded hover:bg-azul-claro/30 cursor-pointer transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                                <path d="M200-200h57l391-391-57-57-391 391zm-80 80v-170l528-527q12-11 26.5-17t30.5-6 31 6 26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120zm640-584-56-56zm-141 85-28-29 57 57z"/>
                                            </svg>
                                        </a>
                                    )
                                }

                                {
                                    estadoTorneo === "Finalitzat" ? (
                                        <span className="w-10 h-10 flex items-center place-content-center rounded cursor-not-allowed">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-600" viewBox="0 -960 960 960">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                            </svg>
                                        </span>
                                    ):(
                                        <span className="w-10 h-10 flex items-center place-content-center rounded hover:bg-red-400/30 cursor-pointer transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120zm400-600H280v520h400zM360-280h80v-360h-80zm160 0h80v-360h-80zM280-720v520z"/>
                                            </svg>
                                        </span>
                                    )
                                }
                                

                                
                            </div>
                        </div>
                    ))
                }
            </div>
            
            
        </div>
        </>
    )
};