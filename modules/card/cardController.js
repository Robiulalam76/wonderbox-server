const { saveHistory } = require("../../commons/services/saveHistory");
const Notification = require("../notification/NotificationModel");
const StoreCard = require("../storeCard/StoreCardModel");
const Card = require("./CardModel");
const { getPopularProductsByStoreId } = require("./cardService");

const createCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    newCard
      .save()
      .then(async (savedCard) => {
        const title = `New Card Order - Product id: ${savedCard.productId.slice(
          0,
          8
        )}`;
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
          title: "New Order Received: Order",
          type: "new_order",
          from: req.body.userId,
          to: req.body.storeId,
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
    const newCard = new Card(req.body);
    await newCard
      .save()
      .then(async (savedCard) => {
        const title = `New Card Order - Product id: ${savedCard.productId.slice(
          0,
          8
        )}`;
        const message =
          "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.";
        const result = await saveHistory(
          savedCard._id,
          title,
          message,
          "order",
          savedCard?.userId
        );
        const updateStatus = await StoreCard.findByIdAndUpdate(
          req.body.cardId,
          { $set: { active: true } },
          { new: true }
        );

        const newNotification = new Notification({
          activityId: savedCard._id,
          title: "New Card Redeem: Order",
          type: "new_order",
          from: req.body.userId,
          to: req.body.storeId,
        });
        await newNotification.save();
        res.status(200).json(updateStatus);
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
    const result = await Card.find({
      $and: [{ userId: req.params.userId }, { type: req.params?.type }],
    }).sort({ _id: -1 });
    res.status(201).json({
      status: "success",
      data: result,
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
    const cards = await Card.find({ storeId: req.params.storeId });
    res.status(201).send(cards);
  } catch (error) {
    res.status(500).json({
      status: "error",
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
};
