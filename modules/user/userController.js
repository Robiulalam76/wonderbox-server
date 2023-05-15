const User = require("./UserModel");

const registerUser = async (req, res) => {
    // const {
    //     name,
    //     email,
    //     password,
    //     country,
    //     phone,
    //     role,
    // } = req.body;

    try {

        console.log(req.body);
        // const isAdded = await User.findOne({ email: email });
        // if (isAdded) {
        //     return res.status(200).json({
        //         status: "error",
        //         message: { emailMessage: "Email Already in Use" },
        //         data: req.body.email
        //     });
        // }
        // else {
        //     const newUser = new User({
        //         name,
        //         email,
        //         country,
        //         phone,
        //         role,
        //         password: bcrypt.hashSync(password),
        //     });
        //     newUser.save();
        //     // const token = signInToken({ name, email, password: bcrypt.hashSync(password) });
        //     res.send({
        //         success: true,
        //         _id: newUser._id,
        //         name: newUser.name,
        //         email: newUser.email,
        //         message: "Please Login Now!",
        //     });
        // }

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Data couldn't insert z",
            error: error.message,
        });
    }
};



module.exports = {
    registerUser,
}