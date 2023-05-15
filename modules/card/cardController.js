const Card = require("./CardModel");

const createCard = async (req, res) => {
    try {
        const newCard = new Card({
            title: req.body.title,
            productId: req.body.productId,
            userId: req.body.userId,
            storeId: req.body.storeId,
            features: req.body.features,
            amount: req.body.amount
        });
        const result = await newCard.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}



// get card by user id

const getCardByUserId = async (req, res) => {
    try {
        const result = await Card.find({ userId: req.params.userId })
        res.status(201).json({
            status: "success",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}


module.exports = {
    createCard,
    getCardByUserId,
}