import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="bg-yellow-100 h-screen w-screen">
      <main className="h-full w-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
