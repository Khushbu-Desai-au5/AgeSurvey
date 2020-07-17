const express = require("express")
const app = express()
const router = require("./routes/routes.js")
const mongoose = require('mongoose')
require("dotenv").config();
var hbs = require("hbs")
app.set("view engine", "hbs")

const mongoDbUrl = process.env.mongoDbUrl


mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDb connected succcesfully");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/", router)

app.listen(process.env.PORT || 3000);