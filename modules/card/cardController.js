const { saveHistory } = require("../../commons/services/saveHistory");
const Notification = require("../notification/NotificationModel");
const Card = require("./CardModel");
const { createNewCardForOrder } = require("./cardService");

const createCard = async (req, res) => {
  try {
    await createNewCardForOrder(req.body)
      .then(async (savedCard) => {
        const title = `New Card Order - Order No: ${savedCard.orderNo}`;
        const message =
          "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.";
        await saveHistory(
          savedCard._id,
          title,
          message,
          "order",
          savedCard?.user
        );
        const newNotification = new Notification({
          activityId: savedCard._id,
          title: "New Order Received: Order",
          type: "new_order",
          user: savedCard?.user,
        });
        await newNotification.save();
        res.status(200).json({
          status: "success",
          message: "New Card Add Success",
        });
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

// create card after verify
const createCardAfterVerify = async (req, res) => {
  try {
    await createNewCardForOrder(req.body)
      .then(async (savedCard) => {
        const title = `New Card Order - Product id: ${req.body.title}`;
        const message =
          "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.";
        await saveHistory(
          savedCard._id,
          title,
          message,
          "order",
          savedCard?.userId
        );
        const newNotification = new Notification({
          activityId: savedCard._id,
          title: "New Card Redeem: Order",
          type: "new_order",
          from: req.body.userId,
          to: req.body.storeId,
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
      $and: [{ userId: req.params.userId }, { type: req.params?.type }],
    });
    const totalPages = Math.ceil(count / limit);

    const result = await Card.find({
      $and: [{ userId: req.params.userId }, { type: req.params?.type }],
    })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("address")
      .populate("productId", "title images");

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
    const result = await Card.findOne({ _id: req.params.id });
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

    const count = await Card.countDocuments({ storeId: req.params.storeId });
    const totalPages = Math.ceil(count / limit);

    const result = await Card.find({ storeId: req.params.storeId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("address")
      .populate("productId", "title images");

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
