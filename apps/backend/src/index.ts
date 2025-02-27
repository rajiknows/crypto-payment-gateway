import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRoutes from "./routes/tokenRoutes";
import "./workers/swapWorker"; // Start WebSocket listener
import { config } from "./config";
import { Connection } from "@solana/web3.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const { SOLANA_MAINNET } = config;

// make a conenction and export it , like a singleton
export const connection = new Connection(SOLANA_MAINNET, "confirmed");

app.use(cors());
app.use(express.json());

app.use("/tokens", tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
