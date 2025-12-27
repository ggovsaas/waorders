import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step1_Industry Component
 * 
 * First step of onboarding - Select your business industry.
 * Presents a grid of industry options with icons.
 * 
 * Corresponds to: Onboarding 1.png
 */

// Industry options with icons and values
const INDUSTRIES = [
  { id: 'food', label: 'Food & Restaurant', icon: '🍕', description: 'Restaurants, cafes, bakeries, food delivery' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: '👗', description: 'Clothing, accessories, shoes, jewelry' },
  { id: 'beauty', label: 'Beauty & Cosmetics', icon: '💄', description: 'Skincare, makeup, haircare products' },
  { id: 'electronics', label: 'Electronics', icon: '📱', description: 'Phones, gadgets, accessories, tech' },
  { id: 'home', label: 'Home & Living', icon: '🏠', description: 'Furniture, decor, home essentials' },
  { id: 'health', label: 'Health & Wellness', icon: '💊', description: 'Supplements, fitness, healthcare' },
  { id: 'grocery', label: 'Grocery & Essentials', icon: '🛒', description: 'Daily essentials, supermarket items' },
  { id: 'services', label: 'Services', icon: '🔧', description: 'Professional services, bookings' },
  { id: 'handmade', label: 'Handmade & Crafts', icon: '🎨', description: 'Artisan products, custom items' },
  { id: 'pets', label: 'Pets & Animals', icon: '🐕', description: 'Pet food, supplies, accessories' },
  { id: 'sports', label: 'Sports & Outdoors', icon: '⚽', description: 'Sports equipment, outdoor gear' },
  { id: 'other', label: 'Other', icon: '✨', description: 'Something else entirely' }
]

function Step1_Industry() {
  const { updateData, nextStep, progressData } = useOnboarding()
  const [selectedIndustry, setSelectedIndustry] = useState(progressData.industry || '')
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle industry selection
   */
  const handleSelect = (industryId) => {
    setSelectedIndustry(industryId)
  }

  /**
   * Handle continue button click
   * Updates context with selected industry and advances to next step
   */
  const handleContinue = () => {
    if (!selectedIndustry) return
    
    setIsAnimating(true)
    
    // Update context with selected industry
    updateData({ industry: selectedIndustry })
    
    // Small delay for animation, then advance
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/25">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What type of business do you have?
          </h1>
          <p className="text-gray-400 text-lg">
            This helps us customize your store experience
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry.id}
              onClick={() => handleSelect(industry.id)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedIndustry === industry.id
                  ? 'bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {/* Selection indicator */}
              {selectedIndustry === industry.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              <span className="text-2xl mb-2 block">{industry.icon}</span>
              <h3 className={`font-semibold text-sm transition-colors ${
                selectedIndustry === industry.id ? 'text-white' : 'text-gray-200 group-hover:text-white'
              }`}>
                {industry.label}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {industry.description}
              </p>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedIndustry}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Continue
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't worry, you can change this later in settings
        </p>
      </div>
    </div>
  )
}

export default Step1_Industry













