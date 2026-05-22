import { useEffect, useState } from "react";

interface Admins {
email_microsoft: string;
id: number;
nombre_real: string;
apellidos: string;
rango: string;
permisos_panel: any;
}

type TipoAccion = "crear" | "editar";

const roles = ["Voluntari", "Staff", "Admin", "Co-Owner", "Owner"];

const selectStyles: Record<string, string> = {
Owner: "border-red-500 bg-red-500/40",
"Co-Owner": "border-purple-500 bg-purple-500/40",
Admin: "border-blue-500 bg-blue-500/40",
Staff: "border-green-500 bg-green-500/40",
Voluntari: "border-gray-400 bg-gray-400/40",
};

export default function CrearAdmin() {
const [usuarios, setUsuarios] = useState<Admins[]>([]);
const [admins, setAdmins] = useState<Admins[]>([]);
const [busqueda, setBusqueda] = useState("");

const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Admins | null>(null);
const [tipoAccion, setTipoAccion] = useState<TipoAccion>("crear");

const [nuevoRango, setNuevoRango] = useState<string>("Voluntari");
const [open, setOpen] = useState(false);

const [inputActivo, setInputActivo] = useState(false);

// USUARIOS
useEffect(() => {
    fetch("/api/panel/ListaUsuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.json())
    .then(setUsuarios)
    .catch(() => console.log("Error usuarios"));
}, []);

// ADMINS
useEffect(() => {
    fetch("/api/panel/ListaAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.json())
    .then(setAdmins)
    .catch(() => console.log("Error admins"));
}, []);

// FILTRO BUSQUEDA
const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();

    return (
    u.email_microsoft?.toLowerCase().includes(texto) ||
    u.nombre_real?.toLowerCase().includes(texto) ||
    u.apellidos?.toLowerCase().includes(texto)
    );
});

// CHECK ADMIN POR RANGO
const esAdmin = (user: Admins) => {
    return admins.some((a) => a.id === user.id);
};

return (
    <div className="w-full h-full">
    <div className="w-full h-full min-h-0 grid grid-rows-[auto_1fr] rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="border-b border-gris-claro p-4 bg-gris-claro flex flex-col gap-4">

        <h2 className="font-bold text-xl">
            Afegir nou administrador
        </h2>

        {/* INPUT */}
        <div className="w-full rounded-2xl px-2 h-10 bg-gray-600 border border-gray-500 flex items-center gap-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 -960 960 960">
                <path d="M440-480q-66 0-113-47t-47-113 47-113 113-47 113 47 47 113-47 113-113 47m0-80q33 0 56.5-23.5T520-640t-23.5-56.5T440-720t-56.5 23.5T360-640t23.5 56.5T440-560M884-20 756-148q-21 12-45 20t-51 8q-75 0-127.5-52.5T480-300t52.5-127.5T660-480t127.5 52.5T840-300q0 27-8 51t-20 45L940-76zM731-229q29-29 29-71t-29-71-71-29-71 29-29 71 29 71 71 29 71-29m-611 69v-111q0-34 17-63t47-44q51-26 115-44t142-18q-12 18-20.5 38.5T407-359q-60 5-107 20.5T221-306q-10 5-15.5 14.5T200-271v31h207q5 22 13.5 42t20.5 38zm287-80"/>
            </svg>
            <input
            type="text"
            className="w-full mx-2 rounded-xl h-8 px-2 text-white bg-transparent"
            onChange={(e) => setBusqueda(e.target.value)}
            onFocus={() => setInputActivo(true)}
            onBlur={() => setTimeout(() => setInputActivo(false), 150)}
            placeholder="Cercar per nom, cognoms o correu..."
            />
        </div>

        {/* LISTA RESULTADOS */}
        {inputActivo && busqueda.length > 0 && (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">

            {usuariosFiltrados.map((user) => {
                const bloqueado = esAdmin(user);

                return (
                <div
                    key={user.id}
                    onClick={() => {
                    if (bloqueado) return;
                    setUsuarioSeleccionado(user);
                    setTipoAccion("editar");
                    setInputActivo(false);
                    setBusqueda(user.nombre_real);
                    }}
                    className={`
                    p-3 rounded-xl border transition
                    flex flex-col gap-1
                    ${
                        bloqueado
                        ? "opacity-40 cursor-not-allowed bg-gray-700"
                        : "cursor-pointer hover:bg-white/10 bg-gray-800"
                    }
                    ${
                        usuarioSeleccionado?.id === user.id
                        ? "border-primary"
                        : "border-gray-600"
                    }
                    `}
                >
                    <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                        {user.nombre_real} {user.apellidos}
                    </p>

                    {bloqueado && (
                        <span className="text-xs px-2 py-1 rounded bg-red-500/30 text-red-200">
                        {user.rango}
                        </span>
                    )}
                    </div>

                    <p className="text-xs text-gray-300">
                    {user.email_microsoft}
                    </p>
                </div>
                );
            })}
            </div>
        )}

        {/* USER + ROL */}
        <div className="w-full grid grid-cols-[1fr_auto] gap-x-4">

            <div>
            {usuarioSeleccionado ? (
                <div className="p-4 rounded-xl flex flex-col">
                <p className="text-white font-bold">
                    Usuario seleccionado:
                </p>

                <p className="text-gray-300">
                    {usuarioSeleccionado.nombre_real} {usuarioSeleccionado.apellidos}
                </p>

                <p className="text-xs text-gray-400">
                    {usuarioSeleccionado.email_microsoft}
                </p>
                </div>
            ) : (
                <p className="text-gray-400">
                Selecciona un usuario para continuar
                </p>
            )}
            </div>

            {/* SELECT ROL */}
            <div className="relative w-48 mt-2 flex flex-col">

            <p className="text-sm mb-1 text-gray-200">
                Rol d'usuari
            </p>

            <div
                onClick={() => setOpen(!open)}
                className={`
                h-12 px-3 rounded-xl flex items-center justify-between
                cursor-pointer border transition text-white
                ${selectStyles[nuevoRango]}
                `}
            >
                <span>{nuevoRango}</span>

                <svg
                className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="white"
                >
                <path d="M480-360 280-560h400L480-360Z" />
                </svg>
            </div>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl overflow-hidden border border-gray-600 bg-gray-800 shadow-xl z-50">
                {roles.map((role) => (
                    <div
                    key={role}
                    onClick={() => {
                        setNuevoRango(role);
                        setOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-white/10"
                    >
                    {role}
                    </div>
                ))}
                </div>
            )}
            </div>

        </div>

        </div>

        {/* BODY */}
        <div className="min-h-0 overflow-y-auto p-4 flex bg-gris-claro/60 flex-col gap-4" />

    </div>
    </div>
);
}