const { AppDataSource } = require('./../config/data-source');
const UserSchema = require('./../entity/User'); 
const hashPassword = require('./../utility/hashPassword');

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

        const userRepository = AppDataSource.getRepository("User");

        const newUser = {
            _id: crypto.randomUUID(),
            name,
            username,
            email,
            contact,
            password,
        };

        await userRepository.save(newUser);

        socket.emit('signupSuccessEvent', { message: 'Signup successful' });
    } catch (error) {
        console.log(error);
        socket.emit('signupErrorEvent', { error: 'Signup failed' });
    }
};

module.exports = signupHandler;