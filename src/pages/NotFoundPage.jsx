import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/paths'
import { Compass, Home } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-900/50 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-white">404</h1>
      <p className="text-lg font-semibold text-slate-300 mt-2">Resource Not Found</p>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The requested path does not exist in the PlacePrep Secure router hierarchy.
      </p>

      <div className="mt-6">
        <Link
          to={ROUTES.HOME}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <Home className="w-4 h-4" />
          <span>Return to Safety</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
