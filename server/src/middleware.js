import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
   
    const authHeader = req.headers.authorization;

    console.log(authHeader, "hed")
   

    if (!authHeader) {
  
        return res.status(401).send({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
  
    try {
        const decoded = jwt.verify(token, "secret_key");
        
        req.user = decoded;
        console.log(req.user)
     
        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

export const methods = {
    auth
};