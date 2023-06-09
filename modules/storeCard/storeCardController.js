const StoreCard = require("./StoreCardModel");

const createStoreCard = async (req, res) => {
    try {
        const newCard = new StoreCard(req.body);
        await newCard.save()
            .then(async savedCard => {
                const title = `New Card Order - Product id: ${savedCard.productId.slice(0, 8)}`
                const message = 'Congratulations! You have successfully placed a new order. We will process your order and provide updates soon.'
                await saveHistory(savedCard._id, title, message, "order", savedCard?.userId)
                res.status(201).json({ message: "new card added successfull" });
            })

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}



const getAllCards = async (req, res) => {
    try {
        const cards = await StoreCard.find({}).sort({ _id: -1 });
        res.status(200).send(cards)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}


// verify card
const verifyCard = async (req, res) => {
    try {
        const { checkNumber, securityCode, email } = req.body
        const isValid = await StoreCard.findOne({
            $and: [
                { checkNumber: checkNumber },
                { securityCode: securityCode },
                { active: "false" }
            ]
        });
        if (isValid) {
            res.status(200).json({
                status: "success",
                message: "Card Is Valid",
                data: isValid
            });
        }
        else {
            res.status(200).json({
                status: "error",
                message: "Card Is invalid",
                data: null
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}



// get card by store id
const getStoreCardByStoreId = async (req, res) => {
    try {
        const result = await StoreCard.find({ storeId: req.params.storeId })
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
    createStoreCard,
    getAllCards,
    getStoreCardByStoreId,
    verifyCard,
}