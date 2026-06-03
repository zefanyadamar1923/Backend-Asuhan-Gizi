import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes";
import { setupSwagger } from "./swagger";

dotenv.config();

const app: Application = express();

// ✅ FIX: Konversi ke number dengan fallback 3000
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

// Setup Swagger UI
setupSwagger(app, PORT);

app.get("/", (req: Request, res: Response) => {
  res.send("API Asuhan Gizi Anak is Running...");
});

// ✅ FIX: Tambahkan '0.0.0.0' agar bisa diakses dari container Nginx
app.listen(PORT, () => {
  console.log(`API is Running...`);
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
