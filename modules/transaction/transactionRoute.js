const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getDepositByUserId,
  updateInfoById,
  getTransactionById,
} = require("./transactionController");
const router = express.Router();

// create new transaction
router.post("/", createTransaction);

// get all transactions
router.get("/", getAllTransactions);

// get transaction by id
router.get("/:id", getTransactionById);

// get Desposits transaction by user id
router.get("/deposits/:userId", getDepositByUserId);

// get transaction by id
router.patch("/:id", updateInfoById);

module.exports = router;
