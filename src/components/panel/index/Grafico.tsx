"use client";

import { useEffect, useMemo, useState } from "react";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
torneoID: string;
};

type Estadisticas = {
revisant: number;
acceptat: number;
denegat: number;
};

export default function EquiposEstadoChart({
torneoID,
}: Props) {
const [stats, setStats] = useState<Estadisticas>({
    revisant: 0,
    acceptat: 0,
    denegat: 0,
});

const [loading, setLoading] = useState(true);

useEffect(() => {
    const obtenerDatos = async () => {
    try {
        setLoading(true);

        const response = await fetch(
        "/api/panel/EquiposChart",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            torneoID,
            }),
        }
        );

        const data = await response.json();

        setStats({
        revisant: data.revisant || 0,
        acceptat: data.acceptat || 0,
        denegat: data.denegat || 0,
        });
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    };

    obtenerDatos();
}, [torneoID]);

const total =
    stats.revisant +
    stats.acceptat +
    stats.denegat;

const data = useMemo(
    () => ({
    labels: ["Revisant", "Acceptat", "Denegat"],
    datasets: [
        {
        data: [
            stats.revisant,
            stats.acceptat,
            stats.denegat,
        ],
        backgroundColor: [
            "#f59e0b",
            "#22c55e",
            "#ef4444",
        ],
        borderWidth: 0,
        },
    ],
    }),
    [stats]
);

const centerTextPlugin = {
id: "centerText",
beforeDraw(chart: any) {
    const { width, height, ctx } = chart;

    ctx.restore();

    /**
     * 🟦 NÚMERO
     */
    ctx.font = "bold 38px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const totalText = String(total);

    ctx.fillText(
    totalText,
    width / 2,
    height / 2 - 10
    );

    /**
     * 🟦 TEXTO ABAJO
     */
    ctx.font = "500 16px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(
    "Equips",
    width / 2,
    height / 2 + 22
    );

    ctx.save();
},
};

if (loading) {
    return (
    <div className="flex w-full h-[500px] bg-gris-claro items-center justify-center">
        <p className="text-gray-500">
        Cargando gráfico...
        </p>
    </div>
    );
}

return (
    <div className="w-full h-[500px] max-w-md rounded-2xl bg-gris-claro p-6 shadow-lg">
        <h4 className="font-bold text-blanco text-3xl">Estat de les inscripcions</h4>
    <div className="relative mx-auto h-[225px] w-[225px] mt-5">
        <Doughnut
        data={data}
        plugins={[centerTextPlugin]}
        options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
            legend: {
                display: false,
            },
            },
        }}
        />
    </div>

    <div className="mt-6 flex flex-col gap-4">
        <EstadoItem
        color="#f59e0b"
        nombre="Revisant"
        valor={stats.revisant}
        />

        <EstadoItem
        color="#22c55e"
        nombre="Acceptat"
        valor={stats.acceptat}
        />

        <EstadoItem
        color="#ef4444"
        nombre="Denegat"
        valor={stats.denegat}
        />
    </div>
    </div>
);
}

type EstadoItemProps = {
color: string;
nombre: string;
valor: number;
};

function EstadoItem({
color,
nombre,
valor,
}: EstadoItemProps) {
return (
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
        <div
        className="h-4 w-4 rounded-full"
        style={{
            backgroundColor: color,
        }}
        />

        <span className="text-sm font-medium text-blanco">
        {nombre}
        </span>
    </div>

    <span className="text-sm font-bold text-blanco">
        {valor}
    </span>
    </div>
);
}