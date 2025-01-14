  const emailContent = `
<!DOCTYPE html>
<html>
  <head>
      <meta charset="UTF-8" />
      <title>IES Calvià Voley Tournament</title>
  </head>
  <body>
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <a href="https://iescalvia-voley.com" style="display: flex; align-items: center; gap: 4px; text-decoration: none;">
            <img src="https://iescalvia-voley.com/web-app-manifest-192x192.png" alt="Logo IES Calvia voley tournament" style="width: 60px; height:60px;"/>
            <h1 style="color: #ffc107; font-size:20px; font-weight:bold;">IES Calvià Voley Tournament</h1>
        </a>
        <hr style="border: 1px solid #333; border-radius: 10px; margin: 30px 0" />
        <div style="margin-bottom: 16px; font-family:Roboto Condensed, sans-serif;font-size:32px; font-weight:bold; line-height:38px;text-align:center; color: #1666FF;">
            Equip inscrit correctament al torneig de Setmana Santa
        </div>
        <h2 style="color: #FFC107; font-size: 24px; margin-bottom: 16px;">Equip Inscrit Per:</h2>
        <div style="display: grid; grid-template-columns: max-content 1fr max-content; align-items: center; place-items: center; text-lg; color: #ffffff; margin-bottom: 20px;">
        <table style="width: 100%;">
          <tr>
            <th>
              <p style="margin: 0; color: #ffffff;">${usuario_nombre}</p>
            </th>
            <th>
              <p style="margin: 0; color: #ffffff;">${usuario_email}</p>
            </th>
            <th>
              <p style="margin: 0; color: #ffffff;">${usuario_curso}</p>
            </th>
          </tr>
        </table>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <h3 style="font-size: 32px; background-color: transparent; color: #FFC107; padding: 10px; border-radius: 5px;">IES Calvià Voley Team</h3>
        </div>
        <div style="width: 240px; height: 240px; margin: auto; border-radius: 10px; overflow: hidden;">
          <img src=${publicUrl} alt="Logo equipo" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="display: flex; align-items: center; margin-top: 16px;">
          <label style="color: #FFC107; font-size: 20px; margin-right: 8px;">Capità: <span style="color: #fff;">${capitan}</span></label>
          <p style="background-color: transparent; color: #ffffff; padding: 8px; border-radius: 5px;"></p>
        </div>
        
        <h4 style="margin-top: 20px; font-size: 24px; color: #FFC107;">Entrenador</h4>
        <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <div style="display: flex; flex-direction: column; margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${acompañante_nombre} ${acompañante_1r_apellido} ${acompañante_2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${acompañante_curso} </p>
              </tr>
              <tr>
                <p style="color: #ffffff; text-decoration:none;">Email: ${acompañante_email}</p>
              </tr>
            </table>
            </div>
        </div>
        
        <h4 style="margin-top: 20px; font-size: 24px; color: #FFC107;">Alumnes Jugadors</h4>
        ${jugadores.map(jugador => `
          <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
                <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${jugador.curso}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Email: ${jugador.email}</p>
              </tr>
            </table>
            
          </div>
        `).join('')}
        ${jugadores_extra.map(jugador => `
          <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${jugador.curso}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Email: ${jugador.email}</p>
              </tr>
            </table>
            
          </div>
        `).join('')}

        <hr style="border: 1px solid #ffc107; border-radius: 10px; margin: 30px 0" />
        <div style="width: 100%;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <table style="width: 100%;">
            <tr>
              <h4 style="color: #1666FF; font-size: 22px; white-space: nowrap; font-weight: 600; text-transform: uppercase; text-align: center;">Organitzat per</h4>
            </tr>
            <tr>
              <th>
                  <a>
                      <img src="https://iescalvia-voley.com/img/team-teto.png" style="width: 175px; height: 175px;" alt="TEAM Teto" />
                  </a>
              </th>
              <th>
                  <a href="https://sites.google.com/iescalvia.com/iescalvia/inici" target="_blank">
                      <img src="https://iescalvia-voley.com/img/ies-calvia.png" style="width: 175px; height: 175px;" alt="IES Calvi=C3=A0" />
                  </a>
                </th>
            </tr>
          </table>
              
          </div>
          
          <div style="display: flex; flex-direction: row; justify-items: center; align-items: center; font-size: 16px;">
              <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
                <img src="https://iescalvia-voley.com/img/licencia/cc.png" style="width: 20px; height:20px; margin: 0 4px;" alt="Creative Comons"/>
                2025 - IES Calvià Voley Tournament
              </div>
              <span style="margin: 0 4px;">|</span>
              <span>
              <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/?refselecter-v1" style="display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 16px; color: #fff;" target="_blank" rel="licencia noopener noreferrer">Tots els drets reservats.
                <img src="https://iescalvia-voley.com/img/licencia/attribution.png" style="width: 20px; height:20px; margin: 0 4px;" alt="Attribution"/>
                <img src="https://iescalvia-voley.com/img/licencia/nc.png" style="width: 20px; height:20px; margin: 0 4px;" alt="NonCommercial"/>
                <img src="https://iescalvia-voley.com/img/licencia/nd.png" style="width: 20px; height:20px; margin: 0 4px;" alt="NoDerivatives"/>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;