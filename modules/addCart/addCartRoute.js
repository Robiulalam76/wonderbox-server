const express = require("express");
const {
  createAddCart,
  getAddCartProducts,
  removeAddCartById,
} = require("./addCartController");
const router = express.Router();

// create new wishlist
router.post("/", createAddCart);

// get all wishlist product by user
router.get("/user/:userId", getAddCartProducts);

// delete wishlist product by id
router.delete("/:userId/:addCartId", removeAddCartById);

module.exports = router;
