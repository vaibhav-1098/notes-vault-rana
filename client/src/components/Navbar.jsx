import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authActions } from "../redux/store"; 

const Navbar = () => {
    const isLogin = useSelector((state) => state.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Email = localStorage.getItem("email");

    const handleLogout = () => {
        try {
            dispatch(authActions.logout());
            localStorage.clear();
            toast.warn("logged out", { autoClose: 1000, hideProgressBar: true });
            navigate("/login");
        } catch (error) {
            toast.warn("error logging out", { autoClose: 1000, hideProgressBar: true });
        }
    };

    return (
        <div>
            <nav className="flex justify-between items-center bg-yellow-400 p-4 px-5">
                <div>
                    <Link className="text-xl font-semibold" to="/">
                        NotesVault
                    </Link>
                </div>
                <div className="flex gap-6">
                    {!isLogin && (
                        <div className="flex justify-center items-center gap-3">
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `p-1 px-2 rounded-md border border-black ${
                                        isActive ? "bg-amber-500" : "bg-transparent"
                                    }`
                                }
                            >
                                Register
                            </NavLink>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `p-1 px-2 rounded-md border border-black w-16 text-center ${
                                        isActive ? "bg-amber-500" : "bg-transparent"
                                    }`
                                }
                            >
                                Login
                            </NavLink>
                        </div>
                    )}
                    {isLogin && (
                        <div className="flex justify-center items-center gap-3 sm:gap-6">
                            <div className="sm:block hidden">
                                <i className="bi bi-person-circle"></i>{" "}
                                <span className="text-sm">{Email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-amber-500 p-1 px-2 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <a href="/app-release.apk" download>
                <button className="bg-emerald-500 text-white py-1 w-full text-centre hover:bg-emerald-600 sm:hidden">
                    Download App
                </button>
            </a>
        </div>
    );
};

export default Navbar;
