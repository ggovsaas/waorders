import { useState, useCallback } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step4_StoreSetup Component
 * 
 * Fourth step of onboarding - Create your store.
 * Captures store name, phone number, and store link.
 * 
 * Corresponds to: Onboarding 4.png
 */

function Step4_StoreSetup() {
  const { updateData, nextStep, prevStep, progressData } = useOnboarding()
  
  // Form state
  const [formData, setFormData] = useState({
    storeName: progressData.storeName || '',
    phone: progressData.phone || '',
    storeLink: progressData.storeLink || ''
  })
  
  const [error, setError] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle input changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }, [error])

  /**
   * Auto-generate store link from store name
   */
  const handleStoreNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      storeName: name,
      // Auto-generate link if link is empty or was auto-generated
      storeLink: prev.storeLink === '' || prev.storeLink === generateSlug(prev.storeName)
        ? generateSlug(name)
        : prev.storeLink
    }))
    if (error) setError(null)
  }

  /**
   * Generate URL-friendly slug from text
   */
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep()
  }

  /**
   * Handle form submission
   */
  const handleContinue = (e) => {
    e.preventDefault()
    
    // Validate all fields
    if (!formData.storeName.trim()) {
      setError('Please enter your store name')
      return
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      return
    }
    
    // Basic phone validation
    const phonePattern = /^[+]?[\d\s-]{8,}$/
    if (!phonePattern.test(formData.phone)) {
      setError('Please enter a valid phone number')
      return
    }
    
    if (!formData.storeLink.trim()) {
      setError('Please enter your store link')
      return
    }
    
    // Validate store link format
    const linkPattern = /^[a-z0-9-]+$/
    if (!linkPattern.test(formData.storeLink)) {
      setError('Store link can only contain lowercase letters, numbers, and hyphens')
      return
    }

    setIsAnimating(true)
    
    // Update context with store data
    updateData({
      storeName: formData.storeName.trim(),
      phone: formData.phone.trim(),
      storeLink: formData.storeLink.trim().toLowerCase()
    })
    
    // Store in sessionStorage for demo mode
    sessionStorage.setItem('currentStoreId', 'demo-store-id')
    sessionStorage.setItem('demoStoreData', JSON.stringify({
      name: formData.storeName.trim(),
      phone_number: formData.phone.trim(),
      store_link: formData.storeLink.trim().toLowerCase()
    }))
    
    // Small delay for animation, then advance
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Create your store
          </h1>
          <p className="text-gray-400 text-lg">
            Set up your store in seconds
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleContinue} className="space-y-6">
          {/* Store Name */}
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-200 mb-2">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleStoreNameChange}
              placeholder="e.g., My Awesome Store"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Customers will contact you on WhatsApp using this number
            </p>
          </div>

          {/* Store Link */}
          <div>
            <label htmlFor="storeLink" className="block text-sm font-medium text-gray-200 mb-2">
              Store Link
            </label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
              <span className="text-gray-400 pl-4 pr-1 py-3 text-sm bg-white/5">waorders.com/</span>
              <input
                type="text"
                id="storeLink"
                name="storeLink"
                value={formData.storeLink}
                onChange={handleChange}
                placeholder="your-store"
                className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-400 outline-none"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              This will be your unique store URL
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
            >
              Back
            </button>
            
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              Create Store
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By creating a store, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default Step4_StoreSetup













