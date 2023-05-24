const Admin = require("../admin/AdminModel");
const User = require("../user/UserModel");
const Store = require("./storeModel");


const addStore = async (req, res) => {
  try {
    const store = new Store({
      name: req.body.name,
      logo: req.body.logo,
      images: req.body.images,
      username: req.body.name?.replaceAll(' ', '').toLowerCase(),
      userId: req.body.userId,
      description: req.body.description,
      address: req.body.address,
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
  const store = await Store.find({ status: "Show" });

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
  const { name, description, address } = req.body;
  const user = await User.findOne({ _id: req.params.id })
  if (user?.role === 'seller') {
    const store = new Store({
      userId: req.params.body,
      name,
      description,
      address,
    });
    const createdStore = await store.save();
    res.status(201).json(createdStore);
  }
  else {
    res.status(201).send({
      message: 'only seller and Admit can be added'
    })
  }
};

const deleteSingleStore = async (req, res) => {
  await Store.deleteOne({ _id: req.params.id });
  res.send({
    message: "Store Delete Succefully",
  });
};

const getVerifiedStores = async (req, res) => {
  const store = await Store.find({ verified: true });

  if (!store) {
    res.status(200);
    throw new Error("Order list is empty..");
  }
  res.json(store);
};


const updateStatus = async (req, res) => {
  const newStatus = req.body.status;
  console.log(newStatus);

  try {

    const findCategory = await Store.findById({ _id: req.params.id })
    if (findCategory) {
      const result = await Store.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: newStatus,
          },
        },
      )
      res.status(200).send({
        message: `Category ${newStatus} Successfully!`,
      });
    }
    else {
      res.status(500).send({
        message: "Category Not Found",
      });
    }

  }
  catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
};


const getAllStoresByRole = async (req, res) => {
  try {
    const { _id } = req.user
    const isAdmin = await Admin.findById({ _id: _id })
    const isSeller = await User.findById({ _id: _id })

    if (isAdmin && isAdmin?.role === "admin") {
      const stores = await Store.find({});
      res.send(stores);
    }
    else if (isSeller && isSeller?.role === "seller") {
      const stores = await Store.find({ userId: _id })
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


// handle function call to updated property
async function addProperty() {
  try {
    const result = await Store.updateMany({}, { status: "Show" });
    console.log(`${result.nModified} products updated`);
  } catch (error) {
    console.error(error);
  } finally {
    // close the database connection
    await mongoose.connection.close();
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

  updateStatus,
  getAllStoresByRole,
  addProperty
};
