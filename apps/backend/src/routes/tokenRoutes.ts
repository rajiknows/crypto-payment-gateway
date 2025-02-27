import express from "express";
import { getTokenBalances } from "../utils/utils";

const router = express.Router();

router.get("/:publicKey", async (req, res) => {
  try {
    const { publicKey } = req.params;
    const balances = await getTokenBalances(publicKey);
    res.json({ publicKey, balances });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token balances" });
  }
});

router.get("/:publicKey/payable/:amount", async (req, res) => {
  try {
    const { publicKey, amount } = req.params;
    const balances = await getTokenBalances(publicKey);
    const payableTokens = balances.filter(
      (token) => token.balance >= parseFloat(amount),
    );
    res.json({ publicKey, amount, payableTokens });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payable tokens" });
  }
});

export default router;
