const Card = require("../card/CardModel");
const Review = require("../review/ReviewModel");
const Product = require("./ProductModel");

const getProductsByParentChildren = async (slug, children_slug) => {
  try {
    const products = await Product.find({
      status: "Show",
      parentSlug: slug,
      children_slug: children_slug,
    });
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

    return productsWithRating;
  } catch (error) {
    console.error("Error retrieving products by storeId with rating:", error);
    throw error;
  }
};

// get products by parent
const getProductsByParentSlug = async (slug) => {
  try {
    const products = await Product.find({
      status: "Show",
      parentSlug: slug,
    });
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

    return productsWithRating;
  } catch (error) {
    console.error("Error retrieving products by storeId with rating:", error);
    throw error;
  }
};

const getProductsByStoreIdWithRating = async (storeId) => {
  try {
    const products = await Product.find({ storeId: storeId, status: "Show" });
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

    const sortedProducts = productsWithRating.sort(
      (a, b) => b.rating - a.rating
    ); // Sort products by rating in

    return productsWithRating;
  } catch (error) {
    console.error("Error retrieving products by storeId with rating:", error);
    throw error;
  }
};

const getTopRankingProductsByStoreId = async (storeId) => {
  try {
    const topRankingProducts = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { averageRating: -1 }, // Sort by averageRating in descending order
      },
      {
        $limit: 10,
      },
    ]);

    const productIds = topRankingProducts.map((product) => product._id);

    const topRankingProductDetails = await Product.find({
      _id: { $in: productIds },
      storeId, // Filter products by storeId
      status: "Show",
    });

    const productsWithRating = topRankingProductDetails.map((product) => {
      const rating = topRankingProducts.find(
        (rating) => rating._id.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        rating: Math.ceil(rating ? rating.averageRating : 0), // Add average rating to each product
      };
    });

    const sortedProducts = productsWithRating.sort(
      (a, b) => b.rating - a.rating
    ); // Sort products by rating in descending order

    return sortedProducts;
  } catch (error) {
    console.error("Error retrieving top ranking products by storeId:", error);
    throw error;
  }
};

// get all top rankings products
const getTopRankingProducts = async () => {
  try {
    const topRankingProducts = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { averageRating: -1 }, // Sort by averageRating in descending order
      },
      {
        $limit: 10,
      },
    ]);
    const productIds = topRankingProducts.map((product) => product._id);
    const topRankingProductDetails = await Product.find({
      _id: { $in: productIds },
      status: "Show",
    });

    const productsWithRating = topRankingProductDetails.map((product) => {
      const rating = topRankingProducts.find(
        (rating) => rating._id.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        rating: Math.ceil(rating ? rating.averageRating : 0), // Add average rating to each product
      };
    });

    // console.log(productsWithRating);

    const sortedProducts = productsWithRating.sort(
      (a, b) => b.rating - a.rating
    ); // Sort products by rating in descending order

    return sortedProducts;
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

const findLatestProductByStore = async (storeId) => {
  try {
    const products = await Product.find({ storeId: storeId, status: "Show" });
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

    return productsWithRating;
  } catch (error) {
    console.error("Error retrieving products by storeId with rating:", error);
    throw error;
  }
};

// get products by store with ratings
const findProductsByStoreId = async (storeId) => {
  try {
    const products = await Product.find({ storeId: storeId });
    const productIds = products.map((product) => product._id);

    const productRatings = await Review.aggregate([
      {
        $match: { productId: { $in: productIds } },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }, // Add the totalRatings field
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
        totalRatings: rating ? rating.totalRatings : 0, // Add the totalRatings field
      };
    });

    return productsWithRating;
  } catch (error) {
    console.error("Error retrieving products by storeId with rating:", error);
    throw error;
  }
};

// get popular products by storeid
const getPopularProductsByStoreId = async (storeId) => {
  try {
    const popularProducts = await Card.aggregate([
      {
        $match: {
          storeId: storeId,
        },
      },
      {
        $group: {
          _id: "$productId",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { totalOrders: -1 },
      },
    ]);
    const productIds = popularProducts.map((product) => product._id);
    const popularProductDetails = await Product.find({
      _id: { $in: productIds },
      storeId: storeId,
      status: "Show",
    });

    return popularProductDetails;
  } catch (error) {
    console.error("Error retrieving popular products by storeId:", error);
    throw error;
  }
};

const getAllPopularProducts = async () => {
  try {
    const popularProducts = await Card.aggregate([
      {
        $group: {
          _id: "$productId",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { totalOrders: -1 }, // Sort by totalOrders in descending order
      },
    ]);

    const productIds = popularProducts.map((product) => product._id);
    const popularProductDetails = await Product.find({
      _id: { $in: productIds },
      status: "Show",
    });

    console.log(popularProductDetails);

    return popularProductDetails;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProductsByParentChildren,
  getProductsByParentSlug,
  getProductsByStoreIdWithRating,
  getTopRankingProductsByStoreId,
  getTopRankingProducts,
  findLatestProductByStore,
  findProductsByStoreId,
  getPopularProductsByStoreId,
  getAllPopularProducts,
};
