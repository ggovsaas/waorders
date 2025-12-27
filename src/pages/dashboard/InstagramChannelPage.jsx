import { useTranslation } from 'react-i18next'

/**
 * InstagramChannelPage Component
 * 
 * Placeholder page for Instagram Shopping integration.
 * Describes connecting Instagram for Shopping Tags and DMs.
 */
function InstagramChannelPage() {
  const { t } = useTranslation()

  const features = [
    { key: 'shoppingTags', icon: '🏷️' },
    { key: 'dmIntegration', icon: '💬' },
    { key: 'analytics', icon: '📊' },
    { key: 'sync', icon: '🔄' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📸</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('channels.instagram.title')}</h1>
            <p className="text-gray-400">{t('channels.instagram.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="max-w-3xl">
          {/* Description */}
          <p className="text-gray-300 text-lg mb-8">
            {t('channels.instagram.description')}
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
                  {t(`channels.instagram.features.${feature.key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button 
              disabled
              className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed flex items-center gap-2"
            >
              <span>📸</span>
              {t('channels.instagram.cta')}
            </button>
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              {t('channels.instagram.comingSoon')}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Mockup */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Instagram post mockups */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
              <div className="text-center">
                <span className="text-4xl mb-2 block">👗</span>
                <span className="text-xs text-gray-400">Product Tag</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstagramChannelPage













