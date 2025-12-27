import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_CODES } from './i18n'

// Layout
import DashboardLayout from './components/DashboardLayout'

// Pages
import LandingPage from './pages/LandingPage'

// Onboarding
import OnboardingFlow from './onboarding/OnboardingFlow'

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import ProductsPage from './pages/dashboard/ProductsPage'
import OrdersPage from './pages/dashboard/OrdersPage'
import AddProduct from './pages/AddProduct'
import InstagramChannelPage from './pages/dashboard/InstagramChannelPage'
import GoogleChannelPage from './pages/dashboard/GoogleChannelPage'
import POSChannelPage from './pages/dashboard/POSChannelPage'
import StorefrontPage from './pages/dashboard/website/StorefrontPage'
import CheckoutPage from './pages/dashboard/website/CheckoutPage'
import AppearancePage from './pages/dashboard/website/AppearancePage'
import MenuPage from './pages/dashboard/website/MenuPage'
import PagesPage from './pages/dashboard/website/PagesPage'
import ReviewsPage from './pages/dashboard/website/ReviewsPage'
import AIDataModelBuilder from './pages/dashboard/AIDataModelBuilder'
import InboxPage from './pages/dashboard/InboxPage'
import WhatsAppManagement from './pages/dashboard/WhatsAppManagement'

/**
 * LanguageRouter Component
 * 
 * Handles language detection from URL and redirects.
 * Supports URLs like /es/dashboard, /pt/onboarding, etc.
 */
function LanguageRouter({ children }) {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (lang && LANGUAGE_CODES.includes(lang)) {
      // Valid language code in URL - set it
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang)
      }
    }
  }, [lang, i18n])

  return children
}

/**
 * LanguageRedirect Component
 * 
 * Redirects to the user's detected language if accessing root paths.
 */
function LanguageRedirect({ to }) {
  const { i18n } = useTranslation()
  const detectedLang = i18n.language?.split('-')[0] || 'en'
  const lang = LANGUAGE_CODES.includes(detectedLang) ? detectedLang : 'en'

  return <Navigate to={`/${lang}${to}`} replace />
}

/**
 * Main App Component
 * 
 * Sets up routing for the wcommerce-creator application.
 * 
 * Routes Structure (with language prefix):
 * 
 * Public Routes:
 * - /:lang/              : Marketing landing page (localized)
 * - /:lang/signup        : Sign up page
 * - /:lang/login         : Login page
 * 
 * Onboarding:
 * - /:lang/onboarding    : 11-step onboarding flow
 * 
 * Dashboard (Protected):
 * - /:lang/dashboard     : Main dashboard with sidebar
 *   - /products          : Products management
 *   - /products/add      : Add new product
 *   - /instagram         : Instagram channel
 *   - /google            : Google channel
 *   - /pos               : Point of Sale
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirect - detect language and redirect */}
        <Route path="/" element={<LanguageRedirect to="/" />} />

        {/* Localized routes with language prefix */}
        <Route path="/:lang/*" element={<LocalizedRoutes />} />

        {/* Legacy routes without language prefix - redirect to localized version */}
        <Route path="/dashboard/*" element={<LanguageRedirect to="/dashboard" />} />
        <Route path="/onboarding" element={<LanguageRedirect to="/onboarding" />} />
        <Route path="/login" element={<LanguageRedirect to="/login" />} />
        <Route path="/signup" element={<LanguageRedirect to="/signup" />} />
        <Route path="/add-product" element={<LanguageRedirect to="/dashboard/products/add" />} />

        {/* Catch-all */}
        <Route path="*" element={<LanguageRedirect to="/" />} />
      </Routes>
    </Router>
  )
}

/**
 * LocalizedRoutes Component
 * 
 * Contains all routes that are prefixed with a language code.
 */
function LocalizedRoutes() {
  const { lang } = useParams()
  const { i18n } = useTranslation()

  // Validate language code
  const isValidLang = LANGUAGE_CODES.includes(lang)

  useEffect(() => {
    if (isValidLang && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n, isValidLang])

  // If invalid language code, redirect to default language
  if (!isValidLang) {
    return <Navigate to={`/en/${lang}`} replace />
  }

  return (
    <LanguageRouter>
      <Routes>
        {/* Landing Page - Main marketing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes (Placeholders) */}
        <Route path="/signup" element={<AuthPlaceholder type="signup" />} />
        <Route path="/login" element={<AuthPlaceholder type="login" />} />

        {/* Onboarding Flow - 11 Steps */}
        <Route path="/onboarding" element={<OnboardingFlow />} />

        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Dashboard Home/Summary */}
          <Route index element={<DashboardHome />} />

          {/* Orders */}
          <Route path="orders" element={<OrdersPage />} />

          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/categories" element={<PlaceholderPage title="Categories" icon="📁" />} />
          <Route path="products/discounts" element={<PlaceholderPage title="Discounts" icon="🏷️" />} />

          {/* Customers */}
          <Route path="customers" element={<PlaceholderPage title="Customers" icon="👥" />} />

          {/* Inbox (Centralized) */}
          <Route path="inbox" element={<InboxPage />} />
          {/* Forward legacy 'chats' route to inbox for now, or keep as sub-menu if desired. 
              The prompt asked to move InboxPage to top level /dashboard/inbox. 
          */}
          <Route path="chats" element={<Navigate to="inbox" replace />} />
          <Route path="chats/inbox" element={<Navigate to="../../inbox" replace />} />
          <Route path="chats/broadcasts" element={<PlaceholderPage title="Broadcasts" icon="📢" />} />
          <Route path="chats/chatbot" element={<PlaceholderPage title="Chatbot" icon="🤖" badge="PRO" />} />

          {/* Analytics */}
          <Route path="analytics" element={<PlaceholderPage title="Analytics" icon="📈" />} />

          {/* Settings */}
          <Route path="settings" element={<PlaceholderPage title="Settings" icon="⚙️" />} />

          {/* AI Agent */}
          <Route path="ai-data-model" element={<AIDataModelBuilder />} />

          {/* Website */}
          <Route path="website" element={<Navigate to="website/storefront" replace />} />
          <Route path="website/storefront" element={<StorefrontPage />} />
          <Route path="website/checkout" element={<CheckoutPage />} />
          <Route path="website/appearance" element={<AppearancePage />} />
          <Route path="website/menu" element={<MenuPage />} />
          <Route path="website/pages" element={<PagesPage />} />
          <Route path="website/reviews" element={<ReviewsPage />} />

          {/* Sales Channels */}
          <Route path="whatsapp" element={<WhatsAppManagement />} />
          <Route path="instagram" element={<InstagramChannelPage />} />
          <Route path="google" element={<GoogleChannelPage />} />
          <Route path="pos" element={<POSChannelPage />} />
          <Route path="bookings" element={<PlaceholderPage title="Table Booking" icon="📅" />} />

          {/* Store */}
          <Route path="store/open" element={<PlaceholderPage title="Open Store" icon="🏪" />} />
          <Route path="store/change" element={<PlaceholderPage title="Change Store" icon="🔄" />} />
        </Route>

        {/* Catch-all for invalid paths within language - redirect to landing */}
        <Route path="*" element={<Navigate to={`/${lang}/`} replace />} />
      </Routes>
    </LanguageRouter>
  )
}

/**
 * AuthPlaceholder Component
 * 
 * Placeholder for authentication pages.
 */
function AuthPlaceholder({ type }) {
  const { t } = useTranslation()
  const title = type === 'signup' ? t('common.signUp') : t('common.logIn')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400">Authentication coming soon...</p>
      </div>
    </div>
  )
}

/**
 * PlaceholderPage Component
 * 
 * Generic placeholder for pages not yet implemented.
 * Shows the page title with icon and a "coming soon" message.
 */
function PlaceholderPage({ title, icon, badge }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badge === 'CONNECTED' ? 'bg-green-500/20 text-green-400' :
                    badge === 'BETA' ? 'bg-yellow-500/20 text-yellow-400' :
                      badge === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                  }`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">Manage your {title.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">{icon}</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {title} Coming Soon
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We're working hard to bring you the best {title.toLowerCase()} management experience.
          Check back soon!
        </p>
      </div>
    </div>
  )
}

export default App
