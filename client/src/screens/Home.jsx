import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Empty from "../components/Empty";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home = () => {
    useDocumentTitle("Notes");
    const navigate = useNavigate();
    const Name = localStorage.getItem("name");

    const isLogin = useSelector((state) => state.isLogin);

    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");

    // getting user id
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.id;
        }
        return null;
    };

    // showing notes
    const fetchNotes = async (userId) => {
        try {
            const userId = getUserIdFromToken();
            const response = await axios.get(
                `${import.meta.env.VITE_EXPRESS_URL}/api/notes/all-my-notes/${userId}`
            );
            if (response.data?.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            toast.error("failed to fetch notes", { autoClose: 1000, hideProgressBar: true });
            console.log(error);
        }
    };

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            fetchNotes(userId);
        }
    }, []);

    // delete note
    const deleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this note?")) {
            return;
        }
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_EXPRESS_URL}/api/notes/delete/${noteId}`
            );
            const data = response.data;
            if (response.data?.success) {
                setNotes(notes.filter((note) => note._id !== noteId));
                toast.info(data.msg, { autoClose: 1000, hideProgressBar: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg, { autoClose: 1000, hideProgressBar: true });
            console.log(error);
        }
    };

    // edit note
    const editNote = (noteId, noteTitle, noteDescription) => {
        navigate("/create", { state: { noteId, title: noteTitle, description: noteDescription } });
    };

    // toggle done state
    const toggleDone = async (noteId) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_EXPRESS_URL}/api/notes/edit/${noteId}`,
                { done: !notes.find((note) => note._id === noteId).done }
            );
            if (response.data?.success) {
                setNotes(
                    notes.map((note) =>
                        note._id === noteId ? { ...note, done: !note.done } : note
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to update note", { autoClose: 1000, hideProgressBar: true });
            console.log(error);
        }
    };

    return (
        <>
            {isLogin && (
                <h1 className="text-center m-5 text-slate-800 font-semibold text-2xl">
                    Welcome {Name}
                </h1>
            )}

            {/* button */}
            <Link to="/create">
                <button className="fixed sm:right-5 sm:bottom-5 right-3 bottom-3 text-6xl sm:text-7xl text-amber-500">
                    <i className="bi bi-file-earmark-plus-fill"></i>
                </button>
            </Link>

            {/* search bar */}
            <div className="m-5">
                <input
                    type="text"
                    placeholder="search Notes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/2 sm:p-2 p-1 px-2 rounded-md bg-slate-200 mx-auto block"
                />
            </div>

            {notes.length == 0 ? (
                <Empty />
            ) : (
                <p className="mx-5 text-blue-600">
                    <span className="border-b border-black pb-1">
                        Scheduled Notes : {notes.filter((note) => !note.done).length}
                    </span>
                </p>
            )}

            {/* schedules notes */}
            <div className="grid m-5 gap-5 sm:grid-cols-2">
                {notes
                    .filter((note) => note.done == false)
                    .filter((note) => {
                        const searchTerm = search.toLowerCase();
                        return searchTerm === ""
                            ? note
                            : note.title.toLowerCase().includes(searchTerm) ||
                                  note.description.toLowerCase().includes(searchTerm);
                    })
                    .map((note) => (
                        <Card
                            key={note._id}
                            title={note.title}
                            description={note.description}
                            deleteNote={() => deleteNote(note._id)}
                            editNote={() => editNote(note._id, note.title, note.description)}
                            toggleDone={() => toggleDone(note._id)}
                            done={note.done}
                        />
                    ))}
            </div>

            {/* completed notes */}
            {notes.length != 0 && (
                <p className="mx-5 text-emerald-600">
                    <span className="border-b border-black pb-1">
                        Completed Notes : {notes.filter((note) => note.done).length}
                    </span>
                </p>
            )}

            <div className="grid m-5 gap-5 sm:grid-cols-2">
                {notes
                    .filter((note) => note.done == true)
                    .filter((note) => {
                        const searchTerm = search.toLowerCase();
                        return searchTerm === ""
                            ? note
                            : note.title.toLowerCase().includes(searchTerm) ||
                                  note.description.toLowerCase().includes(searchTerm);
                    })
                    .map((note) => (
                        <Card
                            key={note._id}
                            title={note.title}
                            description={note.description}
                            deleteNote={() => deleteNote(note._id)}
                            editNote={() => editNote(note._id, note.title, note.description)}
                            toggleDone={() => toggleDone(note._id)}
                            done={note.done}
                        />
                    ))}
            </div>

            <br />
        </>
    );
};

export default Home;
