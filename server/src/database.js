import mysql from "promise-mysql";

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'app_base',
  user: 'root',
  password: 'lucsakser'
});

const getConnection = () => {
  return connection;
}

export default getConnection;
