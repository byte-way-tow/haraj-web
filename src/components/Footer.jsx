import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <span className="font-bold text-xl">حراج</span>
              </div>
              <span className="text-gray-300 font-semibold">سوريا</span>
            </div>
            <p className="text-gray-400 mb-4">
              منصة البيع والشراء الأولى في سوريا. نربط البائعين والمشترين في بيئة آمنة وموثوقة.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-400 hover:text-white transition-colors">
                  جميع الإعلانات
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-gray-400 hover:text-white transition-colors">
                  أضف إعلان
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الفئات الرئيسية</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings?category=cars" className="text-gray-400 hover:text-white transition-colors">
                  السيارات
                </Link>
              </li>
              <li>
                <Link to="/listings?category=real-estate" className="text-gray-400 hover:text-white transition-colors">
                  العقارات
                </Link>
              </li>
              <li>
                <Link to="/listings?category=electronics" className="text-gray-400 hover:text-white transition-colors">
                  الإلكترونيات
                </Link>
              </li>
              <li>
                <Link to="/listings?category=furniture" className="text-gray-400 hover:text-white transition-colors">
                  الأثاث
                </Link>
              </li>
              <li>
                <Link to="/listings?category=services" className="text-gray-400 hover:text-white transition-colors">
                  الخدمات
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">دمشق، سوريا</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400" dir="ltr">+963 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400" dir="ltr">info@haraj-syria.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 حراج سوريا. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                الشروط والأحكام
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الاستخدام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

