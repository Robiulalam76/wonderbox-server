const { default: mongoose } = require("mongoose");
const Card = require("./CardModel");
const { generateCards } = require("./cardUtils");
const StoreCard = require("../storeCard/StoreCardModel");
const { addSellerWallet, decreaseBuyerWallet } = require("../user/userService");

// create new cards
const createNewCardForOrder = async (data) => {
  let newOrderData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const cards = await generateCards(data);
    const createdCard = await Card.create(cards, { session });
    if (!createdCard.length) {
      throw new Error("Failed to create order");
    }
    if (data[0].payType === "Offline") {
      const addWallet = await addSellerWallet(data);
      if (addWallet) {
        const updateCard = await StoreCard.findByIdAndUpdate(
          { _id: data[0].card },
          { $set: { state: "Enable" } },
          { new: true }
        );
        if (updateCard) {
          newOrderData = createdCard[0];
        } else {
          await session.commitTransaction();
          await session.endSession();
        }
      }
    } else {
      const decreaseBuyer = await decreaseBuyerWallet(data[0].user, data);
      if (decreaseBuyer) {
        const addWallet = await addSellerWallet(data);
        if (addWallet) {
          newOrderData = createdCard[0];
        } else {
          await session.commitTransaction();
          await session.endSession();
        }
      } else {
        await session.commitTransaction();
        await session.endSession();
      }
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
  }
  if (newOrderData) {
    console.log("order: ", newOrderData);
    return newOrderData;
  }
};

module.exports = {
  createNewCardForOrder,
};
