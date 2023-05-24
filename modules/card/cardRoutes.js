const express = require("express");
const { createCard, getCardByUserId, createCardAfterVerify } = require("./cardController");
const router = express.Router();


router.post("/", createCard);
router.post("/createcard_after_verify", createCardAfterVerify);

router.get("/getcards/:userId", getCardByUserId);


module.exports = router