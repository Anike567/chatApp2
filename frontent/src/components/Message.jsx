import { BiCheckDouble } from "react-icons/bi";
import { FaCheck, FaLeaf } from "react-icons/fa";
import { SocketContext } from "../store/socketIdContext";
import { useContext, useState } from "react";
import { FiPhoneCall, FiSend, FiUser, FiVideo } from "react-icons/fi";

export default function Message({ index, msg, user, setMessageList }) {
    const { socket } = useContext(SocketContext);
    const [editedMessage, setEdditedMsg] = useState("");
    const [modal, setModal] = useState(false);
    const isSender = msg.from === user._id;

    const handleOptionChange = (e) => {
        e.preventDefault();

        const selectedOption = e.target.value;

        if (selectedOption === 'delete') {
            const payload = {
                msgId: msg._id
            }
            socket.emit("delete-message", payload, (data) => {
                if (data.error) {
                    alert(data.message);
                    return;
                }

                setMessageList((prev) => {
                    prev.splice(index, 1);
                    return [...prev];
                });
            })

        }
        else if (selectedOption === 'edit') {
            setModal(true);
        }
    }

    const handleEdit = () => {
        const payload = {
            msgId: msg._id,
            msg: editedMessage
        }

        socket.emit("edit-message", payload, (data) => {
            if (data.error) {
                alert(data.message);
                return;
            }
            setMessageList((prev) => {
                prev[index].message = editedMessage;
                return [...prev];
            });
            setModal(false)
        })
    }
    return (
        <div className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}>

            {modal && (
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg my-2 relative">


                    <input
                        onChange={(e) => setEdditedMsg(e.target.value)}
                        type="text"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none text-gray-800"
                        placeholder="Type a message..."
                        value={editedMessage}
                    />
                    <button
                        onClick={handleEdit}
                        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                    >
                        Edit
                    </button>

                     <button
                        onClick={()=>{setModal(false)}}
                        className="bg-red-500 er:bg-green-600 text-white p-3 rounded-full"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div
                className={`relative flex justify-between items-start px-4 py-3 rounded-xl shadow-md max-w-[50%] ${isSender
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                    }`}
            >
                <p className="text-lg">{msg.message}</p>

                {isSender && (
                    <div className="flex item-center justify-center flex-col items-end">

                        <div className="flex flex-col justify-center items-center">

                            {/* 3-dot menu */}
                            <div className="menu-wrapper">
                                <select
                                    onChange={handleOptionChange}
                                    className="menu-select"
                                >
                                    <option value="" disabled selected hidden></option>
                                    <option className="text-black p-10" value="edit">Edit</option>
                                    <option className="text-red-800 p-10" value="delete">Delete</option>
                                </select>
                            </div>

                            {/* Delivery tick */}
                            <span className="text-xs text-gray-200 flex items-center mt-1">
                                {msg.delivered === "pending"
                                    ? <FaCheck size={18} />
                                    : <BiCheckDouble size={18} />}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
