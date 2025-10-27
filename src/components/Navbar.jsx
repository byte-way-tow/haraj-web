import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Heart,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">حراج</span>
            </div>
            <span className="hidden sm:block text-gray-700 font-semibold">سوريا</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن أي شيء..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/create-listing')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  أضف إعلان
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-5 w-5" />
                </Button>

                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Button>
                  
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      الملف الشخصي
                    </Link>
                    <Link
                      to="/my-listings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      إعلاناتي
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن أي شيء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                dir="rtl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {user ? (
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    navigate('/create-listing')
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  أضف إعلان
                </Button>
                
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الملف الشخصي
                </Link>
                
                <Link
                  to="/my-listings"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إعلاناتي
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/login')
                    setIsMenuOpen(false)
                  }}
                  className="w-full"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register')
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

