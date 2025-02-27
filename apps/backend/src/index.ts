import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRoutes from "./routes/tokenRoutes";
import "./workers/swapWorker"; // Start WebSocket listener

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/tokens", tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
