import express from "express"
import dotenv from "dotenv"
import db from "./config/db.js"
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js"
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const app = express();

// Allow all origins
app.use(cors());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) // url encoded

// Serve static files from the 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", userRoutes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
