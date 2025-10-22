import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import SelectedUser from './SelectedUser';
import MessageInput from './MessageInput';
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import Message from './Message';
import Loader from './Loader';


export default function Chats({ selectedUser }) {
    const [message, setMessage] = useState("");
    const [userStatus, setUserStatus] = useState(null);
    const messageEndRef = useRef(null);
    const { socket, socketId } = useContext(SocketContext);
    const { user, token } = useContext(AuthContext).authData;
    const [messageList, setMessageList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    /**
       * Send a message via socket
       * @param {KeyboardEvent | MouseEvent} 
       * @returns {void}
       */
    const handleSend = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!message.trim() || !selectedUser) return;

            const msgPayload = {
                token: token,
                msg: {
                    to: selectedUser.u__id,
                    from: user._id,
                    deleiverd: null,
                    message,
                }

            };

            socket.emit("message-received", msgPayload, (data) => {
                if (data.error) {
                    alert(data.message);
                } else {
                    const deleivered = data.status;
                    if (deleivered) {
                        msgPayload.msg.deleiverd = 'delievered';
                    }
                    else {
                        msgPayload.msg.deleiverd = 'pending'
                    }
                }

                setMessageList(prev => [...prev, msgPayload.msg]);
                setMessage("");
            });

        }
    };

    const handleIncomingMessage = useCallback((data) => {
        setMessageList(prev => [...prev, data]);
    });



    const getSelectedUserStatus = useCallback(() => {
        socket.emit("heartbeat", { userId: selectedUser.u__id }, (data) => {
            if (data.error) {
                alert(data.message);
                return;
            }
            console.log(data.data);
            setUserStatus(data.data);
        });
    });

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();

    }, [messageList]);

    useEffect(() => {
        let intervalId;
        if (selectedUser) {
            
            setLoading(true);

            const payload = {
                token,
                data: {
                    to: selectedUser.u__id,
                    from: user._id
                }
            }

            socket.emit("getMessages", payload, (data) => {
                if (data.error) {
                    alert(data.message);
                    setLoading(false);
                }
                setMessageList(data.savedMessages);
                setTimeout(()=>{
                    setLoading(false);
                },1000);
            });

            // Heartbeat interval
            intervalId = setInterval(getSelectedUserStatus, 30000);


        }

        return () => {
            clearInterval(intervalId);
        };

    }, [selectedUser]);


    useEffect(() => {
        socket.on("message-received", handleIncomingMessage);

        return () => {
            socket.off("message-received", handleIncomingMessage);
        }
    }, []);


    if(isLoading){
        return(
            <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
                <Loader/>
            </div>
        )
    }

    return (
        <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
            {selectedUser ? (
                <>
                    {/* Header */}
                    <SelectedUser user={selectedUser} userStatus={userStatus} />

                    {/* Messages */}


                    <div className="flex-1 p-6 overflow-auto space-y-3">
                        {messageList.map((msg, index) => (
                            <Message key={index} msg={msg} user={user} />
                        ))}
                        <div ref={messageEndRef}></div>
                    </div>


                    {/* Input */}
                    <MessageInput setMessage={setMessage} handleSend={handleSend} message={message} />

                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                    <h1 className="text-xl font-semibold text-gray-500">
                        Your messages will appear here
                    </h1>
                </div>
            )}
        </div>
    )
}
