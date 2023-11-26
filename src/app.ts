import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes"; 
import adminRoutes from "./routes/adminRoutes";

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes)

export default app;
