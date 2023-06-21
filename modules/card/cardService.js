const { default: mongoose } = require("mongoose");
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
const createPayment = require("../payment/paymentService");

const createNewCardForOrder = async (data) => {
  let newOrderData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

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
      payType: data?.payType,
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

    if (data.payType === "Online") {
      newCard["address"] = data?.address;
      const payResult = await createPayment({
        method: data.method,
        amount: data.price,
        txnId: data.txnId,
      });
      newCard["payment"] = payResult?._id;
    }

    const createdCard = await Card.create([newCard], { session });
    if (!createdCard.length) {
      throw new Error("Failed to create order");
    }
    const updateCard = await StoreCard.findByIdAndUpdate(
      data.cardId,
      { $set: { state: "Enable" } },
      { new: true }
    );

    newOrderData = createdCard[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return;
  }
  if (newOrderData) {
    const orders = await Card.findOne({ _id: newOrderData._id });
    return orders;
  }
};

module.exports = {
  createNewCardForOrder,
};
