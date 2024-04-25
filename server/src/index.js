import server from "./server.js";
import sequelize from "./database.js";

sequelize.sync({ force: false }).then(() => {
    console.log('All models were synchronized successfully.');
  
    // Inicia el servidor después de que los modelos se hayan sincronizado
    server.listen(3000, () => {
      console.log(`Server on port 3000`);
    });
  }).catch(error => {
    console.error('Unable to synchronize the models:', error);
  });