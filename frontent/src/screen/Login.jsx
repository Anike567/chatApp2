import React, { useEffect, useState, useContext, useRef } from 'react'
import Loader from '../components/Loader';
import { FiX } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../store/authContext';
import { io } from 'socket.io-client';


export default function Login() {
  const { authData, setAuthData } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const [user, setUser] = useState({
    username: '',
    password: ''
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

    if (!socketRef.current) {
      console.warn('Socket not connected yet');
      return;
    }

    socketRef.current.emit('loginEvent', user, (res) => {
      if (res.isLoggedIn) {
        const authData = {
          isLoggedIn: true,
          user: res.user,
          token: res.token
        }

        setAuthData(authData);
        localStorage.setItem('user-data', JSON.stringify(authData));
        navigate('/');
      }
      if (res.message.length > 0) {
        setMessage(res.message.join(','));
      }
      setLoading(false);
    });
  };


  useEffect(() => {
    if (authData.isLoggedIn) {
      navigate('/');
    }

    if(!socketRef.current){
      const newSocket = io(`${socketUrl}/auth`);
      socketRef.current = newSocket;
    }

  },[]);

  
  return (
    <div className="flex h-screen w-screen justify-center items-center bg-blue-50">
      <div className="w-[90%] max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

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

        <div className="text-center">
          {isLoading ? <Loader /> : <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
          >
            Login
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
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup!
          </Link>

          <Link to="/forgetPassword"></Link>

        </div>

        <div className='text-center my-10'>
          <Link to="/forgetpassword" className="text-blue-500 hover:underline">
            Forget Password
          </Link>

          <Link to="/forgetPassword"></Link>

        </div>
      </div>



    </div>
  );
}
