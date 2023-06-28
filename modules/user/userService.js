const { Error } = require("mongoose");
const User = require("./UserModel");
const Store = require("../store/storeModel");
const { calculateEarn } = require("./userUtils");
const { sendOrderMail } = require("../../commons/sendOrderMail");
const { saveHistory } = require("../../commons/services/saveHistory");
const saveNotification = require("../../commons/SaveNotification");

const addSellerWallet = async (cards, user, createdCard) => {
  try {
    let adminWallet = 0;
    for (let i = 0; i < cards.length; i++) {
      const store = await Store.findById({ _id: cards[i].store }).populate(
        "seller"
      );
      const { discount, remainingPrice } = await calculateEarn(
        parseInt(cards[i].price)
      );
      adminWallet = adminWallet + parseInt(discount);
      if (store && store?.seller?.role === "seller") {
        const total = store.seller?.wallet + remainingPrice;
        const result = await User.updateOne(
          { _id: store?.seller?._id },
          { wallet: total },
          { new: true }
        );
      }
      await sendOrderMail(
        [user?.email, store?.seller?.email],
        user?.name,
        store?.name
      );
      await saveHistory(
        createdCard[i]?._id,
        `New Card Orders: ${cards[i]?.title}`,
        "Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.",
        "order",
        user?._id
      );
      await saveNotification(
        createdCard[i]?._id,
        `New Order Successfully! : ${cards[i]?.title}`,
        "new_order",
        user?._id
      );
    }
    const admin = await User.findOne({ email: "admin@gmail.com" });
    const newWallet = admin.wallet + parseInt(adminWallet);
    const adminUpdate = await User.updateOne(
      { role: "admin" },
      { wallet: newWallet },
      { new: true }
    );
    if (adminUpdate) {
      return adminUpdate;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const decreaseBuyerWallet = async (userId, cards) => {
  try {
    let totalCost = 0;
    const user = await User.findById({ _id: userId });
    for (let i = 0; i < cards.length; i++) {
      totalCost = totalCost + parseInt(cards[i].price);
    }
    if (user && user?._id) {
      if (totalCost <= user.wallet) {
        const total = user.wallet - totalCost;
        const result = await User.updateOne(
          { _id: user?._id },
          { wallet: total },
          { new: true }
        );
        return result;
      } else {
        throw new Error("Insufficient Wallet");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  addSellerWallet,
  decreaseBuyerWallet,
};
