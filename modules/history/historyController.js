const History = require("./HistoryModel")

const getHistoryByRoleId = async (req, res) => {
    try {
        const { roleId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const count = await History.countDocuments({ roleId });
        const totalPages = Math.ceil(count / limit);

        const histories = await History.find({ roleId })
            .sort({ createAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: "success",
            data: {
                histories,
                currentPage: page,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};



module.exports = {
    getHistoryByRoleId
}