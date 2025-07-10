const express = require('express');


const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const response = await fetch('https://randomuser.me/api/?results=50');
        const users = await response.json();


        res.json({
            status: true,
            message: {
                users: users.results
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

module.exports = userRouter;
