const notesModel = require("../models/notesModel");
const userModel = require("../models/userModel");

const createNewNote = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const newNote = await notesModel.create({ title, description, userId });
        await userModel.findByIdAndUpdate(userId, { $push: { notes: newNote._id } });
        res.send({ msg: "note created", success: true, newNote });
    } catch (error) {
        res.status(500).send({ msg: "an error occurred", success: false });
    }
};

const deleteNoteById = async (req, res) => {
    try {
        const note = await notesModel.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send({ msg: "no such note", success: false });
        }
        await userModel.findByIdAndUpdate(note.userId, { $pull: { notes: note._id } });
        res.send({ msg: "deleted successfully", success: true, note });
    } catch (error) {
        res.status(500).send({ msg: "an error occurred", success: false });
    }
};

const updateNoteById = async (req, res) => {
    try {
        const { title, description, done } = req.body;
        const note = await notesModel.findByIdAndUpdate(
            req.params.id,
            { title, description, done },
            { new: true }
        );
        if (!note) {
            return res.status(404).send({ msg: "no such note", success: false });
        }
        res.send({ msg: "note updated successfully", success: true, note });
    } catch (error) {
        res.status(500).send({ msg: "an error occurred", success: false });
    }
};

const getAllNotesOfUserById = async (req, res) => {
    try {
        const notes = await notesModel.find({ userId: req.params.userId }).sort({ _id: -1 });
        res.send({ success: true, number: notes.length, notes });
    } catch (error) {
        res.status(500).send({ msg: "an error occurred", success: false });
    }
};

module.exports = {
    createNewNote,
    deleteNoteById,
    updateNoteById,
    getAllNotesOfUserById,
};
