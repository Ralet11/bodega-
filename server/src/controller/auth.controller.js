import getConnection from "../database.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const registerClient = async (req, res) => {
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

const loginClient = async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log(email, password)

        if (email == undefined || password == undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const connection = await getConnection();

        const result = await connection.query("SELECT * FROM clients WHERE email = ?", email);
        console.log(result)

        if (result == 0 || !(await bcrypt.compare(password, result[0].password))) {
            const response = {
                error: true,
                data: {
                    message: 'Incorrect user or password'
                }
            }
            res.json(response);

        } else {

            const payMethod = JSON.parse(result[0].pay_methods)
            console.log(payMethod, "pay method")
            const id = result[0].id;
            console.log(id)
            const client = {
                name: result[0].name,
                address: result[0].adress,
                payMethod: payMethod,
                id: result[0].id
            }

            const locals = await connection.query("SELECT * FROM local WHERE local.clients_id = ?", id)
           
            const token = jwt.sign({ clientId: id }, "secret_key", { expiresIn: "1h" });

            console.log(client, "cliente")

            const response = {
                error: false,
                data: {
                    token: token,
                    client: client,
                    locals: locals
                }
            }
        
            res.json(response)
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const logout = (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: "JWT Clear" });
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body.clientData;
        console.log(name, email, password, phone)

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name,
            email,
            password: hashedPassword,
            phone
        }

        const connection = await getConnection();
        await connection.query("INSERT INTO users SET ?", data);

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
        console.log(error.message)
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body.clientData;
        console.log(email, password)

        if (email == undefined || password == undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const connection = await getConnection();

        const result = await connection.query("SELECT * FROM users WHERE email = ?", email);
        console.log(result)

        if (result == 0 || !(await bcrypt.compare(password, result[0].password))) {
            const response = {
                error: true,
                data: {
                    message: 'Incorrect user or password'
                }
            }
            res.json(response);

        } else {
            const id = result[0].id;
            console.log(id)
            const client = {
                name: result[0].name,
                email: result[0].email,
                phone: result[0].phone,
                birthDate: result[0].birthDate

            }
           
            const token = jwt.sign({ clientId: id }, "secret_key", { expiresIn: "1h" });

            const response = {
                error: false,
                data: {
                    token: token,
                    client: client,
                    
                }
            }
        
            res.json(response)
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


export const methods = {
    registerClient,
    loginClient,
    logout,
    registerUser,
    loginUser

}