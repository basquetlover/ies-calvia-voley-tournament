import { useEffect, useState } from "react";

type Props = {
torneoID?: string | null;
voluntariID?: string | null;
};

interface EquipoData {
id: number,
nombre_equipo: string,
estado?: string,
id_equipo?: string,
aceptado?: string,
escudo?: string,
inscrito: number,
fecha_inscripcion: string,
fecha_modificacion: string,
fecha_revision: string,
siglas: string,
probl_tit_logo: null,
inscriptor_email?: string,
inscriptor_nombre?: string,
email_capitan: 'hhernandezutrera@alu.ibeducacio.eu',
jugadores: any[];
entrenador: any;
profesor: any;
cuerpo_tecnico: any[];
}

export default function EditVoluntari({ torneoID, voluntariID }: Props) {
    const [data, setData] = useState<EquipoData | null>(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        setError(false);

        fetch("/api/panel/InfoEquipo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ torneoID, voluntariID }),
        })
            .then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                setError(true);
                return;
            }

            setData(data);
            })
            .catch(() => {
            setError(true);
            console.log("Error carregant dades");
            });
    }, [torneoID, voluntariID]);

    return(
        <></>
    )
};