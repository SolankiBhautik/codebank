import express from "express";
import cors from "cors";
import snippets from './routs/snippets.js';
import auth from './routs/auth.js';
import './db/connection.js'
// import './controllers/ElasticWatch.js'
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

app.use("/snippets", snippets);
app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port);
