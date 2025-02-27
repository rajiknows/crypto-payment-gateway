import { PublicKey } from "@solana/web3.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
import { prisma } from "@repo/db";

export interface MerchantPayment {
  merchantAddress: string;
  amount: number;
  token: string;
  txHash: string;
  status: string;
}

export async function recordPayment(
  payment: MerchantPayment,
  userId: number,
): Promise<void> {
  try {
    await prisma.payment.create({
      data: {
        userId,
        txHash: payment.txHash,
        amount: payment.amount.toString(),
        token: payment.token,
        status: payment.status,
        merchantAddr: payment.merchantAddress,
      },
    });
    console.log(`Payment recorded: ${payment.txHash}`);
  } catch (error) {
    console.error("Failed to record payment:", error);
    throw error;
  }
}

export async function updatePaymentStatus(
  txHash: string,
  status: string,
): Promise<void> {
  try {
    await prisma.payment.update({
      where: { txHash },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
    console.log(`Payment ${txHash} status updated to ${status}`);
  } catch (error) {
    console.error(`Failed to update payment status for ${txHash}:`, error);
    throw error;
  }
}

export async function getMerchantPayments(
  merchantAddress: string,
): Promise<MerchantPayment[]> {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        merchantAddr: merchantAddress,
      },
    });

    return payments.map((p) => ({
      merchantAddress: p.merchantAddr,
      amount: Number(p.amount),
      token: p.token,
      txHash: p.txHash,
      status: p.status,
    }));
  } catch (error) {
    console.error("Failed to get merchant payments:", error);
    throw error;
  }
}

export async function validateMerchantAddress(
  address: string,
): Promise<boolean> {
  try {
    // Validate Solana address format
    new PublicKey(address);
    return true;
  } catch (error) {
    console.error("Invalid merchant address:", error);
    return false;
  }
}
