import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../store/socketIdContext';
import Loader from '../components/Loader';
import { FiX } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../store/authContext';


export default function ForgetPassword() {
    const { authData, setAuthData } = useContext(AuthContext);

    const { socket } = useContext(SocketContext);
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const findUsername = () => {
        if (!socket) {
            console.warn('Socket not connected yet');
            return;
        }

        if(user.username === ''){
            setMessage("Username must not be empty");
          
            return;
        }

        socket.emit("findUsername",user.username,(data)=>{
            setLoading(true);
            console.log(data);
            if(data.error || data.message){
                setMessage(data.message);
            }

            if(data.data.message){
                setMessage(data.data.message);
            }

            if(data.data){
                setShowNewPassword(true);

            }
            setLoading(false);
        });
       
    };

    const handleSubmit = ()=>{

        if(user.confirmPassword !== user.confirmPassword){
            setMessage("Password and Confirm password must be same");
        }

        const payload = {
            username : user.username,
            password : user.confirmPassword,
            otp : user.otp
        }
        socket.emit("verify-otp",payload,(data)=>{
        
            if(data.error || data.message){
                setMessage(data.message);
            }

            if(data.data.message === 'Password changed successfully'){
                localStorage.clear();
                console.log("working");
                navigate("/login");
            }
        });
    }


   
    useEffect(() => {
        if (!socket) return;       
    }, [socket]);


    return (
        <div className="flex h-screen w-screen justify-center items-center bg-blue-50">
            <div className="w-[90%] max-w-md bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Forget Password</h2>

                {!showNewPassword && <div>
                    <div className="mb-4">
                        <label className="block text-lg mb-2 text-gray-700">Username</label>
                        <input
                            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            name="username"
                            value={user.username}
                            placeholder="Enter username or email"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-center">
                        {isLoading ? <Loader /> : <button
                            type="submit"
                            onClick={findUsername}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
                        >
                            Send Otp
                        </button>}
                    </div>
                </div>

                }



                {showNewPassword && <div>

                    <div className="mb-4">
                        <label className="block text-lg mb-2 text-gray-700">New Password</label>
                        <input
                            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            name="password"
                            value={user.password}
                            placeholder="Enter Password"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg mb-2 text-gray-700">Confirm New Password</label>
                        <input
                            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg mb-2 text-gray-700">OTP</label>
                        <input
                            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            name="otp"
                            value={user.otp}
                            placeholder="Enter Password"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-center">
                        {isLoading ? <Loader /> : <button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
                        >
                            Change Password
                        </button>}
                    </div>

                </div>}






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



            </div>



        </div>
    );
}
