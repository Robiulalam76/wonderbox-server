const { saveHistory } = require("../../commons/services/saveHistory");
const AddCart = require("./AddCartModel");

const createAddCart = async (req, res) => {
  try {
    const newWishlist = new AddCart({
      userId: req.body.userId,
      product: req.body.product,
    });
    const result = await newWishlist.save();
    res.status(200).json({
      status: "success",
      message: "new add Cart added successful",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Data couldn't insert",
      error: error.message,
    });
  }
};

// get all AddCart products by userid
const getAddCartProducts = async (req, res) => {
  try {
    const products = await AddCart.find({ userId: req.params.userId })
      .populate({
        path: "product",
        populate: [{ path: "storeId", select: "name" }],
      })
      .sort({ timestamps: -1 });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Data couldn't insert",
      error: error.message,
    });
  }
};

// get all AddCart products by userid
const removeAddCartById = async (req, res) => {
  try {
    const result = await AddCart.deleteOne({ _id: req.params.addCartId });
    res.status(200).json({
      status: "success",
      message: "Cart product deleted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Data couldn't insert",
      error: error.message,
    });
  }
};

module.exports = {
  createAddCart,
  getAddCartProducts,
  removeAddCartById,
};
