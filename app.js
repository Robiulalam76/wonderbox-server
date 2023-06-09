const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// require routes
const userRoutes = require("./modules/user/userRoutes");
// const userRoutes = require("./modules/admin/");
const productRoutes = require("./modules/product/productRoutes");
const storeRoutes = require("./modules/store/storeRoutes");
const cardRoutes = require("./modules/card/cardRoutes");
const storeCardRoutes = require("./modules/storeCard/storeCardRoutes");
const reviewRoutes = require("./modules/review/reviewRoutes");
const addressRoutes = require("./modules/address/addressRoutes");
const notificationRoutes = require("./modules/notification/notificationRoutes");
const historyRoutes = require("./modules/history/historyRoutes");
const wishlistRoute = require("./modules/wishlist/wishlistRoute");
const addCartRoute = require("./modules/addCart/addCartRoute");
const categoryRoute = require("./modules/category/categoryRoute");
const transactionRoute = require("./modules/transaction/transactionRoute");

// api routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/storecard", storeCardRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/addcart", addCartRoute);
app.use("/api/category", categoryRoute);
app.use("/api/transaction", transactionRoute);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

app.get("/", (req, res) => {
  res.send("App works properly!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: errorMessage });
});

// app export
module.exports = app;
