import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step2_Goal Component
 * 
 * Second step of onboarding - Select your goals.
 * Allows multiple selection of business goals.
 * 
 * Corresponds to: Onboarding 2.png
 */

// Goal options with icons and descriptions
const GOALS = [
  { 
    id: 'deliveries', 
    label: 'Manage deliveries', 
    icon: '🚚',
    description: 'Track orders and manage delivery logistics'
  },
  { 
    id: 'payments', 
    label: 'Accept payments', 
    icon: '💳',
    description: 'Receive payments via multiple methods'
  },
  { 
    id: 'whatsapp', 
    label: 'Sell via WhatsApp', 
    icon: '📱',
    description: 'Turn WhatsApp into your sales channel'
  },
  { 
    id: 'catalog', 
    label: 'Create product catalog', 
    icon: '📦',
    description: 'Showcase products with images and prices'
  },
  { 
    id: 'orders', 
    label: 'Manage orders', 
    icon: '📋',
    description: 'Track and fulfill customer orders'
  },
  { 
    id: 'website', 
    label: 'Create online store', 
    icon: '🌐',
    description: 'Get a professional e-commerce website'
  },
  { 
    id: 'customers', 
    label: 'Grow customer base', 
    icon: '👥',
    description: 'Build relationships and loyalty'
  },
  { 
    id: 'analytics', 
    label: 'Track analytics', 
    icon: '📊',
    description: 'Understand your business performance'
  }
]

function Step2_Goal() {
  const { updateData, nextStep, prevStep, progressData } = useOnboarding()
  const [selectedGoals, setSelectedGoals] = useState(progressData.goals || [])
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle goal toggle
   */
  const handleToggle = (goalId) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId)
      } else {
        return [...prev, goalId]
      }
    })
  }

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep()
  }

  /**
   * Handle continue button click
   * Updates context with selected goals and advances to next step
   */
  const handleContinue = () => {
    if (selectedGoals.length === 0) return
    
    setIsAnimating(true)
    
    // Update context with selected goals
    updateData({ goals: selectedGoals })
    
    // Small delay for animation, then advance
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-6 shadow-lg shadow-pink-500/25">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What's your goal?
          </h1>
          <p className="text-gray-400 text-lg">
            Select all that apply to your business
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id)
            
            return (
              <button
                key={goal.id}
                onClick={() => handleToggle(goal.id)}
                className={`group flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {/* Checkbox indicator */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent'
                    : 'border-white/30 group-hover:border-white/50'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                {/* Icon */}
                <span className="text-2xl flex-shrink-0">{goal.icon}</span>
                
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold transition-colors ${
                    isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {goal.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {goal.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected count */}
        {selectedGoals.length > 0 && (
          <p className="text-center text-purple-400 text-sm mb-6">
            {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleBack}
            className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Continue
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          We'll personalize your dashboard based on your goals
        </p>
      </div>
    </div>
  )
}

export default Step2_Goal













