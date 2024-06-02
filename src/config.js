const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/your-database-name");


connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
});


const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    }
});


const collection = new mongoose.model("users", Loginschema);

module.exports = collection;