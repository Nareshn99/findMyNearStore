const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    discreption: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: String,
        required: true,
        trim: true
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        require:true
    },
    Status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            requred: true
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


postSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Post', postSchema);