const storeModel = require("../Models/storeModel.js")
const userModel = require("../Models/userModel.js")
const { isValidBody, isValidLat, isValidLon, isValidName } = require("../validattion/validation.js")


const createStore = async (req, res) => {
    try {
        let { storeName, discreption, Status } = req.body
        req.body.location = {
            coordinates: [
                req.body.longitude,
                req.body.latitude
            ]
        }
        let user = await storeModel.findOne({ ownerId: req.user._id })
        if (user) {
            return res.status(400).send({ status: false, message: "You Can't Creat more than One Store" });
        }
        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });

        if (!isValidName(storeName))
            return res.status(400).send({ status: false, message: "storeName Name must be present and only Alphabats " });

        if (!isValidName(discreption))
            return res.status(400).send({ status: false, message: "discreption must be present in validformat" });

        if (Status) {
            if (Status !== "Active" && Status !== "Inactive") {
                return res.status(400).send({ status: false, message: "Status must be Active/Inactive" });
            }
        }
        if (!isValidLat(req.body.longitude) || !isValidLon(req.body.latitude))
            return res.status(400).send({ status: false, message: "Invalid coordinates" });

        // Check for uniqueness of storeName and GeoLocation
        let post1 = await storeModel.find({ $or: [{ storeName }, { location: req.body.location }] })
        for (let key of post1) {
            if (key.location == req.body.location) {
                return res.status(409).send({ status: false, message: "Given GeoLocation is already taken" })
            }
            if (key.storeName == storeName.trim()) {
                return res.status(409).send({ status: false, message: "Given storeName is already taken" })
            }
        }
        req.body.owner = req.user.userName
        req.body.ownerId = req.user._id
        const data = await storeModel.create(req.body);
        res.status(201).send({ status: true, message: "Success", data: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getPost = async (req, res) => {
    try {
        let storeId = req.params.storeId;
        const finalData = await storeModel.find({ _id: storeId, isDeleted: false })
        if (finalData.length == 0)
            return res.status(404).send({ status: false, message: 'Store not found' });
        return res.status(200).send({ status: true, message: 'Success', data: finalData });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


const updatePost = async (req, res) => {
    try {
        let { storeName, discreption, Status } = req.body

        let storeId = req.params.storeId

        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });
        if (storeName) {
            if (!isValidName(storeName))
                return res.status(400).send({ status: false, message: "storeName Name must be present and only Alphabats " });
            let post = await storeModel.findOne({ storeName })
            if (post) {
                return res.status(409).send({ status: false, message: "Given storeName is already taken" })
            }
        }
        if (discreption) {
            if (!isValidName(discreption))
                return res.status(400).send({ status: false, message: "discreption must be present in validformat" });
        }
        if (Status) {
            if (Status !== "Active" && Status !== "Inactive") {
                return res.status(400).send({ status: false, message: "Status must be Active/Inactive" });
            }
        }
        if (req.body.longitude || req.body.latitude) {
            if (!isValidLat(req.body.longitude) || !isValidLon(req.body.latitude))
                return res.status(400).send({ status: false, message: "Invalid coordinates" });
            req.body.location = {
                coordinates: [
                    req.body.longitude,
                    req.body.latitude
                ]
            }
        }
        let data = await storeModel.findOneAndUpdate({ isDeleted: false, _id: storeId }, { ...req.body }, { new: true });
        res.status(201).send({ status: true, message: "Success", data: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const deletePost = async (req, res) => {
    try {
        let storeId = req.params.storeId
        let post = await storeModel.findOneAndUpdate({ isDeleted: false, _id: storeId }, { isDeleted: true }, { new: true });
        if (!post) {
            return res.status(404).send({ status: false, message: "post not found" });
        }
        return res.status(200).send({ status: true, message: "The post deleted successfully" });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



const getRetrievePosts = async (req, res) => {
    try {
        const { longitude, latitude } = req.body
        if (!isValidLat(longitude) || !isValidLon(latitude))
            return res.status(400).send({ status: false, message: "Invalid coordinates" });

        const finalData = await storeModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    key: "location",
                    distance: parseInt(1000) * 1609,
                    distanceField: "dist.calculated",
                    spherical: true
                }
            }
        ])
        return res.status(200).send({ status: true, message: 'Success', data: finalData });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


const getAllActiveAndInactive = async (req, res) => {
    try {
        const active = await storeModel.find({ isDeleted: false, Status: "Active" })
        const inactive = await storeModel.find({ isDeleted: false, Status: "Inactive" })
        return res.status(200).send({ status: true, message: 'Success', TotleActive: active.length, TotleInactive: inactive.length });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


module.exports = {
    createStore,
    getPost,
    updatePost,
    deletePost,
    getRetrievePosts,
    getAllActiveAndInactive
}