const express = require("express");
const { createCard, getCardByUserId } = require("./cardController");
const router = express.Router();


router.post("/", createCard);

router.get("/getcards/:userId", getCardByUserId);


module.exports = router