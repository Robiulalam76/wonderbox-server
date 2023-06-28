const saveNotification = require("../../commons/SaveNotification");
const { saveHistory } = require("../../commons/services/saveHistory");
const Address = require("./AddressModel");

const createAddress = async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const result = await newAddress.save();
    if (result) {
      // Call the saveNotification function with the newAddressId
      console.log(result);
      await saveNotification(
        result?._id,
        "New Address Added Successfully!",
        "address",
        req.body.userId
      );
      await saveHistory(
        result?._id,
        "New Address Added Successfully!",
        "Congratulations! You have successfully created a new Address.",
        "address",
        req.body.userId
      );

      res.status(200).json({
        status: "success",
        message: "New Address Created",
        data: req.body,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't insert z",
      error: error.message,
    });
  }
};

// get address by userId
const getAddressById = async (req, res) => {
  try {
    const result = await Address.find({ $and: [{ userId: req.params.id }] });
    res.status(200).json({
      status: "success",
      message: "get all Address Successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't find",
      error: error.message,
    });
  }
};

// update address data
const updateAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    if (updateData) {
      const result = await Address.updateOne(
        { _id: id },
        { $set: updateData },
        { runValidators: true }
      );
      res.status(200).json({
        update: true,
        status: "success",
        message: "Address Updated",
        data: result,
      });
    } else {
      return res.status(400).json({
        update: false,
        status: "error",
        message: "Data couldn't Updated",
        error: "User unauthorized",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't insert z",
      error: error.message,
    });
  }
};

// delete address data
const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const result = await Address.deleteOne({ _id: id });
      res.status(200).json({
        delete: true,
        status: "success",
        message: "Address Deleted",
        data: result,
      });
    } else {
      return res.status(400).json({
        delete: false,
        status: "error",
        message: "Data couldn't deleted",
        error: "User unauthorized",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Data couldn't insert z",
      error: error.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};
