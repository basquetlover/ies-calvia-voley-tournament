import { column, defineDb, defineTable } from 'astro:db';

// https://astro.build/db/config
// const User = defineTable({
//   columns: {
//     id: column.number({ primaryKey: true}),
//     username: column.text({ unique: true}),
//     password: column.text(),
//     rango: column.text(),


//   }
 
// })


// const Equipo = defineTable({
//   columns: {
//     id: column.number({ primaryKey: true}),
//     id_equipo: column.text({ unique: true}),
//     nombre_equipo: column.text({ unique: true}),
//     imagen: column.text(),
//     capitan: column.text(),
//     entrenador: column.text(),
//     // admin: column.text(),
//   }
// })


// const Jugador = defineTable({
//   columns: {
//     id: column.number({ primaryKey: true}),
//     pertenece_equipo: column.number({ references: () => Equipo.columns.id }),
//     nombre_jugador: column.text({ unique: true}),
//     curso: column.text(),
//     // admin: column.text(),
//   }
// })


export default defineDb({
  tables: {
    // User,
    // Equipo,
    // Jugador,
  }
});

