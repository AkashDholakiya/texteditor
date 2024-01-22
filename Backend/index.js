import express from 'express';
import dotenv from 'dotenv';
import dbconn from './dbConnect/dbConnection.js';
import cors from 'cors';
import user from "./routes/userRoutes.js";

const port = 4000 || process.env.PORT;
const app = express();

dotenv.config(); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
app.use("/api/v1/auth", user);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    dbconn(); // Connect to DB
    console.log("Connected to DB");
    console.log(`Server running on port ${port}`);
});     