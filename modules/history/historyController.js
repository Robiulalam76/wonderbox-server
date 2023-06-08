const History = require("./HistoryModel")

const getHistoryByRoleId = async (req, res) => {
    try {
        const histories = await History.find({ roleId: req.params.roleId }).sort({ createAt: -1 })
        res.status(200).send(histories);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
};


module.exports = {
    getHistoryByRoleId
}