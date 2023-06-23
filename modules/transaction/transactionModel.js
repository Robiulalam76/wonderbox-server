const { mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    bank: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: false,
    },
    accountNo: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txnId: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Deposit", "Withdraw"],
      required: true,
    },
    approved: {
      type: Boolean,
      enum: [true, false],
      required: true,
      default: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
