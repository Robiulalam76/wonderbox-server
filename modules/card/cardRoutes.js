const express = require("express");
const { createCard, getCardByUserId, createCardAfterVerify, getOrderCardsByStoreId } = require("./cardController");
const router = express.Router();


router.post("/", createCard);
router.post("/createcard_after_verify", createCardAfterVerify);

router.get("/getcards/:userId/:type", getCardByUserId);

// get all orders by store id
router.get("/orders/:storeId", getOrderCardsByStoreId)

module.exports = router