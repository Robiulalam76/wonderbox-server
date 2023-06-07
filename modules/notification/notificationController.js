const Store = require("../store/storeModel")
const User = require("../user/UserModel")
const Notification = require("./NotificationModel")

const createNotification = async (req, res) => {
    try {
        const newNotification = new Notification({
            activityId: req.body.activityId,
            title: req.body.title,
            type: req.body.type,
            from: req.body.from,
            to: req.body.to
        })
        await newNotification.save()
        res.status(200).json({
            status: "success",
            message: "new Notification added"
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


// get all history by user id
const getNotificationByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ $or: [{ to: userId }, { from: userId }] }).sort({ _id: -1 });
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
        const findUser = await User.findOne({ _id: req.params.roleId })

        if (findUser?.role === "admin") {
            const notifications = await Notification.find({})
                .sort({ timestamp: -1 })  // Sort by the 'timestamp' field in descending order
                .exec();
            res.status(200).send(notifications)
        }
        else if (findUser?.role === "seller") {
            const storeIds = await Store.find({ userId: req.params.roleId }).select('_id').lean().exec();
            const objectIdStoreIds = storeIds.map(store => store._id);

            const notifications = await Notification.find({
                $or: [
                    { to: { $in: objectIdStoreIds } },
                    { to: req.params.roleId },
                    { from: req.params.roleId }
                ]
            })
                .sort({ timestamp: -1 })
                .exec();

            res.status(200).send(notifications);

        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


module.exports = {
    createNotification,
    getNotificationByUserId,
    getNotificationByStoreId
}