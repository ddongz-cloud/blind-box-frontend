import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t-2 border-gray-800 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-pixel text-gray-600">
            © 2024 PixelBox 盲盒机. Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
