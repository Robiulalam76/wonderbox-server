const {
  checkNumberGenerate,
} = require("../../commons/services/checkNumberGenerate");
const { generatePrivateKey } = require("../../commons/services/keyGenerate");
const {
  generateSerialNumber,
} = require("../../commons/services/serialNumberGenerate");

// generate cards
const generateCards = async (cardsData) => {
  try {
    let cards = [];

    for (let i = 0; i < cardsData.length; i++) {
      const serialNumber = await generateSerialNumber();
      const privateKey = await generatePrivateKey();
      const checkNumber = await checkNumberGenerate(12);
      const newCard = {
        product: cardsData[i]?.product,
        title: cardsData[i]?.title,
        store: cardsData[i]?.store,
        price: cardsData[i]?.price,
        type: cardsData[i]?.type,
        user: cardsData[i]?.user,
        payType: cardsData[i]?.payType,
        checkNumber: cardsData[i]?.checkNumber
          ? cardsData[i]?.checkNumber
          : checkNumber,
        securityCode: cardsData[i]?.securityCode
          ? cardsData[i]?.securityCode
          : checkNumber.slice(2, 7),
        privateKey: cardsData[i]?.privateKey
          ? cardsData[i]?.privateKey
          : privateKey,
        serialNumber: cardsData[i]?.serialNumber
          ? cardsData[i]?.serialNumber
          : serialNumber,
      };
      if (cardsData[i].address) {
        newCard["address"] = cardsData[i].address;
      }
      if (cardsData[i].type === "Wallet") {
        newCard["amount"] = cardsData[i].amount;
      } else if (cardsData[i].type === "Package") {
        newCard["features"] = cardsData[i].features;
      }

      cards.push(newCard);
    }
    return cards;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateCards,
};
