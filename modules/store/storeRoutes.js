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
  updateStoreByStoreId,
  updateUsername,
} = require("../store/storeController");
const { isAuth } = require("../../config/auth");

router.route("/").post(addStore).get(getStore);
router.route("/getVerifiedStores").get(getVerifiedStores);
router.route("/:id").get(getStoreById);
router.get("/getInfo/:username", getStoreByUsername);
router.post("/add/:id", addStoreBySeller);
router.delete("/:id", deleteSingleStore);

// update store info by store id
router.patch("/update/:storeId", updateStoreByStoreId)

// change store info by store id
router.patch("/username/:storeId", updateUsername)

router.get("/getAllStores/byRole/:userId", getAllStoresByRole)

module.exports = router;
