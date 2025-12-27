import { useTranslation } from 'react-i18next'

/**
 * POSChannelPage Component
 * 
 * Placeholder page for Point of Sale integration.
 * Coming Soon message emphasizing its role for physical stores.
 */
function POSChannelPage() {
  const { t } = useTranslation()

  const features = [
    { key: 'mobilePayments', icon: '📱' },
    { key: 'inventorySync', icon: '📦' },
    { key: 'receipts', icon: '🧾' },
    { key: 'offline', icon: '📶' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">💳</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{t('channels.pos.title')}</h1>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
              {t('channels.pos.beta')}
            </span>
          </div>
        </div>
      </div>

      {/* Coming Soon Hero */}
      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl p-8 border border-emerald-500/30 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🏪</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('channels.pos.comingSoon')}
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            {t('channels.pos.subtitle')}
          </p>
          <p className="text-gray-400 mb-8">
            {t('channels.pos.description')}
          </p>

          {/* Notify Me Button */}
          <div className="flex flex-col items-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25">
              <span>🔔</span>
              Notify Me When Available
            </button>
            <span className="text-gray-500 text-sm">Be the first to know when POS launches</span>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-6">What's Coming</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div 
              key={feature.key}
              className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <span className="text-white font-medium">
                {t(`channels.pos.features.${feature.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* POS Terminal Mockup */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">POS Terminal Preview</h3>
        <div className="flex justify-center">
          <div className="bg-slate-800 rounded-3xl p-4 w-72 shadow-2xl">
            {/* Phone frame */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden">
              {/* Status bar */}
              <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                <span className="text-white text-xs">9:41</span>
                <div className="flex gap-1">
                  <span className="text-white text-xs">📶</span>
                  <span className="text-white text-xs">🔋</span>
                </div>
              </div>
              
              {/* App content */}
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-white text-4xl font-bold">$127.50</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Summer Dress</span>
                    <span className="text-white">$49.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Accessories x2</span>
                    <span className="text-white">$77.51</span>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold">
                  Tap to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSChannelPage













