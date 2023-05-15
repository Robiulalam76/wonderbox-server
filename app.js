const express = require("express");
const app = express();
const cors = require("cors")


// middleware
app.use(cors());
app.use(express.json())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));



// require routes
const userRoutes = require("./modules/user/userRoutes");


// api routes
app.use("/api/user", userRoutes);







app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ message: err.message });
});


app.get("/", (req, res) => {
    res.send("App works properly!");
});



// app export
module.exports = app





