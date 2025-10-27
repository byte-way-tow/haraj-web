import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Eye, 
  Phone, 
  MessageCircle, 
  Heart,
  Share2,
  ArrowLeft,
  User,
  Calendar
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ListingDetail = () => {
  const { id } = useParams()
  const { API_BASE_URL, user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${id}`)
      const data = await response.json()
      if (data.success) {
        setListing(data.data)
      } else {
        navigate('/listings')
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
      navigate('/listings')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price, currency = 'SYP') => {
    return new Intl.NumberFormat('ar-SY').format(price) + ' ' + currency
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('تم نسخ الرابط')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">الإعلان غير موجود</h2>
          <Button onClick={() => navigate('/listings')}>
            العودة إلى الإعلانات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>العودة</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {listing.images && listing.images.length > 0 ? (
                  <div>
                    <img
                      src={`http://localhost:8000/storage/${listing.images[currentImageIndex].path}`}
                      alt={listing.title}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    {listing.images.length > 1 && (
                      <div className="p-4">
                        <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto">
                          {listing.images.map((image, index) => (
                            <img
                              key={image.id}
                              src={`http://localhost:8000/storage/${image.path}`}
                              alt={`${listing.title} ${index + 1}`}
                              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                                index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">لا توجد صور</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">الوصف</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Main Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {listing.title}
                  </h1>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(listing.price, listing.currency)}
                    </span>
                    {listing.is_negotiable && (
                      <Badge variant="outline">قابل للتفاوض</Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>نُشر في {formatDate(listing.created_at)}</span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views_count} مشاهدة</span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant="outline">
                      {listing.condition === 'new' ? 'جديد' : 'مستعمل'}
                    </Badge>
                    <Badge variant="outline">
                      {listing.category.name_ar}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">معلومات البائع</h3>
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{listing.user.name}</p>
                    <p className="text-sm text-gray-600">عضو منذ {formatDate(listing.user.created_at)}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  {listing.phone && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(`tel:${listing.phone}`)}
                    >
                      <Phone className="h-4 w-4 ml-2" />
                      اتصال: {listing.phone}
                    </Button>
                  )}

                  {listing.whatsapp && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}`)}
                    >
                      <MessageCircle className="h-4 w-4 ml-2" />
                      واتساب
                    </Button>
                  )}

                  {user && user.id !== listing.user.id && (
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 ml-2" />
                      إرسال رسالة
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-800">
                  نصائح للأمان
                </h3>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>• تأكد من المنتج قبل الدفع</li>
                  <li>• التقِ بالبائع في مكان عام</li>
                  <li>• لا تدفع مقدماً قبل رؤية المنتج</li>
                  <li>• تجنب التحويلات المصرفية للغرباء</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail

