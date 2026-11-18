import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'
import RoleSwitcherDev from '../common/RoleSwitcherDev'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Developer tool to switch roles & test security guards */}
      <RoleSwitcherDev />
    </div>
  )
}

export default AppLayout
