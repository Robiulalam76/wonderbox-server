const express = require("express");
const { getNotificationByUserId, getNotificationByStoreId } = require("./notificationController");
const router = express.Router()


// router.post("/",)
router.get("/user/:userId", getNotificationByUserId);

// router.post("/",)
router.get("/store/:roleId", getNotificationByStoreId);


module.exports = router;