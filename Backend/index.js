import express from 'express';
import dotenv from 'dotenv';
import dbconn from './dbConnect/dbConnection.js';
import cors from 'cors';
import user from "./routes/userRoutes.js";
import text from "./routes/textRoutes.js";
// import socketio from 'socket.io';

const port = 4000 || process.env.PORT;
const app = express();
 
dotenv.config(); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
app.use("/api/v1/auth", user);
app.use("/api/v1/textarea", text);

// const server = app.listen(port, () => { dbconn(); console.log("Connected to DB"); console.log(`Server running on port ${port}`);});     

import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000, 
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected');
});

server.listen(port, () => { 
    dbconn();
    console.log("Connected to DB");
    console.log(`Server running on port ${port}`);
}); 