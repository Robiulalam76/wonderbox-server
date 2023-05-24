const express = require('express');
const { createReview, getProductReviews, getProductRatingStatisticsAndReviews } = require('./reviewController');

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Get all reviews and statices
router.get('/reviews-and-statistics/:productId', getProductRatingStatisticsAndReviews);

module.exports = router;
