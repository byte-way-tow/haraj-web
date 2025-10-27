import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Eye,
  Smartphone,
  SlidersHorizontal
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Listings = () => {
  const { API_BASE_URL } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchListings()
  }, [searchParams])

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

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams(searchParams)
      const response = await fetch(`${API_BASE_URL}/listings?${params}`)
      const data = await response.json()
      if (data.success) {
        setListings(data.data.data)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const handleCategoryFilter = (categoryId) => {
    const params = new URLSearchParams(searchParams)
    if (categoryId) {
      params.set('category_id', categoryId)
    } else {
      params.delete('category_id')
    }
    setSelectedCategory(categoryId)
    setSearchParams(params)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="ابحث في الإعلانات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                  dir="rtl"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                بحث
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                فلاتر
              </Button>
            </div>
          </form>

          {/* Category Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">الفئات</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter('')}
                >
                  جميع الفئات
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryFilter(category.id.toString())}
                  >
                    {category.name_ar}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            الإعلانات
            {searchQuery && ` - نتائج البحث عن "${searchQuery}"`}
          </h1>
          <p className="text-gray-600">
            {listings.length} إعلان
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد إعلانات
            </h3>
            <p className="text-gray-600 mb-4">
              لم نجد أي إعلانات تطابق معايير البحث الخاصة بك
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('')
              setSearchParams({})
            }}>
              مسح الفلاتر
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
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
    </div>
  )
}

export default Listings

