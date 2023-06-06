const Store = require("../store/storeModel")
const User = require("../user/UserModel")
const History = require("./HistoryModel")

const createHistory = async (req, res) => {
    try {
        const newHistory = new History({
            activityId: req.body.activityId,
            title: req.body.title,
            type: req.body.type,
            to: req.body.to
        })
        await newHistory.save()
        res.status(200).json({
            status: "success",
            message: "new history added"
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


// get all history by user id
const getHistoryByUserId = async (req, res) => {
    try {
        const histories = await History.find({ to: req.params.userId }).sort({ _id: -1 })
        res.status(200).send(histories)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

// get all history by store id
const getHistoryByStoreId = async (req, res) => {
    try {
        const findUser = await User.findOne({ _id: roleId })

        if (findUser?.role === "admin") {
            const findStores = await Store.find({})
            const histories = await History.find({ to: { $in: findStores?._id } })
                .sort({ timestamp: -1 })  // Sort by the 'timestamp' field in descending order
                .exec();
            res.status(200).send(histories)
        }
        else if (findUser?.role === "seller") {
            const findStores = Store.find({ userId: req.params.roleId })
            const histories = await History.find({ to: { $in: findStores?._id } })
                .sort({ timestamp: -1 })  // Sort by the 'timestamp' field in descending order
                .exec();
            res.status(200).send(histories)
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


module.exports = {
    createHistory,
    getHistoryByUserId,
    getHistoryByStoreId
}