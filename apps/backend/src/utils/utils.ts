import { Connection, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

export async function getTransactionDetails(
  connection: Connection,
  signature: string,
) {
  const tx = await connection.getParsedTransaction(signature, {
    commitment: "confirmed",
  });
  if (!tx || !tx.meta) return null;

  //@ts-ignore
  const sender = new PublicKey(tx.transaction.message.accountKeys[0].pubkey);
  //@ts-ignore
  const recipient = new PublicKey(tx.transaction.message.accountKeys[1].pubkey);
  const preBalance = tx.meta.preBalances[1];
  const postBalance = tx.meta.postBalances[1];
  //@ts-ignore
  const amount = (postBalance - preBalance) / 1e9;
  //@ts-ignore
  const tokenMint = new PublicKey(tx.transaction.message.accountKeys[2].pubkey);

  return { sender, recipient, amount, tokenMint };
}
