const express = require('express')
const router = express.Router()
const {createUser,userLogin}=require('../Controllers/userController')
const {createStore,getPost,updatePost,deletePost,getAllActiveAndInactive,getRetrievePosts}=require("../Controllers/storeController")
const  { Authentication, Authorization }=require("../middlewares/auth")


router.post("/resistor",createUser)
router.post('/login', userLogin)


router.post("/createStore/:userId", Authentication, Authorization ,createStore)
router.get("/getPost/:userId/:storeId", Authentication, Authorization ,getPost)
router.put("/updatePost/:userId/:storeId", Authentication, Authorization ,updatePost)
router.delete("/deletePost/:userId/:storeId", Authentication, Authorization ,deletePost)


router.get("/getAllActiveAndInactive",getAllActiveAndInactive)
router.get("/getRetrievePosts",getRetrievePosts)


//errorHandling for wrong address
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router