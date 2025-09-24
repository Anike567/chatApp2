import React from 'react'

export default function User({ tmpUser, setSelectedUser, index, user }) {
    return (
        <>
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {tmpUser.dp ? (
                    (() => {
                        const blob = new Blob([tmpUser.dp], { type: "image/png" });
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

            <p className="text-lg font-medium text-gray-800">{tmpUser.email === user.email ? "You" : tmpUser.name}</p>

        </>
    )
}
