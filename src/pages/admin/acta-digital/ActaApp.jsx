import { useEffect, useRef, useState } from "react";
import './ActaApp.css';

const ActaDigitalApp = ( { nombreEquipoLocal, nombreEquipoVisitante, tiempoUltimaJugada = "00:00" } ) => {
    const jugadoresLocal = Array.from({ length: 9 }, () => ({ nombre: "", img: "" }));
    const jugadoresVisitante = Array.from({ length: 9 }, () => ({ nombre: "", img: "" }));

    const PUNTOS = [
    {
        nombre: "Directo",
        svg: "",
    },
    {
        nombre: "Bloqueo",
        svg: "M53 26a20 20 0 0 0-16 18l-1 1v4l-2 6-1 3 1 4v9l-4 4-4 4c1 1 1 0 5-3l4-6v-6l-1-6 1-2c1-3 1-3 0 0v4l1-3a112 112 0 0 1 3-13h1l-2 8-1 7 1 1v-3l1-5a186 186 0 0 0 2-9l1 1v6l-1 4 1 5h3l3-4c1-2 2-4 3-3l-1 7-1 5-2 6-2 2-7 10 3-3 4-6c3-3 3-4 4-7v-1h2l5 1 6-1 1 1v4l2 4a100 100 0 0 1 5 9h1a108 108 0 0 0-7-14l-1-6a56 56 0 0 0-1-8c0-5 3-5 4 1l1 2c1 2 2 2 3 2l2-4v-6c-1-4 0-6 2-6l1 4a143 143 0 0 0 0 8v5a50 50 0 0 0 1-8 164 164 0 0 1 0-7 99 99 0 0 1 1 16l1-5v-4 10l-2 9 3 6 4 6-3-6-3-5v-3l1-6 1-4v-3l-1-6v-5l-1-1h-1v-2c-1-8-7-14-14-16l-5-1h-4Zm8 2h3l2 2c3 5 3 11 2 17l-3 5v-1l-2-1-1-1-3-4V33l-3-5v-1h2l3 1Zm-6 0 2 4 1 1h-1c-7 1-12 4-16 8l-2 2-1 1c1-9 7-15 14-16h3Zm14 4c3 2 5 6 6 9v2h-2l-1 1-1 7v3l-1 1-4-2 1-2 3-10-2-9-1-1 2 1Zm-11 4v6l-2 1c-5 1-10 4-13 8l-1 2 1-3v-7l-1-1 1-1a22 22 0 0 1 15-7v2Zm0 8 3 6 1 1v10l-6-3a24 24 0 0 1-5-7l-1-2-1-2 1-1 6-2h2Zm-21 3c0 1 0 1 0 0v-1 1Zm41 3v2a23 23 0 0 1-1-5l1 3Zm-29 0 1 1-1 1c-1 0-2 1-2 3l-1 2-3 2v-2l-1-2 1-1 1-2 4-4 1 2Zm-12-1v-1 1Zm0 0h-1 1Zm32 6 2 1-2 3-2-2-1-2h3Zm-12 4 4 3 1 1-1 1H51l-1-1 1-3 1-4v-1l2 1 3 3Z",
    },
    {
        nombre: "Remate",
        svg: "M65 16c-3 1-2 7 2 8 2 0 2-1 3-2 2-1 2-4 0-6h-5Zm11 11-5 5-5 5-4 3-3 2h-2v-2l-1-2h-1v-1l-2-1-3 1-1 3v1l1 1h-1l-1 1h-1l-1-4v-4l1-2h-1v-1l-1-2-1-1v2-1c0 2 0 3-1 2v1l1 2v3l-1 6 1 1 1 1h-3v2c1 2 5 2 6 0l1-1 6 5 3 4-1 2c-2 1-2 2-2 7l-2 7h-1l-7-1c-3 0-3 0-4-2l-2-2-3 3c-3 3-3 4-3 5h2l1-1h4l1-1 5 2 3 2c2 2 5 2 6 1 1 0 3-2 5-6l1-2 1 6-1 1-2 2-3 5h-2c-1-1-2-1-2 1l1 2v2l1 4 2-3 1-2v-1l1-2 3-2 3-2 3-1 1-4a668 668 0 0 1-4-31v-1l1-1 4-6 4-4 1-2 2-2v-3 1ZM52 44h1v1h-1l-1-1h1Z",
    },
    {
        nombre: "Error",
        svg: "M50 28a27 27 0 0 0-17 12l-2-1h-2l1 2 1 1-1 2-2 12a29 29 0 0 0 7 18l2 1a55 55 0 0 1-4 6h1l3-2 2-2 1 1a24 24 0 0 0 14 5l11-2c6-3 11-7 14-13l1-2 2 1 5 1 1-1c0-2-1-3-5-4l-2-1v-1l1-6-1-6-2-8-4-5-1-1 1-1 2-4-4 2-1 1-1-1c-4-3-9-4-15-4a254 254 0 0 1-6 0Zm6 1 4 1 5 1-2 1-8 3-9 9-1 2-8-4 4-7 6-5 9-1Zm-12 2-1 1a21 21 0 0 0-6 10l-3-2 5-5c1-2 5-4 6-4h-1Zm23 1 3 1v1a221 221 0 0 1-15 17l-9-4 2-3c4-6 10-10 16-11l2-1v-1l1 1Zm8 6 2 2v1h-7l2-2 2-3 1 2Zm3 5 2 6v11c-1 3-1 2-1-1v-6l-2-5a453 453 0 0 0-2-7h2l1 2Zm-4 1c2 5 4 8 4 11v6l-3-1-4-2v-1c-1-3-2-8-4-10l-1-1 2-2 1-2h2l1-1 2 3Zm-40 2c2 4 7 8 10 9h2l4 1 2-1h1l-1 1-4 4-4 5-3-1a32 32 0 0 1-11-10l2-10v-1l1 1 1 2Zm6 2 3 2v1l-1 2-1-1-5-6 4 2Zm20-1Zm6 1 4 9-1 1-9-5 2-3 3-3 1 1Zm-13 7h-3l-5-1c-2-1-2-1-1-3v-1l5 2 4 3Zm-20 5a29 29 0 0 0 10 6l-1 2a172 172 0 0 0-4 5l-2-2-2-1a29 29 0 0 1-4-14v1l3 3Zm35 1 2 1v3l-1 8v2l-2 3-10 3c-6 1-12-1-16-4l-1-1v-1h3a31 31 0 0 0 14 2l-4-1h-5a4383 4383 0 0 0-6-2l1-2a170 170 0 0 0 5-5 29 29 0 0 0 11 0v3l-1 3v1l-1 1v1l-1 2-1 3 5-11v-5l-2-8 4 2 6 2Zm-11-3 2 6c0 2 0 2-2 2h-8l3-4 4-5 1 1Zm18 6 3 2-2 4-6 6a66 66 0 0 0 2-13l3 1ZM38 74l-1-1c-1-1-1-1 0 0l1 1Z",
    }
]


//Cronometro
  const relojRef = useRef(null);
  const minutosRef = useRef(null);
  const segundosRef = useRef(null);

  const [minutos, setMinutos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervaloRef = useRef(null);

  // Función para separar minutos y segundos
  function separarMinutosSegundos(tiempo) {
    const [min, seg] = tiempo.split(":");
    return {
      minutos: parseInt(min, 10),
      segundos: parseInt(seg, 10),
    };
  }

  // Inicializar desde tiempoUltimaJugada
  useEffect(() => {
    const { minutos, segundos } = separarMinutosSegundos(tiempoUltimaJugada);
    setMinutos(minutos);
    setSegundos(segundos);
  }, [tiempoUltimaJugada]);

  // Efecto para manejar el intervalo
  useEffect(() => {
    if (corriendo) {
      intervaloRef.current = setInterval(() => {
        setSegundos((prevSegundos) => {
          let newSeg = prevSegundos + 1;
          let newMin = minutos;

          if (newSeg >= 60) {
            newSeg = 0;
            newMin += 1;
            setMinutos(newMin);
          }

          // Actualización del total en milisegundos si lo necesitas:
          const totalMilisegundos = (newMin * 60 + newSeg) * 1000;
          const tiempoFormateado = String(totalMilisegundos).padStart(10, "0");
          // Puedes usar `tiempoFormateado` para algo aquí

          return newSeg;
        });
      }, 1000);
    } else {
      clearInterval(intervaloRef.current);
    }

    return () => clearInterval(intervaloRef.current);
  }, [corriendo, minutos]);

  // Manejador de clic
  const toggleReloj = () => {
    if (relojRef.current) {
      relojRef.current.classList.toggle("reloj-activo");
    }
    setCorriendo((prev) => !prev);
  };


    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [pasoTipo, setPasoTipo] = useState(0);

  const tipos = ["Directo", "Remate", "Bloqueo", "Error"];

  const manejarSeleccion = (tipo) => {
    setTipoSeleccionado(tipo);
    setPasoTipo(1);
    if (onSeleccionar) onSeleccionar(tipo); // Callback si quieres usarlo fuera
  };

  return (
    <>
    <section class="h-[700px] w-[1100px] my-auto bg-red-400 overflow-auto mx-auto no-scrollbar relative">
        <div key="box_principal" class="w-full h-full border-2 border-accent bg-gris grid grid-rows-1 grid-cols-3 select-none">

            {/* Datos equipo 1 */}
            <div class="w-full h-full bg-transparent">
                {/* Nombre e Imagen Equipo */}
                <div class="w-full h-auto grid grid-cols-[max-content_1fr] grid-rows-1 p-2">
                    <div class="w-max h-max">
                        <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                    </div>
                    <div class="flex items-center place-content-center">
                        <input type="hidden" key="id_equipo_local" disabled value={`equipo-local`}/>
                        <input type="hidden" key="local_total_play" disabled value={jugadoresLocal.length} />
                        <p class="text-2xl text-accent font-semibold">{nombreEquipoLocal}</p>
                    </div>
                </div>

                {/* Lista jugadores */}
                <div class="w-full mt-4 h-auto flex flex-wrap gap-2 items-center place-content-center">
                    {
                        jugadoresLocal.map((jugador, index) => (
                            <div key={`local_play_${index}`} class="w-[105px] h-[105px] rounded-md bg-gris-claro flex flex-col items-center place-content-center cursor-pointer">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                                    </svg>
                                </div>
                                <input key={`local_nombre_${index}`} class="w-full bg-transparent text-center text-blanco select-none" value={`Jugador ${index + 1}`} disabled/>
                            </div>
                        )
                    )}
                    <div class="w-full h-auto rounded-md mx-3 bg-gris-claro grid grid-cols-[max-content_1fr] grid-rows-1">
                        <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                                    </svg>
                                </div>
                                <p class="my-auto text-blanco">Entrenador</p>
                    </div>
                </div>
            </div>

             {/* Datos equipo Generales */}
             <div class="w-full h-full bg-gris-claro flex flex-col items-center pt-4 gap-y-2">
                {/* Datos generales */}
                <div class="w-full flex flex-wrap gap-1 ocultar">
                    <input class="w-24" key="nombre-jugador" type="text" disabled/>
                    <input class="w-24" key="id-equipo" type="text" disabled/>
                    <input class="w-24" key="tipo-punto" type="text" disabled/>
                    <input class="w-24" key="tiempo" type="text" disabled/>
                    <input class="w-24" key="orden" type="text" disabled/>
                </div>

                {/* Marcador */}
                <div key="marcador" class="w-[90%] h-auto grid grid-rows-1 grid-cols-[max-content_max-content_1fr_max-content_max-content]  gap-x-1">
                    {/* Puntos */}
                    <span data-LocPuntos class="text-blanco text-7xl font-semibold">0</span>
                    {/* Sets */}
                    <span data-LocSets class="text-blanco text-4xl font-semibold flex flex-col place-content-end">0</span>
                    {/* Pista */}
                    <span class="text-blanco text-2xl flex flex-col place-content-center items-center">Pista 1</span>
                    {/* Sets */}
                    <span data-VisSets class="text-blanco text-4xl font-semibold flex flex-col place-content-end">0</span>
                    {/* Puntos */}
                    <span data-VisPuntos class="text-blanco text-7xl font-semibold">0</span>
                </div>

                {/* Reloj */}
                 <div key="reloj" ref={relojRef} onClick={toggleReloj} className="w-52 h-auto text-azul-suave flex flex-row gap-2 place-content-center items-center cursor-pointer select-none" >
                    <span data-minutos className="text-5xl font-semibold">
                        {String(minutos).padStart(2, "0")}
                    </span>
                    <span className="text-5xl font-semibold">:</span>
                    <span data-segundos className="text-5xl font-semibold">
                        {String(segundos).padStart(2, "0")}
                    </span>
                </div>

                {/* Arbitros */}
                <div class="w-52 h-16 mb-1  flex flex-wrap gap-2 place-content-center items-center">
                    <p class="text-blanco font-medium text-base"><span class="font-bold">Arbitro:</span> Ricardo</p>
                    <p class="text-blanco font-medium text-base"><span class="font-bold">Oficial 1:</span> Marina</p>
                    <p class="text-blanco font-medium text-base"><span class="font-bold">Oficial 2:</span> Saray</p>
                </div>

                {/* Tipos de puntos */}
                <div class="w-52 h-auto  flex flex-wrap gap-2 place-content-center items-center">
                    {/* Directo */}
                    <div key="directo" onClick={() => seleccionarTipo("Directo")} class="bg-gris w-20 h-20 rounded-md flex flex-col items-center place-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none"  viewBox="0 0 110 110">
                            <path fill="#FFC700" d="M34 27a4173 4173 0 0 1 2 1L24 17l10 10Zm0-6a3535 3535 0 0 0 22 21L42 28l-8-7Z"/>
                            <path fill="#FFC700" d="M37 40a1155 1155 0 0 1 2 5 405 405 0 0 0 10 12h-1l-6-6-8-8 11 11 3 4-1 1v1a511 511 0 0 1-22-21l10 11 9 9 2 2v2a1233 1233 0 0 1-13-12l13 13v7l-2-2a1246 1246 0 0 0 3 5l6 9a17 17 0 0 0 12 4c5 0 7-1 11-3 5-4 9-11 8-18 0-4-1-9-3-11-4-4-8-7-14-7h-2l-1-2a12634 12634 0 0 1-9-8l8 9-2 1h-1l-4-4c-4-3-3-2 1 2l2 2-6-5a1488 1488 0 0 1-5-4l10 10h-1l-2 1-7-7c-15-15-15-15-2-1a442 442 0 0 1 8 9h-1l-3-2a263 263 0 0 1-14-14l-5-5 5 6 11 11 6 5h-1l-1 1-13-13a2375 2375 0 0 0-1 0Zm32 9 3 1h-1l-8 4-6 7-1 4-4-3-1-2 3-5 5-6 5-1 5 1Zm-12 2-3 3-3 5v1l-1-1-1-2 1-1 6-5h1Zm20 2 3 2 1 2h-3l-7 1c-3 1-6 5-6 8l-1 1h-5l-1-1-1-2a21 21 0 0 1 15-13h2l3 2Zm5 6a20 20 0 0 1 1 11v2l-1-2v-5l-3-7-1-1h3l1 2Zm-3 1 3 7v8l-5 7-1 1v-2l1-13-5-8v-1h1l2-1 3-1 1 3Zm-30-1 4 6c2 1 2 2 5 2l5 1 1-1 1-1 2-3 3-3h1c2 2 4 5 4 8l1 11-2 5-8 2h-1l1-2 2-4 1-4-1-4-2-5h-1 1v3l2 4-1 1h-3l-8-1a22 22 0 0 1-9-7c-1-1 0-5 2-8 0-1 0-1 0 0Zm1 13a27 27 0 0 0 6 3c2 1 8 2 10 1l2 1v2l-3 6v1h-1l-9-2-3-4h-1l2 1 6 2h7-2l-11-3-3-1v-2c-2-2-3-5-3-8v-1l1 1 2 3Z"/>
                            <path fill="#FFC700" d="m21 33 6 6a45 45 0 0 0-6-6Zm15 7 3 3-3-3-4-3 4 3Zm-14 3Zm23 0Zm-5 20-3-4 3 4Z"/>
                        </svg>
                        <p class="text-sm text-amarillo">Directo</p>
                    </div>
                    {/* Bloqueo */}
                    <div key="bloqueo" class="bg-gris w-20 h-20 rounded-md flex flex-col items-center place-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 110 110">
                            <path fill="#FFC700" d="M53 26a20 20 0 0 0-16 18l-1 1v4l-2 6-1 3 1 4v9l-4 4-4 4c1 1 1 0 5-3l4-6v-6l-1-6 1-2c1-3 1-3 0 0v4l1-3a112 112 0 0 1 3-13h1l-2 8-1 7 1 1v-3l1-5a186 186 0 0 0 2-9l1 1v6l-1 4 1 5h3l3-4c1-2 2-4 3-3l-1 7-1 5-2 6-2 2-7 10 3-3 4-6c3-3 3-4 4-7v-1h2l5 1 6-1 1 1v4l2 4a100 100 0 0 1 5 9h1a108 108 0 0 0-7-14l-1-6a56 56 0 0 0-1-8c0-5 3-5 4 1l1 2c1 2 2 2 3 2l2-4v-6c-1-4 0-6 2-6l1 4a143 143 0 0 0 0 8v5a50 50 0 0 0 1-8 164 164 0 0 1 0-7 99 99 0 0 1 1 16l1-5v-4 10l-2 9 3 6 4 6-3-6-3-5v-3l1-6 1-4v-3l-1-6v-5l-1-1h-1v-2c-1-8-7-14-14-16l-5-1h-4Zm8 2h3l2 2c3 5 3 11 2 17l-3 5v-1l-2-1-1-1-3-4V33l-3-5v-1h2l3 1Zm-6 0 2 4 1 1h-1c-7 1-12 4-16 8l-2 2-1 1c1-9 7-15 14-16h3Zm14 4c3 2 5 6 6 9v2h-2l-1 1-1 7v3l-1 1-4-2 1-2 3-10-2-9-1-1 2 1Zm-11 4v6l-2 1c-5 1-10 4-13 8l-1 2 1-3v-7l-1-1 1-1a22 22 0 0 1 15-7v2Zm0 8 3 6 1 1v10l-6-3a24 24 0 0 1-5-7l-1-2-1-2 1-1 6-2h2Zm-21 3c0 1 0 1 0 0v-1 1Zm41 3v2a23 23 0 0 1-1-5l1 3Zm-29 0 1 1-1 1c-1 0-2 1-2 3l-1 2-3 2v-2l-1-2 1-1 1-2 4-4 1 2Zm-12-1v-1 1Zm0 0h-1 1Zm32 6 2 1-2 3-2-2-1-2h3Zm-12 4 4 3 1 1-1 1H51l-1-1 1-3 1-4v-1l2 1 3 3Z"/>
                        </svg>
                        <p class="text-sm text-amarillo">Bloqueo</p>
                    </div>
                    {/* Remate */}
                    <div key="remate" class="bg-gris w-20 h-20 rounded-md flex flex-col items-center place-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 110 110">
                            <path fill="#FFC700" d="M65 16c-3 1-2 7 2 8 2 0 2-1 3-2 2-1 2-4 0-6h-5Zm11 11-5 5-5 5-4 3-3 2h-2v-2l-1-2h-1v-1l-2-1-3 1-1 3v1l1 1h-1l-1 1h-1l-1-4v-4l1-2h-1v-1l-1-2-1-1v2-1c0 2 0 3-1 2v1l1 2v3l-1 6 1 1 1 1h-3v2c1 2 5 2 6 0l1-1 6 5 3 4-1 2c-2 1-2 2-2 7l-2 7h-1l-7-1c-3 0-3 0-4-2l-2-2-3 3c-3 3-3 4-3 5h2l1-1h4l1-1 5 2 3 2c2 2 5 2 6 1 1 0 3-2 5-6l1-2 1 6-1 1-2 2-3 5h-2c-1-1-2-1-2 1l1 2v2l1 4 2-3 1-2v-1l1-2 3-2 3-2 3-1 1-4a668 668 0 0 1-4-31v-1l1-1 4-6 4-4 1-2 2-2v-3 1ZM52 44h1v1h-1l-1-1h1Z"/>
                        </svg>
                        <p class="text-sm text-amarillo">Remate</p>
                    </div>
                    {/* Error */}
                    <div key="error" class="bg-gris  w-20 h-20 rounded-md flex flex-col items-center place-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 110 110">
                            <path fill="#FFC700" d="M50 28a27 27 0 0 0-17 12l-2-1h-2l1 2 1 1-1 2-2 12a29 29 0 0 0 7 18l2 1a55 55 0 0 1-4 6h1l3-2 2-2 1 1a24 24 0 0 0 14 5l11-2c6-3 11-7 14-13l1-2 2 1 5 1 1-1c0-2-1-3-5-4l-2-1v-1l1-6-1-6-2-8-4-5-1-1 1-1 2-4-4 2-1 1-1-1c-4-3-9-4-15-4a254 254 0 0 1-6 0Zm6 1 4 1 5 1-2 1-8 3-9 9-1 2-8-4 4-7 6-5 9-1Zm-12 2-1 1a21 21 0 0 0-6 10l-3-2 5-5c1-2 5-4 6-4h-1Zm23 1 3 1v1a221 221 0 0 1-15 17l-9-4 2-3c4-6 10-10 16-11l2-1v-1l1 1Zm8 6 2 2v1h-7l2-2 2-3 1 2Zm3 5 2 6v11c-1 3-1 2-1-1v-6l-2-5a453 453 0 0 0-2-7h2l1 2Zm-4 1c2 5 4 8 4 11v6l-3-1-4-2v-1c-1-3-2-8-4-10l-1-1 2-2 1-2h2l1-1 2 3Zm-40 2c2 4 7 8 10 9h2l4 1 2-1h1l-1 1-4 4-4 5-3-1a32 32 0 0 1-11-10l2-10v-1l1 1 1 2Zm6 2 3 2v1l-1 2-1-1-5-6 4 2Zm20-1Zm6 1 4 9-1 1-9-5 2-3 3-3 1 1Zm-13 7h-3l-5-1c-2-1-2-1-1-3v-1l5 2 4 3Zm-20 5a29 29 0 0 0 10 6l-1 2a172 172 0 0 0-4 5l-2-2-2-1a29 29 0 0 1-4-14v1l3 3Zm35 1 2 1v3l-1 8v2l-2 3-10 3c-6 1-12-1-16-4l-1-1v-1h3a31 31 0 0 0 14 2l-4-1h-5a4383 4383 0 0 0-6-2l1-2a170 170 0 0 0 5-5 29 29 0 0 0 11 0v3l-1 3v1l-1 1v1l-1 2-1 3 5-11v-5l-2-8 4 2 6 2Zm-11-3 2 6c0 2 0 2-2 2h-8l3-4 4-5 1 1Zm18 6 3 2-2 4-6 6a66 66 0 0 0 2-13l3 1ZM38 74l-1-1c-1-1-1-1 0 0l1 1Z"/>
                        </svg>
                        <p class="text-sm text-amarillo">Error</p>
                    </div>
                
                </div>

                {/* Historial */}
                <div class="w-64 h-48 rounded-md bg-gris overflow-y-scroll no-scrollbar flex flex-col gap-y-2 border-2 border-gris">
                    <div key="historial" class="w-full h-auto rounded-md bg-gris flex flex-col-reverse gap-y-2 border-2 border-gris">
                        
                        
                    </div>
                </div>

                {/* Botones */}
                <div class="w-64 h-14 flex flex-row items-center place-content-between">
                    <div class="w-14 h-14 bg-gris rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
                            
                            <path fill="#E8EAED" d="M32 66V33l40 17-40 16Zm4-6 25-10-25-11v8l13 3-13 3v7Z"/>
                        </svg>
                    </div>
                    <div key="conf_partido" class="w-14 h-14 bg-gris rounded-md flex items-center place-content-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="#e8eaed" viewBox="0 -960 960 960">
                            <path d="m370-80-16-128q-13-5-24-12t-23-15l-119 50L78-375l103-78-1-13v-27l1-14-103-78 110-190 119 50 23-15 24-12 16-128h220l16 128q13 5 25 12t22 15l119-50 110 190-103 78 1 14v27l-2 13 103 78-110 190-118-50-23 15-24 12-16 128H370Zm70-80h79l14-106q31-8 58-23t48-38l99 41 39-68-86-65q5-14 7-29t2-32q0-16-2-31t-7-30l86-65-39-68-99 42q-22-23-48-38t-58-24l-13-106h-79l-14 106q-31 8-57 24t-49 37l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 49 39t57 23l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99 41t-41 99q0 58 41 99t99 41Zm-2-140Z"/>
                        </svg>
                    </div>
                    <div key="informe" class="w-14 h-14 bg-gris rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
                        
                        <g clip-path="url(#a)">
                            <path fill="#E8EAED" d="M42 63h16v-5H42v5Zm0-9h16v-4H42v4Zm-4 17-3-1-2-3V33l2-3 3-1h16l13 13v25l-2 3-2 1H38Zm14-27V33H38v34h25V44H52Z"/>
                        </g>
                        <defs>
                            <clipPath key="a">
                            <path fill="#fff" d="M0 0h50v50H0z" transform="translate(25 25)"/>
                            </clipPath>
                        </defs>
                        </svg>
                    </div>
                    <div key="salir" class="w-14 h-14 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
                            <rect width="100" height="100" fill="#EB4335" rx="10"/>
                            <path fill="#6B0014" d="m47 53 2-1 1-2-1-2-2-1-2 1-1 2 1 2 2 1ZM36 75v-6l17-2V36l-1-2-1-1-15-2v-6l15 3a8 8 0 0 1 7 8v35l-22 4Zm-11 0v-6h6V31l1-4 4-2h28l4 2 1 4v38h6v6H25Zm11-6h28V31H36v38Z"/>
                        </svg>
                    </div>
                </div>
                
             </div>

             {/* Datos equipo 2 */}
             <div class="w-full h-full ">
                {/* Nombre e Imagen Equipo */}
                <div class="w-full h-auto grid grid-cols-[1fr_max-content] grid-rows-1 p-2">
                    
                    <div class="flex items-center place-content-center">
                        <input type="hidden" key="id_equipo_visitante" disabled value={`equipo-visitante`}/>
                        <input type="hidden" key="visitante_total_play" disabled value={jugadoresVisitante.length} />
                        <p class="text-2xl text-accent font-semibold">{nombreEquipoVisitante}</p>
                    </div>
                    <div class="w-max h-max">
                        <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                    </div>
                </div>

                {/* Lista jugadores */}
                <div class="w-full mt-4 h-auto flex flex-wrap gap-2 items-center place-content-center">
                    {
                        jugadoresVisitante.map((jugador, index) => (
                            <div key={`visitante_play_${index}`} class="w-[105px] h-[105px] rounded-md bg-gris-claro flex flex-col items-center place-content-center cursor-pointer">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                                    </svg>
                                </div>
                                <input key={`visitante_nombre_${index}`} class="w-full bg-transparent text-center text-blanco" value={`Jugador ${index + 1}`} disabled/>
                            </div>
                        )
                    )}
                    <div class="w-full h-auto rounded-md mx-3 bg-gris-claro grid grid-cols-[max-content_1fr] grid-rows-1">
                        <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 fill-blanco" viewBox="0 -960 960 960">
                                        <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                                    </svg>
                                </div>
                                <p class="my-auto text-blanco">Entrenador</p>
                    </div>
                </div>
             </div>

             {/* Barra de confirmaciones */}
             <div key="confirmaciones" class="absolute left-0 bottom-0 w-full h-5 bg-gray-400 flex flex-row place-content-end overflow-hidden gap-x-4">
                {/* <div class="h-full w-52 flex flex-row items-center place-content-center gap-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-verde" viewBox="0 -960 960 960">
                        <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>
                    <p class="text-sm text-verde">Envio Completado</p>
                    <p class="text-sm text-verde">23:47:20</p>
                </div>

                <div class="h-full w-52 flex flex-row items-center place-content-center gap-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-rojo" viewBox="0 -960 960 960">
                        <path d="M480-280q17 0 29-11t11-29q0-17-11-28t-29-12q-17 0-28 12t-12 28q0 17 12 29t28 11Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>

                    <p class="text-sm text-rojo">Error Enviando</p>
                    <p class="text-sm text-rojo">23:50:46</p>
                </div> */}

             </div>
        </div>

        <div key="panel_conf" class="w-full h-full bg-gris bg-opacity-65 absolute top-0 left-0 flex items-center place-content-center ocultar">
            <div class="bg-gris w-[450px] h-96 rounded-md p-2">
                <h2 class="text-3xl text-amarillo font-semibold text-center">Configuración Partido</h2>
                <div class="flex flex-row items-center text-lg gap-x-2 mt-5">
                    <p class="text-accent">Puntos de Set</p>
                    <input name="conf-puntos" key="conf-puntos" type="number" min="10" max="21" class=" text-blanco bg-gris-claro px-2 py-1 rounded-md w-20" value="10"/>
                </div>
                <div class="flex flex-row items-center text-lg gap-x-2 mt-5">
                    <p class="text-accent">Diferencia de Puntos Set</p>
                    <input name="conf-dif-puntos" key="conf-dif-puntos" type="number" min="0" max="2" class=" text-blanco bg-gris-claro px-2 py-1 rounded-md w-20" value="0"/>
                </div>
                <hr class="w-[90%] mt-5 mx-auto border-amarillo" />
                <div class="flex flex-row items-center text-lg gap-x-2 mt-5">
                    <p class="text-accent">Puntos ExtraSet</p>
                    <input name="conf-puntos-extra" key="conf-puntos-extra" type="number" min="7" class=" text-blanco bg-gris-claro px-2 py-1 rounded-md w-20" value="7"/>
                </div>
                <div class="flex flex-row items-center text-lg gap-x-2 mt-5">
                    <p class="text-accent">Diferencia de Puntos ExtraSet</p>
                    <input name="conf-dif-puntos-extra" key="conf-dif-puntos-extra" type="number" min="0" max="2" class=" text-blanco bg-gris-claro px-2 py-1 rounded-md w-20" value="0"/>
                </div>

                <div class="w-full flex flex-wrap items-center place-content-center gap-10 my-5">
                    <div key="cerrar_conf" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-cancelar">
                        <p>Cancelar</p>
                    </div>

                    <div key="guardar_conf" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-aceptar">
                        <p>Guardar</p>
                    </div>
                </div>
            </div>            
        </div>

        {/* Informes */}
        <div key="panel_informes" class="w-full h-full bg-gris bg-opacity-65 absolute top-0 left-0 flex items-center place-content-center  ocultar">
            <div class="bg-gris w-[700px] h-96 rounded-md p-2">
                <h2 class="text-3xl text-amarillo font-semibold text-center">Informes</h2>
                <div key="lista_informes" class="w-[90%]  overflow-y-auto no-scrollbar h-40 border-gris-claro border-2 mx-auto">
                    {/* <div class="w-full border-[1px] bg-gris-claro border-blanco h-20 rounded-lg px-2 py-1 ">
                        <p class="text-lg text-accent">Informe Generico</p>
                        <p class="text-base text-blanco puntos">Prueba de informe numero 1 Prueba de informe numero 1 Prueba de informe numero 1 Prueba de informe numero 1 Prueba de informe numero 1Prueba de informe numero 1 Prueba de informe numero 1 Prueba de informe numero 1 Prueba de informe numero 1</p>
                    </div> */}
                </div>

                <div class="w-full flex flex-row items-center place-content-around mt-5 ">
                    <div key="nuevo_informe" class="w-max h-max px-3 py-2 bg-azul-suave rounded-xl text-blanco text-xl text-center font-medium cursor-pointer">
                        Informe Generico
                    </div>
                    <div key="nuevo_informe_suspender" class="w-max h-max px-3 py-2 bg-azul-suave rounded-xl text-blanco text-xl text-center font-medium cursor-pointer">
                        Suspender Partido
                    </div>
                </div>

                <div class="w-full flex flex-wrap items-center place-content-center gap-10 my-5">
                    <div key="cerrar_informes" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-cancelar">
                        <p>Cerrar</p>
                    </div>

                    {/* <div key="guardar_informes" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-aceptar">
                        <p>Guardar</p>
                    </div> */}
                </div>
            </div>  
            <div key="redactar_informe" class="bg-gris w-[700px] h-96 rounded-md p-2 absolute flex flex-col items-center ocultar">
                <input type="text" key="tipo_informe" name="tipo_informe" disabled class="text-3xl text-amarillo font-semibold text-cente bg-transparent text-center mx-auto" value="" />
                <textarea key="contenido_informe" name="contenido_informe"  class="w-[90%] min-h-40 h-auto overflow-y-auto no-scrollbar  border-gris-claro border-2 mx-auto bg-gris-claro text-blanco p-2 rounded-lg"></textarea>

                

                <div class="w-full flex flex-wrap items-center place-content-center gap-10 my-5 ">
                    <div key="cerrar_redactar_informes" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-cancelar">
                        <p>Cancelar</p>
                    </div>

                    <div key="guardar_redactar_informes" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-aceptar">
                        <p>Guardar</p>
                    </div>
                </div>
            </div> 

            <div key="redactar_informe_suspender" class="bg-gris w-[700px] h-96 rounded-md p-2 absolute flex flex-col items-center ocultar">
                <input type="text" key="tipo_informe_suspender" name="tipo_informe_suspender" disabled class="text-3xl text-amarillo font-semibold text-cente bg-transparent text-center mx-auto" value="" />
                <select key="culpable_informe" name="culpable_informe" class="w-40 h-auto bg-gris-claro rounded-full px-3 py-2 my-2 text-blanco">
                    <option selected disabled>Equipo culpable</option>
                    <hr />
                    <option value="Equipo 1">Equipo 1</option>
                    <option value="Equipo 2">Equipo 2</option>
                </select>
                <textarea key="contenido_informe_suspender" name="contenido_informe_suspender"  class="w-[90%] min-h-40 h-auto overflow-y-auto no-scrollbar  border-gris-claro border-2 mx-auto bg-gris-claro text-blanco p-2 rounded-lg"></textarea>

                

                <div class="w-full flex flex-wrap items-center place-content-center gap-10 my-5 ">
                    <div key="cerrar_redactar_informe_suspender" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-cancelar">
                        <p>Cancelar</p>
                    </div>

                    <div key="guardar_redactar_informe_suspender" class="cursor-pointer w-max h-max px-3 py-2 text-lg flex items-center place-content-center rounded-full font-bold text-blanco bg-aceptar">
                        <p>Guardar</p>
                    </div>
                </div>
            </div> 
        </div>

        {/* Modificar Jugada */}
        <div key="modificar_jugada" class="w-full h-full bg-gris bg-opacity-65 absolute top-0 left-0 flex items-center place-content-center ocultar">
            <div key="modificar_cerrar" class="absolute top-0 left-0 h-full w-full -z-0"></div>
            <div class="bg-gris w-max h-auto rounded-md z-10 ">
                <input key="modificar_reference" type="text" disabled value="" />

                <div class="w-96 flex flex-col items-center place-content-around gap-y-1">
                    <div key="btn_modificar_jugada" class="w-full h-16 flex items-center place-content-center bg-azul-suave rounded-xl text-blanco text-xl text-center font-medium cursor-pointer">
                        Modificar Jugada
                    </div>
                    <div key="eliminar_jugada" class="w-full h-16 flex items-center place-content-center bg-azul-suave rounded-xl text-blanco text-xl text-center font-medium cursor-pointer">
                        Eliminar Jugada
                    </div>
                </div>

                
            </div>   
        </div>

        {/*Confirmar Eliminar Jugada */}
        <div key="div_eliminar_jugada"  class="w-full h-full bg-gris bg-opacity-65 absolute top-0 left-0 flex items-center place-content-center ocultar">
            <div class="w-96 h-52 bg-gris rounded-lg">
                <h2 class="text-4xl text-center text-amarillo">¿Estas seguro de eliminar la jugada?</h2>
                <div class="w-full flex flex-wrap items-center place-content-around mt-5">
                    <div key="cancelar_eliminar" class="cursor-pointer text-lg font-semibold rounded-md px-3 py-2 bg-rojo text-blanco">Cancelar</div>
                    <div key="confirmar_eliminar" class="cursor-pointer text-lg font-semibold rounded-md px-3 py-2 bg-verde text-blanco">Confirmar</div>
                </div>
            </div>
            
        </div>

        {/*Confirmar Eliminar Jugada */}
        <div key="div_confirmar_set"  class="w-full h-full bg-gris bg-opacity-65 absolute top-0 left-0 flex items-center place-content-center ocultar">
            <div key="fondo_confirmar_set" class="w-full h-full absolute top-0 z-0 left-0 ">
            </div>
            <div class="w-96 h-40 bg-gris rounded-lg flex flex-col items-center place-content-center gap-y-4 z-10">
                <input key="confirmar_set_value" disabled type="text" class="w-full text-4xl bg-transparent text-center text-amarillo" />
                <div class="w-full flex flex-wrap items-center place-content-around ">
                    
                    <div key="confirmar_set" class="cursor-pointer text-lg font-semibold rounded-md px-3 py-2 bg-verde text-blanco">OK</div>
                </div>
            </div>
            
        </div>

        {/*Resumen Partido */}
        <div key="resumen_partido" class="w-full h-full bg-gris absolute top-0 left-0 border-accent border-2 ocultar">

            <div class="w-full grid grid-cols-2 place-items-center mt-8">
                <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <div class="flex items-center place-content-center">
                        <p class="text-4xl text-accent font-semibold">Nombre Equipo 1</p>
                    </div>
                    <div class="w-max h-max">
                        <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                    </div>

                    <input key="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                </div>

                <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <input key="resultado_final_visitante" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    <div class="w-max h-max">
                        <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                    </div>
                    <div class="flex items-center place-content-center">
                        <p class="text-4xl text-accent font-semibold">Nombre Equipo 1</p>
                    </div>
                    
                </div>
            </div>

            <div class="w-full grid grid-cols-2 place-items-center mt-10">
                <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                        <input key="resultado_set1_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div>
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                        <input key="resultado_set2_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div>
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                        <input key="resultado_set3_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div>
                </div>

                <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                        <input key="resultado_set3_visitante" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div>
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                        <input key="resultado_set2_visitante" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div>
                    <div class="w-max flex flex-col items-center place-content-center gap-y-2">
                        <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                        <input key="resultado_set1_visitante" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="0" />
                    </div> 
                </div>
            </div>

            <div class="w-[90%] h-[2px] bg-accent mx-auto my-10 rounded-full"></div>

            <div class=" my-auto h-72 w-full grid grid-cols-2 place-items-center">
                <div class="w-full h-full flex-col items-center place-content-center space-y-4">
                    <h2 class="text-azul-suave text-3xl font-semibold text-center">Arbitros Designados</h2>
                    <p class="text-blanco font-medium text-xl text-center"><span class="font-bold">Arbitro:</span> Ricardo</p>
                    <p class="text-blanco font-medium text-xl text-center"><span class="font-bold">Oficial 1:</span> Marina</p>
                    <p class="text-blanco font-medium text-xl text-center"><span class="font-bold">Oficial 2:</span> Saray</p>
                </div>
                <div class="w-full h-full flex-col items-center place-content-center space-y-4">
                    <p class="text-sm text-naranja bg-naranja-claro p-2 rounded-lg w-[80%] mx-auto">Una vez finalizado el partido del todo, no se podra realizar ninguna modificacion sin la autorizacion de un staff autorizado (Pere Alemany o Santino Bonavera)</p>
                    <p class="text-3xl text-accent text-center">Finalizar el Partido de Prueba</p>
                    <div class="w-full flex flex-wrap items-center place-content-around">
                        <div key="volver_acta" class="text-xl cursor-pointer font-semibold px-3 py-2 rounded-2xl bg-gris-claro text-blanco">Volver a la Acta</div>
                        <a href="/admin/designaciones" key="final_definitivo" class="text-xl font-semibold px-3 py-2 rounded-2xl bg-rojo-claro text-rojo">Cerrar Partido</a>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>


    

    
    </>
  );
};

export default ActaDigitalApp;