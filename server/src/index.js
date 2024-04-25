import server from "./server.js";
import sequelize from "./database.js";

sequelize.sync({ force: false }).then(() => {
    console.log('All models were synchronized successfully.');
  
    // Inicia el servidor después de que los modelos se hayan sincronizado
    server.listen(80, () => {
      console.log(`Server on port 80`);
    });
  }).catch(error => {
    console.error('Unable to synchronize the models:', error);
  });