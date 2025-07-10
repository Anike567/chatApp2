import React, { useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from '../store/authContext';



export default function Home() {
    const loggedInUser = useContext(AuthContext).authData.user;
    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");

    const {socket} = useContext(SocketContext);


    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/')
            const users = res.data;
            setUserList(users.message.users)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching users:', err)
        }
    }

    const handleSend = (e) => {
        if (e.key === 'Enter') {
            
            socket.emit("message-received",message);
            setMessage("");

        }
    }

    useEffect(()=>{
        socket.on('message-received',(data)=>{
            console.log(data);
        })
    },[])

    useEffect(() => {
        fetchUser()
    }, [])

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="flex h-full w-full px-4 py-6 space-x-4">
            {/* Left Sidebar */}
            <div className="w-full sm:w-[20%] h-full overflow-auto p-4 bg-gray-100 border border-gray-300 rounded-lg">
                {userList.map((user, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedUser(loggedInUser)}
                        className="bg-blue-300 my-3 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:underline transition duration-200"
                    >
                        <p className="text-center font-medium">
                            {`${loggedInUser.name} ${user.name.first} ${user.name.last}`}
                        </p>
                    </div>
                ))}
            </div>

            {/* Right Panel */}
            <div className="flex-1 h-full bg-gray-100 border border-gray-300 rounded-lg">
                {selectedUser ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex  items-center p-5 border-b font-semibold text-lg bg-blue-300 rounded-t-lg">
                            <div id="dp-wrapper " className='mx-5'>
                                <img src={selectedUser.picture} />
                            </div>
                            <div id="title-wrapper">
                                <p>{`${selectedUser.name}`}</p>
                            </div>
                        </div>

                        {/* Message body */}
                        <div className="flex-1 p-4 overflow-auto">
                            {/* Chat messages would go here */}
                        </div>

                        {/* Message input box */}
                        <div className="flex justify-center items-center p-5 border-t bg-blue-300 rounded-b-lg">
                            <div className="flex items-center w-full max-w-xl">
                                <input
                                    onKeyDown={handleSend}
                                    onChange={(e) => setMessage(e.target.value)}
                                    type="text"
                                    className="flex-1 p-3 border-2 font-bold text-black rounded-lg focus:outline-none"
                                    placeholder="Type a message..."
                                    value={message}
                                />

                                <button onClick={handleSend} className="ml-4 bg-green-500 text-white p-5 cursor-pointer rounded-full hover:bg-green-600 active:scale-95 transition duration-200">
                                    <FiSend className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex justify-center items-center">
                        <h1 className="text-xl font-bold underline text-gray-600">
                            Your Messages will display here
                        </h1>
                    </div>
                )}
            </div>

        </div>
    )
}
