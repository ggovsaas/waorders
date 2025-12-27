import { useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import { SUPPORTED_LANGUAGES } from '../i18n'
import { WebsiteProvider } from '../context/WebsiteContext'

/**
 * DashboardLayout Component
 * 
 * Main layout wrapper for all dashboard pages.
 * Provides consistent layout with:
 * - Fixed sidebar on the left (256px width)
 * - Topbar with language selector, help, and profile
 * - Main content area with proper offset
 * - Consistent background styling
 */

function DashboardLayout() {
  const { lang = 'en' } = useParams()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Get current language info
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0]

  /**
   * Change language
   */
  const changeLanguage = (newLang) => {
    i18n.changeLanguage(newLang)
    const newPath = location.pathname.replace(`/${lang}/`, `/${newLang}/`)
    window.history.replaceState(null, '', newPath)
    setShowLangDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Topbar - aligned with sidebar logo padding */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Store Selector - Left side */}
          <button className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center">
              <span className="text-sm">🏪</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">My Store</p>
              <p className="text-xs text-gray-400">Free Trial</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>

          {/* Right side items */}
          <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowLangDropdown(!showLangDropdown)
                setShowProfileDropdown(false)
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">{currentLang.flag}</span>
              <span className="text-sm text-gray-300 hidden sm:inline">{currentLang.code.toUpperCase()}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Language Dropdown */}
            {showLangDropdown && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-white/10 rounded-lg overflow-hidden shadow-xl z-50">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                      i18n.language === language.code ? 'bg-purple-500/20 text-white' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm">{language.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help/Support Button */}
          <a 
            href="https://waorders.com/support" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            title={t('nav.helpSupport')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowLangDropdown(false)
              }}
              className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-slate-800 border border-white/10 rounded-lg overflow-hidden shadow-xl z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <a href={`/${lang}/dashboard/profile`} className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">{t('nav.profile', 'Profile')}</span>
                  </a>
                  <a href={`/${lang}/dashboard/settings`} className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{t('nav.settings')}</span>
                  </a>
                  <a href={`/${lang}/dashboard/billing`} className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm">{t('nav.billing', 'Billing')}</span>
                  </a>
                </div>
                
                {/* Logout */}
                <div className="border-t border-white/10 py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">{t('nav.logout', 'Logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Main content area - offset by sidebar width and topbar height */}
      <main className="ml-64 pt-16 min-h-screen relative">
        <div className="p-6 lg:p-8">
          <WebsiteProvider>
            <Outlet />
          </WebsiteProvider>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout





