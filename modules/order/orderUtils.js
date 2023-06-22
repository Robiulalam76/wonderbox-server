const Order = require("./orderModel");

const findLastOrderNO = async () => {
  const lastOrderNo = await Order.findOne({}, { orderNo: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastOrderNo?.orderNo;
};

const generateOrderNo = async () => {
  const currentId =
    (await findLastOrderNO()) || (0).toString().padStart(8, "0"); //00000
  const incrementedId = (parseInt(currentId) + 1).toString().padStart(8, "0");
  return incrementedId;
};

// make cards array object
const generateCardsArray = async (cardsData) => {
  let cards = [];
  for (let i = 0; i < cardsData.length; i++) {
    cards.push({ card: cardsData[i]._id });
  }
  return cards;
};

module.exports = {
  generateOrderNo,
  generateCardsArray,
};
