import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import clientRouter from './routes/clientRouter.js';
import commonRouter from './routes/commonRouter.js';
import itemRouter from './routes/itemRouter.js';
import estimateRouter from './routes/estimateRouter.js';
import settingRouter from './routes/settingRouter.js'
import { fileURLToPath } from 'url';
import createUploadDir from './helpers/utililty.js';
import path from 'path';
import fs from 'fs';
import connection from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB

await connection();

//__dirname
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


// Ensure uploads directory exists
// TODO : Move this code to controller to uplaod file
createUploadDir();

// Use cors middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parses JSON data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... your API routes
app.use('/api/clients', clientRouter);
app.use('/api/countries', commonRouter);
app.use('/api/items', itemRouter);
app.use('/api/estimate', estimateRouter);
app.use('/api/settings',settingRouter);
app.use('/api/files', commonRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
