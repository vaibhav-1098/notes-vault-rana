const mongoose = require("mongoose");

// schema to make document
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notes: [{ type: mongoose.Types.ObjectId, ref: "note" }],
});

// collection to make model
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
