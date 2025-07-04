import React, { useState } from 'react'

export default function Navbar() {
  const [toDisplay, setDisplay] = useState(false)

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-100 text-black shadow-md relative">
      <div id="nav-left">
        <p className="text-2xl text-red-500 font-bold">Chat App</p>
      </div>

      <div id="nav-right" className="flex items-center">
    
        <div className="hidden sm:flex space-x-6">
          <a className="text-xl hover:scale-105 transform cursor-pointer hover:underline transition duration-200">Home</a>
          <a className="text-xl hover:scale-105 transform cursor-pointer hover:underline transition duration-200">Settings</a>
          <a className="text-xl hover:scale-105 transform cursor-pointer hover:underline transition duration-200">Logout</a>
        </div>

        
        <div className="flex sm:hidden relative">
          <button
            onClick={() => setDisplay(!toDisplay)}
            className="flex flex-col justify-between w-6 h-5 ml-4 focus:outline-none transform transition duration-200 hover:scale-110"
          >
            <span className="block h-0.5 bg-black"></span>
            <span className="block h-0.5 bg-black"></span>
            <span className="block h-0.5 bg-black"></span>
          </button>

          <div
            className={`absolute right-0 top-full mt-2 transform transition-all duration-200 ease-out origin-top z-10 ${
              toDisplay ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
            } bg-white shadow-lg rounded-lg ring-1 ring-black/10`}
          >
            <div className="flex flex-col items-start px-6 py-4 space-y-2 w-40">
              <a className="text-lg hover:scale-105 transform cursor-pointer hover:underline transition duration-200">
                Home
              </a>
              <a className="text-lg hover:scale-105 transform cursor-pointer hover:underline transition duration-200">
                Settings
              </a>
              <a className="text-lg hover:scale-105 transform cursor-pointer hover:underline transition duration-200">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
