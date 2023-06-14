const express = require("express");
const { getHistoryByRoleId, getAllHistories } = require("./historyController");
const router = express.Router();

// create histroy

// get all history
router.get("/", getAllHistories);

// get history by role id
router.get("/role/:roleId", getHistoryByRoleId);

module.exports = router;
