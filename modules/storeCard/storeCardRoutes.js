const express = require("express");
const {
  createStoreCard,
  getStoreCardByStoreId,
  verifyCard,
  getAllCards,
  getStoreCardById,
} = require("./storeCardController");
const router = express.Router();

router.post("/", createStoreCard);
router.get("/", getAllCards);

router.get("/:id", getStoreCardById);

// verify card
router.post("/verify", verifyCard);

router.get("/getcards/:storeId", getStoreCardByStoreId);

module.exports = router;
