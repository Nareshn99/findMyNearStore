const userModel = require("../Models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { isValidBody, isValidEmail, isValidPwd, isValidName } = require("../validattion/validation.js")

const createUser = async (req, res) => {
    try {
        let { userName, email, password } = req.body

        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });

        if (!isValidName(userName))
            return res.status(400).send({ status: false, message: "UserName must be present and only Alphabats " });

        if (!isValidEmail(email))
            return res.status(400).send({ status: "false", message: "Email id must be require and in valid formate" });

        if (!isValidPwd(password))
            return res.status(400).send({ status: "false", message: "Password must be require and Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" });

        req.body.password = await bcrypt.hash(password, 10)

        // Check for uniqueness of email
        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(409).send({ status: false, message: "Given email is already taken" })
        }

        const data = await userModel.create(req.body);
        res.status(201).send({ status: true, message: "User Created", data: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const userLogin = async (req, res) => {
    try {
        let { email, password } = req.body

        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });
        if (!isValidEmail(email))
            return res.status(400).send({ status: "false", message: "Email id must be require and in valid formate" });

        //find user from dataBase
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" });
        }
        let correctPass = await bcrypt.compare(password, user.password)
        if (!correctPass) {
            return res.status(400).send({ status: false, message: "Invalid Password" });
        }

        let token = jwt.sign(
            { userId: user._id },
            "na&*^resh*&%$2Go!2hil@3579e2$%#*",
            { expiresIn: '1d' }
        )

        return res.status(201).send({ status: true, message: "Success", data: { token: token } });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {
    createUser,
    userLogin
}
