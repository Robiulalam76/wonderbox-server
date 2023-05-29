const User = require("../user/UserModel");
const Store = require("./storeModel");


const addStore = async (req, res) => {
  try {
    console.log(req.body);
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
    const createdStore = await store.save();
    res.status(201).json(createdStore);

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
      const createdStore = await store.save();
      res.status(201).json(createdStore);
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
  await Store.deleteOne({ _id: req.params.id });
  res.send({
    message: "Store Delete Succefully",
  });
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
    console.log(storeId);
    const result = await Store.updateOne(
      { _id: storeId },
      { $set: req.body },
      { runValidators: true }
    );
    res.status(200).json({
      status: "success",
      message: "Update successfully",
      data: result,
    });
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
        const result = await Store.updateOne(
          { _id: storeId },
          { $set: req.body },
          { runValidators: true }
        );
        return res.status(200).json({
          status: "success",
          message: "username Update successfully",
          data: result,
        });
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



// get all orders by store id
// const getOdersByStoreId = async (req, res) => {
//   try {
// const orders = await 
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// }



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
