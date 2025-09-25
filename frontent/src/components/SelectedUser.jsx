import React from 'react';
import { FiPhoneCall, FiUser, FiVideo } from "react-icons/fi";

export default function SelectedUser({ user }) {

   

    return (
        <div className="flex items-center justify-between p-5 border-b bg-white shadow-sm">
            {/* Left: Avatar + Name */}
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 cursor-pointer rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.dp ? (
                        (() => {
                            const blob = new Blob([user.dp], { type: "image/png" });
                            const url = URL.createObjectURL(blob);
                            return (
                                <img
                                    src={url}
                                    alt="user dp"
                                    className="w-full h-full object-cover"
                                />
                            );
                        })()
                    ) : (
                        <FiUser size={24} className="text-gray-700" />
                    )}
                </div>
                <p className="text-lg font-semibold text-gray-800">
                    {user.name}
                </p>
            </div>

            {/* Right: Action buttons */}
            <div className="flex space-x-6">
                <FiPhoneCall
                    size={28}
                    className="cursor-pointer text-gray-700 hover:text-green-600"

                />
                <FiVideo
                    size={30}
                    className="cursor-pointer text-gray-700 hover:text-blue-600"
                />
            </div>
        </div>
    );
}
