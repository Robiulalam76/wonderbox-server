const Payment = require("./paymentModel");

const createPayment = async (data) => {
  const newPayment = new Payment({
    method: data.method,
    amount: data.amount,
    txnId: data.txnId,
  });
  const result = await newPayment.save();
  return result;
};

module.exports = createPayment;
