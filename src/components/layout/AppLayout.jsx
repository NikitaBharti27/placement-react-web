import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'
import RoleSwitcherDev from '../common/RoleSwitcherDev'

export const AppLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>

      <RoleSwitcherDev />
    </div>
  )
}

export default AppLayout
