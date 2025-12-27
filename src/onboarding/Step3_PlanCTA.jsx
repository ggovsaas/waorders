import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step3_PlanCTA Component
 * 
 * Third step of onboarding - Plan/Trial selection.
 * Shows pricing plans and allows user to select or start free trial.
 * 
 * Corresponds to: Onboarding 3.png
 */

// Plan options
const PLANS = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    description: 'Try all features free for 14 days',
    features: [
      'Unlimited products',
      'WhatsApp integration',
      'Basic analytics',
      'Customer management',
      'Order tracking'
    ],
    highlight: false,
    buttonText: 'Start Free Trial',
    badge: null
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Everything you need to grow',
    features: [
      'Everything in Free Trial',
      'Custom domain',
      'Advanced analytics',
      'Priority support',
      'Remove branding',
      'Automated messages',
      'Multiple payment gateways'
    ],
    highlight: true,
    buttonText: 'Start with Pro',
    badge: 'MOST POPULAR'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$9',
    period: '/month',
    description: 'Perfect for small businesses',
    features: [
      'Up to 100 products',
      'WhatsApp integration',
      'Basic analytics',
      'Email support'
    ],
    highlight: false,
    buttonText: 'Start with Basic',
    badge: null
  }
]

function Step3_PlanCTA() {
  const { updateData, nextStep, prevStep, progressData } = useOnboarding()
  const [selectedPlan, setSelectedPlan] = useState(progressData.plan || 'free_trial')
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Handle plan selection
   */
  const handleSelect = (planId) => {
    setSelectedPlan(planId)
  }

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep()
  }

  /**
   * Handle continue button click
   */
  const handleContinue = () => {
    setIsAnimating(true)
    
    // Update context with selected plan
    updateData({ plan: selectedPlan })
    
    // Small delay for animation, then advance
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className={`w-full max-w-5xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-green-500/25">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Choose your plan
          </h1>
          <p className="text-gray-400 text-lg">
            Start free, upgrade anytime. No credit card required.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id
            
            return (
              <div
                key={plan.id}
                onClick={() => handleSelect(plan.id)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-purple-600/40 to-cyan-600/40 border-2 border-purple-500 shadow-xl shadow-purple-500/20 scale-105'
                    : isSelected
                      ? 'bg-white/10 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-xs font-bold text-white shadow-lg">
                    {plan.badge}
                  </div>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(plan.id)
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.highlight || isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            )
          })}
        </div>

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
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Continue with {PLANS.find(p => p.id === selectedPlan)?.name}
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-8 text-gray-500 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure payment
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            24/7 support
          </span>
        </div>
      </div>
    </div>
  )
}

export default Step3_PlanCTA













