const express = require('express');


const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/users');
        

        res.json({
            status: true,
            message: {
                users: response.data.results
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
