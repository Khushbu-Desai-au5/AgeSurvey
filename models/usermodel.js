const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    country: { type: String },
    age: { type: Number },
    gender: { type: String },
    nationality: { type: String }
})

module.exports = mongoose.model('UserModel', userSchema)