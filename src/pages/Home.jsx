import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Car, 
  Home as HomeIcon, 
  Smartphone, 
  Sofa, 
  Shirt, 
  Briefcase, 
  Users, 
  Heart, 
  Book,
  Activity,
  ArrowRight,
  MapPin,
  Clock,
  Eye
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { API_BASE_URL } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [featuredListings, setFeaturedListings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const categoryIcons = {
    'car': Car,
    'home': HomeIcon,
    'smartphone': Smartphone,
    'sofa': Sofa,
    'shirt': Shirt,
    'briefcase': Briefcase,
    'users': Users,
    'heart': Heart,
    'activity': Activity,
    'book': Book,
  }

  useEffect(() => {
    fetchCategories()
    fetchFeaturedListings()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFeaturedListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings?per_page=8`)
      const data = await response.json()
      if (data.success) {
        setFeaturedListings(data.data.data)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const formatPrice = (price, currency = 'SYP') => {
    return new Intl.NumberFormat('ar-SY').format(price) + ' ' + currency
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'منذ يوم واحد'
    if (diffDays < 7) return `منذ ${diffDays} أيام`
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`
    return `منذ ${Math.ceil(diffDays / 30)} أشهر`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            حراج سوريا
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            منصة البيع والشراء الأولى في سوريا
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن السيارات، العقارات، الإلكترونيات وأكثر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:ring-4 focus:ring-blue-300 text-gray-900"
                  dir="rtl"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            تصفح حسب الفئة
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon] || Briefcase
              return (
                <Link
                  key={category.id}
                  to={`/listings?category_id=${category.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-blue-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {category.name_ar}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              إعلانات مميزة
            </h2>
            <Link to="/listings">
              <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                <span>عرض الكل</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <Link key={listing.id} to={`/listings/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={`http://localhost:8000/storage/${listing.images[0].path}`}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <Smartphone className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {listing.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          مميز
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(listing.price, listing.currency)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {listing.condition === 'new' ? 'جديد' : 'مستعمل'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 ml-1" />
                        <span>{listing.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{formatDate(listing.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 ml-1" />
                          <span>{listing.views_count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            هل تريد بيع شيء ما؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انشر إعلانك مجاناً واصل إلى آلاف المشترين
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/create-listing')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            أضف إعلانك الآن
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home

