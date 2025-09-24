const connectionPool = require("../config/connection");
const verifyToken = require("../utility/verifyToken");
const jwt = require('jsonwebtoken');
const User = require('../entity/User');
const { AppDataSource } = require('./../config/data-source');

const getUserHandler = async (data) => {
    const { token } = data;
    const verifiedToken = verifyToken(token);

    if (verifiedToken) {
        try {
            const userRepository = AppDataSource.getRepository("User");

            const users = await userRepository.find();
            return users;

        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
    else{
        return null;
    }

};

module.exports = getUserHandler;
