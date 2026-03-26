import React, { useEffect, useState } from "react";
// Si EquipoBoxIzq/EquipoBoxDer los conviertes a componentes React:
import EquipoBoxIzq from "./EquipoBoxIzq";
import EquipoBoxDer from "./EquipoBoxDer";
import EquipoIzq from "./EquipoIzq";
import EquipoDer from "./EquipoDer";
import './EstilosReact.css';

const traducirPartido = (str) => {
  const match = str.match(/\d+$/);
  return `Partit ${match ? match[0] : ""}`;
};

export default function BracketAutoRefresh() {
const [partidos, setPartidos] = useState([]);
const [loading, setLoading] = useState(true);
const [partidosObj, setPartidosObj] = useState({});



useEffect(() => {
  async function cargarPartidos() {
    setLoading(true);
    try {
    //   const res = await fetch('/api/usuario/CargarBracket');
            const res = await fetch('/api/usuario/CargarBracket',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log("Partidos cargados", data);
      setPartidos(data);
      
        const obj = data.reduce((acc, partido) => {
        acc[partido.bracket] = partido;
        return acc;
        }, {});

    setPartidosObj(obj);
    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      setLoading(false);
    }
  }

  cargarPartidos();
  const intervalo = setInterval(cargarPartidos, 3 * 60 *1000); // cada 3 minutos
    const handleKeyPress = (event) => {
    if (event.key.toLowerCase() === 'r') {
      cargarPartidos();
    }
  };
  window.addEventListener('keydown', handleKeyPress);

  return () => clearInterval(intervalo);
}, []);

  if (loading && !partidos) return <p>Cargando...</p>;

  return (

     <div class="relative grid grid-cols-6 grid-rows-4 transform gap-0 h-[1080px] z-10  w-[1920px]  mx-auto place-items-center ">
{/* <!-- Octavo 1 --> */}
 {partidosObj["octavos_1"] && (
<div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
    
    {/* <!-- Equipo 1 --> */}
    {/* <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavos_1"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_1"]?.estado}</h5>
        <h4 id="pista_p1" class="text-sm">{partidosObj["octavos_1"]?.pista}</h4>
    </div> */}
    <EquipoIzq
        escudo={partidosObj["octavos_1"]?.escudo_local}
        nombre={partidosObj["octavos_1"]?.equipo_local}
        resultado={partidosObj["octavos_1"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["octavos_1"]?.escudo_visitante}
        nombre={partidosObj["octavos_1"]?.equipo_visitante}
        resultado={partidosObj["octavos_1"]?.resultado_visitante}
    />

    
   
    <div class="absolute w-12 h-28 bg-accent top-[55%] right-[-36px]  linea-octavos-down rotate-180">
        &nbsp;
    </div>
</div>
)}

{/* <!-- Octavo 2 --> */}
 {partidosObj["octavo_2"] && (
<div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative col-start-1 row-start-2">
    {/* {/* <!-- Equipo 1 --> */} 
    {/* <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavo_2"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavo_2"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavo_2"]?.estado}</h5>
        <h4 id="pista_p1" class="text-sm">{partidosObj["octavo_2"]?.pista}</h4>
    </div> */}
    <EquipoIzq
        escudo={partidosObj["octavo_2"]?.escudo_local}
        nombre={partidosObj["octavo_2"]?.equipo_local}
        resultado={partidosObj["octavo_2"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["octavo_2"]?.escudo_visitante}
        nombre={partidosObj["octavo_2"]?.equipo_visitante}
        resultado={partidosObj["octavo_2"]?.resultado_visitante}
    />
    

  
    <div class="absolute w-12 h-28 bg-accent top-[45%] right-[-36px] -translate-y-3/4 linea-octavos-up rotate-180 -z-10">
        &nbsp;
    </div>
</div>
)}
{/* <!-- Octavo 3 --> */}
{partidosObj["octavos_3"] && (
<div class="col-start-1 row-start-3"> 
<div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative ">
    <div class="absolute w-12 h-28 bg-accent top-[55%] right-[-36px]  linea-octavos-down rotate-180 -z-10">
        &nbsp;
    </div>
    {/* {/* <!-- Equipo 1 --> */} 
    {/* <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavos_3"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_3"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_3"]?.estado}</h5>
        <h4 class="text-sm">{partidosObj["octavos_3"]?.pista}</h4>
    </div> */}
   <EquipoIzq
        escudo={partidosObj["octavos_3"]?.escudo_local}
        nombre={partidosObj["octavos_3"]?.equipo_local}
        resultado={partidosObj["octavos_3"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["octavos_3"]?.escudo_visitante}
        nombre={partidosObj["octavos_3"]?.equipo_visitante}
        resultado={partidosObj["octavos_3"]?.resultado_visitante}
    />
</div>
</div>
)}
{/* <!-- Octavo 4 --> */}
{partidosObj["octavos_4"] && (
<div class="col-start-1 row-start-4">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative ">
    <div class="absolute w-12 h-28 bg-accent top-[45%] right-[-36px] -translate-y-3/4 linea-octavos-up rotate-180 -z-10">
        &nbsp;
    </div>
        {/* {/* <!-- Equipo 1 --> */} 
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_4"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_4"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_4"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["octavos_4"]?.pista}</h4>
        </div> */}
        <EquipoIzq
        escudo={partidosObj["octavos_4"]?.escudo_local}
        nombre={partidosObj["octavos_4"]?.equipo_local}
        resultado={partidosObj["octavos_4"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["octavos_4"]?.escudo_visitante}
        nombre={partidosObj["octavos_4"]?.equipo_visitante}
        resultado={partidosObj["octavos_4"]?.resultado_visitante}
    />
    </div>
</div>
)}
{partidosObj["octavos_5"] && (
<div class="col-start-6 row-start-1">
     <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_5"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_5"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_5"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_5"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
        <EquipoDer
        escudo={partidosObj["octavos_5"]?.escudo_local}
        nombre={partidosObj["octavos_5"]?.equipo_local}
        resultado={partidosObj["octavos_5"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["octavos_5"]?.escudo_visitante}
        nombre={partidosObj["octavos_5"]?.equipo_visitante}
        resultado={partidosObj["octavos_5"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-28 bg-accent top-[55%] left-[-36px]  linea-octavos-up rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}
{/* <!-- Octavo 6 --> */}
 {partidosObj["octavos_6"] && (
<div class="col-start-6 row-start-2">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_6"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_6"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_6"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_6"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
        <EquipoDer
        escudo={partidosObj["octavos_6"]?.escudo_local}
        nombre={partidosObj["octavos_6"]?.equipo_local}
        resultado={partidosObj["octavos_6"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["octavos_6"]?.escudo_visitante}
        nombre={partidosObj["octavos_6"]?.equipo_visitante}
        resultado={partidosObj["octavos_6"]?.resultado_visitante}
    />
         <div class="absolute w-12 h-28 bg-accent top-[45%] left-[-36px] -translate-y-3/4 linea-octavos-down rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Octavo 7 --> */}
 {partidosObj["octavos_7"] && (
<div class="col-start-6 row-start-3">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_7"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_7"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_7"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_7"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
        <EquipoDer
        escudo={partidosObj["octavos_7"]?.escudo_local}
        nombre={partidosObj["octavos_7"]?.equipo_local}
        resultado={partidosObj["octavos_7"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["octavos_7"]?.escudo_visitante}
        nombre={partidosObj["octavos_7"]?.equipo_visitante}
        resultado={partidosObj["octavos_7"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-28 bg-accent top-[55%] left-[-36px]  linea-octavos-up rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}
{/* <!-- Octavo 8 --> */}
 {partidosObj["octavos_8"] && (
<div class="col-start-6 row-start-4">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_8"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_8"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_8"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_8"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
         <EquipoDer
        escudo={partidosObj["octavos_8"]?.escudo_local}
        nombre={partidosObj["octavos_8"]?.equipo_local}
        resultado={partidosObj["octavos_8"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["octavos_8"]?.escudo_visitante}
        nombre={partidosObj["octavos_8"]?.equipo_visitante}
        resultado={partidosObj["octavos_8"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-28 bg-accent top-[45%] left-[-36px] -translate-y-3/4 linea-octavos-down rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Quartos 1 --> */}
 {partidosObj["quartos_1"] && (
<div class="row-span-2 col-start-2 row-start-1">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative ">
        {/* <!-- Equipo 1 --> */}
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_1"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_1"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["quartos_1"]?.pista}</h4>
        </div> */}
       <EquipoIzq
        escudo={partidosObj["quartos_1"]?.escudo_local}
        nombre={partidosObj["quartos_1"]?.equipo_local}
        resultado={partidosObj["quartos_1"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["quartos_1"]?.escudo_visitante}
        nombre={partidosObj["quartos_1"]?.equipo_visitante}
        resultado={partidosObj["quartos_1"]?.resultado_visitante}
    />
    <div class="absolute w-12 h-52 bg-accent top-[56%] right-[-36px]  linea-cuartos-down rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Quartos 2--> */}
 {partidosObj["quartos_2"] && (
<div class="row-span-2 col-start-2 row-start-3">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative ">
        {/* <!-- Equipo 1 --> */}
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_2"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_2"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_2"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["quartos_2"]?.pista}</h4>
        </div> */}
       <EquipoIzq
        escudo={partidosObj["quartos_2"]?.escudo_local}
        nombre={partidosObj["quartos_2"]?.equipo_local}
        resultado={partidosObj["quartos_2"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["quartos_2"]?.escudo_visitante}
        nombre={partidosObj["quartos_2"]?.equipo_visitante}
        resultado={partidosObj["quartos_2"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-52 bg-accent top-[26%]  right-[-36px] -translate-y-3/4 linea-cuartos-up rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Quartos 3--> */}
 {partidosObj["quartos_3"] && (
<div class="row-span-2 col-start-5 row-start-1">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_3"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_3"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_3"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["quartos_3"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
         <EquipoDer
        escudo={partidosObj["quartos_3"]?.escudo_local}
        nombre={partidosObj["quartos_3"]?.equipo_local}
        resultado={partidosObj["quartos_3"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["quartos_3"]?.escudo_visitante}
        nombre={partidosObj["quartos_3"]?.equipo_visitante}
        resultado={partidosObj["quartos_3"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-52 bg-accent top-[56%] left-[-36px]  linea-cuartos-up rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Quartos 4--> */}
 {partidosObj["quartos_4"] && (
<div class="row-span-2 col-start-5 row-start-3">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_4"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_4"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_4"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["quartos_4"]?.pista}</h4>
        </div> */}
        {/* <!--Ganador P7--> */}
         <EquipoDer
        escudo={partidosObj["quartos_4"]?.escudo_local}
        nombre={partidosObj["quartos_4"]?.equipo_local}
        resultado={partidosObj["quartos_4"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["quartos_4"]?.escudo_visitante}
        nombre={partidosObj["quartos_4"]?.equipo_visitante}
        resultado={partidosObj["quartos_4"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-52 bg-accent top-[26%] left-[-36px] -translate-y-3/4 linea-cuartos-down rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/* <!-- Semi 1--> */}
 {partidosObj["semi_1"] && (
<div class="row-span-2 col-start-3 row-start-2">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative ">
        {/* <!-- Equipo 1 --> */}
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["semi_1"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["semi_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["semi_1"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["semi_1"]?.pista}</h4>
        </div> */}
        <EquipoIzq
        escudo={partidosObj["semi_1"]?.escudo_local}
        nombre={partidosObj["semi_1"]?.equipo_local}
        resultado={partidosObj["semi_1"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["semi_1"]?.escudo_visitante}
        nombre={partidosObj["semi_1"]?.equipo_visitante}
        resultado={partidosObj["semi_1"]?.resultado_visitante}
    />
        <div class="absolute w-12 h-56 bg-accent -top-[65%] scale-105 right-[-35px] -translate-y-1/4 linea-semis  rotate-180 -z-10">
        &nbsp;
    </div>
    </div>
</div>
)}

{/*  <!-- Semi 2--> */} 
 {partidosObj["semi_2"] && (
<div class="row-span-2 col-start-4 row-start-2">
    <div class="w-max flex flex-col gap-2 transform scale-[1.3] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["semi_2"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["semi_2"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["semi_2"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["semi_2"]?.pista}</h4>
        </div> */}
        {/*  <!--Ganador P7--> */} 
         <EquipoDer
        escudo={partidosObj["semi_2"]?.escudo_local}
        nombre={partidosObj["semi_2"]?.equipo_local}
        resultado={partidosObj["semi_2"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoDer
        escudo={partidosObj["semi_2"]?.escudo_visitante}
        nombre={partidosObj["semi_2"]?.equipo_visitante}
        resultado={partidosObj["semi_2"]?.resultado_visitante}
    />
    </div>
</div>
)}

{/* {/* <!-- Final--> */} 
 {partidosObj["final"] && (
<div class="col-span-2 col-start-3 row-start-1">
    <div class="w-max flex flex-col gap-2 transform scale-[1.4] bg-gold rounded-lg p-2">
        {/* <div class="grid grid-cols-3 place-items-center text-gris">
            <h4 class="text-sm">{partidosObj["final"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["final"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["final"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["final"]?.pista}</h4>
        </div> */}
        {/* {/* <!--Ganador octavo_2--> */}
        <div class="flex flex-row gap-2">
             <EquipoIzq
        escudo={partidosObj["final"]?.escudo_local}
        nombre={partidosObj["final"]?.equipo_local}
        resultado={partidosObj["final"]?.resultado_local}
    />

    {/* <!-- Equipo 2 --> */}
    <EquipoIzq
        escudo={partidosObj["final"]?.escudo_visitante}
        nombre={partidosObj["final"]?.equipo_visitante}
        resultado={partidosObj["final"]?.resultado_visitante}
    />
        </div>
    </div>
</div>
)}

{/* {/* <!-- 3/4 puesto--> */} 
 {partidosObj["tercer_quarto"] && (
<div class="col-span-2 col-start-3 row-start-4">
    <div class="w-max flex flex-col gap-2 transform scale-[1.4] bg-gris-claro rounded-lg p-2 relative">
        {/* <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["tercer_quarto"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["tercer_quarto"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["tercer_quarto"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["tercer_quarto"]?.pista}</h4>
        </div> */}
        {/* {/* <!--Ganador octavo_2--> */}
        <div class="flex flex-row gap-2">
            <EquipoBoxIzq>
                <div>
                    {partidosObj["tercer_quarto"]?.escudo_local && partidosObj["tercer_quarto"]?.escudo_local.trim() !== "" ?  (
                        <img src={partidosObj["tercer_quarto"]?.escudo_local} class="w-14 h-14 object-cover rounded-lg" alt={partidosObj["tercer_quarto"]?.equipo_local} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 object-cover rounded-lg" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div>
                <p class="text-blanco text-3xl font-semibold text-center">{partidosObj["tercer_quarto"]?.equipo_local}</p>
                <div>
                    <p class="text-blanco text-5xl font-medium w-8 text-center bg-transparent border-none">{partidosObj["tercer_quarto"]?.resultado_local}</p>
                </div>
            </EquipoBoxIzq>

            {/* {/* <!--Ganador P2--> */} 
            <EquipoBoxDer>
                <div>
                    <div>
                        <p class="text-blanco text-5xl font-medium w-8 text-center bg-transparent border-none">{partidosObj["tercer_quarto"]?.resultado_visitante}</p>
                    </div>
                </div>
                <p class="text-blanco text-3xl font-semibold text-center">{partidosObj["tercer_quarto"]?.equipo_visitante}</p>
                <div>
                    {partidosObj["tercer_quarto"]?.escudo_visitante && partidosObj["tercer_quarto"]?.escudo_visitante.trim() !== "" ?  (
                        <img src={partidosObj["tercer_quarto"]?.escudo_visitante} class="w-14 h-14 object-cover rounded-lg" alt={partidosObj["tercer_quarto"]?.equipo_visitante} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 object-cover rounded-lg" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div> 
            </EquipoBoxDer>
        </div>
    </div>
</div>
)}

<div className="col-span-2 col-start-3 row-start-4  w-full h-full">
    <div className="w-full h-full   flex flex-row items-center justify-around">
              <img src="/favicon.svg" className="w-48 h-48" />
              <div className="w-48 h-48 relative z-0">
                <img src="/img/team-teto.png" className="w-48 h-48 team-teto absolute -top-3 -left-3" />
                <div className="w-[1px] rotate-45 rounded h-52 absolute -top-2 left-1/2 -translate-x-1/2 bg-accent -z-10 "> &nbsp; </div>
                <img src="/img/ies-calvia.png" className="w-48 h-48 ies-calvia absolute -bottom-3 -right-3" />
              </div>
            </div>
</div>
</div>
    // <div>

    // </div>
  );
}
