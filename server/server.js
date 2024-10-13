const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/database");
const userController = require("./controllers/userController");
const notesController = require("./controllers/notesController");

// database connection
connectDB();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

/* routes */

app.get("/", (req, res) => {
    res.send("Welcome");
});

// account functions
app.post("/api/user/register", userController.registerUser);
app.post("/api/user/verifyOtp", userController.verifyOtp);
app.post("/api/user/login", userController.loginUser);

// notes function
app.post("/api/notes/new", notesController.createNewNote);
app.delete("/api/notes/delete/:id", notesController.deleteNoteById);
app.patch("/api/notes/edit/:id", notesController.updateNoteById);
app.get("/api/notes/all-my-notes/:userId", notesController.getAllNotesOfUserById);

app.use("/", (req, res) => {
    res.status(404).json({ message: "route not found" });
});

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server started");
});
