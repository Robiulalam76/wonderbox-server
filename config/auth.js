require("dotenv").config();
const jwt = require("jsonwebtoken");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

// for email verify
const generateEmailVerifyToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_FOR_VERIFY, {
    expiresIn: "2d",
  });
};

const getUserInfoByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY);
    return decoded;
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  generateEmailVerifyToken,
  getUserInfoByToken,
};
