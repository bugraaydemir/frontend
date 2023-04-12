import Notification from "../models/Notification.js";

export const readNotification = async(req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification Not Found" });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};