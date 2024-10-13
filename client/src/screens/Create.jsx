import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProtectedRoute from "../components/ProtectedRoute";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Create = () => {
    useDocumentTitle("Add / Edit");
    const navigate = useNavigate();
    const location = useLocation();

    const [title, setTitle] = useState(location.state?.title || "");
    const [description, setDescription] = useState(location.state?.description || "");
    const [loading, setLoading] = useState(false);

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.id;
        }
        return null;
    };

    // create or update note
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userId = getUserIdFromToken();

        try {
            if (location.state?.noteId) {
                // If noteId is present, edit the existing note
                const response = await axios.patch(
                    `${import.meta.env.VITE_EXPRESS_URL}/api/notes/edit/${location.state.noteId}`,
                    {
                        title,
                        description,
                        userId,
                    }
                );
                if (response.data?.success) {
                    toast.success(response.data.msg, { autoClose: 1000, hideProgressBar: true });
                    navigate("/");
                }
            } else {
                // If noteId is not present, create a new note
                const response = await axios.post(
                    `${import.meta.env.VITE_EXPRESS_URL}/api/notes/new`,
                    {
                        title,
                        description,
                        userId,
                    }
                );
                if (response.data?.success) {
                    toast.success(response.data.msg, { autoClose: 1000, hideProgressBar: true });
                    navigate("/");
                }
            }
        } catch (error) {
            setTitle("");
            setDescription("");
            console.log(error);
            toast.error(error.response?.data?.msg, { autoClose: 1000, hideProgressBar: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="p-4 mt-14">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-100 p-6 rounded shadow-md w-full sm:w-1/2 mx-auto flex flex-col"
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title (optional)"
                            maxLength="30"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            disabled={loading}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            name="description"
                            placeholder="Description"
                            maxLength="300"
                            rows="8"
                            onChange={(e) => setDescription(e.target.value.replace(/^\s+/, "").replace(/\s+$/g, ""))}
                            value={description}
                            required
                            disabled={loading}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 resize-none focus:ring-yellow-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-between">
                        <Link to="/">
                            <button
                                type="button"
                                className="w-full p-3 rounded bg-gray-300 hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`ml-2 w-full p-3 rounded bg-yellow-400 hover:bg-yellow-500 transition duration-200 ${
                                loading ? "bg-gray-500 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Adding..." : "Done"}
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
};

export default Create;
