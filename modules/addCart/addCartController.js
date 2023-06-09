const { saveHistory } = require("../../commons/services/saveHistory");
const AddCart = require("./AddCartModel");

const createAddCart = async (req, res) => {
  try {
    const newWishlist = new AddCart({
      userId: req.body.userId,
      product: req.body.product,
    });
    await newWishlist.save().then(async (savedAddCart) => {
      const title = `New Product Add Cart - `;
      const message =
        "Congratulations! You have successfully created a new product Add Cart.";
      await saveHistory(
        savedAddCart._id,
        title,
        message,
        "add_cart",
        req.body.userId
      );
      res.status(200).json({
        status: "success",
        message: "new add Cart added successfull",
      });
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
      .populate("product")
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
    await AddCart.deleteOne({ _id: req.params.addCartId }).then(
      async (removedAddCart) => {
        const title = `AddCart Product Removed`;
        const message = "You have successfully Deleted a Cart product.";
        await saveHistory(
          req.params.addCartId,
          title,
          message,
          "add_cart",
          req.params.userId
        );
        res.status(200).json({
          status: "success",
          message: "Cart product deleted",
        });
      }
    );
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
