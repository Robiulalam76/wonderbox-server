const { default: mongoose } = require("mongoose");
const Card = require("./CardModel");
const { generateCards } = require("./cardUtils");
const { newOrder } = require("../order/orderService");
const Order = require("../order/orderModel");

// create new cards
const createNewCardForOrder = async (data) => {
  let newOrderData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cards = await generateCards(data?.cards);

    const createdCard = await Card.create(cards, { session });
    if (!createdCard.length) {
      throw new Error("Failed to create order");
    } else {
      const result = await newOrder(
        createdCard,
        data?.address,
        data?.totalAmount,
        data?.user,
        session
      );
      newOrderData = result[0];
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return;
  }
  if (newOrderData) {
    const orders = await Order.findOne({ _id: newOrderData._id });
    return orders;
  }
};

module.exports = {
  createNewCardForOrder,
};

// const updateCard = await StoreCard.findByIdAndUpdate(
//   data.cardId,
//   { $set: { state: "Enable" } },
//   { new: true }
// );
