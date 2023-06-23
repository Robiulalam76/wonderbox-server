const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  updateInfoById,
  getTransactionById,
  createWithdraw,
  getTransactionByUserId,
} = require("./transactionController");
const router = express.Router();

// create new transaction
router.post("/deposit", createTransaction);
router.post("/withdraw", createWithdraw);

// get all transactions
router.get("/", getAllTransactions);

// get transaction by id
router.get("/:id", getTransactionById);

// get transaction by user id
router.get("/:type/:userId", getTransactionByUserId);

// get transaction by id
router.patch("/:id", updateInfoById);

module.exports = router;
