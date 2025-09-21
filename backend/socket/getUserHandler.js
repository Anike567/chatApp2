const connectionPool = require("../config/connection");
const verifyToken = require("../utility/verifyToken");
const jwt = require('jsonwebtoken');
const User = require('../entity/User');
const { AppDataSource } = require('./../config/data-source');

const getUserHandler = async (data, socket) => {
    const { token } = data;


    try {
        const userRepository = AppDataSource.getRepository("User");

        const users = await userRepository.find();
        return users;

    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null;
    }
};

module.exports = getUserHandler;
