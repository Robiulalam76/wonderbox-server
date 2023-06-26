const { default: mongoose } = require("mongoose");
const Card = require("./CardModel");
const { generateCards } = require("./cardUtils");
const StoreCard = require("../storeCard/StoreCardModel");
const { addSellerWallet, decreaseBuyerWallet } = require("../user/userService");
const { sendOrderMail } = require("../../commons/sendOrderMail");
const User = require("../user/UserModel");
const Store = require("../store/storeModel");
const { saveHistory } = require("../../commons/services/saveHistory");
const saveNotification = require("../../commons/SaveNotification");

// create new cards
const createNewCardForOrder = async (option, data) => {
  let newOrderData = null;
  const user = await User.findById({ _id: data[0]?.user });
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const cards = await generateCards(data);
    const createdCard = await Card.create(cards, { session });
    if (!createdCard.length) {
      throw new Error("Failed to create order");
    }
    if (data[0].payType === "Offline") {
      const addWallet = await addSellerWallet(data, user, createdCard);
      if (addWallet) {
        const updateCard = await StoreCard.findByIdAndUpdate(
          { _id: data[0].card },
          { $set: { state: "Enable" } },
          { new: true }
        );
        if (updateCard) {
          const store = await Store.findById({ _id: data[0]?.store });
          const seller = await Store.findById({ _id: store?.seller });
          await sendOrderMail(
            [user?.email, seller?.email],
            user?.name,
            store?.name
          );
          await saveHistory(
            `New Card Orders`,
            "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.",
            "order",
            data[0]?.user
          );
          await saveNotification(
            createdCard[0]?._id,
            "New Order Successfully!",
            "new_order",
            data[0].user
          );
          newOrderData = createdCard[0];
        } else {
          await session.commitTransaction();
          await session.endSession();
        }
      }
    } else {
      const addWallet = await addSellerWallet(data, user, createdCard);
      if (addWallet) {
        if (option === "wallet") {
          const decreaseBuyer = await decreaseBuyerWallet(data[0].user, data);
          if (decreaseBuyer) {
            newOrderData = createdCard[0];
          } else {
            await session.commitTransaction();
            await session.endSession();
          }
        } else {
          newOrderData = createdCard[0];
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
