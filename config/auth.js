require("dotenv").config();
const jwt = require("jsonwebtoken");

const signInToken = (user) => {
    console.log(user, "yydf");
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            image: user.image,
        },
        "5r4se46e79y8hw786g4aew86rf746rtf4a6egh7498h468earf494ga6469gh4w4r5gy6e5g6e45g+9ea5gh+a6e5f+95FR+9q45f9",
        {
            expiresIn: "2d",
        }
    );
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

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, "5r4se46e79y8hw786g4aew86rf746rtf4a6egh7498h468earf494ga6469gh4w4r5gy6e5g6e45g+9ea5gh+a6e5f+95FR+9q45f9");
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (err) {
        res.status(401).send({
            message: err.message,
        });
    }
};



// const isAdmin = async (req, res, next) => {
//     const admin = await Admin.findOne({ role: "admin" });
//     if (admin) {
//         next();
//     } else {
//         res.status(401).send({
//             message: "User is not Admin",
//         });
//     }
// };


module.exports = {
    signInToken,
    tokenForVerify,
    isAuth,
    // isAdmin,
    // sendEmail,
};
