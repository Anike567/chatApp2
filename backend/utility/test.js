require("dotenv").config();
setTimeout(()=>{
    const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
console.log("SECRET:", secret);

const token = jwt.sign({ foo: "bar" }, secret);
console.log("TOKEN:", token);

const decoded = jwt.verify(token, secret);
console.log("DECODED:", decoded);

},3000)