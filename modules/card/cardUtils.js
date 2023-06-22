const {
  checkNumberGenerate,
} = require("../../commons/services/checkNumberGenerate");
const { generatePrivateKey } = require("../../commons/services/keyGenerate");

// generate cards
const generateCards = async (cardsData) => {
  let cards = [];

  for (let i = 0; i < cardsData.length; i++) {
    const privateKey = await generatePrivateKey();
    const checkNumber = await checkNumberGenerate(12);
    const newCard = {
      product: cardsData[i]?.product,
      store: cardsData[i]?.store,
      price: cardsData[i]?.price,
      type: cardsData[i]?.type,
      checkNumber: cardsData[i]?.checkNumber
        ? cardsData[i]?.checkNumber
        : checkNumber,
      securityCode: cardsData[i]?.securityCode
        ? cardsData[i]?.securityCode
        : checkNumber.slice(2, 7),
      privateKey: cardsData[i]?.privateKey
        ? cardsData[i]?.privateKey
        : privateKey,
    };
    if (cardsData[i].type === "Wallet") {
      newCard["amount"] = cardsData[i].amount;
    } else if (cardsData[i].type === "Package") {
      newCard["features"] = cardsData[i].features;
    }
    cards.push(newCard);
  }
  return cards;
};

module.exports = {
  generateCards,
};
