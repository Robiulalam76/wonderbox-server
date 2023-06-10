const User = require("../user/UserModel");
const Category = require("./CategoryModel");

// ---------------------- Dashboard ------------------------

// get all products by role
const getAllCategoriesByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const isSeller = await User.findById({ _id: roleId });
    if (isSeller && isSeller?.role === "admin") {
      const categories = await Category.find({ approved: true }).sort({
        _id: -1,
      });
      res.send(categories);
    } else if (isSeller && isSeller?.role === "seller") {
      const categories = await Category.find({
        approved: true,
        status: "Show",
      }).sort({
        _id: -1,
      });
      res.send(categories);
    } else {
      res.status(500).send({
        message: "User Not Valid",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ---------------------- Dashboard ------------------------

const addCategory = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id });
    const newCategory = new Category(req.body);
    if (admin?.role === "admin") {
      newCategory.approved = true;
      newCategory.status = "Show";
    }
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
      status: 500,
    });
  }
};

const addAllCategory = async (req, res) => {
  try {
    await Category.insertMany(req.body);
    res.status(200).send({
      message: "Category Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get request category by admin
const getRequestCategoryByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;
    const categories = await Category.find({
      $or: [
        { $and: [{ approved: false }, { store: storeId }] },
        { store: storeId },
      ],
    })
      .populate("store")
      .sort({
        _id: -1,
      });
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "Show" }).sort({
      _id: -1,
    });
    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({ approved: true }).sort({
      _id: -1,
    });
    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all category for dashboard
const getCategories = async (req, res) => {
  try {
    const { _id } = req.user;
    const isSeller = await User.findById({ _id: _id });

    if (isSeller && isSeller?.role === "admin") {
      const categories = await Category.find({}).sort({ _id: -1 });
      res.send(categories);
    } else if (isSeller && isSeller?.role === "seller") {
      const categories = await Category.find({ status: "Show" }).sort({
        _id: -1,
      });
      res.send(categories);
    } else {
      res.status(401).send({
        message: "User is not Admin / Seller",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.parent = req.body.parent;
      category.type = req.body.type;
      category.subCategory = req.body.subCategory;
      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send({ message: "Category not found!" });
  }
};

const updateStatus = async (req, res) => {
  const newStatus = req.body;
  console.log({ newStatus });
  try {
    const findCategory = await Category.findById({ _id: req.params.id });
    if (findCategory) {
      const result = await Category.updateOne(
        { _id: req.params.id },
        {
          $set: newStatus,
        }
      );
      res.status(200).send({
        message: `Category ${newStatus} Successfully!`,
      });
    } else {
      res.status(500).send({
        message: "Category Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
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

// update category info
const updateCategoryInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.updateOne(
      { _id: id },
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

const deleteSubCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findById({ _id: id });
  } catch (error) {}
};

const deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      status: 500,
    });
  }
};

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getCategories,
  getRequestCategoryByStoreId,
  updateCategoryInfo,

  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteSubCategory,
  deleteCategory,

  getAllCategoriesByRole,
};
