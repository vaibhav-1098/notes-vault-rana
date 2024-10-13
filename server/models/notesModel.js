const mongoose = require("mongoose");

// schema to make document
const NotesSchema = new mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: true },
    done: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
});

// collection to make model

const NotesModel = mongoose.model("note", NotesSchema);
module.exports = NotesModel;
