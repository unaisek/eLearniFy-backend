import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;
