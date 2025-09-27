import React, { useContext } from 'react';
import { FiUser, FiUserCheck, FiUserPlus } from "react-icons/fi";
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from '../store/authContext';
import { FaUserCheck } from "react-icons/fa";


export default function SearchResult({ searchRsult, friendList }) {
    const { socket, socketId } = useContext(SocketContext);
    const { user, token } = useContext(AuthContext).authData;
    const sendFrienRequest = (toId) => {
        const payload = {
            token,
            data: {
                to: toId,
                from: user._id
            }

        }
        socket.emit("addFriend", payload, (res) => {
            alert(res.message);
            
        })
    }
    return (
        <div className="absolute z-100 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
            {searchRsult.map((result, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition"
                >
                    {/* Left side: DP + user details */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            {result.dp ? (
                                (() => {
                                    const blob = new Blob([result.dp], { type: "image/png" });
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

                        {/* Space between dp and text */}
                        <div className="ml-3">
                            <p className="text-gray-800 font-medium">{result.name}</p>
                            <p className="text-gray-500 text-sm">{result.email}</p>
                        </div>
                    </div>

                    {/* Friend request icon */}

                    {friendList.has(result._id) ? (
                        <FiUserCheck
                            size={30}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        />
                    ) : (
                        <FiUserPlus
                            onClick={() => sendFrienRequest(result._id)}
                            size={30}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        />
                    )}

                </div>
            ))}
        </div>
    )
}
