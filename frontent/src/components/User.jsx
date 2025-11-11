import React from 'react'
import { FiUser } from 'react-icons/fi';

export default function User({ tmpUser, user, msgCount }) {
    return (
        <>
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {tmpUser.u_dp ? (
                    (() => {
                        const blob = new Blob([tmpUser.u_dp], { type: "image/png" });
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

            <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold text-gray-800 truncate">
                    {tmpUser.u_email === user.email ? "You" : tmpUser.u_name}
                </p>

                {msgCount > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded-full shadow-sm">
                        {msgCount}
                    </span>
                )}
            </div>

        </>
    )
}
