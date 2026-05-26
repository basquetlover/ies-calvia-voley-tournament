import { generarEmailVolDen } from "src/lib/genEmailVolDen";
import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";
import { enviarEmailApi } from "src/utils/emailSend";


const permisosVol={
  "equips": {
    "ver": false,
    "editar": false,
    "evaluar": false,
    "eliminar": false
  },
  "panell": {
    "ver": true
  },
  "pistes": {
    "ver": true
  },
  "alumnes": {
    "ver": false,
    "exportar": false
  },
  "partits": {
    "ver": false,
    "crear": false,
    "editar": false,
    "eliminar": false
  },
  "usuaris": {
    "ver": false,
    "crear": false,
    "editar": false,
    "eliminar": false,
  },
  "edicions": {
    "ver": false,
    "crear": false,
    "editar": false,
    "eliminar": false
  },
  "permisos": {
    "ver": false,
    "crear": false,
    "editar": false
  },
  "voluntaris": {
    "ver": false,
    "crear": false,
    "editar": false,
    "eliminar": false
  },
  "acta-digital": {
    "ver": true,
    "editar": false,
  },
  "designacions": {
    "ver": true,
  },
  "historial-jugadors": {
    "ver": false,
    "editar": false,
    "exportar": false
  }
}

export async function POST({ request }: { request: Request }) {
    const { observaciones, torneoID, data } = await request.json();

    const estado = "Denegat"
    const TablaVoluntarios = `Voluntarios${torneoID}`

    // console.log(data)
    if(!observaciones){
        return new Response(JSON.stringify({
        ok: false, error: {
            seccion: "observacion",
            mensaje: "Has d’indicar les observacions del procés de revisió abans de denegar la sol·licitud."
        }
        }), { status: 400 });
    }
    

    const getCurrentDateInCatalan = () => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date();
        return new Intl.DateTimeFormat('ca-ES', options).format(date);
    };
      
    const currentDate = getCurrentDateInCatalan();

    const { data: Vol, error: errorVol } = await supabaseAdmin
    .from(TablaVoluntarios)
    .update({ 
        estado: estado,
        observacion: observaciones,
        fecha_revision: currentDate,
    })
    .eq('email', data.email)
    .select()

    if(errorVol){
        console.log(errorVol)
    }

    const traducirTipoVoluntario = (tipo: string) => {
    const traducciones: Record<string, string> = {
        "Arbitro": "Àrbitre",
        "Oficial de Mesa": "Oficial de taula",
        "Arbitro o Oficial de Mesa": "Àrbitre o Oficial de taula"
    };

    return traducciones[tipo] || tipo;
    };

    const nombre = data.nombre;
    const email = data.email;
    const rol = traducirTipoVoluntario(data.tipo)

    console.log("Datos a email", nombre, email, rol)

    const html = generarEmailVolDen({email, rol, nombre})

    try {
      await enviarEmailApi({
        to: email,
        subject: "Resultat de l’avaluació del voluntariat | IES Calvià Voley Tournament",
        html: html,
        origen: "voley_tournament"
      });
    
    } catch (EmailError) {
      console.error("Error enviando email:", EmailError);
    }
    
    // console.log(usuario_permisos, usuario_rango)

  return new Response(JSON.stringify({ok:true, data: "Edició actualizada correctament"  }), { status: 200 });
}

