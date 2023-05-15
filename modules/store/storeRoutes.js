const express = require("express");
const router = express.Router();

const {
  getStoreById,
  getStoreByUsername,
  addStore,
  getStore,
  addStoreBySeller,
  deleteSingleStore,
  getVerifiedStores,
  getAllStoresByRole,
  updateStatus,
} = require("../store/storeController");
const { isAuth } = require("../../config/auth");

router.route("/").post(addStore).get(getStore);
router.route("/getVerifiedStores").get(getVerifiedStores);
router.route("/:id").get(getStoreById);
router.get("/getInfo/:username", getStoreByUsername);
router.post("/add/:id", addStoreBySeller);
router.delete("/:id", deleteSingleStore);
// router.route("/myorders").get(protect, getMyOrders);
// router.route('/:id/pay').put(protect, updateOrderToPaid)
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


router.put("/status/:id", isAuth, updateStatus)
router.get("/getAllStores/byRole", isAuth, getAllStoresByRole)

module.exports = router;
