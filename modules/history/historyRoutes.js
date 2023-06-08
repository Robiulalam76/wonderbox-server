const express = require("express");
const { getHistoryByRoleId } = require("./historyController");
const router = express.Router()


// create histroy

// get all history

// get history by role id
router.get("/role/:roleId", getHistoryByRoleId);


module.exports = router;