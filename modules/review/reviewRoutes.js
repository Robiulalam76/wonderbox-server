const express = require('express');
const { createReview, getProductReviews, deleteReview, updateReview } = require('./reviewController');

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Update a review
router.put('/update/:reviewId', updateReview);

// Delete a review
router.delete('/delete/:reviewId', deleteReview);

module.exports = router;
