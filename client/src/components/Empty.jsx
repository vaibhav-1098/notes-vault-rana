import React from "react";

const Empty = () => {
    return (
        <div className="flex justify-center items-center flex-col gap-2 mt-20">
            <p className="text-center text-xl text-gray-600">Your notes are Empty</p>
            <img src="./images/box.png" alt="empty" className="sm:w-80 w-60" />
        </div>
    );
};

export default Empty;
