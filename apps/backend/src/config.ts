import { Connection } from "@solana/web3.js";

interface Config {
  port: number;
  SOLANA_MAINNET:string
  WALLET_SECRET: string;
  WALLET_PUBLIC: string;
  USDC_TOKEN_MINT:string,
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  SOLANA_MAINNET:process.env.SOLANA_MAINNET||"",
  WALLET_SECRET: process.env.WALLET_SECRET || '',
  WALLET_PUBLIC:process.env.WALLET_PUBLIC||"",
  USDC_TOKEN_MINT:process.env.USDC_TOKEN_MINT||""
};


const {SOLANA_MAINNET} = config;

// make a conenction and export it , like a singleton 
export const connection  = new Connection(SOLANA_MAINNET, "confirmed");


