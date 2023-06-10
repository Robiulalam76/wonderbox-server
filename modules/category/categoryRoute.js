const express = require("express");
const router = express.Router();

const { isAuth } = require("../../config/auth");
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  getAllCategoriesByRole,
  getRequestCategoryByStoreId,
  updateCategoryInfo,
} = require("./categoryController");

//add a category
router.post("/add/:id", addCategory);

//add all category
router.post("/all", addAllCategory);

//get only showing category
router.get("/show", getShowingCategory);

//get all category
router.get("/", getAllCategory);

//get category for dashboard
router.get("/all", isAuth, getCategories);

//get a category
router.get("/:id", getCategoryById);

//update a category
router.put("/:id", updateCategory);

//show/hide a category
router.put("/status/:id", updateStatus);

//show/hide a category
router.patch("/updateinfo/:id", updateCategoryInfo);

//delete a category
router.delete("/:id", deleteCategory);

//Remove a sub category
router.put("/sub-category/:id", deleteSubCategory);

// ---------------------- dashboard Routes --------------------
router.get("/getAllCategories/byRole/:roleId", getAllCategoriesByRole);
router.get("/request/:storeId", getRequestCategoryByStoreId);

module.exports = router;
