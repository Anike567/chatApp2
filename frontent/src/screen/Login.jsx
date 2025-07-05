import React, { useState } from 'react'

export default function Login() {
  const [user, setUser] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-blue-50">
      <div className="w-[90%] max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <div className="mb-4">
          <label className="block text-lg mb-2 text-gray-700">Username</label>
          <input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            name="password"
            value={user.password}
            placeholder="Enter password"
            onChange={handleChange}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
