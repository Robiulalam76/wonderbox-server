const { saveHistory } = require("../../commons/services/saveHistory");
const Wishlist = require("./WishlistModel");

const createWishlist = async (req, res) => {
  try {
    const newWishlist = new Wishlist({
      userId: req.body.userId,
      product: req.body.product,
    });
    await newWishlist.save().then(async (savedWishlist) => {
      const title = `New Product Wishlisted - `;
      const message =
        "Congratulations! You have successfully created a new product Wishlisted.";
      await saveHistory(
        savedWishlist._id,
        title,
        message,
        "wishlist",
        req.body.userId
      );
      res.status(200).json({
        status: "success",
        message: "new wishlist added successfull",
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

// get all wishlist products by userid
const getWishlistProducts = async (req, res) => {
  try {
    const products = await Wishlist.find({ userId: req.params.userId })
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

// get all wishlist products by userid
const removeWishlistById = async (req, res) => {
  try {
    await Wishlist.deleteOne({ _id: req.params.wishlistId }).then(
      async (removedWishlist) => {
        const title = `Wishlist Product Removed`;
        const message = "You have successfully Deleted a Wishlist product.";
        await saveHistory(
          req.params.wishlistId,
          title,
          message,
          "wishlist",
          req.params.userId
        );
        res.status(200).json({
          status: "success",
          message: "wishlist product deleted",
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
  createWishlist,
  getWishlistProducts,
  removeWishlistById,
};
