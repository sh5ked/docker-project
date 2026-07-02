const dns = require('node:dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const path = require('path');
require('dotenv').config();

const userRoutes = require("./routes/users");
const { default: mongoose } = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    "http://127.0.0.1:5501",
    "http://localhost:3000",
    process.env.RENDER_EXTERNAL_URL
].filter(Boolean)

app.use(express.json());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error("Not allowed by CORS policies"))
            }
        },
    })
);
connectDB();

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET, is not defined in enviroment varaiables");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send('Welcome to our users managment app.');
})

app.get("/health", (req, res) => {
    const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
    const dbConnected = mongoose.connection.readyState === 1;

    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? "ok" : "error",
        db: dbStates[mongoose.connection.readyState],
        runtime: `${Math.floor(process.uptime())}s`,
        environment: process.env.NODE_ENV || "development"
    })
});

app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);


});
