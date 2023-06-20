const { Error } = require("mongoose");
const User = require("./UserModel");

const addSellerWallet = async (id, newWallet) => {
  try {
    const user = await User.findById({ _id: id });
    if (user && user?.role === "seller") {
      const total = user.wallet + newWallet;
      const result = await User.updateOne(
        { _id: user?._id },
        { wallet: total },
        { new: true }
      );
      return result;
    }
  } catch (error) {
    throw new Error();
  }
};

const decreaseBuyerWallet = async (id, newWallet) => {
  try {
    const user = await User.findById({ _id: id });
    if (user && user?.role === "buyer") {
      const total = user.wallet - newWallet;
      const result = await User.updateOne(
        { _id: user?._id },
        { wallet: total },
        { new: true }
      );
      return result;
    }
  } catch (error) {
    throw new Error();
  }
};

module.exports = {
  addSellerWallet,
  decreaseBuyerWallet,
};
