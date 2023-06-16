const { saveHistory } = require("../../commons/services/saveHistory");
const StoreCard = require("./StoreCardModel");
const { createNewStoreCard } = require("./storeCardService");

const createStoreCard = async (req, res) => {
  try {
    await createNewStoreCard(req.body).then(async (savedCard) => {
      const title = `New Card saved - ${req.body.title}`;
      const message =
        "Congratulations! You have successfully placed a new card save.";
      await saveHistory(
        savedCard._id,
        title,
        message,
        "order",
        savedCard?.storeId
      );
    });
    res.status(200).json({
      success: true,
      message: "new card added successful",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getStoreCardById = async (req, res) => {
  try {
    const card = await StoreCard.findOne({ _id: req.params.id });
    res.status(200).send(card);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllCards = async (req, res) => {
  try {
    const cards = await StoreCard.find({}).sort({ _id: -1 });
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// verify card
const verifyCard = async (req, res) => {
  try {
    const { checkNumber, securityCode } = req.body;
    const isValid = await StoreCard.findOne({
      $and: [
        { checkNumber: checkNumber },
        { securityCode: securityCode },
        { state: "Disable" },
      ],
    });
    if (isValid) {
      res.status(200).json({
        status: "success",
        message: "Card Is Valid",
        data: isValid,
      });
    } else {
      res.status(200).json({
        status: "error",
        message: "Card Is invalid",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get card by store id
const getStoreCardByStoreId = async (req, res) => {
  try {
    const result = await StoreCard.find({ storeId: req.params.storeId });
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

module.exports = {
  createStoreCard,
  getStoreCardById,
  getAllCards,
  getStoreCardByStoreId,
  verifyCard,
};
