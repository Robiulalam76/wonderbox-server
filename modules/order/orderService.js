const Order = require("./orderModel");
const { generateOrderNo, generateCardsArray } = require("./orderUtils");

const newOrder = async (data, address, totalAmount, user, session) => {
  try {
    const orderNo = await generateOrderNo();
    const cards = await generateCardsArray(data);
    const newOrderData = {
      cards: cards,
      totalAmount: totalAmount,
      user: user,
      orderNo: orderNo,
    };
    if (address) {
      newOrderData["address"] = address;
      newOrderData["payType"] = "Online";
    } else {
      newOrderData["payType"] = "Offline";
    }
    const result = await Order.create([newOrderData], { session });
    return result;
  } catch (error) {
    console.error("Error creating new order:", error);
  }
};

module.exports = {
  newOrder,
};
