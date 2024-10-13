import React from "react";

const Card = ({
    title = "Your Title Here",
    description = "Your description here",
    editNote,
    deleteNote,
    done,
    toggleDone,
}) => {
    return (
        <div className={`h-40 rounded-md overflow-y-auto p-2 px-3 text-justify shadow-custom ${done ? 'bg-slate-200' : ''}`}>
            <input
                type="checkbox"
                className="cursor-pointer scale-125"
                checked={done}
                onChange={toggleDone}
            />
            <span className="px-2 font-semibold">{title}</span>
            <div className="float-right">
                <button className="mr-2" onClick={editNote}>
                    <i className="bi bi-pen text-blue-600"></i>
                </button>
                <button onClick={deleteNote}>
                    <i className="bi bi-x-square text-rose-600"></i>
                </button>
            </div>
            <p>{description}</p>
        </div>
    );
};

export default Card;
