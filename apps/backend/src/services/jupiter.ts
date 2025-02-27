import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { config } from "../config";
import { connection } from "../index";

const { WALLET_SECRET } = config;

export async function swapTokens(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  fromToken: PublicKey,
  toToken: PublicKey,
) {
  const quoteAmount = await getQuoteAmount(fromToken, toToken, amount);
  if (!quoteAmount) throw new Error("Failed to get quote amount");

  const wallet = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(WALLET_SECRET)),
  );

  const senderTokenAccount = await getAssociatedTokenAddress(
    fromToken,
    wallet.publicKey,
  );
  const recipientTokenAccount = await getAssociatedTokenAddress(
    toToken,
    recipient,
  );

  // Perform swap using Jupiter API
  const swapSignature = await executeSwap(fromToken, toToken, amount, wallet);
  if (!swapSignature) throw new Error("Swap transaction failed");

  // After swap, send the received tokens to the recipient
  const sendSignature = await sendTransaction(recipient, quoteAmount, toToken);
  return { swapSignature, sendSignature };
}

export async function getQuoteAmount(
  fromToken: PublicKey,
  toToken: PublicKey,
  amount: number,
) {
  const JUPITER_API_URL = "https://quote-api.jup.ag/v6/quote";
  const params = new URLSearchParams({
    inputMint: fromToken.toBase58(),
    outputMint: toToken.toBase58(),
    amount: amount.toString(),
    slippageBps: "50", // 0.5% slippage
  });

  const response = await fetch(`${JUPITER_API_URL}?${params}`);
  const data = await response.json();
  return data?.outAmount ? Number(data.outAmount) : null;
}

async function executeSwap(
  fromToken: PublicKey,
  toToken: PublicKey,
  amount: number,
  wallet: Keypair,
) {
  const JUPITER_SWAP_URL = "https://quote-api.jup.ag/v6/swap";
  const requestBody = {
    inputMint: fromToken.toBase58(),
    outputMint: toToken.toBase58(),
    amount,
    slippageBps: 50, // 0.5% slippage
    userPublicKey: wallet.publicKey.toBase58(),
  };

  const response = await fetch(JUPITER_SWAP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const swapResult = await response.json();
  if (!swapResult.swapTransaction) return null;

  const swapTransaction = Transaction.from(
    Buffer.from(swapResult.swapTransaction, "base64"),
  );
  swapTransaction.sign(wallet);
  return await sendAndConfirmTransaction(connection, swapTransaction, [wallet]);
}

export async function sendTransaction(
  recipient: PublicKey,
  amount: number,
  tokenMint: PublicKey,
) {
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(WALLET_SECRET)),
  );

  const senderTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    wallet.publicKey,
  );
  const recipientTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    recipient,
  );

  const transaction = new Transaction().add(
    createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      wallet.publicKey,
      amount,
    ),
  );

  return await sendAndConfirmTransaction(connection, transaction, [wallet]);
}
