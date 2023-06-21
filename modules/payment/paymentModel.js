const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txnId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model("Payment", paymentSchema);
module.exports = Payment;
