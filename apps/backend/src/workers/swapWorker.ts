import { Connection, PublicKey } from "@solana/web3.js";
import { getTransactionDetails } from "../utils/utils";
import { swapTokens } from "../services/jupiter";
import dotenv from "dotenv";
import { decodeMemo } from "../utils/memoParser";
import { sendTransaction } from "../services/jupiter";

dotenv.config();

const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const USDC_MINT_ADDRESS = new PublicKey(process.env.USDC_MINT_ADDRESS!);

const connection = new Connection(SOLANA_RPC_URL, "confirmed");

async function handleTransaction(signature: string) {
  try {
    const txDetails = await getTransactionDetails(connection, signature);
    if (!txDetails) return console.log(`Transaction ${signature} not found.`);

    const { sender, recipient, amount, tokenMint } = txDetails;

    // Fetch transaction and extract memo
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    const merchantAddr = decodeMemo(transaction);
    if (!merchantAddr)
      return console.error("No merchant address found in memo!");

    console.log(
      `Received ${amount} of ${tokenMint.toBase58()} from ${sender.toBase58()} for merchant ${merchantAddr}`,
    );

    if (tokenMint.equals(USDC_MINT_ADDRESS)) {
      console.log(`Token is already USDC. Sending directly to merchant.`);
      await sendTransaction(new PublicKey(merchantAddr), amount, tokenMint);
    } else {
      console.log(`Swapping ${amount} to USDC.`);
      await swapTokens(sender, recipient, amount, tokenMint, USDC_MINT_ADDRESS);
      console.log("Swap complete, USDC sent to merchant.");
    }
  } catch (error) {
    console.error("Error handling transaction:", error);
  }
}

connection.onLogs(
  "all",
  (logs, ctx) => {
    if (logs.err) return;
    const txSignature = logs.signature;
    console.log("New transaction detected:", txSignature);
    handleTransaction(txSignature);
  },
  "confirmed",
);

console.log("Listening for transactions...");
