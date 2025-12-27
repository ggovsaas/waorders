import { useTranslation } from 'react-i18next'

/**
 * GoogleChannelPage Component
 * 
 * Placeholder page for Google Shopping integration.
 * Describes setting up Google Merchant Center/Google Shopping listings.
 */
function GoogleChannelPage() {
  const { t } = useTranslation()

  const features = [
    { key: 'merchantCenter', icon: '🏪' },
    { key: 'freeListings', icon: '🆓' },
    { key: 'shoppingAds', icon: '📢' },
    { key: 'analytics', icon: '📈' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('channels.google.title')}</h1>
            <p className="text-gray-400">{t('channels.google.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="max-w-3xl">
          {/* Description */}
          <p className="text-gray-300 text-lg mb-8">
            {t('channels.google.description')}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature) => (
              <div 
                key={feature.key}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-white font-medium">
                  {t(`channels.google.features.${feature.key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button 
              disabled
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed flex items-center gap-2"
            >
              <span>🔍</span>
              {t('channels.google.cta')}
            </button>
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              {t('channels.google.comingSoon')}
            </span>
          </div>
        </div>
      </div>

      {/* Google Shopping Preview */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Google Shopping Preview</h3>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">🔍</span>
            <span className="text-gray-400 text-sm">your product name...</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
                <p className="text-sm text-gray-800 font-medium truncate">Your Product</p>
                <p className="text-sm text-green-600 font-bold">$49.99</p>
                <p className="text-xs text-gray-500">waorders.com</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleChannelPage













