import { useContext, useEffect, useRef, useState } from 'react';
import Loader from '../components/Loader';
import { FiPhoneCall, FiSend, FiUser, FiVideo } from 'react-icons/fi';
import { SocketContext } from '../store/socketIdContext';
import { AuthContext } from '../store/authContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, token } = useContext(AuthContext).authData;
    const { socket, socketId } = useContext(SocketContext);
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [unsavedMessages, setUnsavedMessages] = useState([]);
    const messageEndRef = useRef(null);
    const debounceTimeOutRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSearch = () => {

        if (debounceTimeOutRef.current) {
            clearTimeout(debounceTimeOutRef.current);
        }

        debounceTimeOutRef.current = setTimeout(() => { console.log(searchText) }, 1000);

    }

    const saveMessage = () => {
        console.log(unsavedMessages);
        socket.emit('saveMessage', unsavedMessages);
        // if (unsavedMessages.length > 0) {
        //     socket.emit('saveMessage', unsavedMessages);
        //     console.log(unsavedMessages);
        //     setUnsavedMessages([]); 
        // }
    };

    const getMessagesForUser = (otherUserId) => {
        const data = {
            from: user._id,
            to: otherUserId,
        };
        socket.emit('getMessages', data, (res) => {
            setMessageList(res || []);
        });
    };

    const handleSend = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (!message.trim()) return;

            const msgPayload = {
                to: selectedUser._id,
                from: user._id,
                message,
            };

            setMessageList((prev) => [...prev, msgPayload]);
            setUnsavedMessages((prev) => [...prev, msgPayload]);
            socket.emit("message-received", msgPayload);
            setMessage(""); // clear input
        }
    };

    useEffect(() => {
        if (!socket) return;


        // Fetch user list
        socket.emit('getuser', { token }, (res) => {
            setUserList(res.message.users);
            setLoading(false);
        });

        // Sync socket ID
        socket.emit('updateSocketId', { userId: user._id, socketid: socketId });

        // Listen for new messages
        socket.on('message-received', (data) => {
            if (
                selectedUser &&
                ((data.from === selectedUser._id && data.to === user._id) ||
                    (data.from === user._id && data.to === selectedUser._id))
            ) {
                setMessageList((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('message-received');

            saveMessage();
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    if (isLoading) return <Loader />;

    return (
        <div className="flex h-full w-full px-4 py-6 bg-white space-x-4">
            {/* Left Sidebar */}
            <div className="w-full sm:w-[22%] h-full bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b bg-white shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
                        <input

                            onChange={(e) => { setSearchText(e.target.value); handleSearch() }}
                            value={searchText}
                            type="text"
                            placeholder="Search by email or username"
                            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none "
                        />
                    </div>

                    {/* User List */}
                    <div className="flex-1 overflow-auto">
                        {userList.map((tmpUser, index) => {
                            if (tmpUser.email === user.email) return null;
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedUser(tmpUser);
                                        getMessagesForUser(tmpUser._id);
                                    }}
                                    className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-blue-100 transition duration-200"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                        <FiUser size={24} className="text-gray-700" />
                                    </div>
                                    <p className="text-md font-medium text-gray-800">{tmpUser.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Chat Panel */}
            <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b bg-white shadow-sm">
                            {/* Left: Avatar and Name */}
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <FiUser size={24} className="text-gray-700" />
                                </div>
                                <p className="text-lg font-semibold text-gray-800">{selectedUser.name}</p>
                            </div>

                            {/* Right: Call Icon */}
                            <button className="flex items-center space-x-10 text-green-600 hover:text-green-700 transition">
                                <FiPhoneCall size={30} color='black' className='cursor-pointer'/>
                                <FiVideo size={30} color='black' className='cursor-pointer' />
                            </button>
                        </div>


                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-auto space-y-3">
                            {messageList.map((msg, index) => (
                                <div key={index} className="w-full flex">
                                    <div
                                        className={`px-4 py-2 my-2 rounded-xl shadow-md break-words max-w-[75%] ${msg.from === user._id
                                            ? 'ml-auto bg-green-600 text-white'
                                            : 'mr-auto bg-blue-600 text-white'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef}></div>
                        </div>

                        {/* Input */}
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
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <h1 className="text-xl font-semibold text-gray-500">
                            Your messages will appear here
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );

}
