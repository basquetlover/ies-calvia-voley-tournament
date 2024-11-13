import { db, Equipo, Jugador, User } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(User).values([
		{
			id: 1,
			username: "basquetlover",
			password: "1234",
			rango: "coor"

		}
	]);

	await db.insert(Equipo).values([
		{
			id: 1,
			id_equipo: "team-teto",
			nombre_equipo: "Team Teto",
			imagen: "",
			capitan:"miguel",
			entrenador: "sergio",
		},
		{
			id: 2,
			id_equipo: "prueba-2",
			nombre_equipo: "Equipo 2",
			imagen: "",
			capitan:"Capi 2",
			entrenador: "Coach 2",
		}
	]);

	await db.insert(Jugador).values([
		{
			id: 1,
			nombre_jugador: "lucas",
			curso: "1º Bat",
			pertenece_equipo: 1,

		}
	]);
}
