import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step5_Domain Component
 * 
 * Fifth step of onboarding - Domain/Upgrade Prompt.
 * Allows user to set up a custom domain or continue with free subdomain.
 * 
 * Corresponds to: onboarding 5.png
 */

function Step5_Domain() {
  const { updateData, nextStep, prevStep, progressData } = useOnboarding()
  
  const [useFreeSubdomain, setUseFreeSubdomain] = useState(progressData.useFreeSubdomain !== false)
  const [customDomain, setCustomDomain] = useState(progressData.customDomain || '')
  const [error, setError] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep()
  }

  /**
   * Handle skip/continue
   */
  const handleContinue = () => {
    // Validate custom domain if user wants to use it
    if (!useFreeSubdomain && customDomain.trim()) {
      // Basic domain validation
      const domainPattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
      if (!domainPattern.test(customDomain)) {
        setError('Please enter a valid domain (e.g., mystore.com)')
        return
      }
    }

    setIsAnimating(true)
    
    // Update context
    updateData({
      useFreeSubdomain,
      customDomain: useFreeSubdomain ? '' : customDomain.trim().toLowerCase()
    })
    
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  /**
   * Handle skip
   */
  const handleSkip = () => {
    setIsAnimating(true)
    
    updateData({
      useFreeSubdomain: true,
      customDomain: ''
    })
    
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-lg transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/25">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Your store address
          </h1>
          <p className="text-gray-400 text-lg">
            Choose how customers will find your store
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {/* Free subdomain option */}
          <button
            onClick={() => {
              setUseFreeSubdomain(true)
              setError(null)
            }}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              useFreeSubdomain
                ? 'bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Radio indicator */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                useFreeSubdomain
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-white/30'
              }`}>
                {useFreeSubdomain && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">Free subdomain</h3>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                    FREE
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Get started instantly with a waorders.com subdomain
                </p>
                <div className="bg-white/5 rounded-lg px-4 py-2.5 text-sm">
                  <span className="text-gray-400">Your store:</span>
                  <span className="text-cyan-400 ml-2 font-medium">
                    waorders.com/{progressData.storeLink || 'your-store'}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Custom domain option */}
          <button
            onClick={() => {
              setUseFreeSubdomain(false)
              setError(null)
            }}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              !useFreeSubdomain
                ? 'bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Radio indicator */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                !useFreeSubdomain
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-white/30'
              }`}>
                {!useFreeSubdomain && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">Custom domain</h3>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                    PRO
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Use your own domain for a professional look
                </p>
                
                {/* Custom domain input */}
                {!useFreeSubdomain && (
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => {
                      setCustomDomain(e.target.value)
                      if (error) setError(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="mystore.com"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                  />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Pro upgrade hint */}
        {!useFreeSubdomain && progressData.plan === 'free_trial' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-1">
                  Custom domains require Pro plan
                </p>
                <p className="text-yellow-200/70 text-xs">
                  You can set this up now and it will activate when you upgrade
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Continue
          </button>
        </div>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="w-full mt-4 text-center text-gray-400 hover:text-white text-sm transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

export default Step5_Domain













