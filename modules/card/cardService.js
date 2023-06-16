const {
  checkNumberGenerate,
} = require("../../commons/services/checkNumberGenerate");
const { generatePrivateKey } = require("../../commons/services/keyGenerate");
const {
  generateSerialNumber,
} = require("../../commons/services/serialNumberGenerate");
const Product = require("../product/ProductModel");
const StoreCard = require("../storeCard/StoreCardModel");
const Card = require("./CardModel");

const createNewCardForOrder = async (data) => {
  const product = await Product.findById({ _id: data.productId });

  const serialNumber = await generateSerialNumber();
  const privateKey = await generatePrivateKey();
  const checkNumber = await checkNumberGenerate(12);
  const newCard = new Card({
    title: product?.title,
    productId: data?.productId,
    cardId: data?.cardId,
    userId: data?.userId,
    storeId: data?.storeId,
    price: data?.price,
    type: data?.type,
    checkNumber: data?.checkNumber ? data?.checkNumber : checkNumber,
    serialNumber: data?.serialNumber ? data?.serialNumber : serialNumber,
    securityCode: data?.securityCode
      ? data?.securityCode
      : checkNumber.slice(2, 7),
    privateKey: data?.privateKey ? data?.privateKey : privateKey,
  });

  if (data.type === "Wallet") {
    newCard["amount"] = data.amount;
  } else if (data.type === "Package") {
    newCard["features"] = data.features;
  }
  const result = await newCard.save();
  await StoreCard.findByIdAndUpdate(
    data.cardId,
    { $set: { state: "Enable" } },
    { new: true }
  );
  return result;
};

module.exports = {
  createNewCardForOrder,
};
