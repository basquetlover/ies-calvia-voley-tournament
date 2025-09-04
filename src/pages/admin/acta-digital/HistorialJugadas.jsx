import { useEffect, useRef, useState } from "react";
import './ActaApp.css';

export default async function GuardarJugada(jugada, id_partido, nuevoLocSet1, nuevoLocSet2, nuevoLocSet3, nuevoVisSet1, nuevoVisSet2, nuevoVisSet3) {
    console.log(jugada)
    // Recuperar historial actual
    let localStorageGuardado = false;
  const historialGuardado =
    JSON.parse(localStorage.getItem(`historial_${id_partido}`)) || [];

  // Añadir la jugada directamente
  const nuevoHistorial = [...historialGuardado, jugada];

  // Guardar en localStorage con el mismo nombre de clave
  //localStorage.setItem(`historial_${id_partido}`, JSON.stringify(nuevoHistorial));
    let resultado;
  try {
    localStorage.setItem(`historial_${id_partido}`, JSON.stringify(nuevoHistorial));
    localStorageGuardado = true; // Si llega aquí, se guardó en localStorage
  } catch (err) {
    console.error('No se pudo guardar en localStorage:', err);
    localStorageGuardado = false;
  }
    // Enviar la jugada a la API para que se guarde en Supabase
  try {
    const response = await fetch('/api/acta-digital/guardarJugada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jugada, id_partido, nuevoLocSet1, nuevoLocSet2, nuevoLocSet3, nuevoVisSet1, nuevoVisSet2, nuevoVisSet3 })
    });

    if (!response.ok) {
      throw new Error('Error al guardar la jugada en la DB');
    }

    const data = await response.json();
    console.log('Jugada guardada en DB:', data);
    resultado = {  success: true, mensaje: "Jugada guardada en db", tipo: "Completo" };
  } catch (error) {
    console.error('No se pudo guardar la jugada:', error);
    if (localStorageGuardado) {
      resultado = {
        
        success: false,
        mensaje: "Jugada guardada solo en localStorage",
        tipo: "Warning"
      };
    } else {
      resultado = {
       
        success: false,
        mensaje: error.message || "Error al guardar la jugada",
        tipo: "Error"
      };
    }
  
    resultado = { success: false, mensaje: error.message, tipo: "Error" };
  }

        try {
        const historialActualizado = JSON.parse(localStorage.getItem(`historial_${id_partido}`) || "[]");

        if (historialActualizado.length > 0) {
            // Solo actualizar el estado del último elemento
            historialActualizado[historialActualizado.length - 1].estado = resultado.tipo;
            
            localStorage.setItem(
            `historial_${id_partido}`,
            JSON.stringify(historialActualizado)
            );
        }
        } catch (err) {
        console.error('No se pudo actualizar el historial en localStorage:', err);
        }

  return resultado;

}


