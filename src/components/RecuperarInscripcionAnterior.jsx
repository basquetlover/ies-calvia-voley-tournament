import React, { useState, useEffect } from "react";

export default function RecuperarInscripcionAnterior() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosInscripcion, setDatosInscripcion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    recuperarInscripcionAnterior();
  }, []);

  const recuperarInscripcionAnterior = async () => {
    try {
      const response = await fetch("/api/inscripcion/anterior", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setCargando(false);
        return;
      }

      const datos = await response.json();

      if (datos.success && datos.equipo) {
        setDatosInscripcion(datos);
        setMostrarModal(true);
      }

      setCargando(false);
    } catch (error) {
      console.error("Error recuperando inscripción anterior:", error);
      setCargando(false);
    }
  };

  const precargarDatos = (datos) => {
    if (!datos?.equipo) return;

    // Cargar escudo
    const imgEscudo = document.getElementById("img");
    if (imgEscudo && datos.equipo.escudo) {
      imgEscudo.src = datos.equipo.escudo;

      // Crear un archivo a partir del escudo para el input type="file"
      // Esto es necesario para que se envíe cuando se submit el formulario
      const cargarEscudoEnInput = async () => {
        try {
          const response = await fetch(datos.equipo.escudo);
          const blob = await response.blob();
          const file = new File([blob], "escudo.png", { type: blob.type });

          const fileInput = document.getElementById("foto");
          if (fileInput && fileInput.type === "file") {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
          }
        } catch (error) {
          console.error("Error cargando escudo en input:", error);
        }
      };

      cargarEscudoEnInput();
    }

    const inputNombreEquipo = document.getElementById("nombre_equipo");
    if (inputNombreEquipo) {
      inputNombreEquipo.value = datos.equipo.nombre_equipo || "";
      inputNombreEquipo.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Cargar email del capitán
    if (datos.equipo.email_capitan) {
      const inputCapitanEmail = document.getElementById("input_capitan_email_form");
      if (inputCapitanEmail) {
        inputCapitanEmail.value = datos.equipo.email_capitan;
      }
    }

    if (datos.equipo.capitan_edit) {
      const inputCapitan = document.getElementById("input_capitan_form");
      if (inputCapitan) {
        inputCapitan.value = datos.equipo.capitan_edit;
      }
    }

    if (datos.jugadores?.length) {
      // Separar jugadores por tipo de ficha
      const jugadoresRegulares = datos.jugadores.filter(j => j.ficha === "jugador");
      const entrenadores = datos.jugadores.filter(j => j.ficha === "entrenador");
      const profesores = datos.jugadores.filter(j => j.ficha === "profesor");
      const cuerpoTecnico = datos.jugadores.filter(j => j.ficha === "cuerpo_tecnico");

      // Cargar jugadores regulares (6 primeros en player_*, resto en extra_player_*)
      jugadoresRegulares.forEach((jugador, index) => {
        // Determinar si es jugador regular o extra
        const esExtra = index >= 6;
        const idPrefix = esExtra ? `extra_player_${index - 6}` : `player_${index}`;

        const inputNombre = document.getElementById(`${idPrefix}_name`);
        if (inputNombre) {
          inputNombre.value = jugador.nombre || "";
        }

        const inputApellido1 = document.getElementById(`${idPrefix}_1r_apellido`);
        if (inputApellido1) {
          inputApellido1.value = jugador._1r_apellido || "";
        }

        const inputApellido2 = document.getElementById(`${idPrefix}_2n_apellido`);
        if (inputApellido2) {
          inputApellido2.value = jugador._2n_apellido || "";
        }

        const selectCurso = document.getElementById(`${idPrefix}_curso`);
        if (selectCurso) {
          selectCurso.value = jugador.curso || "";
        }

        const inputEmail = document.getElementById(`${idPrefix}_email`);
        if (inputEmail) {
          inputEmail.value = jugador.email || "";
        }

        // Marcar capitán si existe
        const capitanId = esExtra ? `extra_capitan_${index - 6}` : `capitan_${index}`;
        if (datos.equipo.email_capitan === jugador.email) {
          const capitanBtn = document.getElementById(capitanId);
          if (capitanBtn) {
            capitanBtn.classList.add("active-c");
          }
        }

        if (jugador.genero) {
          const generoId = esExtra ? `extra_genero_${index - 6}` : `genero_${index}`;
          const inputGenero = document.getElementById(generoId);
          if (inputGenero) {
            inputGenero.value = jugador.genero;
          }

          const hombreId = esExtra ? `extra_hombre_${index - 6}` : `hombre_${index}`;
          const mujerID = esExtra ? `extra_mujer_${index - 6}` : `mujer_${index}`;
          const spanHombre = document.getElementById(hombreId);
          const spanMujer = document.getElementById(mujerID);

          if (jugador.genero === "hombre" || jugador.genero === "Hombre" || jugador.genero === "H") {
            spanHombre?.classList.add("hombre");
            spanHombre?.classList.remove("desactivado");
            spanMujer?.classList.remove("mujer");
            spanMujer?.classList.add("desactivado");
          } else if (jugador.genero === "mujer" || jugador.genero === "Mujer" || jugador.genero === "M") {
            spanMujer?.classList.add("mujer");
            spanMujer?.classList.remove("desactivado");
            spanHombre?.classList.remove("hombre");
            spanHombre?.classList.add("desactivado");
          }
        }
      });

      // Cargar entrenadores
      entrenadores.forEach((entrenador) => {
        const inputNombre = document.getElementById("entrenador_name");
        if (inputNombre) {
          inputNombre.value = entrenador.nombre || "";
        }

        const inputApellido1 = document.getElementById("entrenador_1r_apellido");
        if (inputApellido1) {
          inputApellido1.value = entrenador._1r_apellido || "";
        }

        const inputApellido2 = document.getElementById("entrenador_2n_apellido");
        if (inputApellido2) {
          inputApellido2.value = entrenador._2n_apellido || "";
        }

        const inputEmail = document.getElementById("entrenador_email");
        if (inputEmail) {
          inputEmail.value = entrenador.email || "";
        }

        const selectCurso = document.getElementById("entrenador_curso");
        if (selectCurso) {
          selectCurso.value = entrenador.curso || "";
        }

        if (entrenador.genero) {
          const inputGenero = document.getElementById("genero_entrenador");
          if (inputGenero) {
            inputGenero.value = entrenador.genero;
          }

          const spanHombre = document.getElementById("hombre_entrenador");
          const spanMujer = document.getElementById("mujer_entrenador");

          if (entrenador.genero === "hombre" || entrenador.genero === "Hombre" || entrenador.genero === "H") {
            spanHombre?.classList.add("hombre");
            spanHombre?.classList.remove("desactivado");
            spanMujer?.classList.remove("mujer");
            spanMujer?.classList.add("desactivado");
          } else if (entrenador.genero === "mujer" || entrenador.genero === "Mujer" || entrenador.genero === "M") {
            spanMujer?.classList.add("mujer");
            spanMujer?.classList.remove("desactivado");
            spanHombre?.classList.remove("hombre");
            spanHombre?.classList.add("desactivado");
          }
        }
      });

      // Cargar profesores
      profesores.forEach((profesor) => {
        const inputNombre = document.getElementById("profesor_name");
        if (inputNombre) {
          inputNombre.value = profesor.nombre || "";
        }

        const inputApellido1 = document.getElementById("profesor_1r_apellido");
        if (inputApellido1) {
          inputApellido1.value = profesor._1r_apellido || "";
        }

        const inputApellido2 = document.getElementById("profesor_2n_apellido");
        if (inputApellido2) {
          inputApellido2.value = profesor._2n_apellido || "";
        }

        const inputEmail = document.getElementById("profesor_email");
        if (inputEmail) {
          inputEmail.value = profesor.email || "";
        }

        const selectCurso = document.getElementById("profesor_curso");
        if (selectCurso) {
          selectCurso.value = profesor.curso || "";
        }

        if (profesor.genero) {
          const inputGenero = document.getElementById("genero_profesor");
          if (inputGenero) {
            inputGenero.value = profesor.genero;
          }

          const spanHombre = document.getElementById("hombre_profesor");
          const spanMujer = document.getElementById("mujer_profesor");

          if (profesor.genero === "hombre" || profesor.genero === "Hombre" || profesor.genero === "H") {
            spanHombre?.classList.add("hombre");
            spanHombre?.classList.remove("desactivado");
            spanMujer?.classList.remove("mujer");
            spanMujer?.classList.add("desactivado");
          } else if (profesor.genero === "mujer" || profesor.genero === "Mujer" || profesor.genero === "M") {
            spanMujer?.classList.add("mujer");
            spanMujer?.classList.remove("desactivado");
            spanHombre?.classList.remove("hombre");
            spanHombre?.classList.add("desactivado");
          }
        }
      });

      // Cargar cuerpo técnico
      cuerpoTecnico.forEach((tecnico, index) => {
        const inputNombre = document.getElementById(`staff_player_${index}_name`);
        if (inputNombre) {
          inputNombre.value = tecnico.nombre || "";
        }

        const inputApellido1 = document.getElementById(`staff_player_${index}_1r_apellido`);
        if (inputApellido1) {
          inputApellido1.value = tecnico._1r_apellido || "";
        }

        const inputApellido2 = document.getElementById(`staff_player_${index}_2n_apellido`);
        if (inputApellido2) {
          inputApellido2.value = tecnico._2n_apellido || "";
        }
        const inputEmailStass = document.getElementById(`staff_player_${index}_email`);
        if (inputEmailStass) {
          inputEmailStass.value = tecnico.email || "";
        }

        const selectCurso = document.getElementById(`staff_player_${index}_curso`);
        if (selectCurso) {
          selectCurso.value = tecnico.curso || "";
        }

        if (tecnico.genero) {
          const inputGenero = document.getElementById(`staff_genero_${index}`);
          if (inputGenero) {
            inputGenero.value = tecnico.genero;
          }

          const spanHombre = document.getElementById(`staff_hombre_${index}`);
          const spanMujer = document.getElementById(`staff_mujer_${index}`);

          if (tecnico.genero === "hombre" || tecnico.genero === "Hombre" || tecnico.genero === "H") {
            spanHombre?.classList.add("hombre");
            spanHombre?.classList.remove("desactivado");
            spanMujer?.classList.remove("mujer");
            spanMujer?.classList.add("desactivado");
          } else if (tecnico.genero === "mujer" || tecnico.genero === "Mujer" || tecnico.genero === "M") {
            spanMujer?.classList.add("mujer");
            spanMujer?.classList.remove("desactivado");
            spanHombre?.classList.remove("hombre");
            spanHombre?.classList.add("desactivado");
          }
        }
      });

      // Procesar capitán: buscar el jugador con email_capitan y rellenar datos
      if (datos.equipo.email_capitan) {
        // Buscar el jugador con el email del capitán
        const jugadorCapitan = jugadoresRegulares.find(j => j.email === datos.equipo.email_capitan);
        
        if (jugadorCapitan) {
          const nombreCapitan = jugadorCapitan.nombre || "";
          const apellidoCapitan = jugadorCapitan._1r_apellido || "";
          const nombreCompleto = `${nombreCapitan} ${apellidoCapitan}`;

          // Rellenar inputs del capitán
          const inputCapitan = document.getElementById("input_capitan");
          if (inputCapitan) {
            inputCapitan.value = nombreCompleto;
          }

          const inputCapitanForm = document.getElementById("input_capitan_form");
          if (inputCapitanForm) {
            inputCapitanForm.value = nombreCompleto;
          }

          // Buscar y marcar el span del capitán
          // Encontrar el índice dentro del array jugadoresRegulares
          const indexCapitan = jugadoresRegulares.indexOf(jugadorCapitan);
          const esExtra = indexCapitan >= 6;
          const capitanId = esExtra ? `extra_capitan_${indexCapitan - 6}` : `capitan_${indexCapitan}`;
          
          const capitanBtn = document.getElementById(capitanId);
          if (capitanBtn) {
            capitanBtn.classList.add("active-c");
          }
        }
      }
    }
  };

  const handleAceptar = () => {
    if (datosInscripcion) {
      precargarDatos(datosInscripcion);
      setMensajeExito(
        "✓ Datos de inscripción anterior cargados exitosamente"
      );
      setTimeout(() => setMensajeExito(""), 5000);
    }
    setMostrarModal(false);
  };

  const handleRechazar = () => {
    setMostrarModal(false);
    setDatosInscripcion(null);
  };

  return (
    <>
      {mensajeExito && (
        <div className="text-green-500 bg-green-900 bg-opacity-30 rounded-lg px-3 py-2 text-center mb-4">
          {mensajeExito}
        </div>
      )}

      {mostrarModal && datosInscripcion && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleRechazar();
          }}
        >
          <div className="bg-gris-claro rounded-lg shadow-2xl p-6 max-w-md w-11/12 border-2 border-accent">
            <h3 className="text-2xl font-bold text-amarillo mb-4">
              Inscripción Anterior Encontrada
            </h3>

            <p className="text-blanco mb-4">
              Hemos detectado que ya participaste anteriormente.
            </p>

            <div className="bg-azul bg-opacity-20 rounded-lg p-4 mb-4 border border-azul border-opacity-50">
              <div className="flex items-center gap-4 mb-4">
                {datosInscripcion.equipo?.escudo && (
                  <img
                    src={`${datosInscripcion.equipo.escudo}`}
                    alt={datosInscripcion.equipo.nombre_equipo}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="flex-1">
                  <p className="text-amarillo font-semibold">
                    Equipo:{" "}
                    <span className="text-blanco">
                      {datosInscripcion.equipo?.nombre_equipo || "-"}
                    </span>
                  </p>
                  <p className="text-amarillo font-semibold text-sm">
                    Categoría:{" "}
                    <span className="text-blanco">
                      {datosInscripcion.equipo?.categoria || "-"}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-amarillo font-semibold text-sm">
                Edición:{" "}
                <span className="text-blanco">
                  {datosInscripcion.edicionAnterior?.nombre || "-"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleRechazar}
                className="px-4 py-2 rounded-lg bg-cancelar text-blanco font-semibold"
              >
                No, gracias
              </button>

              <button
                onClick={handleAceptar}
                className="px-4 py-2 rounded-lg bg-aceptar text-blanco font-semibold"
              >
                Sí, cargar datos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
