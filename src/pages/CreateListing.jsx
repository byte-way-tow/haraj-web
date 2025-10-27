import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  MapPin, 
  DollarSign,
  Phone,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const CreateListing = () => {
  const { API_BASE_URL, token, user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    currency: 'SYP',
    condition: 'used',
    location: '',
    phone: user?.phone || '',
    whatsapp: '',
    is_negotiable: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCategories()
  }, [user])

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      alert('يمكنك رفع 10 صور كحد أقصى')
      return
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))

    setImages([...images, ...newImages])
  }

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formDataToSend = new FormData()
    
    // Add form fields
    Object.keys(formData).forEach(key => {
  if (key === 'is_negotiable') {
    formDataToSend.append(key, formData[key] ? '1' : '0')
  } else {
    formDataToSend.append(key, formData[key])
  }
})

    // Add images
    images.forEach(image => {
      formDataToSend.append('images[]', image.file)
    })

    try {
      const response = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        navigate(`/listings/${data.data.id}`)
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.message || 'حدث خطأ في إنشاء الإعلان' })
        }
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      setErrors({ general: 'حدث خطأ في الاتصال' })
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] ? errors[fieldName][0] : null
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            أضف إعلان جديد
          </h1>
          <p className="text-gray-600">
            انشر إعلانك مجاناً واصل إلى آلاف المشترين
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الإعلان</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
                {getFieldError('category_id') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('category_id')}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الإعلان *
                </label>
                <Input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="أدخل عنواناً واضحاً ومختصراً"
                  dir="rtl"
                />
                {getFieldError('title') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="اكتب وصفاً مفصلاً للمنتج أو الخدمة..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
                {getFieldError('description') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
                )}
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر *
                  </label>
                  <div className="relative">
                    <Input
                      name="price"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="pl-10"
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  {getFieldError('price') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SYP">ليرة سورية</option>
                    <option value="USD">دولار أمريكي</option>
                    <option value="EUR">يورو</option>
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة *
                </label>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {[
                    { value: 'new', label: 'جديد' },
                    { value: 'excellent', label: 'ممتاز' },
                    { value: 'good', label: 'جيد' },
                    { value: 'fair', label: 'مقبول' },
                    { value: 'used', label: 'مستعمل' },
                  ].map((condition) => (
                    <label key={condition.value} className="flex items-center">
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.condition === condition.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="mr-2 text-sm text-gray-700">{condition.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع *
                </label>
                <div className="relative">
                  <Input
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="المدينة، المنطقة"
                    className="pl-10"
                    dir="rtl"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                {getFieldError('location') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('location')}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+963 xxx xxx xxx"
                      className="pl-10"
                      dir="ltr"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    واتساب
                  </label>
                  <div className="relative">
                    <Input
                      name="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+963 xxx xxx xxx"
                      className="pl-10"
                      dir="ltr"
                    />
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Negotiable */}
              <div className="flex items-center">
                <input
                  id="is_negotiable"
                  name="is_negotiable"
                  type="checkbox"
                  checked={formData.is_negotiable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_negotiable" className="mr-2 block text-sm text-gray-900">
                  السعر قابل للتفاوض
                </label>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصور (اختياري - حتى 10 صور)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">اضغط لرفع الصور</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 2MB لكل صورة</p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'جاري النشر...' : 'نشر الإعلان'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateListing

