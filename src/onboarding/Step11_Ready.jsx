import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step11_Ready Component
 * 
 * Final step of onboarding - Store Ready to Share.
 * Shows success message and provides options to share or go to dashboard.
 * 
 * Corresponds to: onboarding 11.jpg
 */

// Confetti particle component for celebration effect
function Confetti() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = ['#9333ea', '#06b6d4', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  )
}

function Step11_Ready() {
  const navigate = useNavigate()
  const { progressData, completeOnboarding } = useOnboarding()
  
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  // Store URL
  const storeUrl = `waorders.com/${progressData.storeLink || 'your-store'}`

  /**
   * Copy store link to clipboard
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${storeUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  /**
   * Share to WhatsApp
   */
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out my new store! 🛒\n\nhttps://${storeUrl}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  /**
   * Go to dashboard
   */
  const handleGoToDashboard = () => {
    completeOnboarding()
    navigate('/dashboard')
  }

  // Auto-hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Confetti celebration */}
      {showConfetti && <Confetti />}

      <div className="w-full max-w-lg text-center">
        {/* Success animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl shadow-green-500/30 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎉 You're all set!
          </h1>
          <p className="text-gray-400 text-lg">
            Your store <span className="text-white font-semibold">{progressData.storeName || 'Your Store'}</span> is ready
          </p>
        </div>

        {/* Store preview card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">{progressData.storeName || 'Your Store'}</h3>
              <p className="text-cyan-400 text-sm">{storeUrl}</p>
            </div>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
            <div>
              <p className="text-2xl font-bold text-white">{progressData.products?.length || 0}</p>
              <p className="text-xs text-gray-400">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{progressData.deliveryMethods?.length || 0}</p>
              <p className="text-xs text-gray-400">Delivery</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{progressData.paymentMethods?.length || 0}</p>
              <p className="text-xs text-gray-400">Payments</p>
            </div>
          </div>

          {/* Store link with copy */}
          <div className="mt-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
              <input
                type="text"
                value={`https://${storeUrl}`}
                readOnly
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Share options */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-4">Share your store with the world</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              Share on WhatsApp
            </button>
            
            <button
              onClick={handleCopyLink}
              className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Go to Dashboard CTA */}
        <button
          onClick={handleGoToDashboard}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
        >
          Go to Dashboard →
        </button>

        {/* Quick actions hint */}
        <p className="mt-6 text-gray-500 text-sm">
          You can always customize your store from the dashboard
        </p>
      </div>
    </div>
  )
}

export default Step11_Ready













