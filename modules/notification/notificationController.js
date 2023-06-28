const User = require("../user/UserModel");
const Notification = require("./NotificationModel");

const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      activityId: req.body.activityId,
      title: req.body.title,
      type: req.body.type,
      from: req.body.from,
      to: req.body.to,
    });
    await newNotification.save();
    res.status(200).json({
      status: "success",
      message: "new Notification added",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get all history by user id
const getNotificationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({
      $or: [{ user: userId }],
    })
      .sort({ _id: -1 })
      .limit(20);
    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get all history by store id
const getNotificationByStoreId = async (req, res) => {
  try {
    const findUser = await User.findOne({ _id: req.params.roleId });

    if (findUser?.role === "admin") {
      const notifications = await Notification.find({})
        .sort({ _id: -1 }) // Sort by the 'timestamp' field in descending order
        .exec();
      res.status(200).send(notifications);
    } else if (findUser?.role === "seller") {
      const notifications = await Notification.find({
        $or: [{ user: req.params.roleId }],
      })
        .sort({ _id: -1 })
        .exec();

      res.status(200).send(notifications);
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getNotificationByUserId,
  getNotificationByStoreId,
};
