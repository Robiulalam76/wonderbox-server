const express = require("express");
const { isAuth } = require("../../config/auth");
const { createProduct, getProductById, getShowingProducts, getDiscountedProducts, getAllProducts, getLatestProducts, getStockOutProducts, getProductBySlug, getProductsByParent, getProductsBySlugAndChildrenSlug, getSearchProducts, updateProduct, updateStatus, deleteProduct, getAllProductsByRole } = require("./productController");
const router = express.Router();

// new product
router.post("/add", createProduct)

router.get("/:id", getProductById);

//get showing products only
router.get("/show/all", getShowingProducts);

//get discounted products only
router.get("/discount/all", getDiscountedProducts);

//get all products
router.get("/", getAllProducts);


//get all latest products
router.get("/getProducts/latest", getLatestProducts);

//get all stock out products
router.get("/stock-out", getStockOutProducts);

//get a product by slug
router.get("/:slug", getProductBySlug);

//get a product by parent
// router.get("/cat/:parent", getProductByParent);
router.get("/cat/:slug", getProductsByParent);

// search children_slug
router.get("/cat/:slug/:children_slug", getProductsBySlugAndChildrenSlug);

router.get("/search/:searchtitle", getSearchProducts);
//update a product
router.put("/:id", updateProduct);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

// ---------------------- dashboard Routes --------------------
router.get("/getAllProducts/byRole", isAuth, getAllProductsByRole)

module.exports = router;