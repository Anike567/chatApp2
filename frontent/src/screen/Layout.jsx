import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Layout() {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header with fixed height */}
      {/* <header className="h-20 flex-shrink-0">
        <Navbar />
      </header> */}

      {/* Main area that takes remaining height and allows scrolling */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full h-full">
          <Outlet />
        </div>
      </main>

      {/* Footer that appears after scrolling if content is large */}
      {/* <footer className="p-4 bg-gray-100 text-center text-black">
        <p>© 2025 Your Footer Content</p>
      </footer> */}
    </div>
  )
}
