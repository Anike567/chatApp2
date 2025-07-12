
import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../store/socketIdContext';
import Loader from '../components/Loader';
import { FiX } from 'react-icons/fi';
import { useNavigate,Link } from 'react-router-dom';



export default function Signup() {


    const { socket } = useContext(SocketContext);
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        password: '',
        name : '',
        contact : '',
        email : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setLoading(true);

        if (!socket) {
            console.warn('Socket not connected yet');
            return;
        }
        console.log(user);
        socket.emit('signupEvent', user);

    };


    useEffect(() => {
        if (!socket) return;

        const handleSignupSuccessEvent = (data) => {
            console.log('Login Success:', data);
            navigate('/login')
            setLoading(false);
        };

        const handleSignupErrorEvent = (data) => {
            console.error('Login Error:', data);
            setLoading(false);
        };

        const handleSignupMessageEvent = (data) => {
            console.log(data);
            const msg = typeof data.message === 'string' ? data.message : 'Something went wrong';
            console.log('Login Message:', msg);
            setMessage(msg);
            setLoading(false);
        };


        socket.on('signupSuccessEvent', handleSignupSuccessEvent);
        socket.on('signupErrorEvent', handleSignupErrorEvent);
        socket.on('signupMessageEvent', handleSignupMessageEvent);

        return () => {
            socket.off('signupSuccessEvent', handleSignupSuccessEvent);
            socket.off('signupErrorEvent', handleSignupErrorEvent);
            socket.off('signupMessageEvent', handleSignupMessageEvent);
        };
    }, [socket]);


    return (
        <div className="flex h-screen w-screen justify-center items-center bg-blue-50">
            <div className="w-[90%] max-w-md bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Signup</h2>

                <div className="mb-4">
                    <label className="block text-lg mb-2 text-gray-700">Username</label>
                    <input
                        className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        name="username"
                        value={user.username}
                        placeholder="Enter username"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg mb-2 text-gray-700">Password</label>
                    <input
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        name="password"
                        value={user.password}
                        placeholder="Enter password"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg mb-2 text-gray-700">Name</label>
                    <input
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        name="name"
                        value={user.name}
                        placeholder="Enter Name"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg mb-2 text-gray-700">Contact No.</label>
                    <input
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        name="contact"
                        value={user.contact}
                        placeholder="Enter Contact No."
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg mb-2 text-gray-700">Email</label>
                    <input
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        name="email"
                        value={user.email}
                        placeholder="Enter Email"
                        onChange={handleChange}
                    />
                </div>

                <div className="text-center">
                    {isLoading ? <Loader /> : <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
                    >
                        Signup
                    </button>}
                </div>


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

                <div className='text-center my-10'>
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Already registered Login!
                    </Link>
                </div>
            </div>
        </div>
    );
}
