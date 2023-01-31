const JWT = require('jsonwebtoken');
const { isValidObjectId } = require('../validattion/validation')
const userModel = require("../Models/userModel");


const Authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token)
            return res.status(401).send({ status: false, message: 'TOKEN is missing !!!' });

        let user = token.split(' ');
        JWT.verify(
            user[1],
            "na&*^resh*&%$2Go!2hil@3579e2$%#*",
            (err, decodedToken) => {
                if (err)
                    return res.status(400).send({ status: false, message: err.message })
                req.userId = decodedToken.userId
                next()
            });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const Authorization = async (req, res, next) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Invalid User Id" });

        let checkUser = await userModel.findById(userId)
        if (!checkUser)
            return res.status(404).send({ status: false, message: "User not found" })

        if (userId != req.userId)
            return res.status(403).send({ status: false, message: "Unauthorized" })
        req.user = checkUser
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { Authentication, Authorization };