import React from 'react'
import { FiPhoneCall, FiSend, FiUser, FiVideo } from "react-icons/fi";
export default function SelectedUser({ user }) {

    const handlePhoneCall = async () => {
        const pc = new RTCPeerConnection();

        const stream = await navigator.mediaDevices({ audio: true, video: false });
    }

    return (
        <div className="flex items-center justify-between p-5 border-b bg-white shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <FiUser size={24} className="text-gray-700" />
                </div>
                <p className="text-lg font-semibold text-gray-800">
                    {user.name}
                </p>
            </div>
            <div className="flex space-x-6">
                <FiPhoneCall
                    size={30}
                    color="black"
                    className="cursor-pointer"
                    onClick={handlePhoneCall}
                />
                <FiVideo size={30} color="black" className="cursor-pointer" />
            </div>
        </div>
    )
}
