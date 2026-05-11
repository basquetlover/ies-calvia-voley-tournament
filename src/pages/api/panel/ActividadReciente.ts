import type { APIRoute } from "astro";
import { supabaseAdmin } from "src/lib/supabase";

/**
 * ⚙️ CONFIG
 */
const PAGE_SIZE = 5;

/**
 * 📅 MESOS CATALÀ → JS
 */
const mesos: Record<string, number> = {
  gener: 0,
  febrer: 1,
  març: 2,
  abril: 3,
  maig: 4,
  juny: 5,
  juliol: 6,
  agost: 7,
  setembre: 8,
  octubre: 9,
  novembre: 10,
  desembre: 11
};

/**
 * 🧠 PARSE "6 de març del 2026"
 */
const parseFechaCat = (str: string) => {
  if (!str) return null;

  const parts = str.toLowerCase().split(" ");
  const dia = parseInt(parts[0]);
  const mes = mesos[parts[2]];
  const any = parseInt(parts[4]);

  if (isNaN(dia) || mes === undefined || isNaN(any)) return null;

  return new Date(any, mes, dia);
};

/**
 * ⏱️ TIEMPO RELATIVO
 */
const formatTimeAgo = (date: Date | null) => {
  if (!date) return "desconegut";

  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Avui";
  if (diffDays === 1) return "Ahir";
  return `fa ${diffDays} dies`;
};

/**
 * 📦 PAGINACIÓN
 */
const paginate = (arr: any[], size: number) => {
  const result: { num_pagina: number; data: any[] }[] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push({
      num_pagina: Math.floor(i / size) + 1,
      data: arr.slice(i, i + size)
    });
  }

  return result;
};

/**
 * 🧠 ESTADO EQUIPOS
 */
const getEstadoEquip = (e: any) => {
  const estado = (e.estado ?? "");
  const aceptado = (e.aceptado ?? "");

  // 🔴 Denegado
  if (estado === "Denegat") {
    return "Equip denegat";
  }

  // 🟡 Revisando
  if (estado === "Revisant") {
    return "Equip en revisió";
  }

  // 🟢 Aceptado → subestado
  if (estado === "Acceptat") {
    if (aceptado === "Inscrit") {
      return "Equip inscrit";
    }

    // if (aceptado === "Llista d'espera") {
    //   return "Equip en llista d'espera";
    // }

    // fallback por si viene vacío
    return "Equip en llista d'espera";
  }

  return "Estat desconegut";
};

export const POST: APIRoute = async ({request}) => {


  try {

    const { torneoID } = await request.json();

    if (!torneoID) {
      return new Response(JSON.stringify({ error: 'torneoID requerido' }), {
        status: 400
      });
    }
    const TablaEquipos = `Equipos${torneoID}`
    const TablaVoluntarios = `Voluntarios${torneoID}`
    /**
     * 🟦 EQUIPOS
     */
    const { data: equips } = await supabaseAdmin
      .from(TablaEquipos)
      .select(
        "nombre_equipo, estado, aceptado, inscrito, fecha_inscripcion, fecha_modificacion, fecha_revision, capitan"
      );

    /**
     * 🟩 VOLUNTARIOS
     */
    const { data: voluntaris } = await supabaseAdmin
      .from(TablaVoluntarios)
      .select(
        "nombre, _1r_apellido, fecha_inscripcion, fecha_revision, tipo"
      );

    const activity: any[] = [];

    /**
     * 🟦 EQUIPOS
     */
    equips?.forEach((e: any) => {
      const nom = e.nombre_equipo;

      if (e.fecha_inscripcion) {
        activity.push({
          tipo: "equip_inscripcio",
          accio: "Nova inscripció d'equip",
          referencia: nom,
          fecha: parseFechaCat(e.fecha_inscripcion),
          fecha_exacta: e.fecha_inscripcion,
          temps: formatTimeAgo(parseFechaCat(e.fecha_inscripcion)),
          detalle: `Capità: ${e.capitan ?? "desconegut"}`
        });
      }

      if (e.fecha_modificacion) {
        activity.push({
          tipo: "equip_modificacio",
          accio: "Modificació d'equip",
          referencia: nom,
          fecha: parseFechaCat(e.fecha_modificacion),
          fecha_exacta: e.fecha_revision,
          temps: formatTimeAgo(parseFechaCat(e.fecha_modificacion)),
          detalle: `Capità: ${e.capitan ?? "desconegut"}`
        });
      }

      if (e.fecha_revision) {
        if(e.estado === "Acceptat" && e.aceptado === "Inscrit") {
            activity.push({
            tipo: "equip_revisio_acceptat_inscrit",
            accio: getEstadoEquip(e), // 🔥 AQUÍ EL CAMBIO IMPORTANTE
            referencia: nom,
            fecha: parseFechaCat(e.fecha_revision),
            fecha_exacta: e.fecha_revision,
            temps: formatTimeAgo(parseFechaCat(e.fecha_revision)),
            detalle: `Capità: ${e.capitan ?? "desconegut"}`
          });
        } 
        if(e.estado === "Acceptat" && e.aceptado !== "Inscrit") {
            activity.push({
            tipo: "equip_revisio_acceptat_espera",
            accio: getEstadoEquip(e),
            referencia: nom,
            fecha: parseFechaCat(e.fecha_revision),
            fecha_exacta: e.fecha_revision,
            temps: formatTimeAgo(parseFechaCat(e.fecha_revision)),
            detalle: `Capità: ${e.capitan ?? "desconegut"}`
          });
        }
      } if (e.estado === "Denegat") {
        activity.push({
            tipo: "equip_revisio_denegat",
            accio: getEstadoEquip(e),
            referencia: nom,
            fecha: parseFechaCat(e.fecha_revision),
            fecha_exacta: e.fecha_revision,
            temps: formatTimeAgo(parseFechaCat(e.fecha_revision)),
            detalle: `Capità: ${e.capitan ?? "desconegut"}`
          });
      }
    });

    /**
     * 🟩 VOLUNTARIOS
     */
    voluntaris?.forEach((v: any) => {
      const nom = `${v.nombre ?? ""} ${v._1r_apellido ?? ""}`.trim();

      if (v.fecha_inscripcion) {
        activity.push({
          tipo: "voluntari_inscripcio",
          accio: "Nova inscripció voluntari",
          referencia: nom,
          fecha: parseFechaCat(v.fecha_inscripcion),
          fecha_exacta: v.fecha_inscripcion,
          temps: formatTimeAgo(parseFechaCat(v.fecha_inscripcion)),
          detalle: `Rol: ${v.tipo ?? "desconegut"}`
        });
      }

      if (v.fecha_revision) {
        activity.push({
          tipo: "voluntari_revisio",
          accio: "Revisió voluntari",
          referencia: nom,
          fecha: parseFechaCat(v.fecha_revision),
          fecha_exacta: v.fecha_revision,
          temps: formatTimeAgo(parseFechaCat(v.fecha_revision)),
          detalle: `Rol: ${v.tipo ?? "desconegut"}`
        });
      }
    });

    /**
     * 📊 ORDENAR
     */
    activity.sort((a, b) => {
      const d1 = a.fecha?.getTime() ?? 0;
      const d2 = b.fecha?.getTime() ?? 0;
      return d2 - d1;
    });

    /**
     * 🧼 LIMPIAR
     */
    const clean = activity.map(({ fecha, ...rest }) => rest);

    /**
     * 📦 PAGINAR
     */
    const paginated = paginate(clean, PAGE_SIZE);

    return new Response(JSON.stringify(paginated), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Error intern" }),
      { status: 500 }
    );
  }
};