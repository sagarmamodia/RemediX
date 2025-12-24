import express from "express";
import cors from "cors";
import { config } from "./src/config/index.config";
import authRoutes from "./src/routes/auth.routes";


const app = express();

app.use(cors({
    origin: "",
    credentials: config.cors.credentials,
}))

app.get("/health", (req, res) => {
    res.json({success: true, data: {}})
})

export default app;