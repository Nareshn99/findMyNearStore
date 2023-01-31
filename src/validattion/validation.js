const mongoose = require("mongoose")

const isValidBody = (reqBody) => {
    return Object.keys(reqBody).length == 0;
}

const isValidName = (name) => {
    return /^[a-zA-Z\. ]*$/.test(name)
}

const isValidLat = (location) => {
    return /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/.test(location)
};

const isValidLon = (location) => {
    return /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/.test(location)
};


const isValidEmail = (Email) => {
    return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
};

const isValidPwd = (Password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
};

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  }


module.exports = {
    isValidBody, 
    isValidEmail, 
    isValidPwd, 
    isValidName,
    isValidLat,
    isValidLon,
    isValidObjectId
}