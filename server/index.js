import express from 'express'
import env from 'dotenv'
import dbConnection from './utils/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import cors from 'cors';

env.config();
const app = express();
const PORT = process.env.PORT || 5000;


//Middlewares

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
