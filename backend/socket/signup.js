const messages = require('../entity/messageStore');
const { AppDataSource } = require('./../config/data-source');
const UserSchema = require('./../entity/User'); 
const hashPassword = require('./../utility/hashPassword');

const signupHandler = async (data, cb) => {

    console.log(data);
    let { name, username, email, contact, password } = data;

    const emptyEntries = Object.entries({ name, username, email, contact, password })
        .filter(([_, value]) => value === '' || value === undefined)
        .map(([key]) => key);

    if (emptyEntries.length > 0) {
        const message = `${emptyEntries.join(', ')} should not be empty`;
        cb({error : true, 'message' : message});

        return;
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

        // await userRepository.save(newUser);
        cb({error : false, message : 'Signup successful'})
        return;
    } catch (error) {
        console.log(error);
        cb({error : true, message : "Internal Server error occured"});
    }
};

module.exports = signupHandler;