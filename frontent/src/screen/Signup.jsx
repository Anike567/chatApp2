
import React, { useEffect, useState, useContext, useRef } from 'react';
import Loader from '../components/Loader';
import { FiX } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import genrateKeysPair from '../utility/generateKeyPairs';
const socketUrl = import.meta.env.VITE_SOCKET_URL;



export default function Signup() {

    const socketRef = useRef(null);
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(true);
    const[backgroundProcess,setBackgroundProcess] = useState(false);

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        password: '',
        name: '',
        contact: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setBackgroundProcess(true);

        if (!socketRef.current) {
            console.warn('Socket not connected yet');
            return;
        }

        socketRef.current.emit('signupEvent', user, (res) => {
            console.log(res);
            if(res.error){
                setMessage(res.message);
            }
            else{
                navigate("/");

                const{publicKey, privateKey} = genrateKeysPair();

                console.log(publicKey);
                console.log(privateKey);
            }
            setBackgroundProcess(false);
        });

    };


    useEffect(() => {

        const newSocket = io(`${socketUrl}/auth`);
        socketRef.current = newSocket;
        newSocket.on("connect",() => {
            setLoading(false);
        })
    }, [])


    if (isLoading) {
        return (
            <div className="flex h-screen w-screen justify-center items-center bg-white">
                <Loader />
            </div>
        );
    }


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
                    {backgroundProcess ? <Loader /> : <button
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
