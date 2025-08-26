import React, { useEffect, useState, useContext } from 'react'
import Loader from './Loader';
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from "../store/authContext";
import { FiUser,FiUserPlus } from 'react-icons/fi';



export default function FriendRequests() {
    const [isLoading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState([]);
    const { socket, socketId } = useContext(SocketContext);
    const { user, token } = useContext(AuthContext).authData;
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.emit("getFriendRequestList", user._id, (res) => {
            setLoading(false);
            console.log(res);
            if(res.error){
                setMessage(res.message);
                return
            }
            console.log(res.data);
            setFriendRequests(res.data);
        });

    }, []);

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className='flex items-center justify-center w-full h-full'>
            {friendRequests.length > 0 && friendRequests.map((result, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition"
                >
                    {/* Left side: DP + user details */}
                    <div className="flex w-[400px]items-center">
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
                        <div className="mx-5">
                            <p className="text-gray-800 font-medium">{result.name}</p>
                            <p className="text-gray-500 text-sm">{result.email}</p>
                        </div>
                    </div>

                    {/* Friend request icon */}
                    <FiUserPlus
                        onClick={() => { sendFrienRequest(result._id) }}
                        size={30}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    />
                </div>
            ))}
            {friendRequests.length === 0 && <div>
                <p>No new Friend Request</p>
            </div>}

            {message && (
                <div className="mt-4 relative bg-red-100 text-red-700 px-4 py-2 rounded-md shadow-sm">
                    <p className='w-full text-center mx-2'>{message}</p>
                    <FiX
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                        size={20}
                        onClick={() => setMessage('')}
                    />
                </div>
            )}
        </div>
    )
}
