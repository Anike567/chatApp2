const verifyToken = require("../utility/verifyToken");

const getUserHandler = async (data, socket) => {
    const { token } = data;
    const isTokenValid = verifyToken(token);

    if (isTokenValid) {
        try {

            const response = await fetch('https://randomuser.me/api/?results=50');
            const users = await response.json();
            return users.results;
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }



}

module.exports = getUserHandler;