const Review = require("./ReviewModel");


// Create a new review
const createReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const review = await newReview.save()
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId }).populate('reviewerId').sort({ _id: -1 });
        // Calculate the average rating
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.ceil(totalRating / totalReviews);

        // Calculate rating percentages
        const ratingCounts = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };

        reviews.forEach((review) => {
            ratingCounts[review.rating]++;
        });

        const ratingPercentages = {
            a: Math.ceil((ratingCounts[1] / totalReviews) * 100 || 0),
            b: Math.ceil((ratingCounts[2] / totalReviews) * 100 || 0),
            c: Math.ceil((ratingCounts[3] / totalReviews) * 100 || 0),
            d: Math.ceil((ratingCounts[4] / totalReviews) * 100 || 0),
            e: Math.ceil((ratingCounts[5] / totalReviews) * 100 || 0),
        };

        res.json({ reviews, averageRating, ratingPercentages, totalReviews });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
};



// Update a review
const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { title, comment, rating, isPositive } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                title,
                comment,
                rating,
                isPositive,
            },
            { new: true }
        );

        res.json(updatedReview);
    } catch (error) {
        console.log('Error updating review:', error);
        res.status(500).json({ error: 'An error occurred while updating the review' });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        await Review.findByIdAndDelete(reviewId);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.log('Error deleting review:', error);
        res.status(500).json({ error: 'An error occurred while deleting the review' });
    }
};


module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};
