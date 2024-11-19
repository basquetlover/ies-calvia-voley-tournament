// import { column, defineDb, defineTable } from 'astro:db';

// // // https://astro.build/db/config
// // const User = defineTable({
// // 	columns: {
// // 		id: column.text({primaryKey: true}),
// //     username: column.text({optional: false}),
// //     password: column.text(),
// // 	}
// // });

// // const Session = defineTable({
// // 	columns: {
// // 		id: column.text({primaryKey: true}),
// // 		expiresAt: column.date(),
// // 		userId: column.text({references: () => User.columns.id})
// // 	}
// // });


// // const Equipo = defineTable({
// //   columns: {
// //     id: column.number({ primaryKey: true}),
// //     id_equipo: column.text({ unique: true}),
// //     nombre_equipo: column.text({ unique: true}),
// //     imagen: column.text(),
// //     capitan: column.text(),
// //     entrenador: column.text(),
// //     // admin: column.text(),
// //   }
// // });


// // const Jugador = defineTable({
// //   columns: {
// //     id: column.number({ primaryKey: true}),
// //     pertenece_equipo: column.number({ references: () => Equipo.columns.id }),
// //     nombre_jugador: column.text({ unique: true}),
// //     curso_id: column.number({ references: () => Curso.columns.id }),
// //     // admin: column.text(),
// //   }
// // });

// // const Curso = defineTable({
// //     columns: {
// //       id: column.number({ primaryKey: true}),
// //       label: column.text(),
// //     }
// // });


// export default defineDb({
//   tables: {
//     // User,
//     // Session,
//     // Equipo,
//     // Jugador,
//     // Curso,
//   }
// });

