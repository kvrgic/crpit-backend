const jwt = require('jsonwebtoken');

{/** 
Middleware za provjeru JWT tokena iz kolačića (cookies).
Ako je token validan, postavlja `userId` i `role` na `req` objekt. */}

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        //Alternativa: dohvat tokena iz Authorization headera
        //const token = req.headers.authorization?.split(' ')[1]; // Bearer token
        if(!token) {
            return res.status(401).send({message: "Token nije dostavljen"})
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded.userId) {
            return res.status(401).send({message: "Dostavljen je nevažeći token"})
        }

        // Dodavanje korisničkog ID-a i uloge u request objekat za dalje korištenje
        req.userId = decoded.userId;
        req.role = decoded.role;

        next();
        
    } catch (error) {
        console.error("Error verify token", error);
        res.status(401).send({message: "Neispravan token!"})
    }
}

module.exports = verifyToken
