import { useEffect, useState } from "react";

export default function MiniMarcador() {
    const [partidos, setPartidos] = useState([]);
    const [numPartidos, setNumPartidos] = useState(0);
    useEffect(() => {
    async function cargarPartidos() {
        //setLoading(true);
        try {
        //   const res = await fetch('/api/usuario/CargarBracket');
                const res = await fetch('/api/usuario/CargarMarcador',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }
        });
    
        const data = await res.json();
        //console.log("Partidos en directo", data);
        let numeroPartidos = data.length;
        console.log("Número de partidos en directo:", numeroPartidos);
        //numeroPartidos = 1
        // ⚠️ Si la API devuelve sin partidos
            if (!data || data.length === 0) {
                // ⚡ Lanzamos evento global
                window.dispatchEvent(new Event("sinPartidos"));
                return;
                }
        setNumPartidos(numeroPartidos);
        setPartidos(data);
    
        
    
        } catch (err) {
        console.error("Error cargando partidos:", err);
        } finally {
        //setLoading(false);
        }
    }
    
    cargarPartidos();
    const intervalo = setInterval(cargarPartidos, 3*1000); // cada 3 segundos
    return () => clearInterval(intervalo);
    }, []);
return(
    <div className="h-28 w-full flex items-center justify-center">
        {
            numPartidos === 2 ? (
                <>
                <div className="w-full grid grid-cols-2 grid-rows-1 place-items-center gap-12">

                
                <div>
        {
            partidos.filter(p => p.pista !== "Pista 2").map((partido, index) => (
                <div className={`flex flex-row items-center justify-center gap-8 ${partido.pista === "Pista 1" ? "col-start-1" : "col-start-2"}`} key={index}>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_local} className="w-16 h-16" />
                        </div>
                        <div>
                            <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center text-3xl font-semibold text-accent`}>
                                {partido.equipo_local}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p className="text-5xl text-blanco font-bold">
                                {partido.marcador.global.local}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <p id="resultado_final_local" className={`w-10 h-auto text-center text-6xl font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.local}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.local}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.local}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                            <span className=" w-10 h-10  bg-gris">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                    <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                </g>
                                </svg>
                            </span>
                        </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-max h-max">
                            <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-6xl  font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.visitante}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.visitante}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.visitante}
                                </span>
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-5xl font-bold bg-transparent text-blanco">
                                {partido.marcador.global.visitante}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center text-3xl bg-transparent text-accent font-semibold`}>
                                {partido.equipo_visitante}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_visitante} className="w-16 h-16" />
                        </div>
                    </div>
                </div>
            ))
        }
                </div>

                <div>
                    {
                    partidos.filter(p => p.pista !== "Pista 1").map((partido, index) => (
                        <div className={`flex flex-row items-center justify-center gap-8 ${partido.pista === "Pista 1" ? "col-start-1" : "col-start-2"}`} key={index}>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-max h-max">
                                    <img src={partido.escudo_equipo_local} className="w-16 h-16" />
                                </div>
                                <div>
                                    <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center text-3xl font-semibold bg-transparent text-accent`}>
                                        {partido.equipo_local}
                                    </p>
                                </div>
                                <div className="w-max h-max">
                                    <p className="text-5xl text-blanco font-bold">
                                        {partido.marcador.global.local}
                                    </p>
                                </div>
                                <div className="w-max h-max">
                                    <p id="resultado_final_local" className={`w-10 h-auto text-center text-6xl font-semibold bg-transparent text-blanco `}>
                                        <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                            {partido.marcador.set1.local}
                                        </span>
                                        <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                            {partido.marcador.set2.local}
                                        </span>
                                        <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                            {partido.marcador.set3.local}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                    <span className=" w-10 h-10 -top-4 left-36 bg-gris">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                            <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                            <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                        </g>
                                        </svg>
                                    </span>
                                </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-max h-max">
                                    <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-6xl  font-semibold bg-transparent text-blanco `}>
                                        <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                            {partido.marcador.set1.visitante}
                                        </span>
                                        <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                            {partido.marcador.set2.visitante}
                                        </span>
                                        <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                            {partido.marcador.set3.visitante}
                                        </span>
                                    </p>
                                </div>
                                <div className="w-max h-max">
                                    <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-5xl font-bold bg-transparent text-blanco">
                                        {partido.marcador.global.visitante}
                                    </p>
                                </div>
                                <div className="w-max h-max">
                                    <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center text-3xl bg-transparent text-accent font-semibold`}>
                                        {partido.equipo_visitante}
                                    </p>
                                </div>
                                <div className="w-max h-max">
                                    <img src={partido.escudo_equipo_visitante} className="w-16 h-16" />
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
                </div>
                </>
            ):(
                <>
                <div>
        {
            partidos.map((partido, index) => (
                <div className={`flex flex-row items-center justify-center gap-8  mx-auto`} key={index}>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_local} className="w-16 h-16" />
                        </div>
                        <div>
                            <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center font-semibold text-3xl bg-transparent text-accent`}>
                                {partido.equipo_local}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p className="text-5xl text-blanco font-bold">
                                {partido.marcador.global.local}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <p id="resultado_final_local" className={`w-10 h-auto text-center text-6xl font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.local}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.local}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.local}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                            <span className=" w-10 h-10  bg-gris">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                    <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                </g>
                                </svg>
                            </span>
                        </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-max h-max">
                            <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-6xl  font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.visitante}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.visitante}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.visitante}
                                </span>
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-5xl font-bold bg-transparent text-blanco">
                                {partido.marcador.global.visitante}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-auto h-auto text-center text-3xl bg-transparent text-accent font-semibold`}>
                                {partido.equipo_visitante}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_visitante} className="w-16 h-16" />
                        </div>
                    </div>
                </div>
            ))
        }
        </div>
                </>
            )
        }
       
    </div>
)
}