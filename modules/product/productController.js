const { saveHistory } = require("../../commons/services/saveHistory");
const Review = require("../review/ReviewModel");
const Product = require("./ProductModel");
const {
  getTopRankingProductsByStoreId,
  getProductsByStoreIdWithRating,
  getProductsByParentChildren,
  getProductsByParentSlug,
  findProductsByStoreId,
} = require("./productServices");

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      images: req.body.images,
      storeId: req.body.storeId,
      price: req.body.price,
      discount: req.body.discount,
      features: req.body.features,
      parent: req.body.parent,
      parentSlug: req.body.parent.replaceAll(" ", "-").toLowerCase(),
      children: req.body.children,
      childrenSlug: req.body.children.replaceAll(" ", "-").toLowerCase(),
      titleSlug: req.body.title.replaceAll(" ", "-").toLowerCase(),
      description: req.body.description,
      type: req.body.type,
    });
    await newProduct.save().then(async (savedProduct) => {
      const title = `New Product Published - Product id: ${savedProduct._id.slice(
        0,
        8
      )}`;
      const message =
        "Congratulations! You have successfully Published a new Product.";
      await saveHistory(
        savedProduct._id,
        title,
        message,
        "product",
        savedProduct?.storeId
      );
      res.status(400).json({
        status: "success",
        message: "Product Added Successfull",
      });
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't insert",
      error: error.message,
    });
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.status(201).send(products);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't insert",
      error: error.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Show" }).sort({ _id: -1 });
    const productIds = products.map((product) => product._id);

    const productRatings = await Review.aggregate([
      {
        $match: { productId: { $in: productIds } },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const productsWithRating = products.map((product) => {
      const rating = productRatings.find(
        (rating) => rating._id.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        rating: Math.ceil(rating ? rating.averageRating : 0),
      };
    });

    res.send(productsWithRating);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get discount products
const getDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 5 } }).sort({
      _id: -1,
    });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStockOutProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $lt: 1 } }).sort({
      _id: -1,
    });

    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.find({ parent: req.params.slug });
    res.send([product]);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductsByParent = async (req, res) => {
  try {
    const products = await getProductsByParentSlug(req.params.slug);
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

// get product by slug and children_slug
const getProductsBySlugAndChildrenSlug = async (req, res) => {
  const { slug, children_slug } = req.params;
  try {
    const products = await getProductsByParentChildren(slug, children_slug);
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findById(req.params.id);
    // console.log(product);
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get products by store id
const getProductsByStoreId = async (req, res) => {
  try {
    const product = await findProductsByStoreId(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get products by store id
const getShowProductsByStoreId = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await getProductsByStoreIdWithRating(req.params.id);
    // console.log(product);
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get top ranking products
const topRankingProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const topRankingProducts = await getTopRankingProductsByStoreId(storeId);

    res.json(topRankingProducts);
  } catch (error) {
    console.error("Error retrieving top ranking products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get latest product by storeId with ratings
const getLatestProductByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const products = await getTopRankingProductsByStoreId(storeId);

    res.json(products);
  } catch (error) {
    console.error("Error retrieving top ranking products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { runValidators: true, new: true }
    ).then(async (savedProduct) => {
      const title = `Product Update - Product id: ${productId.slice(0, 8)}`;
      const message = "Congratulations! Your Product was successfully updated.";
      await saveHistory(
        productId,
        title,
        message,
        "product",
        savedProduct.storeId
      );

      res.status(200).json({
        status: "success",
        message: "Update successful",
      });
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Update couldn't be completed",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.title = req.body.title;
      product.slug = req.body.slug;
      product.description = req.body.description;
      product.parent = req.body.parent;
      product.children = req.body.children;
      product.type = req.body.type;
      product.unit = req.body.unit;
      product.quantity = req.body.quantity;
      product.originalPrice = req.body.originalPrice;
      product.price = req.body.price;
      product.discount = req.body.discount;
      product.images = req.body.images;
      product.tag = req.body.tag;
      product.storeName = req.body.storeName;
      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const updateStatus = async (req, res) => {
  const newStatus = req.body.status;
  console.log(newStatus);

  try {
    const findProduct = await Product.findById({ _id: req.params.id });
    if (findProduct) {
      await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: newStatus,
          },
        }
      ).then(async (savedProduct) => {
        const title = `Product status Update - Product id: ${savedProduct._id.slice(
          0,
          8
        )}`;
        const message =
          "Congratulations! Your Product status successfully Updated.";
        await saveHistory(
          savedProduct._id,
          title,
          message,
          "product",
          savedProduct?.storeId
        );
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
        });
      });
    } else {
      res.status(500).send({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const findProduct = await Product.findById({ _id: req.params.id });
    if (findProduct) {
      await Product.deleteOne({ _id: req.params.id }).then(
        async (savedProduct) => {
          const title = `Product status Update - Product id: ${savedProduct._id.slice(
            0,
            8
          )}`;
          const message =
            "Congratulations! Your Product status successfully Updated.";
          await saveHistory(
            savedProduct._id,
            title,
            message,
            "product",
            savedProduct?.storeId
          );
          res.status(200).send({
            message: "Product Deleted Successfully!",
            status: 200,
          });
        }
      );
    } else {
      res.status(500).send({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const result = await Product.find({ status: "Show" })
      .skip(0)
      .limit(20)
      .sort({ _id: -1 });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @access Public.
const getSearchProducts = async (req, res) => {
  const searchKey = req.params.searchtitle.toLowerCase();
  const product = await Product.find({});

  const allSearchedProducts = product.filter((i) => {
    const mainname = i.title.toLowerCase();
    return mainname.includes(searchKey) && i;
  });
  console.log(allSearchedProducts);

  if (product) {
    res.status(200).json({ total: product.length, allSearchedProducts });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// get all products by role
const getAllProductsByRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const isUser = await User.findById({ _id: userId });

    if (isUser && isUser?.role === "admin") {
      const products = await Product.find({}).sort({ _id: -1 });
      res.send(products);
    } else if (isUser && isUser?.role === "seller") {
      const products = await Product.find({ sellerId: userId }).sort({
        _id: -1,
      });
      res.send(products);
    } else {
      res.status(500).send({
        message: "User Not Valid",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  createProduct,
  allProducts,
  getProductsByStoreId,
  getShowProductsByStoreId,
  topRankingProducts,
  getLatestProductByStore,
  updateProductById,

  getAllProducts,
  getShowingProducts,
  getDiscountedProducts,
  getStockOutProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateStatus,
  deleteProduct,
  getProductsByParent,
  getSearchProducts,
  getLatestProducts,

  getProductsBySlugAndChildrenSlug,

  // ---------------dashboard ----------------
  getAllProductsByRole,
};
