import React, { useEffect, useState } from "react";

const pistas = ["Pista 1", "Pista 2", "Pista Central"];
const bracketsOrden = ["octavos", "cuartos", "semi", "final", "3r i 4t", "perdedores"];
const estados = ["Per Jugar", "En Directe", "Finalitzat"];

// Normaliza brackets
function normalizarBracket(bracket) {
  if (!bracket) return "";
  const base = bracket.split("_")[0].toLowerCase();
  if (base.startsWith("octav")) return "octavos";
  if (base.startsWith("quart")) return "cuartos";
  if (base.startsWith("semi")) return "semi";
  if (base.startsWith("final")) return "final";
  if (base.startsWith("perd")) return "perdedores";
  if (base.includes("3")) return "3r i 4t";
  return base;
}

// Modal genérico
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-4 rounded-xl max-w-6xl w-full relative">
        <button className="absolute top-2 right-2 text-xl font-bold hover:text-gray-300" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

// Card de partido (visual horizontal)
function PartidoCard({ partido, equipos, onClick, calentando }) {

  const estadoStyles = {
    "Per Jugar": "bg-gray-700",
    "En Directe": "bg-red-600 animate-pulse",
    "Finalitzat": "bg-green-700",
  };

  const escudoDefault = "https://voley.iescalvia.com/img/escudos/sin-escudo.png";

  // Buscar equipo en la lista que viene de Supabase
  // const equipoLocal = equipos.find(e => e.nombre_equipo === partido.equipo_local);
  // const equipoVisitante = equipos.find(e => e.nombre_equipo === partido.equipo_visitante);

  const escudoLocal = partido.escudo_local || escudoDefault;
  const escudoVisitante = partido.escudo_visitante || escudoDefault;

  return (
    <div onClick={onClick} className={`cursor-pointer rounded-xl p-4 shadow-md ${estadoStyles[partido.estado]}`}>

      <div className="grid grid-cols-4 text-sm font-semibold border-b border-white/60 pb-2">
        <span>{partido.id_partido}</span>
        <span className="text-center">{partido.estado}</span>
        <span className="text-center first-letter:uppercase">{normalizarBracket(partido.bracket)}</span>
        <span className="text-right">{partido.pista}</span>
      </div>

      {/* LOCAL */}
      <div className="flex justify-between items-center text-lg mt-2">
        <div className="flex items-center gap-2">
          <img
            src={escudoLocal}
            alt={partido.equipo_local}
            className="w-8 h-8 object-contain"
            onError={(e) => e.currentTarget.src = escudoDefault}
          />
          <span className={partido.pista === "Pista 1" ? "text-[#d40000]" : "text-[#00c0eb]"}>{partido.equipo_local}</span>
        </div>

        <span>{partido.LocGlobal ?? "-"}</span>
      </div>

      {/* VISITANTE */}
      <div className="flex justify-between my-2 items-center text-lg">
        <div className="flex items-center gap-2">
          <img
            src={escudoVisitante}
            alt={partido.equipo_visitante}
            className="w-8 h-8 object-contain"
            onError={(e) => e.currentTarget.src = escudoDefault}
          />
          <span className={partido.pista === "Pista 1" ? "text-[#ccff00]" : "text-[#d4d4d4]"}>{partido.equipo_visitante}</span>
        </div>

        <span>{partido.VisGlobal ?? "-"}</span>
      </div>

      <div className="grid grid-cols-3 text-sm font-semibold border-t border-white/60 pt-2">
        <span className="text-center">{partido.arbitro}</span>
        <span className="text-center">{partido.oficial_1}</span>
        <span className="text-center">{partido.oficial_2}</span>
      </div>

      {calentando && (
        <div className="text-yellow-300 text-xs font-semibold">
          Calentando 🔥
        </div>
      )}

    </div>
  );
}

// Bloques para EditPartidoForm
function EquiposResult({ formData, handleChange, equipos }) {
  return (
    <div className="flex gap-4 flex-1 w-full">
      {/* Local */}
      <div className="flex-1 w-1/2">
        <label>Equipo Local</label>
        <select name="equipo_local" value={formData.equipo_local} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          <option value={formData.equipo_local}>{formData.equipo_local}</option>
          {equipos.map(eq => <option key={eq.nombre_equipo} value={eq.nombre_equipo}>{eq.nombre_equipo}</option>)}
        </select>
        <input name="LocGlobal" value={formData.LocGlobal} onChange={handleChange} placeholder="Resultado" className="w-full p-2 mt-1 rounded bg-gray-800 text-white"/>
        <div className="flex gap-1 mt-1">
          <input name="LocSet1" type="text" value={formData.LocSet1} onChange={handleChange} placeholder="S1" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
          <input name="LocSet2" value={formData.LocSet2} onChange={handleChange} placeholder="S2" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
          <input name="LocSet3" value={formData.LocSet3} onChange={handleChange} placeholder="S3" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
        </div>
      </div>
      {/* Visitante */}
      <div className="flex-1 w-1/2">
        <label>Equipo Visitante</label>
        <select name="equipo_visitante" value={formData.equipo_visitante} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          <option value={formData.equipo_visitante}>{formData.equipo_visitante}</option>
          {equipos.map(eq => <option key={eq.nombre_equipo} value={eq.nombre_equipo}>{eq.nombre_equipo}</option>)}
        </select>
        <input name="VisGlobal" value={formData.VisGlobal} onChange={handleChange} placeholder="Resultado" className="w-full p-2 mt-1 rounded bg-gray-800 text-white"/>
        <div className="flex gap-1 mt-1">
          <input name="VisSet1" value={formData.VisSet1} onChange={handleChange} placeholder="S1" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
          <input name="VisSet2" value={formData.VisSet2} onChange={handleChange} placeholder="S2" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
          <input name="VisSet3" value={formData.VisSet3} onChange={handleChange} placeholder="S3" className="flex-1 p-2 rounded w-20 bg-gray-800 text-white"/>
        </div>
      </div>
    </div>
  );
}

function InfoPartido({ formData, handleChange }) {
  return (
    <div className="flex gap-4 mt-2">
      <div className="flex-1">
        <label>Pista</label>
        <select name="pista" value={formData.pista} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          {pistas.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label>Estado</label>
        <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label>Jornada</label>
        <input type="number" name="jornada" value={formData.jornada} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white"/>
      </div>
      <div className="flex-1">
        <label>Bracket</label>
        <select name="bracket" disabled value={formData.bracket} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          {bracketsOrden.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </div>
  );
}

function Arbitros({ formData, handleChange, voluntarios }) {
  return (
    <div className="flex gap-4 mt-2">
      <div className="flex-1">
        <label>Árbitro</label>
        <select name="arbitro" placeholder="Seleccionar árbitro"  value={formData.arbitro} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          <option value="">Seleccionar árbitro</option>
          {voluntarios.map(v => <option key={v.nombre} value={v.nombre}>{v.nombre}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label>Oficial 1</label>
        <select name="oficial_1" placeholder="Seleccionar oficial 1"  value={formData.oficial_1} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          <option value="">Seleccionar oficial 1</option>
          {voluntarios.map(v => <option key={v.nombre} value={v.nombre}>{v.nombre}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label>Oficial 2</label>
        <select name="oficial_2" placeholder="Seleccionar oficial 2"  value={formData.oficial_2} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
          <option value="">Seleccionar oficial 2</option>
          {voluntarios.map(v => <option key={v.nombre} value={v.nombre}>{v.nombre}</option>)}
        </select>
      </div>
    </div>
  );
}

// EditPartidoForm completo
function EditPartidoForm({ partido, onClose, onSave, equipos, voluntarios }) {
  const [formData, setFormData] = useState({ ...partido });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/react/editar-partido", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id_partido: partido.id_partido, datos: formData })
      });
      await res.json();
      onSave();
      onClose();
    } catch(err) { console.error(err); }
    //console.log("Datos a guardar:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <EquiposResult formData={formData} handleChange={handleChange} equipos={equipos}/>
      <InfoPartido formData={formData} handleChange={handleChange}/>
      <Arbitros formData={formData} handleChange={handleChange} voluntarios={voluntarios}/>
      <button type="submit" className="w-full mt-4 p-2 bg-blue-600 rounded hover:bg-blue-700">Guardar Cambios</button>
    </form>
  );
}

// Componente principal
export default function CargarPartidos() {
  const [partidos, setPartidos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [voluntarios, setVoluntarios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [orden, setOrden] = useState("jornada");

  const fetchEquipos = async () => {
    try { 
      const res = await fetch("/api/react/lista-equipos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_partido: "Carga" }) });
      const data = await res.json();
      setEquipos(data.ListaEquipos || []);
    } catch { setEquipos([]); }
  };

  const fetchPartidos = async () => {
    try {
      const res = await fetch("/api/react/lista-partidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_partido: "Carga" }) });
      const data = await res.json();
      setPartidos(data.ListaPartidos || []);
    } catch { setPartidos([]); }
  };

  const fetchVoluntarios = async () => {
    try {
      const res = await fetch("/api/react/lista-voluntarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_partido: "Carga" }) });
      const data = await res.json();
      setVoluntarios(data.Voluntarios || []);
    } catch { setVoluntarios([]); }
  };

  useEffect(() => { fetchEquipos(); fetchPartidos(); fetchVoluntarios(); }, []);

  const abrirModal = (p) => { setPartidoSeleccionado(p); setModalAbierto(true); };
  const cerrarModal = () => { setPartidoSeleccionado(null); setModalAbierto(false); };
  const refrescarLista = () => fetchPartidos();

  const actualizarDatos = async () => {
  await Promise.all([
    fetchPartidos(),
    fetchEquipos(),
    fetchVoluntarios()
  ]);
};

  // Determinar partidos “calentando”
  const partidosCalentando = {};

pistas.forEach(pista => {

  const pendientes = partidos
    .filter(p => p.pista === pista && p.estado === "Per Jugar")
    .sort((a, b) => a.jornada - b.jornada);

  if (pendientes.length > 0) {
    partidosCalentando[pista] = pendientes[0].id_partido;
  }

});

  // Agrupar
  const grupos = {};
  partidos.forEach(p => {
    let clave = orden === "pista" ? p.pista : orden === "bracket" ? normalizarBracket(p.bracket) : `Jornada ${p.jornada}`;
    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(p);
  });

  let clavesOrdenadas = Object.keys(grupos);
  if (orden === "bracket") clavesOrdenadas = bracketsOrden.filter(b => grupos[b]);
  if (orden === "pista") clavesOrdenadas = pistas.filter(p => grupos[p]);
  if (orden === "jornada") clavesOrdenadas.sort((a, b) => parseInt(a.replace("Jornada ", "")) - parseInt(b.replace("Jornada ", "")));

  return (
    <section className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex gap-3 flex-wrap mb-4 items-center">
        <button 
          onClick={() => setOrden("jornada")} 
          className={`px-3 py-1 rounded ${orden === "jornada" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Jornadas
        </button>

        <button 
          onClick={() => setOrden("pista")} 
          className={`px-3 py-1 rounded ${orden === "pista" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Pistas
        </button>

        <button 
          onClick={() => setOrden("bracket")} 
          className={`px-3 py-1 rounded ${orden === "bracket" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Bracket
        </button>

        {/* Botón actualizar */}
        <button
          onClick={actualizarDatos}
          className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 font-semibold"
        >
          Actualizar 
        </button>
      </div>

      {clavesOrdenadas.map(clave => (
        <div key={clave} className="space-y-3">
          <h2 className="text-2xl text-blanco font-bold">{clave}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupos[clave].sort((a, b) => a.jornada - b.jornada).map(p => (
              <PartidoCard
                key={p.id_partido}
                partido={p}
                onClick={() => abrirModal(p)}
                calentando={partidosCalentando[p.pista] === p.id_partido}
              />
            ))}
          </div>
        </div>
      ))}

      <Modal isOpen={modalAbierto} onClose={cerrarModal}>
        {partidoSeleccionado && <EditPartidoForm partido={partidoSeleccionado} onClose={cerrarModal} onSave={refrescarLista} voluntarios={voluntarios} equipos={equipos} />}
      </Modal>
    </section>
  );
}