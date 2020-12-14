const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt; //jwt cookie get
        const veryfyUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(veryfyUser);

        const user = await Register.findOne({ _id: veryfyUser._id });
        // console.log(user.username);
        // console.log(user);

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        error = { "error": "Error please log in" };
        res.status(400).redirect("../");
        // res.status(401).send(error);
    }

}

module.exports = auth;