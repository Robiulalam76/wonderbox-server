const Notification = require("../modules/notification/NotificationModel");

const saveNotification = async (activityId, title, type, user) => {
  try {
    const newNotification = new Notification({
      activityId,
      title,
      type,
      user,
    });
    const result = await newNotification.save();
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = saveNotification;
