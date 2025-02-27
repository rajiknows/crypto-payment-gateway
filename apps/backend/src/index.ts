import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./workers/swapWorker"; // Start WebSocket listener
import { config } from "./config";
import { Connection, clusterApiUrl } from "@solana/web3.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Solana connection
export const connection = new Connection(
  config.SOLANA_RPC_URL || clusterApiUrl("mainnet-beta"),
  "confirmed",
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Error handling
//@ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
