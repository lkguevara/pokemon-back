const server = require('./src/app.js');
const { conn } = require('./src/db.js');

const getAllTypes = require("./src/controllers/types"); // con esto nos evitamos hacer un get de types cada vez que entregmos al navegador para que la tabla de relaciones se actualice y cree las relaciones
const port = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(process.env.PORT, async () => {
    console.log(`server listening in port ${port}`); // eslint-disable-line no-console
  });
});
