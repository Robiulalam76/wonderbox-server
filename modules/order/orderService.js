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
      address: address,
      payType: "Online",
      orderNo: orderNo,
    };
    const result = await Order.create([newOrderData], { session });
    return result;
  } catch (error) {
    console.error("Error creating new order:", error);
  }
};

module.exports = {
  newOrder,
};
