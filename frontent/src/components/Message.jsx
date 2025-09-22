import { BiCheckDouble } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

export default function Message({ msg, user }) {
    const isSender = msg.from === user._id;

    return (
        <div className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative flex justify-between items-start px-4 py-3 rounded-xl shadow-md max-w-[50%] ${isSender
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                    }`}
            >
                {/* Message text */}
                <p className="text-lg">{msg.message}</p>

                {/* Right side (dropdown + tick) */}
                {isSender && (
                    <div className="flex item-center justify-center flex-col items-end ml-2">

                        {/* Delivery tick */}
                        <div>
                            <span className="text-xs text-gray-200 flex items-center">
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
