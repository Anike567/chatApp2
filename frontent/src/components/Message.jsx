import React from 'react'
import { BiCheckDouble } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

export default function Message({ msg, user }) {
    const isSender = msg.from === user._id;

    return (
        <div className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative px-4 py-2 my-2 rounded-xl shadow-md break-words inline-block max-w-[75%] ${
                    isSender
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
                }`}
            >
                <p className="text-lg mb-2">{msg.message}</p>
                {isSender && (
                    <span className="absolute bottom-0 right-2 text-xs text-gray-200 flex items-center">
                        {msg.deleiverd === 'pending'
                            ? <FaCheck size={15} />
                            : <BiCheckDouble size={25} />}
                    </span>
                )}
            </div>
        </div>
    )
}
