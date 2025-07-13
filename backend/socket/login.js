const comparePassword = require('../utility/comparePassword');
const connectionPool = require('./../config/connection');
const jwt = require('jsonwebtoken');

const loginHandler = async (user, socket, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const { username, password } = user;

    const res = {
        error: false,
        message: [],
        token: '',
        user : null
    };

    const emptyEntries = Object.entries({ username, password })
        .filter(([_, value]) => value === '' || value === undefined)
        .map(([key]) => key);

    if (emptyEntries.length > 0) {


        res.message.push(`${emptyEntries.join(', ')} should not be empty`);

        return callback(res);

    }

    // ✅ Do NOT take `callback` inside the query function
    connectionPool.query(query, [username], async (error, results) => {


        if (error) {
            console.error('Query error:', error);
            res.error = true;
            res.message.push('Internal Server Error please try again later');
            return callback(res); // ✅ Use the correct callback here
        }

        if (!results || results.length === 0) {
            res.message.push('Username not found, Signup first');
            return callback(res); // ✅ Use the correct callback here
        }

        const dbUser = results[0];

        try {
            const isMatch = await comparePassword(password, dbUser.password);

            if (isMatch) {
                const token = jwt.sign({ ...dbUser }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });

                res.token = token;
                res.isLoggedIn = true;
                res.message.push('Logged in successfully');
                res.user = dbUser
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
    });
};


module.exports = loginHandler;