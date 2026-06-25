const dns = require('node:dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
require('dotenv').config();

const userRoutes = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5501"
}));
connectDB();

app.get("/", (req, res) => {
    res.send('Welcome to our users managment app.');
})

app.use("/api/users", userRoutes);
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
    
});
