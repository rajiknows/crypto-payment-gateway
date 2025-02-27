interface Config {
  port: number;
  SOLANA_RPC_URL: string;
  WALLET_SECRET: string;
  WALLET_PUBLIC: string;
  USDC_TOKEN_MINT: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || "",
  WALLET_SECRET: process.env.WALLET_SECRET || "",
  WALLET_PUBLIC: process.env.WALLET_PUBLIC || "",
  USDC_TOKEN_MINT: process.env.USDC_TOKEN_MINT || "",
};
