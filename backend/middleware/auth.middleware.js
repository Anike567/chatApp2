const verifyToken = require("../utility/verifyToken");

const authMiddleware = (socket, next)=>{
    const token = socket.handshake.auth.token;

    if(!token){
        const payload = {error : true, message : "Token missing"}
        
        return next(new Error("Token missing"))
    }
    const verifiedToken = verifyToken(token);

    if(!verifiedToken){
        const payload = {error : true, message : "Token expires or Invalid"};
        
        return next(new Error("Token expire or Invalid"));
    }

    next();
}

module.exports = authMiddleware;