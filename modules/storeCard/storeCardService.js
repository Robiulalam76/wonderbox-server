const { generatePrivateKey } = require("../../commons/services/keyGenerate");
const {
  generateSerialNumber,
} = require("../../commons/services/serialNumberGenerate");
const Product = require("../product/ProductModel");
const StoreCard = require("./StoreCardModel");

const createNewStoreCard = async (data) => {
  const product = await Product.findById({ _id: data.productId });

  const serialNumber = await generateSerialNumber();
  const privateKey = await generatePrivateKey();
  const newCard = new StoreCard({
    title: product?.title,
    productId: data.productId,
    storeId: data.storeId,
    price: data.price,
    type: data.type,
    checkNumber: data.checkNumber,
    securityCode: data.securityCode,
    serialNumber: serialNumber,
    privateKey: privateKey,
  });

  if (data.type === "Wallet") {
    newCard["amount"] = data.amount;
  } else if (data.type === "Package") {
    newCard["features"] = data.features;
  }
  const result = await newCard.save();
  return result;
};

module.exports = {
  createNewStoreCard,
};
