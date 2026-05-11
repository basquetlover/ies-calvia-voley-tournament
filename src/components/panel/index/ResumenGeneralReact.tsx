import React, { useEffect, useState } from 'react';

const ICONS = {
  Equips: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" color="#000" viewBox="0 0 24 24">
      <path className="fill-azul-claro/30" d="M8.25 10.5a3.75 3.75 0 1 1 5.281 3.424c2.674.623 4.719 2.838 4.719 5.575a.75.75 0 0 1-.75.75h-11a.75.75 0 0 1-.75-.75c0-2.737 2.045-4.952 4.719-5.575a3.75 3.75 0 0 1-2.22-3.424"/><path className="fill-azul-claro/50" d="M7.5 3.748a3.75 3.75 0 0 0-1.531 7.174c-2.674.623-4.719 2.838-4.719 5.575 0 .414.336.75.75.75h2.625c.547-1.58 1.653-2.887 3.054-3.766a5.252 5.252 0 0 1 2.949-8.052A3.75 3.75 0 0 0 7.5 3.748M19.375 17.247c-.547-1.58-1.653-2.887-3.054-3.766a5.252 5.252 0 0 0-2.949-8.051 3.75 3.75 0 1 1 4.66 5.493c2.673.622 4.718 2.836 4.718 5.574a.75.75 0 0 1-.75.75z"/>
    </svg>
  ),
  Voluntaris: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 stroke-azul-claro opacity-50" fill="none" color="#000" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 14.5v-6c0-.465 0-.697.051-.888a1.5 1.5 0 0 1 1.06-1.06C3.304 6.5 3.536 6.5 4 6.5s.697 0 .888.051a1.5 1.5 0 0 1 1.06 1.06C6 7.804 6 8.036 6 8.5v6c0 .465 0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06c-.192.052-.424.052-.889.052s-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C2 15.197 2 14.964 2 14.5M6 7.5h1.768a6 6 0 0 1 2.364.485l4.725 2.025A1.89 1.89 0 0 1 16 11.743c0 .694-.563 1.257-1.257 1.257H14.1a5.7 5.7 0 0 1-2.119-.408L10.5 12"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 13h6.575a1.425 1.425 0 0 1 .391 2.795l-5.22 1.492a5.53 5.53 0 0 1-2.947.026L6 15.5"/>
    </svg>
  ),
  Partits: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-50 stroke-azul-claro" fill="none" color="#000" viewBox="0 0 24 24">
      <path strokeLinejoin="round" strokeWidth="1.5" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"/><path strokeLinejoin="round" strokeWidth="1.5" d="M8.12 3c-.445 1.619-.356 5.586 3.568 8.5m0 0c4.942-1.33 8.437-.85 10.312.85m-10.312-.85C12.252 16.188 8.875 19.15 7 20"/><path strokeLinejoin="round" strokeWidth="1.5" d="M9 8c2.087-1.886 7.326-2.872 11.5-.986M16.889 11c.589 2.895-1.175 8.188-4.889 11M10 17c-2.625-1.26-5.842-6.04-6-11"/>
    </svg>
  ),
  Jugadors: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-50 stroke-azul-claro" fill="none" color="#000" viewBox="0 0 24 24">
      <path strokeLinecap="square" strokeWidth="1.5" d="M17 8.5a5 5 0 1 0-10 0 5 5 0 0 0 10 0Z"/><path strokeLinecap="square" strokeWidth="1.5" d="M19 20.5a7 7 0 1 0-14 0"/>
    </svg>
  ),
};

function getArrow(variacion: number, positivo: boolean) {
  if (variacion === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500 fill-500" viewBox="0 -960 960 960">
        <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480z"/>
      </svg>
    );
  }
  return positivo ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 fill-green-500" viewBox="0 -960 960 960">
      <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 -960 960 960">
      <path d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240z"/>
    </svg>
  );
}

export default function ResumenGeneralReact({ torneoID }: { torneoID: string }) {
  const [secciones, setSecciones] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!torneoID) return;

  setLoading(true);

  fetch('/api/panel/ResumenGeneral', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ torneoID })
  })
    .then(res => res.json())
    .then(data => {
      setSecciones(data); // 👈 antes era data.secciones
      setLoading(false);
    })
    .catch(() => setLoading(false));

}, [torneoID]);

  const nombres = ['Equips', 'Voluntaris', 'Partits', 'Jugadors'];

  return (
    <div className="flex flex-wrap gap-4 mt-14 items-center place-content-around">
      {nombres.map(nombre => {
        const seccion = secciones?.find(s => s.nombre === nombre);
        return (
          <div key={nombre} className="bg-gris-claro min-w-52 w-auto max-w-72 h-32 flex flex-col place-content-center rounded-2xl p-4 relative border border-transparent hover:border-azul-claro transition ">
            <h3 className="text-lg text-gray-500 font-semibold">{nombre}</h3>
            <p className="text-6xl font-bold flex flex-row items-end">
              {loading || !seccion ? (
                <span className='text-xl'>Carregant...</span>
              ) : (
                <>
                  {seccion.cantidad}
                  <span className={`flex flex-row ${seccion.variacion > 0 ? 'text-green-500 fill-green-500' : seccion.variacion < 0 ? 'text-red-500 fill-red-500' : 'text-gray-500 fill-500'}`}>
                    {getArrow(seccion.variacion, seccion.positivo)}
                    <span className="ml-1 text-sm">{Math.abs(seccion.variacion)}%</span>
                  </span>
                </>
              )}
            </p>
            <span className="absolute top-3 right-3">
              {ICONS[nombre as keyof typeof ICONS]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
