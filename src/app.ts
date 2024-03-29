import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes"; 
import adminRoutes from "./routes/adminRoutes";
import tutorRoutes from "./routes/tutorRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv"
import errorHandler from "./middlewares/globalErrorHandler";
import { createServer } from "http";
import { io } from "./services/socketIoService";
dotenv.config();

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const httpServer = createServer(app);
io.attach(httpServer);

app.use(cookieParser());
// app.use(bodyParser.json())
app.use(express.json({ limit: "10mb" }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/user',userRoutes)

app.use(errorHandler)

export { httpServer };
