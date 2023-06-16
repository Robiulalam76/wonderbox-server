const Card = require("../../modules/card/CardModel");
const StoreCard = require("../../modules/storeCard/StoreCardModel");

const findLastSerialNumber = async () => {
  const lastSerialNumber = await Card.findOne({}, { serialNumber: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastSerialNumber?.serialNumber;
};

const generateSerialNumber = async () => {
  const currentId =
    (await findLastSerialNumber()) || (0).toString().padStart(8, "0"); //00000
  const incrementedId = (parseInt(currentId) + 1).toString().padStart(8, "0");
  return incrementedId;
};

module.exports = {
  generateSerialNumber,
};
