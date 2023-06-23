const User = require("../user/UserModel");
const Transaction = require("./transactionModel");

const createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction({
      bank: req.body.bank,
      branch: req.body.branch,
      accountNo: req.body.accountNo,
      amount: req.body.amount,
      txnId: req.body.txnId,
      images: req.body.images,
      user: req.body.user,
      type: req.body.type,
      description: req.body.description,
    });
    const result = await newTransaction.save();
    res.status(200).json({
      success: true,
      message: `${req.body.type} Request Send Successful`,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAllTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaulting to 1 if not provided
  const limit = 10; // Number of transactions per page
  const approvedFilter = req.query.approved;
  const typeFilter = req.query.type;

  try {
    let conditions = [];

    if (approvedFilter !== undefined) {
      conditions.push({ approved: approvedFilter });
    }
    if (typeFilter !== undefined) {
      conditions.push({ type: typeFilter });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const count = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    const transactions = await Transaction.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "image name");

    res.status(200).json({
      success: true,
      message: "Transactions retrieval successful",
      data: transactions,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById({
      _id: req.params.id,
    }).populate("user");
    res.status(200).json({
      success: true,
      message: `Transaction get Successful`,
      data: transaction,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getDepositByUserId = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaulting to 1 if not provided
  const limit = 10; // Number of transactions per page
  const approvedFilter = req.query.approved; // Approved filter value (true, false, or undefined)

  try {
    let conditions = [{ user: req.params.userId }, { type: "Deposit" }];

    if (approvedFilter !== undefined) {
      conditions.push({ approved: approvedFilter });
    }

    const count = await Transaction.countDocuments({ $and: conditions });
    const totalPages = Math.ceil(count / limit);

    const transactions = await Transaction.find({ $and: conditions })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Transaction retrieval successful",
      data: transactions,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInfoById = async (req, res) => {
  try {
    const transaction = await Transaction.findById({ _id: req.params.id });
    const user = await User.findById({ _id: transaction.user });
    if (transaction.approved === false) {
      const result = await Transaction.updateOne(
        { _id: transaction._id },
        req.body,
        { new: true }
      );
    }
    if (
      (transaction &&
        transaction.approved === false &&
        transaction?.type === "Deposit") ||
      transaction?.type === "Withdraw"
    ) {
      let total = 0;
      if (transaction.type === "Deposit") {
        total = user.wallet + transaction.amount;
      } else if (transaction.type === "Withdraw") {
        total = user.wallet - transaction.amount;
      }
      if (total) {
        const result = await User.updateOne(
          { _id: user._id },
          { wallet: total },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: `Transaction Update Successful`,
          data: result,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getDepositByUserId,
  updateInfoById,
};
