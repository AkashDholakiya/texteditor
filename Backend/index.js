import express from 'express';
import dotenv from 'dotenv';
import dbconn from './dbConnect/dbConnection.js';
import cors from 'cors';
import user from "./routes/userRoutes.js";
import text from "./routes/textRoutes.js"; 
import textarea from './models/textarea.js';
import http from 'http';
import { Server } from 'socket.io';

const port = 4000 || process.env.PORT;
const app = express();
 
dotenv.config(); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
app.use("/api/v1/auth", user);
app.use("/api/v1/textarea", text);


app.get('/', (req, res) => {
    res.send('Welcome to TextEditor API');
});


const server = http.createServer(app);

const io = new Server(server, {
    pingTimeout: 60000, 
    cors: {
        origin: 'https://texteditor-frontend.vercel.app',
    }
});

io.on('connection', (socket) => {

    socket.on('updateData', async (data) => {

        socket.broadcast.emit('updateData', data);
        const { title, content,id } = data;
        try {
            const text = await textarea.findByIdAndUpdate(id, {title:title, content:content, updatedAt: new Date().toISOString() } ,{new:true});   
        } catch (error) { 
            console.log(error);
        }
    });

});

server.listen(port, () => { 
    dbconn();
    console.log("Connected to DB");
    console.log(`Server running on port ${port}`);
}); 