const Review = require("../review/ReviewModel");
const Product = require("./ProductModel");


const getProductsByStoreIdWithRating = async (storeId) => {
    try {
        const products = await Product.find({ storeId: storeId, status: "Show" });
        const productIds = products.map((product) => product._id);

        const productRatings = await Review.aggregate([
            {
                $match: { productId: { $in: productIds } }
            },
            {
                $group: {
                    _id: '$productId',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const productsWithRating = products.map((product) => {
            const rating = productRatings.find((rating) => rating._id.toString() === product._id.toString());
            return {
                ...product.toObject(),
                rating: Math.ceil(rating ? rating.averageRating : 0)
            };
        });

        const sortedProducts = productsWithRating.sort((a, b) => b.rating - a.rating); // Sort products by rating in 

        return productsWithRating;
    } catch (error) {
        console.error('Error retrieving products by storeId with rating:', error);
        throw error;
    }
};


const getTopRankingProductsByStoreId = async (storeId) => {
    try {
        const topRankingProducts = await Review.aggregate([
            {
                $group: {
                    _id: '$productId',
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { averageRating: -1 } // Sort by averageRating in descending order
            },
            {
                $limit: 10
            }
        ]);

        const productIds = topRankingProducts.map((product) => product._id);

        const topRankingProductDetails = await Product.find({
            _id: { $in: productIds },
            storeId // Filter products by storeId
        });

        const productsWithRating = topRankingProductDetails.map((product) => {
            const rating = topRankingProducts.find((rating) => rating._id.toString() === product._id.toString());
            return {
                ...product.toObject(),
                rating: Math.ceil(rating ? rating.averageRating : 0) // Add average rating to each product
            };
        });

        const sortedProducts = productsWithRating.sort((a, b) => b.rating - a.rating); // Sort products by rating in descending order

        return sortedProducts;
    } catch (error) {
        console.error('Error retrieving top ranking products by storeId:', error);
        throw error;
    }
};



const findLatestProductByStore = async (storeId) => {
    try {
        const products = await Product.find({ storeId: storeId, status: "Show" });
        const productIds = products.map((product) => product._id);

        const productRatings = await Review.aggregate([
            {
                $match: { productId: { $in: productIds } }
            },
            {
                $group: {
                    _id: '$productId',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const productsWithRating = products.map((product) => {
            const rating = productRatings.find((rating) => rating._id.toString() === product._id.toString());
            return {
                ...product.toObject(),
                rating: Math.ceil(rating ? rating.averageRating : 0)
            };
        });

        return productsWithRating;
    } catch (error) {
        console.error('Error retrieving products by storeId with rating:', error);
        throw error;
    }
};



module.exports = {
    getProductsByStoreIdWithRating,
    getTopRankingProductsByStoreId,
    findLatestProductByStore,
}
