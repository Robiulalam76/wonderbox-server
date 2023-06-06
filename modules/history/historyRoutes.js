const express = require("express");
const { getHistoryByUserId, getHistoryByStoreId } = require("./historyController");
const router = express.Router()


// router.post("/",)
router.get("/user/:userId", getHistoryByUserId);

// router.post("/",)
router.get("/store/:roleId", getHistoryByStoreId);


module.exports = router;