import { Connection, PublicKey } from "@solana/web3.js";
import { getTransactionDetails } from "../utils/utils";
import { swapTokens } from "../services/jupiter";
import { sendTransaction } from "../services/jupiter";
import { recordPayment, updatePaymentStatus } from "../services/merchant";
import dotenv from "dotenv";
import { decodeMemo } from "../utils/memoParser";
import { prisma } from "@repo/db";
import { config } from "../config";

dotenv.config();

const { SOLANA_RPC_URL, USDC_TOKEN_MINT } = config;
const USDC_TOKEN_ADDRESS = new PublicKey(USDC_TOKEN_MINT);
// const MERCHANT_WALLET = new PublicKey(process.env.MERCHANT_WALLET!);
// const {USDC_MINT_ADDRESS }= new PublicKey(process.env.USDC_MINT_ADDRESS!);

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

    // Record payment in database
    try {
      // Find user by wallet address
      const user = await prisma.user.findFirst({
        where: { wallet: sender.toBase58() },
      });

      if (user) {
        await recordPayment(
          {
            merchantAddress: merchantAddr,
            amount,
            token: tokenMint.toBase58(),
            txHash: signature,
            status: "pending",
          },
          user.id,
        );
      } else {
        console.log(`No user found for wallet ${sender.toBase58()}`);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
    }

    if (tokenMint.equals(USDC_TOKEN_ADDRESS)) {
      console.log(`Token is already USDC. Sending directly to merchant.`);
      await sendTransaction(
        recipient,
        new PublicKey(merchantAddr),
        amount,
        tokenMint,
      );
      await updatePaymentStatus(signature, "completed");
    } else {
      console.log(`Swapping ${amount} to USDC.`);
      await swapTokens(
        sender,
        recipient,
        amount,
        tokenMint,
        USDC_TOKEN_ADDRESS,
        signature,
      );

      // Send the swapped USDC to merchant
      await sendTransaction(
        recipient,
        new PublicKey(merchantAddr),
        amount, // Note: actual amount might be different after swap
        USDC_TOKEN_ADDRESS,
        signature,
      );

      console.log("Swap complete, USDC sent to merchant.");
    }
  } catch (error) {
    console.error("Error handling transaction:", error);
    try {
      await updatePaymentStatus(signature, "failed");
    } catch (dbError) {
      console.error("Error updating payment status:", dbError);
    }
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
