const express = require("express");
const { createStoreCard, getStoreCardByStoreId, verifyCard } = require("./storeCardController");
const router = express.Router();


router.post("/", createStoreCard);

// verify card
router.post("/verify", verifyCard);

router.get("/getcards/:storeId", getStoreCardByStoreId);


module.exports = router