---
import { supabaseAdmin } from "../../../lib/supabase";
import LayoutOwner from '@layouts/LayoutOwner.astro';
import { CURSOS } from "@const/rangos";
import LayoutStaff from "@layouts/LayoutStaff.astro";
// Tipo explícito para las propiedades esperadas en `Astro.props`

// Tipo explícito para las propiedades esperadas en `Astro.props`
type AdministradorProps = {
    id_equipo: string;
    nombre_equipo: string;
};

// Genera rutas dinámicas
export async function getStaticPaths() {
  // Consulta a la base de datos para obtener user_email y rango
  const { data, error } = await supabaseAdmin
    .from('Equipos')
    .select('id_equipo, nombre_equipo');

  if (error) {
    console.error('Error fetching administradores:', error.message);
    return { paths: [] };
  }

  // Genera las rutas dinámicas con datos adicionales
  const paths = data.map((equipo) => ({
    params: { id_equipo: equipo.id_equipo },
    props: { nombre_equipo: equipo.nombre_equipo }, // Pasamos rango como parte de los props
  }));

  return { paths };
}
const id_equipo = Astro.url.pathname.split('/').pop();

let nombre_equipo = 'Sin Nombre';
let escudo = "";
let capitan = "";
let estado = "";
let aceptado = "";
let fecha_inscripcion = "";

let id = "";
let inscrito = "";

let creador_nombre = "";
let creador_email = "";
let creador_curso ="";
interface Jugador {
  nombre: string;
  _1r_apellido: string;
  curso: string;
  _2n_apellido: string;
  genero: string;
  email: string;
  img: string;
  
};
interface Staff {
  nombre: string;
  _1r_apellido: string;
  curso: string;
  _2n_apellido: string;
  genero: string;
  email: string;
  img: string;
  
};
let entrenador_nombre = "";
let entrenador_1r_apellido = "";
let entrenador_2n_apellido = "";
let entrenador_curso = "";
let entrenador_genero = "";
let entrenador_email = "";

let jugadores: Jugador[] = [];

let Staff: Staff[] = [];
// let entrenador: Jugador[] = [];


try {
  // Buscar el rango correspondiente al email en la tabla Administradores
  const { data: equipoData, error } = await supabaseAdmin
    .from('EquiposSS')
    .select('nombre_equipo, id, capitan, escudo, inscrito, estado, aceptado, fecha_inscripcion')
    .eq('id_equipo', id_equipo)
    .single();

  if (error) {
    console.error(`Error al buscar nombre_equipo para ${id_equipo}:`, error.message);
  } else if (equipoData) {
    nombre_equipo = equipoData.nombre_equipo;
    escudo = equipoData.escudo;
    capitan = equipoData.capitan;
    id = equipoData.id;
    inscrito = equipoData.inscrito;
    estado = equipoData.estado;
    aceptado = equipoData.aceptado;
    fecha_inscripcion = equipoData.fecha_inscripcion;
  }

  const { data: UsuarioInscripcion } = await supabaseAdmin
    .from('Usuarios')
    .select('nombre, email, curso')
    .eq('id', inscrito)
    .single();
    if(UsuarioInscripcion){
        creador_nombre = UsuarioInscripcion.nombre;
        creador_email = UsuarioInscripcion.email;
        creador_curso = UsuarioInscripcion.curso
    }

  const {data: jugadoresData, error: jugadorError} = await supabaseAdmin
    .from('JugadoresSS')
    .select('nombre, curso, _1r_apellido, _2n_apellido, genero, email, img')
    .eq('pertenece_equipo', id)
    .eq('ficha', 'jugador')
    .order('id', { ascending: true });

  if(jugadorError){
    console.error(`Error al buscar jugadores`, error?.message);
  } else if(jugadoresData){
    jugadores = jugadoresData;
 
  }

  const {data: StaffData, error: StaffError} = await supabaseAdmin
    .from('JugadoresSS')
    .select('nombre, curso, _1r_apellido, _2n_apellido, genero, email, img')
    .eq('pertenece_equipo', id)
    .eq('ficha', 'cuerpo_tecnico')
    .order('id', { ascending: true });

  if(StaffError){
    console.error(`Error al buscar jugadores`, error?.message);
  } else if(StaffData){
    Staff = StaffData;
  }

  const {data: EntrenadorData, error: EntrenadorError} = await supabaseAdmin
    .from('JugadoresSS')
    .select('nombre, curso, _1r_apellido, _2n_apellido, genero, email')
    .eq('pertenece_equipo', id)
    .eq('ficha', 'entrenador')
    .limit(1);

    if (EntrenadorError) {
    console.error(`Error al buscar entrenador`, EntrenadorError?.message); // Cambiado a EntrenadorError
} else if (EntrenadorData && EntrenadorData.length > 0) { // Verifica que haya datos
    const entrenadorData = EntrenadorData[0]; // Toma el primer entrenador
    entrenador_nombre = entrenadorData.nombre;
    entrenador_1r_apellido = entrenadorData._1r_apellido;
    entrenador_2n_apellido = entrenadorData._2n_apellido;
    entrenador_curso = entrenadorData.curso;
    entrenador_genero = entrenadorData.genero;
    entrenador_email = entrenadorData.email;
    console.log(entrenador_nombre, entrenador_1r_apellido, entrenador_2n_apellido, entrenador_curso, entrenador_email, entrenador_genero);
} else {
    console.log("No se encontró ningún entrenador.");
}
  
  

} catch (err) {
  console.error('Error al obtener rango:', err);
}

---
<!-- <script>
    const file = document.getElementById('foto') as HTMLInputElement;
    const img = document.getElementById('img') as HTMLImageElement;
    const defaultFile = 'Vector.png'; // Asegúrate de definir defaultFile
    
    file.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = function(e: ProgressEvent<FileReader>) {
          if (e.target && img) {
            img.src = e.target.result as string;
          }
        };
        reader.readAsDataURL(files[0]);
      } else {
        if (img) {
          img.src = defaultFile;
        }
      }
    });
    </script> -->
<script>

</script>
<LayoutStaff title=`Equip ${nombre_equipo}`>
    <div class="max-w-4xl mx-auto my-10">
      <div class="flex flex-wrap items-center place-content-around gap-2">
        <p class={`w-max h-max px-2 py-1 rounded-xl ${estado ===  "Revisant" ? "bg-naranja-claro text-naranja text-base uppercase font-semibold" : ""} ${estado ===  "Acceptat" ? "bg-verde-claro text-verde text-base uppercase font-semibold" : ""} ${estado ===  "Denegat" ? "bg-rojo-claro text-rojo text-base uppercase font-semibold" : ""}`}>{estado}</p>
        <p class={`w-max h-max px-2 py-1 rounded-xl ${aceptado ===  "Llista d'espera" ? "bg-rojo-claro text-rojo text-base uppercase font-semibold" : ""} ${aceptado ===  "Inscript" ? "bg-verde-claro text-verde text-base uppercase font-semibold" : ""} `}>{aceptado}</p>
        <p class="text-blanco bg-gris-claro px-3 py-2 rounded-lg">Data inscripció: {fecha_inscripcion}</p>
      </div>

      <div>
        <div class="bg-accent w-full h-[2px] rounded-full my-5"></div>
      <div class="flex flex-wrap items-center place-content-around gap-2">
        <p class={`w-max h-max px-2 py-1 rounded-xl`} id="new-estado">Revisant</p>
        <p class={`w-max h-max px-2 py-1 rounded-xl `}></p>
        <p class="text-blanco bg-gris-claro px-3 py-2 rounded-lg">Data Revisió: {fecha_inscripcion}</p>
      </div>
    </div>

        <section class="space-y-4" >
            <div>
                <h2 class="text-amarillo text-2xl">Equip Inscrit Per:</h2>
                <div class="flex flex-wrap items-center place-content-around gap-2 text-lg text-blanco">
                    <p>{creador_nombre}</p>
                    <p>{creador_email}</p>
                    <p>{creador_curso}</p>
                </div>
            </div>
          <div class="mx-auto w-max relative mt-4">
            
            <h3 class="mx-auto text-4xl xs:text-3xl sm:text-3xl md:text-4xl text-center border-none bg-transparent rounded text-accent py-2 px-3 w-auto">{nombre_equipo}</h3>
            
            
          </div>
      
          <!--Imagen Escudo -->
          <div class="w-60 h-60 p-4  rounded-xl  relative mx-auto">
            {escudo ?(
                <img src={escudo} class="w-full h-full" alt={`Logo ${nombre_equipo}`} />
                ):(
                    <img src="/img/escudos/sin-escudo.png" alt="Equipo sin escudo" />
                )}
            
            
          </div>

          <!--Capitan -->
          <div class="flex flex-row items-center ml-2">
            <label for="capitan" class="block text-amarillo text-2xl font-medium">Capità</label>
            <p class="border-none ml-2 text-lg text-blanco bg-transparent rounded py-2 px-3 w-auto">{capitan}</p>
             
          </div>
        
          <!--Entrenador -->
          
          <div class="w-max flex flex-row gap-2">
            <div class="px-3 py-2 w-96 h-12 flex flex-row text-4xl text-amarillo border-none">
              <h4>Entrenador</h4>
             {/* Genero */}
             <div class="flex flex-col relative">
              <label class="genero relative">
                  <label for="nombre" class="absolute -top-5 -right-5 flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
              </label>
                  
                  <span id={`hombre_entrenador`} class={`desactivado ${entrenador_genero === "hombre" ? 'hombre' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                          <path d="M800-800v240h -80v-103L561-505q19 28 29 60t10 65q0 92-64 156t-156 64q-92 0-156-64t-64-156q0-92 64-156t156-64q33 0 65 10t59 29l159-159H560v-80h240ZM380-520q-58 0-99 41t-41 99q0 58 41 99t99 41q58 0 99-41t41-99q0-58-41-99t-99-41Z"/>
                      </svg>
                  </span>
                  <span id={`mujer_entrenador`} class={`desactivado ${entrenador_genero === "mujer" ? 'mujer' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                          <path d="M440-120v-80h-80v-80h80v-84q-79-14-129-75t-51-143q0-91 65-154t155-64q91 0 156 64t64 154q0 81-50 143t-130 75v84h80v80h-80v80h-80Zm40-320q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Z"/>
                      </svg>
                  </span>
             </div>
            </div>
          </div>
          <div class="flex flex-col items-center ml-2">
    
            <div class="flex min-h-20 h-auto pt-4 pb-2  flex-wrap place-content-start items-center gap-x-2 gap-y-8 space-x-2">
              
              {/* Nombre */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center rounded-full px-3 py-1 text-blanco text-xl">
                      Nom
                  </p>
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{entrenador_nombre}</p>
                  
              </div>
              {/* 1r Apellido */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      1r Cognom
                  </p>
                  
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{entrenador_1r_apellido}</p>
              </div>
      
              {/* 2n Apellido */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro rounded-full px-3 py-1 text-blanco text-xl">2n Cognom</p>
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{entrenador_2n_apellido}</p>
              </div>
      
               {/* Curso */}
              <div class="flex flex-col relative">
                  <p  class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      Curs
                      
                  </p>
                  
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{entrenador_curso}</p>
              </div>
              {/* Email */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      Email
                  </p>
                  <p class="px-2 py-1 w-72 overflow-hidden h-12 bg-gris-claro flex flex-row items-center rounded-full text-base text-blanco border-none">{entrenador_email}</p>
              
              </div>
            </div>
          </div>
         

          <div class="w-max flex flex-row gap-2">
            <div class="px-3 py-2 w-96 h-12  text-4xl text-amarillo border-none"><h4>Alumnes Jugadors</h4></div>
          </div>
          
          
    {jugadores.map((jugador, index) => (
            <div class="w-[95%] h-[2px] my-10 mx-auto border-none block rounded-full bg-accent select-none">&nbsp;</div>
            <div class="flex flex-row gap-2 items-end">
            <p class="text-blanco font-semibold bg-azul bg-opacity-55 w-max h-max p-2 rounded-md text-xl ">{index + 1}. Jugador</p>
        
        
         {/* Genero */}
         <div class="flex flex-col relative">
              <label class="genero relative">
                  <label for="nombre" class="absolute -top-5 -right-5 flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
              </label>
                  
                  <span id={`hombre_entrenador`} class={`desactivado ${jugador.genero === "hombre" ? 'hombre' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                          <path d="M800-800v240h -80v-103L561-505q19 28 29 60t10 65q0 92-64 156t-156 64q-92 0-156-64t-64-156q0-92 64-156t156-64q33 0 65 10t59 29l159-159H560v-80h240ZM380-520q-58 0-99 41t-41 99q0 58 41 99t99 41q58 0 99-41t41-99q0-58-41-99t-99-41Z"/>
                      </svg>
                  </span>
                  <span id={`mujer_entrenador`} class={`desactivado ${jugador.genero === "mujer" ? 'mujer' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                          <path d="M440-120v-80h-80v-80h80v-84q-79-14-129-75t-51-143q0-91 65-154t155-64q91 0 156 64t64 154q0 81-50 143t-130 75v84h80v80h-80v80h-80Zm40-320q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Z"/>
                      </svg>
                  </span>
             </div>
             </div>
      </div>
      <div class="w-auto min-h-20 h-auto pt-4 pb-2 grid grid-cols-[max-content_1fr] grid-rows-1 md:grid-cols-[max-content_1fr] md:grid-rows-1 xs:grid-cols-1 xs:grid-rows-[max-content_1fr] sm:grid-cols-1 sm:grid-rows-[max-content_1fr] gap-2 gap-y-8 place-items-center">
            <div class="w-20 min-h-20 h-auto overflow-hidden gap-1 flex flex-col items-center justify-center">
              {jugador.img ? (
                  <img 
                      src={jugador.img} 
                      alt={`Imagen jugador ${index + 1}`} 
                      class="h-20 w-auto object-cover" 
                    />
                  
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="#e8eaed" viewBox="0 -960 960 960">
                  <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                </svg>
                )}
                <div class="flex flex-row items-center gap-x-1 place-content-center">
                  <span class=" w-8 h-8 rounded-md flex items-center place-content-center text-blanco bg-gris-claro bg-opacity-60">Si</span>
                  <span class=" w-8 h-8 rounded-md flex items-center place-content-center text-blanco bg-gris-claro bg-opacity-60">No</span>
                </div>
            </div>
            <div class="flex min-h-20 h-auto  flex-wrap place-content-start items-center gap-x-2 gap-y-8 space-x-2">
              
              {/* Nombre */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center rounded-full px-3 py-1 text-blanco text-xl">
                      Nom
                  </p>
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador.nombre}</p>
                  
              </div>
              {/* 1r Apellido */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      1r Cognom
                  </p>
                  
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador._1r_apellido}</p>
              </div>
      
              {/* 2n Apellido */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro rounded-full px-3 py-1 text-blanco text-xl">2n Cognom</p>
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador._2n_apellido}</p>
              </div>
      
               {/* Curso */}
              <div class="flex flex-col relative">
                  <p  class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      Curs
                      
                  </p>
                  
                  <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador.curso}</p>
              </div>
              {/* Email */}
              <div class="flex flex-col relative">
                  <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
                      Email
                  </p>
                  <p class="px-2 py-1 w-72 overflow-hidden h-12 bg-gris-claro flex flex-row items-center rounded-full text-base text-blanco border-none">{jugador.email}</p>
              
              </div>
             
             </div>
            </div>
    ))}


<div class="w-max flex flex-row gap-2">
  <div class="px-3 py-2 w-96 h-12  text-4xl text-amarillo border-none"><h4>Alumnes Jugadors</h4></div>
</div>


{Staff.map((jugador, index) => (
  <div class="w-[95%] h-[2px] my-10 mx-auto border-none block rounded-full bg-accent select-none">&nbsp;</div>
  <div class="flex flex-row gap-2 items-end">
  <p class="text-blanco font-semibold bg-azul bg-opacity-55 w-max h-max p-2 rounded-md text-xl ">{index + 1}. Jugador</p>


{/* Genero */}
<div class="flex flex-col relative">
    <label class="genero relative">
        <label for="nombre" class="absolute -top-5 -right-5 flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
    </label>
        
        <span id={`hombre_entrenador`} class={`desactivado ${jugador.genero === "hombre" ? 'hombre' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                <path d="M800-800v240h -80v-103L561-505q19 28 29 60t10 65q0 92-64 156t-156 64q-92 0-156-64t-64-156q0-92 64-156t156-64q33 0 65 10t59 29l159-159H560v-80h240ZM380-520q-58 0-99 41t-41 99q0 58 41 99t99 41q58 0 99-41t41-99q0-58-41-99t-99-41Z"/>
            </svg>
        </span>
        <span id={`mujer_entrenador`} class={`desactivado ${jugador.genero === "mujer" ? 'mujer' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 -960 960 960">
                <path d="M440-120v-80h-80v-80h80v-84q-79-14-129-75t-51-143q0-91 65-154t155-64q91 0 156 64t64 154q0 81-50 143t-130 75v84h80v80h-80v80h-80Zm40-320q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Z"/>
            </svg>
        </span>
   </div>
   </div>
</div>
<div class="w-auto min-h-20 h-auto pt-4 pb-2 grid grid-cols-[max-content_1fr] grid-rows-1 md:grid-cols-[max-content_1fr] md:grid-rows-1 xs:grid-cols-1 xs:grid-rows-[max-content_1fr] sm:grid-cols-1 sm:grid-rows-[max-content_1fr] gap-2 gap-y-8 place-items-center">
  <div class="w-20 h-20 overflow-hidden flex items-center justify-center">
    {jugador.img ? (
  <img 
      src={jugador.img} 
      alt={`Imagen jugador ${index + 1}`} 
      class="h-full w-auto object-cover" 
    />
  
) : (
<svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="#e8eaed" viewBox="0 -960 960 960">
  <path d="M234-276q51-39 114-61t132-23q69 0 132 23t114 61q35-41 55-93t19-111q0-133-93-226t-227-94q-133 0-226 94t-94 226q0 59 20 111t54 93Zm246-164q-59 0-99-40t-41-100q0-59 41-99t99-41q59 0 100 41t40 99q0 59-40 100t-100 40Zm0 360q-83 0-156-31t-127-86q-54-54-85-127T80-480q0-83 32-156t85-127q54-54 127-85t156-32q83 0 156 32t127 85q54 54 86 127t31 156q0 83-31 156t-86 127q-54 54-127 86T480-80Zm0-80q53 0 100-15t86-45q-39-29-86-44t-100-16q-53 0-100 16t-86 44q39 29 86 45t100 15Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
</svg>
)}
  </div>
  <div class="flex min-h-20 h-auto  flex-wrap place-content-start items-center gap-x-2 gap-y-8 space-x-2">
    
    {/* Nombre */}
    <div class="flex flex-col relative">
        <p class="form bg-gris-claro flex flex-row items-center place-content-center rounded-full px-3 py-1 text-blanco text-xl">
            Nom
        </p>
        <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador.nombre}</p>
        
    </div>
    {/* 1r Apellido */}
    <div class="flex flex-col relative">
        <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
            1r Cognom
        </p>
        
        <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador._1r_apellido}</p>
    </div>

    {/* 2n Apellido */}
    <div class="flex flex-col relative">
        <p class="form bg-gris-claro rounded-full px-3 py-1 text-blanco text-xl">2n Cognom</p>
        <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador._2n_apellido}</p>
    </div>

     {/* Curso */}
    <div class="flex flex-col relative">
        <p  class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
            Curs
            
        </p>
        
        <p class="px-4 py-1 w-40 flex flex-row items-center h-12 bg-gris-claro rounded-full text-base text-blanco border-none">{jugador.curso}</p>
    </div>
    {/* Email */}
    <div class="flex flex-col relative">
        <p class="form bg-gris-claro flex flex-row items-center place-content-center gap-1 rounded-full px-3 py-1 text-blanco text-xl">
            Email
        </p>
        <p class="px-2 py-1 w-72 overflow-hidden h-12 bg-gris-claro flex flex-row items-center rounded-full text-base text-blanco border-none">{jugador.email}</p>
    
    </div>
   
   </div>
  </div>
))}

 <div id="evaluar" class="w-20 h-20 rounded-md bg-gris-claro evaluar">
  <svg xmlns="http://www.w3.org/2000/svg" fill="#e8eaed" viewBox="0 -960 960 960">
    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56-23t-24-57v-640q0-33 24-56t56-24h320l240 240v480q0 33-23 57t-57 23H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
  </svg>
  </div>
        
</section>
</div>

<script>
  console.log("Script Evaluar Cargado")
  const boton = document.getElementById("evaluar");

  boton?.addEventListener('click', function(){
    
  })
</script>
      
      
<style>
  input[type="file"]::file-selector-button {
  display: none;
}
.evaluar{
  z-index: 0;
        position: absolute;
        bottom: 40px;
        right: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
}
   .centrar {
        z-index: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .formulario{
        z-index: 10000;
    }
    .form{
        
        position: absolute;
        top: -20px;
        left: 20px;
    }

    .active-c{
        background-color: rgb(239, 191, 4, 0.5);
    }
    .genero {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 90px;
    height: 25px;
}

.genero span {
    border-radius: 10px;
    fill: white;
    transition: background-color 0.3s;
}
.desactivado{
    background-color: rgba(39, 39, 39, 0.75);
}
.hombre {
    background: rgba(0, 89, 255, 0.75);
    /* background: rgb(255, 199, 0.75); */
     /* Color para hombre */
}

.mujer {
    background-color: rgba(255, 0, 200, 0.75);
    /* background: rgb(255, 199, 0.75); */
    
}



</style>
</LayoutStaff>