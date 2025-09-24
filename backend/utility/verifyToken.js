const jwt = require('jsonwebtoken');


const verifyToken = (token) => {

    const secretKey = process.env.JWT_SECRET
    try {
        
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error("Invalid token:", error.message);
        return null;
    }

};

module.exports = verifyToken;
