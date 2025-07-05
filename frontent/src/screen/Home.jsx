import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import { FiSend } from 'react-icons/fi'

export default function Home() {
    const [isLoading, setLoading] = useState(true)
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    if (selectedUser) {
        console.log(selectedUser.name.first);
    }
    const fetchUser = async () => {
        try {
            const res = await axios.get('https://randomuser.me/api/?results=50')
            const users = res.data.results
            setUserList(users)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching users:', err)
        }
    }

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
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-300 my-3 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:underline transition duration-200"
                    >
                        <p className="text-center font-medium">
                            {`${user.name.title} ${user.name.first} ${user.name.last}`}
                        </p>
                    </div>
                ))}
            </div>

            {/* Right Panel */}
            <div className="flex-1 h-full bg-gray-100 border border-gray-300 rounded-lg">
                {selectedUser ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-5 border-b font-semibold text-lg bg-blue-300 rounded-t-lg">
                            {`${selectedUser.name.first} ${selectedUser.name.last}`}
                        </div>

                        {/* Message body */}
                        <div className="flex-1 p-4 overflow-auto">
                            {/* Chat messages would go here */}
                        </div>

                        {/* Message input box */}
                        <div className="flex justify-center items-center p-5 border-t bg-blue-300 rounded-b-lg">
                            <div className="flex items-center w-full max-w-xl">
                                <input
                                    type="text"
                                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none"
                                    placeholder="Type a message..."
                                />
                                <button className="ml-4 bg-green-500 text-white p-5 cursor-pointer rounded-full hover:bg-green-600 active:scale-95 transition duration-200">
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
