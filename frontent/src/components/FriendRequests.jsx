import React, { useEffect, useState, useContext } from 'react'
import Loader from './Loader';
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from "../store/authContext";
import { FiUser, FiUserPlus } from 'react-icons/fi';



export default function FriendRequests() {
    const [isLoading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState([]);
    const { socket, socketId } = useContext(SocketContext);
    const { user, token } = useContext(AuthContext).authData;
    const [message, setMessage] = useState("");


    const getFriendRequest = () => {
        const payload = {
            data: user._id,
            token
        }
        socket.emit("getFriendRequestList", payload, (res) => {
            setLoading(false);
            console.log(res);
            if (res.error) {
                setMessage(res.message);
                return
            }
            setFriendRequests(res.data);
        });
    }

    useEffect(() => {
        getFriendRequest();

    }, []);

    const handleAcceptRequest = (user1) => {
        const payload = {
            token: token,
            to: user._id,
            from: user1
        }

        socket.emit('accept-request', payload, (data) => {

            if(data.error){
                alert(data.message);
            }

            if(data.message = "Accepted"){
                getFriendRequest();
            }
        })
    }

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


                    <div className='text-blue-600' onClick={() => { handleAcceptRequest(result._id) }}>
                        <p>Accept</p>
                    </div>
                </div>
            ))}
            {friendRequests.length === 0 && <div>
                <p className='text-red-500'>No new Friend Request</p>
            </div>}


        </div>
    )
}
