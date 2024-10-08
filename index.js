import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import connection from './db/connectingDB.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
// const corsOptions = {
//   origin: ['https://auth-project-770fb.web.app'],
//   credentials: true, // Enable sending cookies with requests
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // List the methods you're using// Include any custom headers
// };

// middlewares
app.use(
  cors({
    origin: [
      'https://auth-project-770fb.web.app',
      'http://localhost:5173',
      'https://auth-project-770fb.firebaseapp.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connection();
});
