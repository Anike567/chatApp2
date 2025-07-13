const connectionPool = require("../config/connection");
const verifyToken = require("../utility/verifyToken");

const getUserHandler = async (data, socket) => {
    const { token } = data;

    try {
        const decoded = verifyToken(token); // should return user info or throw error

        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users`;

            connectionPool.query(query, (err, results) => {
                if (err) {
                    console.error("DB Error:", err);
                    return resolve(null); // Return null so caller knows token is valid but DB failed
                }
                return resolve(results); // Return list of users
            });
        });

    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null; // Invalid token, return null to trigger tokenExpiredEvent
    }
};

module.exports = getUserHandler;
