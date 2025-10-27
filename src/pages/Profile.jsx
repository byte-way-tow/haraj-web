import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Save, 
  X,
  Plus,
  Eye,
  Calendar
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, token, API_BASE_URL } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyListings()
  }, [user])

  const fetchMyListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.success) {
        setMyListings(data.data.data)
      }
    } catch (error) {
      console.error('Error fetching my listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditing(false)
        // Update user context if needed
        window.location.reload() // Simple refresh to update user data
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.message || 'حدث خطأ في التحديث' })
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ general: 'حدث خطأ في الاتصال' })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    })
    setErrors({})
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price, currency = 'SYP') => {
    return new Intl.NumberFormat('ar-SY').format(price) + ' ' + currency
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'نشط', variant: 'default' },
      sold: { label: 'مباع', variant: 'secondary' },
      expired: { label: 'منتهي الصلاحية', variant: 'destructive' },
      suspended: { label: 'معلق', variant: 'destructive' },
    }
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>الملف الشخصي</span>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Avatar */}
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
                    <User className="h-12 w-12 text-blue-600 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    عضو منذ {formatDate(user.created_at)}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم
                  </label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      dir="rtl"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{user.name}</span>
                    </div>
                  )}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+963 xxx xxx xxx"
                      dir="ltr"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{user.phone || 'غير محدد'}</span>
                    </div>
                  )}
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>إعلاناتي ({myListings.length})</span>
                  <Button
                    onClick={() => navigate('/create-listing')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إعلان جديد
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex space-x-4 rtl:space-x-reverse">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
                      <Plus className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد إعلانات
                    </h3>
                    <p className="text-gray-600 mb-4">
                      لم تقم بنشر أي إعلانات بعد
                    </p>
                    <Button
                      onClick={() => navigate('/create-listing')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      أضف إعلانك الأول
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        <div className="flex space-x-4 rtl:space-x-reverse">
                          {/* Image */}
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {listing.images && listing.images.length > 0 ? (
                              <img
                                src={`http://localhost:8000/storage/${listing.images[0].path}`}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {listing.title}
                              </h3>
                              {getStatusBadge(listing.status)}
                            </div>

                            <p className="text-lg font-bold text-blue-600 mb-2">
                              {formatPrice(listing.price, listing.currency)}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 ml-1" />
                                  <span>{listing.views_count}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 ml-1" />
                                  <span>{formatDate(listing.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

