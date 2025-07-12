const hashPassword = require('../utility/hashPassword');
const connectionPool = require('./../config/connection');

const signupHandler = async (data, socket) => {
    let { name, username, email, contact, password } = data;

    const emptyEntries = Object.entries({ name, username, email, contact, password })
        .filter(([_, value]) => value === '' || value === undefined)
        .map(([key]) => key);

    if (emptyEntries.length > 0) {
        const message = `${emptyEntries.join(', ')} should not be empty`;
        return socket.emit('signupMessageEvent', { message });
    }


    try {
        password = await hashPassword(password);
    } catch (error) {
        console.log(error);
        return socket.emit('signupErrorEvent', { error: 'Signup failed' });
    }


    const query = `
    INSERT INTO users (_id, name, username, email, contact, password, created_at)
    VALUES (UUID(), ?, ?, ?, ?, ?, NOW())
  `;

    const values = [name, username, email, contact, password];


    connectionPool.query(query, values, (err, results) => {
        if (err) {
            console.error('Signup query error:', err);
            return socket.emit('signupErrorEvent', { error: 'Signup failed' });
        }

        socket.emit('signupSuccessEvent', { message: 'Signup successful' });
    });

};




module.exports = signupHandler;