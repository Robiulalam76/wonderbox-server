const { saveHistory } = require("../../commons/services/saveHistory");
const Notification = require("../notification/NotificationModel");
const Review = require("./ReviewModel");


// Create a new review
const createReview = async (req, res) => {
    try {
        const newReview = new Review({
            reviewerId: req.body.reviewerId,
            productId: req.body.productId,
            rating: req.body.rating,
            isPositive: req.body.isPositive,
            title: req.body.title,
            comment: req.body.comment,
        });
        newReview.save()
            .then(async savedReview => {
                const newNotification = new Notification({
                    activityId: savedReview._id,
                    title: "New Product Review Submitted",
                    type: "review",
                    from: req.body.reviewerId,
                    to: req.body.storeId
                })
                newNotification.save()
                    .then(async savedNotify => {
                        const title = `New Review - Product: ${req.body.productId.slice(0, 8)}`
                        const message = "Thank you for submitting a review for the product. Your feedback is greatly appreciated."
                        const result = await saveHistory(savedReview._id, title, message, "review", req.body.reviewerId)
                        res.status(200).json({
                            status: "success",
                            message: "New Review Add Success"
                        });
                    })
            })
            .catch(err => {
                res.status(500).json({
                    status: "error",
                    message: err.message
                });
            });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
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
        await Review.findByIdAndUpdate(
            reviewId,
            {
                title,
                comment,
                rating,
                isPositive,
            },
            { new: true }
        )
            .then(async savedReview => {
                const title = `Update Review - Product: ${savedReview.productId.slice(0, 8)}`
                const message = "Thank you for updating a review for the product."
                await saveHistory(savedReview._id, title, message, "review", savedReview?.reviewerId)
                res.status(200).json({
                    status: "suceess",
                    message: "Review Update Success"
                });
            })

    } catch (error) {
        console.log('Error updating review:', error);
        res.status(500).json({ error: 'An error occurred while updating the review' });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        await Review.findByIdAndDelete(reviewId)
            .then(async savedReview => {
                const title = `Your Review has been deleted - Product id: ${savedReview.productId.slice(0, 8)}`
                const message = "Thank you for a review for the product."
                const result = await saveHistory(savedReview._id, title, message, "review", savedReview?.reviewerId)
                res.json({ message: 'Review deleted successfully' });
            })
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
