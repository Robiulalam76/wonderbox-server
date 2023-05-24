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

        const reviews = await Review.find({ productId }).populate('reviewerId');
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





// Get rating statistics and reviews for a product
const getProductRatingStatisticsAndReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log(productId);

        const ratingStatistics = await Review.aggregate([
            {
                $match: { productId: productId }
            },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    ratings: {
                        $push: {
                            rating: '$_id',
                            count: '$count'
                        }
                    },
                    totalReviewers: { $sum: '$count' },
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $project: {
                    _id: 0,
                    ratings: 1,
                    totalReviewers: 1,
                    averageRating: { $round: ['$averageRating', 1] }
                }
            }
        ]);

        const reviews = await Review.find({ productId });

        let ratingPercentage = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        if (ratingStatistics.length > 0) {
            const ratings = ratingStatistics[0].ratings;
            const totalReviewers = ratingStatistics[0].totalReviewers;

            ratings.forEach(rating => {
                ratingPercentage[rating.rating] = (rating.count / totalReviewers) * 100;
            });
        }

        res.json({ ratingPercentage, reviews, ...ratingStatistics[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve rating statistics and reviews' });
    }
};


module.exports = {
    createReview,
    getProductReviews,
    getProductRatingStatisticsAndReviews
};
