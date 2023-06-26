const { saveHistory } = require("../../commons/services/saveHistory");
const Notification = require("../notification/NotificationModel");
const Card = require("./CardModel");
const { createNewCardForOrder } = require("./cardService");

const createCard = async (req, res) => {
  try {
    const result = await createNewCardForOrder(
      req.body?.option,
      req.body?.cards
    );
    res.status(200).json({
      success: true,
      message: "New Order Successful!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// create card after verify
const createCardAfterVerify = async (req, res) => {
  try {
    await createNewCardForOrder("wallet", req.body)
      .then(async (savedCard) => {
        const title = `New Card Order`;
        const message =
          "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.";
        await saveHistory(title, message, "order", req.body[0]?.user);
        const newNotification = new Notification({
          title: "New Order Received: Order",
          type: "new_order",
          user: req.body[0]?.user,
        });
        await newNotification.save();
        res.status(200).json({ success: true });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get card by user id

const getCardByUserId = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;

    const count = await Card.countDocuments({
      $and: [{ user: req.params.userId }, { type: req.params?.type }],
    });
    const totalPages = Math.ceil(count / limit);

    const result = await Card.find({
      $and: [{ user: req.params.userId }, { type: req.params?.type }],
    })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("address")
      .populate("product", "title images");

    res.status(201).json({
      status: "success",
      data: result,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get card by user id

const getCardById = async (req, res) => {
  try {
    const result = await Card.findOne({ _id: req.params.id })
      .populate("address")
      .populate("store", "name logo");
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get all orders by store id
const getOrderCardsByStoreId = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;

    const count = await Card.countDocuments({ store: req.params.storeId });
    const totalPages = Math.ceil(count / limit);

    const result = await Card.find({ store: req.params.storeId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("address")
      .populate("product", "title images");

    res.status(201).json({
      status: "success",
      data: result,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCardInfoById = async (req, res) => {
  try {
    const result = await Card.updateOne({ _id: req.params.id }, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: `Card Update Successful`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCard,
  createCardAfterVerify,
  getCardByUserId,
  getOrderCardsByStoreId,
  getCardById,
  updateCardInfoById,
};
