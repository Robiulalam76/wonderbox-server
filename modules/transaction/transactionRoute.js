const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getDepositByUserId,
} = require("./transactionController");
const router = express.Router();

// create new transaction
router.post("/", createTransaction);

// get all transactions
router.get("/", getAllTransactions);

// get transaction by id
router.get("/:id");

// get Desposits transaction by user id
router.get("/deposits/:userId", getDepositByUserId);

module.exports = router;
