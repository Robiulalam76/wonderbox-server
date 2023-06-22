const express = require("express");
const {
  createCard,
  getCardByUserId,
  createCardAfterVerify,
  getOrderCardsByStoreId,
  getCardById,
  updateCardInfoById,
} = require("./cardController");
const router = express.Router();

router.post("/", createCard);
router.post("/createcard_after_verify", createCardAfterVerify);

router.get("/getcards/:userId/:type", getCardByUserId);

router.get("/:id", getCardById);
router.patch("/:id", updateCardInfoById);

// get all orders by store id
router.get("/orders/:storeId", getOrderCardsByStoreId);

module.exports = router;
