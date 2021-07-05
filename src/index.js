const express = require("express");
const app = express();
const port = 5555;
const database = require("./config/db.js");
const bodyparser = require("body-parser");
const bcrypt = require("bcryptjs")
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("./routes/auth/auth")
const user = require("./routes/user/user")
const todos = require("./routes/todos/todos")
const test = require("./middleware/auth")
const { json } = require("body-parser");


app.use(bodyparser.urlencoded({ extended: true}))
app.use("/", auth)
app.use("/user", user)
app.use("/todo", todos)

app.listen(port, () => {
    console.log(`Run at http://localhost:${port}`);
});