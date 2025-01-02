const connect_DB = require("./Config/connect_DB");
const notFound = require("./Middleware/notFound.js");
const userRoutes = require("./Routes/userRoute.js");
const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {app, server} = require("./socket/index.js");
// const app = express();
env.config();

const port = process.env.PORT || 3000;

app.use(express.static("dist"));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const start = async () => {
    try {
        server.listen(port, console.log(`server is running on Port ${port}`))
        await connect_DB();
    } catch (error) {
        console.log("Something went wrong", error);
    }
}

start();

app.get("/", (req, res) => res.send(`<center>Server is Listen on PORT ${port}</center>`))
app.use("/api", userRoutes)
app.use(notFound);