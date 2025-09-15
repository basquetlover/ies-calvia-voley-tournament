import { useState } from "react";

export default function CrearPartidoForm() {
  const [formData, setFormData] = useState({
    numero: "",
    equipo_local: "",
    equipo_local_ref: "",
    equipo_visitante: "",
    equipo_visitante_ref: "",
    pista: "",
    estado: "",
    bracket: "",
    bracket_numero: ""
  });

  // Lista de opciones
  const equipos = [
    { id: 1, nombre: "Las Barbies" },
    { id: 2, nombre: "Team Teto" },
    { id: 3, nombre: "Los Pumas" },
    { id: 4, nombre: "Volley Stars" }
  ];

  const pistas = ["Pista 1", "Pista 2"];
  const estados = ["Por Jugar", "En Directo", "Finalizado"];
  const brackets = ["Octavos", "Cuartos", "Semifinal", "Final"];

  // Handler de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar datos
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);

    // Aquí iría tu llamada a Supabase o API:
    // await supabase.from("Partidos").insert([formData])
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      {/* Número de partido */}
      <div>
        <label className="block text-sm font-medium mb-1">Número de partido</label>
        <input
          type="number"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          placeholder="Ej: 5"
          required
        />
      </div>

      {/* Equipo Local */}
      <div>
        <label className="block text-sm font-medium mb-1">Equipo Local</label>
        <select
          name="equipo_local"
          value={formData.equipo_local}
          onChange={handleChange}
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Seleccionar equipo</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nombre}
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
            className="w-full border rounded-md p-2"
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
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Seleccionar equipo</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nombre}
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
            className="w-full border rounded-md p-2"
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
          className="w-full border rounded-md p-2"
        >
          <option value="">Seleccionar pista</option>
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
          className="w-full border rounded-md p-2"
        >
          <option value="">Seleccionar estado</option>
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
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Seleccionar fase</option>
          {brackets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {formData.bracket && (
          <input
            type="number"
            name="bracket_numero"
            value={formData.bracket_numero}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder={`Número de ${formData.bracket} (ej: 1, 2, 3...)`}
          />
        )}
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear Partido
        </button>
      </div>
    </form>
  );
}
