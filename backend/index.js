const express = require('express');

const app = express();


app.get("/",(req,res)=>{
    res.end("Hello  from backend");
});


app.listen(3000,()=>{
    console.log("server is up and running on port 3000");
});


