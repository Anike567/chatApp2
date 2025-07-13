import { useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { FiSend, FiUser } from 'react-icons/fi'; // ✅ Import user icon
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from '../store/authContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, token } = useContext(AuthContext).authData;
    const { socket, socketId } = useContext(SocketContext);
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const handleSend = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (!message.trim()) return;

            const msgPayload = {
                to: selectedUser._id,
                from: user._id,
                message,
            };

            socket.emit("message-received", msgPayload);
            setMessageList(prev => [...prev, msgPayload]);
            setMessage("");
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.emit('getuser', { token }, (res) => {
            setUserList(res.message.users);
            setLoading(false);
        });

        socket.emit('updateSocketId', { userId: user._id, socketid: socketId });

        socket.on('message-received', (data) => {
            setMessageList(prev => [...prev, data]);
            console.log(messageList);
        });

        return () => {
            socket.off('message-received');
        };
    }, [socket]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex h-full w-full px-4 py-6 space-x-4 bg-white">

            {/* Left Sidebar */}
            <div className="w-full sm:w-[20%] h-full overflow-auto p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div id="left-header" className="flex flex-col">
                    {/* Header */}
                    <div className="flex items-center space-x-3 p-5 border-b font-semibold text-lg bg-blue-300 rounded-t-lg">
                        <FiUser className="text-2xl" /> {/* ✅ User icon added */}
                        <p>{user.name}</p>
                    </div>
                </div>
                <div className='my-10'>
                    {userList.map((tmpUser, index) => {
                        if (tmpUser.email === user.email) return null;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedUser(tmpUser);
                                    setMessageList([]);
                                }}
                                className="flex items-center space-x-3 p-5 border-b font-semibold text-lg bg-blue-200 rounded-t-lg cursor-pointer hover:underline transition duration-200"
                            >
                                <FiUser className="text-2xl" />
                                <p>{tmpUser.name}</p>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Right Chat Panel */}
            <div className="flex-1 h-full bg-gray-100 border border-gray-300 rounded-lg">
                {selectedUser ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center space-x-3 p-5 border-b font-semibold text-lg bg-blue-300 rounded-t-lg">
                            <FiUser className="text-2xl" /> {/* ✅ User icon added */}
                            <p>{selectedUser.name}</p>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 p-4 overflow-auto space-y-2">
                            {messageList.map((msg, index) => (
                                <div key={index} className="w-full flex">
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${msg.from === user._id
                                            ? 'bg-green-800 ml-auto text-left'
                                            : 'bg-blue-800 mr-auto text-right'
                                            }`}
                                    >
                                        <p className="text-sm font-medium">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
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

                                <button
                                    onClick={handleSend}
                                    className="ml-4 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 active:scale-95 transition duration-200"
                                >
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
    );
}
