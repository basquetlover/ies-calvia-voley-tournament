import { useState, useEffect } from "react";

function PartidoForm({ partido, equipos, pistas, estados, brackets }) {
  const [formData, setFormData] = useState({
    numero: partido.id_partido || "",
    equipo_local: partido.equipo_local || "",
    equipo_local_ref: "",
    equipo_visitante: partido.equipo_visitante || "",
    equipo_visitante_ref: "",
    pista: partido.pista || "",
    estado: partido.estado || "",
    bracket: partido.bracket || "",
    bracket_numero: ""
  });

  // Handler de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar datos
  const handleSubmit = (e) => {
    e.preventDefault();
    // const nuevoPartido = {
    //   numero: `${formData.numero}`,
    //   equipo_local: formData.equipo_local,
    //   equipo_local_ref: formData.equipo_local_ref,
    //   equipo_visitante: formData.equipo_visitante,
    //   equipo_visitante_ref: formData.equipo_visitante_ref,
    //   pista: formData.pista,
    //   estado: formData.estado,
    //   bracket: formData.bracket,
    //   bracket_numero: `_${formData.bracket_numero}`
    // };
    // console.log("Formulario enviado:", nuevoPartido);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-gris-claro mt-3 text-blanco flex place-items-center flex-wrap gap-4 shadow-md rounded-xl p-6 space-y-4"
    >
      {/* Número de partido */}
      <div>
        <label className="block text-sm font-medium mb-1">Número de partido</label>
        <input
          type="text"
          name="numero"
          disabled
          value={formData.numero}
          onChange={handleChange}
          className="w-36 text-black border rounded-md p-2"
        />
      </div>

      {/* Equipo Local */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium mb-1">Equipo Local</label>
        <select
          name="equipo_local"
          value={formData.equipo_local}
          onChange={handleChange}
          className="w-36 border text-black rounded-md p-2 mb-2"
        >
          <option value={partido.equipo_local}>{partido.equipo_local}</option>
          {equipos.map((eq, index) => (
            <option key={index} value={eq.nombre_equipo}>
              {eq.nombre_equipo}
            </option>
          ))}
          <option value="ganador">Guanyador P...</option>
          <option value="perdedor">Perdedor P...</option>
        </select>
        {(formData.equipo_local === "ganador" ||
          formData.equipo_local === "perdedor") && (
          <input
            type="number"
            name="equipo_local_ref"
            value={formData.equipo_local_ref}
            onChange={handleChange}
            className="w-36 border text-black rounded-md p-2"
            placeholder="Número de partido"
          />
        )}
      </div>

      {/* Equipo Visitante */}
      <div>
        <label className="block text-sm font-medium mb-1">Equipo Visitante</label>
        <select
          name="equipo_visitante"
          value={formData.equipo_visitante}
          onChange={handleChange}
          className="w-36 border text-black rounded-md p-2 mb-2"
        >
          <option value={partido.equipo_visitante}>{partido.equipo_visitante}</option>
          {equipos.map((eq, index) => (
            <option key={index} value={eq.nombre_equipo}>
              {eq.nombre_equipo}
            </option>
          ))}
          <option value="ganador">Guanyador P...</option>
          <option value="perdedor">Perdedor P...</option>
        </select>
        {(formData.equipo_visitante === "ganador" ||
          formData.equipo_visitante === "perdedor") && (
          <input
            type="number"
            name="equipo_visitante_ref"
            value={formData.equipo_visitante_ref}
            onChange={handleChange}
            className="w-36 border text-black rounded-md p-2"
            placeholder="Número de partido"
          />
        )}
      </div>

      {/* Pista */}
      <div>
        <label className="block text-sm font-medium mb-1">Pista</label>
        <select
          name="pista"
          value={formData.pista}
          onChange={handleChange}
          className="w-36 border text-black rounded-md p-2"
        >
          <option value={partido.pista}>{partido.pista}</option>
          {pistas.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-36 border text-black rounded-md p-2"
        >
          <option value={partido.estado}>{partido.estado}</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* Bracket */}
      <div>
        <label className="block text-sm font-medium mb-1">Bracket</label>
        <select
          name="bracket"
          value={formData.bracket}
          onChange={handleChange}
          className="w-36 border rounded-md p-2 text-black mb-2"
        >
          <option value={partido.bracket}>{partido.bracket}</option>
          {brackets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {(formData.bracket === "Semifinal" ||
          formData.bracket === "Octavos" ||
          formData.bracket === "Cuartos") && (
          <input
            type="number"
            name="bracket_numero"
            value={formData.bracket_numero}
            onChange={handleChange}
            className="w-36 border rounded-md p-2 text-black"
            min={1}
            max={8}
            placeholder={`Número de ${formData.bracket} (ej: 1, 2, 3...)`}
          />
        )}
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 cursor-not-allowed"
        >
          Actualizar Partido
        </button>
      </div>
    </form>
  );
}

export default function CrearPartidoForm() {
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);

  const fetchEquipos = async () => {
    try {
      const res = await fetch("/api/react/lista-equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_partido: "Carga" }),
      });
      const resultado = await res.json();
      setEquipos(resultado.ListaEquipos || []);
    } catch {
      setEquipos([]);
    }
  };

  const fetchPartidos = async () => {
    try {
      const res = await fetch("/api/react/lista-partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_partido: "Carga" }),
      });
      const resultado = await res.json();
      setPartidos(resultado.ListaPartidos || []);
    } catch {
      setPartidos([]);
    }
  };

  useEffect(() => {
    fetchEquipos();
    fetchPartidos();
  }, []);

  const pistas = ["Pista 1", "Pista 2", "Pista Central"];
  const estados = ["Per Jugar", "En Directe", "Finalizat"];
  const brackets = ["Octavos", "Cuartos", "Semifinal", "Final", "3r i 4t", "Perdedors"];

  return (
    <>
      {partidos.length > 0 ? (
        partidos.map((p, i) => (
          <PartidoForm
            key={i}
            partido={p}
            equipos={equipos}
            pistas={pistas}
            estados={estados}
            brackets={brackets}
          />
        ))
      ) : (
        <p>Cargando partidos...</p>
      )}
    </>
  );
}
