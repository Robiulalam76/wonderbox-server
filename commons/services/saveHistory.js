const History = require("../../modules/history/HistoryModel");

async function saveHistory(activityId, title, message, type, roleId) {
  try {
    const newHistory = new History({
      activityId: activityId,
      title: title,
      message: message,
      type: type,
      roleId: roleId,
    });

    const savedHistory = await newHistory.save();
    return savedHistory;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveHistory,
};
