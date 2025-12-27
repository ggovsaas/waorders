import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step9_WhatsApp Component
 * 
 * Ninth step of onboarding - Customize WhatsApp Message.
 * Configure how order messages will appear when sent via WhatsApp.
 * 
 * Corresponds to: Onboarding 9.png
 */

// Order format templates
const ORDER_FORMATS = [
  {
    id: 'simple',
    label: 'Simple',
    description: 'Just the essentials',
    preview: `🛒 *New Order*

• 2x Product Name - $20.00

*Total:* $40.00

📍 Delivery to: [Address]
📞 Contact: [Phone]`
  },
  {
    id: 'detailed',
    label: 'Detailed',
    description: 'Complete order info',
    preview: `🛒 *New Order #1234*

*Customer:* John Doe
📞 +1 234 567 8900
📍 123 Main St, City

━━━━━━━━━━━━
*Items:*
• 2x Product Name
  $10.00 each = $20.00
• 1x Another Item
  $15.00 each = $15.00
━━━━━━━━━━━━

*Subtotal:* $35.00
*Delivery:* $5.00
━━━━━━━━━━━━
*Total:* $40.00

💳 Payment: Cash on Delivery`
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Build your own',
    preview: `Customize your own message format...`
  }
]

function Step9_WhatsApp() {
  const { updateData, nextStep, prevStep, progressData } = useOnboarding()
  
  const [orderFormat, setOrderFormat] = useState(progressData.orderFormat || 'detailed')
  const [messageFooter, setMessageFooter] = useState(progressData.messageFooter || '')
  const [includeImages, setIncludeImages] = useState(progressData.includeItemImages !== false)
  const [autoReply, setAutoReply] = useState(progressData.autoReply !== false)
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle back
   */
  const handleBack = () => {
    prevStep()
  }

  /**
   * Handle continue
   */
  const handleContinue = () => {
    setIsAnimating(true)
    
    // Update context
    updateData({
      orderFormat,
      messageFooter: messageFooter.trim(),
      includeItemImages: includeImages,
      autoReply
    })
    
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className={`w-full max-w-3xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg shadow-green-500/25">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            WhatsApp messages
          </h1>
          <p className="text-gray-400 text-lg">
            Customize how orders appear in WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Settings */}
          <div className="space-y-6">
            {/* Order format selection */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Order message format
              </label>
              <div className="space-y-2">
                {ORDER_FORMATS.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setOrderFormat(format.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      orderFormat === format.id
                        ? 'bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      orderFormat === format.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/30'
                    }`}>
                      {orderFormat === format.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">{format.label}</h4>
                      <p className="text-xs text-gray-400">{format.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Additional options
              </label>
              
              {/* Include images toggle */}
              <button
                onClick={() => setIncludeImages(!includeImages)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  includeImages
                    ? 'bg-purple-600/10 border-purple-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🖼️</span>
                  <div className="text-left">
                    <h4 className="font-medium text-white text-sm">Include product images</h4>
                    <p className="text-xs text-gray-400">Send images alongside orders</p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  includeImages ? 'bg-purple-600' : 'bg-white/20'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    includeImages ? 'translate-x-5' : ''
                  }`} />
                </div>
              </button>

              {/* Auto-reply toggle */}
              <button
                onClick={() => setAutoReply(!autoReply)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  autoReply
                    ? 'bg-purple-600/10 border-purple-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🤖</span>
                  <div className="text-left">
                    <h4 className="font-medium text-white text-sm">Auto-reply confirmation</h4>
                    <p className="text-xs text-gray-400">Send automatic order confirmations</p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  autoReply ? 'bg-purple-600' : 'bg-white/20'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoReply ? 'translate-x-5' : ''
                  }`} />
                </div>
              </button>
            </div>

            {/* Custom footer message */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Footer message <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={messageFooter}
                onChange={(e) => setMessageFooter(e.target.value)}
                placeholder="Thank you for ordering! 🙏"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will appear at the bottom of every order message
              </p>
            </div>
          </div>

          {/* Right column - Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Message preview
            </label>
            <div className="bg-[#0b141a] rounded-2xl p-4 border border-white/10">
              {/* WhatsApp header */}
              <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Your Store</h4>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              
              {/* Message bubble */}
              <div className="bg-[#005c4b] rounded-2xl rounded-tl-md p-4 max-w-[90%] shadow-lg">
                <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {ORDER_FORMATS.find(f => f.id === orderFormat)?.preview}
                  {messageFooter && `\n\n${messageFooter}`}
                </pre>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-[10px] text-white/60">12:34 PM</span>
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <p className="mt-3 text-xs text-gray-500 text-center">
              This is how your order messages will appear in WhatsApp
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step9_WhatsApp













