const comparePassword = require('../utility/comparePassword');
const connectionPool = require('./../config/connection');
const jwt = require('jsonwebtoken');

const loginHandler = async (user, socket) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const { username, password } = user;

    const emptyEntries = Object.entries({ username, password })
        .filter(([_, value]) => value === '' || value === undefined)
        .map(([key]) => key);

    if (emptyEntries.length > 0) {
        return socket.emit('loginMessageEvent', {
            message: `${emptyEntries.join(', ')} should not be empty`
        });
    }

    connectionPool.query(query, [username], async (error, results) => {
        if (error) {
            console.error('Query error:', error);
            return socket.emit('loginErrorEvent', {
                error: 'Internal Server Error',
            });
        }

        if (!results || results.length === 0) {
            return socket.emit('loginMessageEvent', {
                message: 'Username not found, please sign up',
            });
        }

        const dbUser = results[0];

        try {
            const isMatch = await comparePassword(password, dbUser.password);

            if (isMatch) {
                const token = jwt.sign({...dbUser},process.env.JWT_SECRET,{
                    expiresIn : '1h'
                });
                
                return socket.emit('loginSuccessEvent', {
                    message: {
                        loggedIn: true,
                        signedToken:token,
                        user: dbUser,
                    }
                });
            } else {
                return socket.emit('loginMessageEvent', {
                    message: 'Incorrect password',
                });
            }
        } catch (err) {
            console.error('Password comparison error:', err);
            return socket.emit('loginErrorEvent', {
                error: 'Internal Server Error',
            });
        }
    });
};

module.exports = loginHandler;
