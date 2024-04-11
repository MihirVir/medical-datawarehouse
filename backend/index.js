// importing libraries
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path")
const app = express();
const multer = require("multer")
const mainRoute = require("./routes/index");
const dashboardRoutes = require("./routes/dashboard");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "40mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "40mb", extended: true }));
app.use("/api/v1/setup", mainRoute);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use(express.static(path.join(__dirname, "uploads")));

const start = async () => {
    try {
        app.listen(port, async () => {
            console.log("=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_")
            console.log(`Backend service is up and running ${port}`)
        });
    } catch (err) {
        console.log("Error connecting to redis or server has some issue running up")
        throw new Error("Something wrong with server");
    }
}

start();

