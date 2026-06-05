// Component que mostra un error quan no es troba cap equip amb el nom i ID indicats

type ErrorEquipoProps = {

  idEquipo?: string | null;
};

export default function ErrorEquipo({  idEquipo }: ErrorEquipoProps) {
  return (
    <div className="w-full h-full flex flex-col items-center place-content-center text-center">
      
      <h1 className="text-4xl font-bold text-blanco">
        Equip no trobat
      </h1>

      <div className="h-1 w-20 mt-4 rounded-full bg-accent">&nbsp;</div>

      <div className="h-96 max-w-xl flex flex-col items-center bg-gris-claro px-10 py-5 rounded-xl border border-gray-400 gap-y-3 mt-10">

        <span className="p-4 bg-red-700 w-max h-max rounded-full flex items-center place-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-red-400" viewBox="0 -960 960 960">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920t141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80zm0-80h480v-400H240zm296.5-143.5Q560-327 560-360t-23.5-56.5T480-440t-56.5 23.5T400-360t23.5 56.5T480-280t56.5-23.5M360-640h240v-80q0-50-35-85t-85-35-85 35-35 85z"/>
          </svg>
        </span>

        <p className="text-2xl font-bold text-blanco">
          No s'ha trobat cap equip
        </p>

        <p className="text-gray-300">
          No existeix cap equip amb aquest nom o ID proporcionat.
        </p>

        <div className="bg-white/5 px-4 py-2 rounded-lg text-sm text-gray-300">
          <p><strong>ID:</strong> {idEquipo ?? "No especificat"}</p>
        </div>

        <a
          href="/panel"
          className="flex items-center place-content-center w-full py-3 bg-azul-suave hover:bg-azul-suave/50 rounded-2xl text-blanco fill-blanco"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 -960 960 960">
              <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142z"/>
            </svg>
          </span>
          Tornar al panell principal
        </a>

        <div className="w-full h-0.5 my-2 bg-gray-600">&nbsp;</div>

        <p className="text-xs text-gray-400">
          Revisa que l'enllaç sigui correcte o que l'equip existeixi
        </p>

      </div>
    </div>
  );
}