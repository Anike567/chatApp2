import React from 'react'
import { FiPhoneCall, FiSend, FiUser, FiVideo } from "react-icons/fi";
export default function MessageInput({setMessage, handleSend, message}) {
    return (
        <div className="p-5 border-t bg-white">
            <div className="flex items-center gap-4">
                <input
                    onKeyDown={handleSend}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    placeholder="Type a message..."
                    value={message}
                />
                <button
                    onClick={handleSend}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition duration-200 active:scale-95"
                >
                    <FiSend className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
