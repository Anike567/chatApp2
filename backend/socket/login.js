const comparePassword = require('../utility/comparePassword');
const { AppDataSource } = require('../config/data-source.js');
const jwt = require('jsonwebtoken');
const User = require('../entity/User');

const loginHandler = async (userInput, socket, callback) => {
    const { username, password } = userInput;

    const res = {
        error: false,
        message: [],
        token: '',
        user: null,
    };

    const emptyEntries = Object.entries({ username, password })
        .filter(([_, value]) => value === '' || value === undefined)
        .map(([key]) => key);

    if (emptyEntries.length > 0) {
        res.message.push(`${emptyEntries.join(', ')} should not be empty`);
        return callback(res);
    }

    try {
        const userRepository = AppDataSource.getRepository("User"); 

        const dbUser = await userRepository.findOne({ where: { username } });

        if (!dbUser) {
            res.message.push('Username not found, Signup first');
            return callback(res);
        }

        const isMatch = await comparePassword(password, dbUser.password);

        if (isMatch) {
            const token = jwt.sign({ id: dbUser._id, username: dbUser.username }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.token = token;
            res.isLoggedIn = true;
            res.message.push('Logged in successfully');
            res.user = dbUser;
            return callback(res);
        } else {
            res.message.push('Incorrect password');
            return callback(res);
        }
    } catch (err) {
        console.error('Password comparison error:', err);
        res.error = true;
        res.message.push('Internal Server Error');
        return callback(res);
    }
};

module.exports = loginHandler;
