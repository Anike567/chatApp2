const bcrypt = require('bcrypt');

const comparePassword = (plainPassword, hashedPassword) => {

    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result); 
        });
    });
};

module.exports = comparePassword;
