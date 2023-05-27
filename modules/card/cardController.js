const StoreCard = require("../storeCard/StoreCardModel");
const Card = require("./CardModel");

const createCard = async (req, res) => {
    try {
        const newCard = new Card(req.body);
        const result = await newCard.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}
// create card after verify
const createCardAfterVerify = async (req, res) => {
    try {
        const newCard = new Card(req.body);
        const result = await newCard.save();

        if (result) {
            const updateStatus = await StoreCard.findByIdAndUpdate(
                req.body.cardId,
                { $set: { active: true } },
                { new: true }
            );

            res.status(200).json(updateStatus);
        }
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
        const result = await Card.find({
            $and: [
                { userId: req.params.userId },
                { type: req.params?.type },
            ]
        })
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


// get all orders by store id
const getOrderCardsByStoreId = async (req, res) => {
    try {
        const cards = await Card.find({ storeId: req.params.storeId })
        res.status(201).send(cards);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}


module.exports = {
    createCard,
    createCardAfterVerify,
    getCardByUserId,
    getOrderCardsByStoreId,
}