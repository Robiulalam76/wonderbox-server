const express = require("express");
const { createStoreCard, getStoreCardByStoreId, verifyCard, getAllCards } = require("./storeCardController");
const router = express.Router();


router.post("/", createStoreCard);
router.get("/", getAllCards);

// verify card
router.post("/verify", verifyCard);

router.get("/getcards/:storeId", getStoreCardByStoreId);


module.exports = router