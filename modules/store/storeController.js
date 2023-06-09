const { saveHistory } = require("../../commons/services/saveHistory");
const User = require("../user/UserModel");
const Store = require("./storeModel");


const addStore = async (req, res) => {
  try {
    const store = new Store({
      name: req.body.name,
      logo: req.body.logo,
      images: req.body.images,
      username: req.body.username?.replaceAll(' ', '').toLowerCase(),
      userId: req.body.userId,
      street: req.body.street,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
      email: req.body.email,
      description: req.body.description
    });
    await store.save()
      .then(async savedStore => {
        const title = `New Store Create - store id: ${savedStore?._id.slice(0, 8)}`
        const message = "Congratulations! You have successfully create a new store."
        await saveHistory(savedStore?._id, title, message, "store", savedStore?._id)
        res.status(200).json(createdStore);
      })

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }

};


const getStore = async (req, res) => {
  const store = await Store.find({ status: "Show" }).populate("userId");

  if (!store) {
    res.status(200);
    throw new Error("Order list is empty..");
  }
  res.json(store);
};



const getStoreById = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  console.log(store);

  if (store) {
    res.send(store);
  } else {
    res.status(404);
  }
};


const getStoreByUsername = async (req, res) => {
  const store = await Store.findOne({ username: req.params.username });
  try {
    if (store) {
      res.send(store);
    } else {
      res.status(404).json({ message: 'no data' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addStoreBySeller = async (req, res) => {
  try {
    const isSeller = await User.findById({ _id: req.params.id })
    if (isSeller.role === "seller") {
      const store = new Store({
        name: req.body.name,
        logo: req.body.logo,
        images: req.body.images,
        username: req.body.username?.replaceAll(' ', '').toLowerCase(),
        userId: req.body.userId,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        email: req.body.email,
        description: req.body.description
      });
      await store.save()
        .then(async savedStore => {
          const title = `New Store Create - store id: ${savedStore?._id.slice(0, 8)}`
          const message = "Congratulations! You have successfully create a new store."
          await saveHistory(savedStore?._id, title, message, "store", savedStore?._id)
          res.status(200).json(createdStore);
        })
    }
    else {
      res.status(500).json({
        status: "error",
        message: "only Seller Can Be added"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
}


const deleteSingleStore = async (req, res) => {
  await Store.deleteOne({ _id: req.params.id })
    .then(async deleteStore => {
      const title = `Store Delete Successfull - store id: ${req.params.id.slice(0, 8)}`
      const message = "Congratulations! You have successfully create a new store."
      await saveHistory(req.params.id, title, message, "store", req.params.id)
      res.send({
        message: "Store Delete Succefully",
      });
    })
};


// get verified stores
const getVerifiedStores = async (req, res) => {
  const store = await Store.find({ verified: true }).limit(8);
  if (!store) {
    res.status(200);
    throw new Error("Order list is empty..");
  }
  res.json(store);
};


// update store info
const updateStoreByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;
    const result = await Store.updateOne(
      { _id: storeId },
      { $set: req.body },
      { runValidators: true }
    )
      .then(async savedStore => {
        const title = `Store Info Update Successfull - store id: ${storeId.slice(0, 8)}`
        const message = "Congratulations! You have successfully updated info."
        await saveHistory(storeId, title, message, "store", storeId)
        res.status(200).json({
          status: "success",
          message: "Update successfully",
          data: result,
        });
      })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "upadate couldn't success",
      error: error.message,
    });
  }
};


// change store username by id
const updateUsername = async (req, res) => {
  try {
    const { storeId } = req.params;
    if (req.body) {
      const findUsername = await Store.findOne({ username: req.body.username })
      if (findUsername) {
        return res.status(400).json({
          status: "error",
          message: "Username already in use",
          error: "upadate couldn't success",
        });
      }
      else {
        await Store.updateOne(
          { _id: storeId },
          { $set: req.body },
          { runValidators: true }
        )
          .then(async savedStore => {
            const title = `Store Username Update Successfull - store id: ${storeId.slice(0, 8)}`
            const message = "Congratulations! You have successfully store new username updated."
            await saveHistory(storeId, title, message, "store", storeId)
            res.status(200).json({
              status: "success",
              message: "username Update successfully",
              data: result,
            });
          })
      }
    }
    else {
      return res.status(400).json({
        status: "error",
        message: "Please Provide new Username",
        error: "Data not found",
      });
    }

  }
  catch (error) {
    res.status(400).json({
      status: "error",
      message: "upadate couldn't success",
      error: error.message,
    });
  }
};




const getAllStoresByRole = async (req, res) => {
  try {
    const { userId } = req.params
    const isUser = await User.findById({ _id: userId })

    if (isUser?.role === "admin") {
      const stores = await Store.find({});
      res.send(stores);
    }
    else if (isUser && isUser?.role === "seller") {
      const stores = await Store.find({ userId: userId })
      res.send(stores);
    }
    else {
      res.status(500).send({
        message: "User Not Valid",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}


module.exports = {
  addStore,
  getStoreByUsername,
  getStore,
  getStoreById,
  addStoreBySeller,
  deleteSingleStore,
  getVerifiedStores,
  updateStoreByStoreId,
  updateUsername,

  getAllStoresByRole,
};
