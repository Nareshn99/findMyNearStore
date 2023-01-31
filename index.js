const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/Route/router");
const app = express();
require("dotenv").config()

app.use(express.json())

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})
    .then(() => console.log("mongoDB is connected"))
    .catch((err) => console.log(err.message))



app.use("/", route)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express is Running on port ${PORT}`)
})