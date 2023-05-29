const express = require("express");
const { registerUser, loginUser, signupWithSocial, getAllUsers, getUserById, updateUser, deleteUser, patchUserInfoById, getUserInfo } = require("./userController");
const { isAuth } = require("../../config/auth");
const router = express.Router();

// new user register
router.post("/register", registerUser);

//login a user
router.post('/login', loginUser);

// get userinfo by token
router.get('/me', isAuth, getUserInfo);

// signup with social
router.post('/signup/withsocial', signupWithSocial);

//get all user
router.get('/', getAllUsers);

//get a user
router.get('/:id', getUserById);

//update a user
router.put('/:id', updateUser);

//delete a user
router.delete('/:userId/:adminId', deleteUser);

//update a user info
router.patch('/:id', patchUserInfoById);



module.exports = router;