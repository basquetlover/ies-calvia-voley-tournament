import { useState, useEffect } from "react";
import { supabase } from "src/lib/supabase";

type Usuario = {
  nombre: string;
  curso: string;
  email: string;
};

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [count, setCount] = useState(10);
  const initialCount = 10;

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("nombre, curso, email")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error al obtener usuarios:", error);
      } else {
        setUsuarios(data || []);
      }
    };

    fetchUsuarios();
  }, []);

  const totalUsuarios = usuarios.length;
  const minimo = Math.max(0, count - 10);
  const usuariosToShow = usuarios.slice(minimo, count);

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <h3 className="text-amarillo text-center text-3xl my-5">Lista Usuarios</h3>
      <div className="w-full h-[500px] rounded-lg p-4 text-blanco text-lg bg-gris-claro overflow-x-scroll flex flex-col items-center">
        <table className="w-full font-normal gap-2">
          <thead>
            <tr className="w-full text-amarillo">
              <th>Nombre</th>
              <th>Curso</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosToShow.map((usuario) => (
              <tr key={usuario.email} className="text-center">
                <td>{usuario.nombre}</td>
                <td>{usuario.curso}</td>
                <td>{usuario.email}</td>
                <td>
                  <a href={`/admin/usuario/${usuario.email}`} className="group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 group-hover:fill-amarillo" fill="none" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="27.5" stroke="#1666FF" strokeWidth="5" />
                      <path fill="#1666FF" d="M20 40h2l14-14-2-2-14 14v2Zm-3 3v-6l19-19h1l1-1 1 1h1l2 2v1a3 3 0 0 1 0 2v1L23 43h-6Zm18-18-1-1 2 2-1-1Z"/>
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full flex justify-around mt-6">
          {count > initialCount && (
            <button
              onClick={() => setCount(count - 10)}
              className="bg-accent px-3 py-3 rounded-full"
            >
              Anterior
            </button>
          )}
          {count < totalUsuarios && (
            <button
              onClick={() => setCount(count + 10)}
              className="bg-accent px-3 py-3 rounded-full"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
