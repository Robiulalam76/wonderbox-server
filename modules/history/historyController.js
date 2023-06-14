const History = require("./HistoryModel");

// get all histories
const getAllHistories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const totalCount = await History.countDocuments({});
    const totalPages = Math.ceil(totalCount / perPage);
    const skip = (page - 1) * perPage;

    const histories = await History.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      page,
      totalPages,
      totalCount,
      histories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

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
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllHistories,
  getHistoryByRoleId,
};
