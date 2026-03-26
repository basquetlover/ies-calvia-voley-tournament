import React, { useEffect, useState, useRef } from "react";
import './EstilosReact.css';

export default function BracketAutoRefresh({equipos, sentido}) {
    const containerRef = useRef(null);
    
    // Duplicamos 3 veces para evitar el "salto" en pantallas grandes
    const equiposInfinitos = [...equipos, ...equipos, ...equipos];

    return (
        <div className="w-full mx-auto h-auto shadow-izq shadow-der overflow-hidden">
            <div 
                ref={containerRef}
                className={`infinite-scroll-container flex flex-nowrap py-5 items-center ${
                    sentido === 'derecha' ? 'scroll-right' : 'scroll-left'
                }`}
                style={{ 
                    '--gap-size': '8rem',  // 28 * 0.25rem = 7rem (tu gap-x-28)
                    '--item-width': '165px'
                }}
            >
                {equiposInfinitos.map((equipo, index) => (
                    <div 
                        key={`${equipo.id_equipo}-${index}`} 
                        className="scroll-item flex items-center justify-center"
                    >
                        <img 
                            src={equipo.escudo} 
                            alt={equipo.nombre} 
                            className="w-[165px] h-auto aspect-square rounded object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
// import { useEffect, useRef } from "react";

// export default function BracketAutoRefresh({ equipos }) {
// const itemsRef = useRef([]);
// const positions = useRef([]);

// const speed = 1;

// useEffect(() => {
//   const screenWidth = window.innerWidth;
//   let x = screenWidth; // 🔥 empieza fuera de pantalla derecha
//   const speed = 1;

//   let animation;

//   const animate = () => {
//     x -= speed;

//     for (let i = 0; i < equipos.length; i++) {
//       const el = itemsRef.current[i];
//       if (!el) continue;

//       el.style.transform = `translateX(${x + i * 150}px)`;
//     }

//     // reciclaje
//     const max = Math.max(...positions.current);
//     for (let i = 0; i < equipos.length; i++) {
//       if (x + i * 150 < -200) {
//         x = max;
//       }
//     }

//     animation = requestAnimationFrame(animate);
//   };

//   animation = requestAnimationFrame(animate);
//   return () => cancelAnimationFrame(animation);
// }, []);

// return (
//     <div className="relative overflow-hidden my-5 flex flex-row gap-x-16 w-full h-[150px]">
//     {equipos.map((e, i) => (
//         <img
//         key={e.id_equipo}
//         ref={(el) => (itemsRef.current[i] = el)}
//         src={e.escudo}
//         className="absolute w-[125px] h-auto  aspect-square rounded object-cover"
//         // style={{ left: 0, top: "20px" }}
//         />
//     ))}
//     </div>
// );
// }