import { PublicKey } from "@solana/web3.js";

export function decodeMemo(transaction: any): string | null {
  if (!transaction || !transaction.meta) return null;

  for (const instruction of transaction.transaction.message.instructions) {
    if (
      instruction.programId.equals(
        new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      )
    ) {
      const memo = Buffer.from(instruction.data, "base64").toString("utf-8");
      if (memo.startsWith("merchant:")) {
        return memo.replace("merchant:", "").trim();
      }
    }
  }

  return null;
}
