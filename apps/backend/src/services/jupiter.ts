import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { config } from "../config.js";
import { connection } from "../index.js";
import { prisma } from "@repo/db";
import axios from "axios";

const { WALLET_SECRET } = config;

// Create wallet keypair from secret
const wallet = Keypair.fromSecretKey(Buffer.from(JSON.parse(WALLET_SECRET)));

export async function swapTokens(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  fromToken: PublicKey,
  toToken: PublicKey,
  txHash?: string,
) {
  const { createTransferInstruction, getAssociatedTokenAddress } = await import(
    "@solana/spl-token"
  );
  try {
    console.log(
      `Swapping ${amount} of ${fromToken.toBase58()} to ${toToken.toBase58()}`,
    );

    // Update payment status to swapping
    if (txHash) {
      await prisma.payment.update({
        where: { txHash },
        data: {
          status: "swapped",
          updatedAt: new Date(),
        },
      });
    }

    // 1. Get quote from Jupiter API
    const quoteResponse = await axios.get("https://quote-api.jup.ag/v6/quote", {
      params: {
        inputMint: fromToken.toBase58(),
        outputMint: toToken.toBase58(),
        amount: amount * 1e6, // Assuming 6 decimals - adjust based on token
        slippageBps: 50, // 0.5% slippage
      },
    });

    const { data: quoteData } = quoteResponse;

    // 2. Get serialized transactions
    const { data: swapData } = await axios.post(
      "https://quote-api.jup.ag/v6/swap",
      {
        quoteResponse: quoteData,
        userPublicKey: wallet.publicKey.toBase58(),
        destinationTokenAccount: recipient.toBase58(),
      },
    );

    // 3. Execute the transaction
    const swapTransaction = swapData.swapTransaction;
    const txid = await connection.sendRawTransaction(
      Buffer.from(swapTransaction, "base64"),
    );

    await connection.confirmTransaction(
      {
        signature: txid,
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash())
          .lastValidBlockHeight,
      },
      "confirmed",
    );

    console.log("Swap completed successfully:", txid);

    // Update payment record if txHash is provided
    if (txHash) {
      await prisma.payment.update({
        where: { txHash },
        data: {
          status: "completed",
          updatedAt: new Date(),
        },
      });
    }

    return txid;
  } catch (error) {
    console.error("Error swapping tokens:", error);

    // Update payment record as failed if txHash is provided
    if (txHash) {
      await prisma.payment.update({
        where: { txHash },
        data: {
          status: "failed",
          updatedAt: new Date(),
        },
      });
    }

    throw error;
  }
}

export async function sendTransaction(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  tokenMint: PublicKey,
  txHash?: string,
) {
  const { createTransferInstruction, getAssociatedTokenAddress } = await import(
    "@solana/spl-token"
  );
  try {
    // Get token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      sender,
    );

    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      recipient,
    );

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      sender,
      Math.round(amount * 1e6), // assuming 6 decimals for USDC, ensure it's an integer
    );

    // Create and sign transaction
    const transaction = new Transaction().add(transferInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      wallet,
    ]);

    console.log(`Transaction sent: ${signature}`);

    // Update payment record if txHash is provided
    if (txHash) {
      await prisma.payment.update({
        where: { txHash },
        data: {
          status: "completed",
          updatedAt: new Date(),
        },
      });
    }

    return signature;
  } catch (error) {
    console.error("Error sending transaction:", error);

    // Update payment record as failed if txHash is provided
    if (txHash) {
      await prisma.payment.update({
        where: { txHash },
        data: {
          status: "failed",
          updatedAt: new Date(),
        },
      });
    }

    throw error;
  }
}
