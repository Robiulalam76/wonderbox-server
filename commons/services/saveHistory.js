const History = require("../../modules/history/HistoryModel");

async function saveHistory(title, message, type, roleId) {
  try {
    const newHistory = new History({
      title,
      message,
      type,
      roleId,
    });

    const savedHistory = await newHistory.save();
    return savedHistory;
  } catch (error) {
    // Handle error appropriately (e.g., log it or throw an exception)
    throw error;
  }
}

module.exports = {
  saveHistory,
};
