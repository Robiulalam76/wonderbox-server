const express = require("express");
const {
  createWishlist,
  getWishlistProducts,
  removeWishlistById,
} = require("./wishlistController");
const router = express.Router();

// create new wishlist
router.post("/", createWishlist);

// get all wishlist product by user
router.get("/user/:userId", getWishlistProducts);

// delete wishlist product by id
router.delete("/:userId/:wishlistId", removeWishlistById);

module.exports = router;
