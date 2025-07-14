const connectionPool = require("../config/connection");
const verifyToken = require("../utility/verifyToken");

const getUserHandler = async (data, socket) => {
    const { token } = data;

    try {
        const decoded = verifyToken(token); 

        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users`;

            connectionPool.query(query, (err, results) => {
                if (err) {
                    console.error("DB Error:", err);
                    return resolve(null); 
                }
                return resolve(results); 
            });
        });

    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null; 
    }
};

module.exports = getUserHandler;
