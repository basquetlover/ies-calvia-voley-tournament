

type Props = {
  escudo?: string;
  nombre: string;
  resultado?: number | string;
};

export default function EquipoBoxIzq({ escudo, nombre, resultado }: Props) {
  // w-[185px] px-1 h-[65px]
  return (
    <div className="w-52 h-20 px-1 bg-azul rounded-lg grid grid-cols-[auto_1fr_max-content] place-items-center">
      
      {/* Escudo */}
      <div className="w-full h-full flex items-center place-content-center">
        {escudo ? (
          <img
            src={escudo}
            alt={`Escudo ${nombre}`}
            className="w-[70px] h-[70px] object-cover rounded-lg"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[70px] h-[70px] object-cover rounded-lg"
            fill="none"
            viewBox="0 0 650 650"
          >
            <circle cx="325" cy="325" r="315" stroke="#fff" strokeWidth="20" />
            <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10" />
          </svg>
        )}
      </div>

      {/* Nombre */}
      <p className="text-blanco text-4xl font-semibold text-center">
        {nombre}
      </p>

      {/* Resultado */}
      <div>
        <p className="text-blanco text-[55px] font-medium w-8 text-center">
          {resultado}
        </p>
      </div>
    </div>
  );
}