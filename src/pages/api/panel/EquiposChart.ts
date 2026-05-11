import type { APIRoute } from "astro";
import { supabaseAdmin } from "src/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    /**
     * 📦 BODY
     */
    const { torneoID } = await request.json();

    if (!torneoID) {
      return new Response(
        JSON.stringify({
          error: "torneoID requerit"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const TablaEquipos = `Equipos${torneoID}`;

    /**
     * 🟦 EQUIPOS
     */
    const { data: equips, error } = await supabaseAdmin
      .from(TablaEquipos)
      .select("estado");

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    /**
     * 📊 CONTADORES
     */
    const stats = {
      revisant: 0,
      acceptat: 0,
      denegat: 0
    };

    equips?.forEach((equip: any) => {
      const estado = (equip.estado ?? "").toLowerCase();

      if (estado === "revisant") {
        stats.revisant++;
      }

      if (estado === "acceptat") {
        stats.acceptat++;
      }

      if (estado === "denegat") {
        stats.denegat++;
      }
    });

    /**
     * ✅ RESPONSE
     */
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        error: "Error intern"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};