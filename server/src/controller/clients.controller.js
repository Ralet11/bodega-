import getConnection from '../database.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const  getAllClients = async (req, res) => {
    try {
        const query = "SELECT c.* FROM clients c LEFT JOIN local l ON l.clients_id = c.id"

        const connection = await getConnection()

        const result = await connection.query(query);
        res.json(result[0]);

        } catch (error) {
            res.status(500);
            res.send(error.message)
        }
}


export const addClient = async (req, res) => {
    try {
        const { name, email, password, adress, phone } = req.body;
        
        if (!name || !email || !password || !adress || !phone) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name,
            email,
            password: hashedPassword,
            adress,
            phone
        }

        const connection = await getConnection();
        await connection.query("INSERT INTO clients SET ?", data);

        const response = {
            error: false,
            data: {
                result: data,
                message: "Client added successfully"
            }
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}


export const getClientById = async (req, res) => {
    try {
        const clientId = req.params.id; 
        if (!clientId) {
            return res.status(400).json({ message: "Bad Request. Please provide a valid client ID." });
        }

        const query = "SELECT * FROM clients WHERE id = ?"; 

        const connection = await getConnection();
        const [rows, fields] = await connection.execute(query, [clientId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Client not found." });
        }

        const client = rows[0]; 

        res.json(client);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

export const login = async (req, res)=> {

    try {
        
        const { email, password } = req.body;


        if(email == undefined || password == undefined) {
           return res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM clients WHERE email = ?", email);
        

        if(result == 0 || ! (await bcrypt.compare(password, result[0][0].password))) {
            const response = {
                error: true,
                data: {
                    message: 'Incorrect user or password'
                }
            }
            res.json(response);
        } else {
            const id = result[0].id;
            const token = jwt.sign({id:id}, "secret_key");

            const cookiesOptions = {
                expires: new Date(Date.now()+90 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('jwt', token, cookiesOptions)

            const response = {
                error: false,
                data: {
                    token: token
                }
            }
            res.json(response)
        } 

    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
};


export const logout = (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: "JWT Clear" });
}
