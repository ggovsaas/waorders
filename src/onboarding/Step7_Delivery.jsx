import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step7_Delivery Component
 * 
 * Seventh step of onboarding - Add Delivery Methods.
 * Configure how customers will receive their orders.
 * 
 * Corresponds to: onboarding 7.png
 */

// Predefined delivery options
const DELIVERY_OPTIONS = [
  {
    id: 'pickup',
    label: 'Store Pickup',
    icon: '🏪',
    description: 'Customers pick up orders at your location',
    hasFee: false
  },
  {
    id: 'local_delivery',
    label: 'Local Delivery',
    icon: '🚗',
    description: 'Deliver to customers in your area',
    hasFee: true,
    defaultFee: 5.00
  },
  {
    id: 'shipping',
    label: 'Standard Shipping',
    icon: '📦',
    description: 'Ship nationwide via postal service',
    hasFee: true,
    defaultFee: 10.00
  },
  {
    id: 'express',
    label: 'Express Delivery',
    icon: '⚡',
    description: 'Same-day or next-day delivery',
    hasFee: true,
    defaultFee: 15.00
  },
  {
    id: 'free_shipping',
    label: 'Free Shipping',
    icon: '🎁',
    description: 'Free delivery (minimum order may apply)',
    hasFee: false
  }
]

function Step7_Delivery() {
  const { addDeliveryMethod, removeDeliveryMethod, nextStep, prevStep, progressData } = useOnboarding()
  
  const [showAddForm, setShowAddForm] = useState(progressData.deliveryMethods.length === 0)
  const [customMethod, setCustomMethod] = useState({ name: '', fee: '' })
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Toggle a delivery method
   */
  const handleToggleMethod = (method) => {
    const existingIndex = progressData.deliveryMethods.findIndex(m => m.id === method.id)
    
    if (existingIndex >= 0) {
      removeDeliveryMethod(existingIndex)
    } else {
      addDeliveryMethod({
        id: method.id,
        label: method.label,
        icon: method.icon,
        fee: method.hasFee ? method.defaultFee : 0,
        hasFee: method.hasFee
      })
    }
  }

  /**
   * Update fee for a method
   */
  const handleUpdateFee = (methodId, newFee) => {
    const existingIndex = progressData.deliveryMethods.findIndex(m => m.id === methodId)
    if (existingIndex >= 0) {
      const updatedMethod = {
        ...progressData.deliveryMethods[existingIndex],
        fee: parseFloat(newFee) || 0
      }
      removeDeliveryMethod(existingIndex)
      addDeliveryMethod(updatedMethod)
    }
  }

  /**
   * Add custom delivery method
   */
  const handleAddCustom = (e) => {
    e.preventDefault()
    if (!customMethod.name.trim()) return
    
    addDeliveryMethod({
      id: `custom_${Date.now()}`,
      label: customMethod.name.trim(),
      icon: '🚚',
      fee: parseFloat(customMethod.fee) || 0,
      hasFee: parseFloat(customMethod.fee) > 0,
      isCustom: true
    })
    
    setCustomMethod({ name: '', fee: '' })
    setShowAddForm(false)
  }

  /**
   * Check if method is selected
   */
  const isSelected = (methodId) => {
    return progressData.deliveryMethods.some(m => m.id === methodId)
  }

  /**
   * Get current fee for a method
   */
  const getCurrentFee = (methodId) => {
    const method = progressData.deliveryMethods.find(m => m.id === methodId)
    return method?.fee || 0
  }

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
    setTimeout(() => {
      nextStep()
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className={`w-full max-w-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <span className="text-3xl">🚚</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Delivery methods
          </h1>
          <p className="text-gray-400 text-lg">
            How will customers receive their orders?
          </p>
        </div>

        {/* Delivery options */}
        <div className="space-y-3 mb-6">
          {DELIVERY_OPTIONS.map((method) => {
            const selected = isSelected(method.id)
            
            return (
              <div
                key={method.id}
                className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                  selected
                    ? 'bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <button
                  onClick={() => handleToggleMethod(method)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    selected
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent'
                      : 'border-white/30'
                  }`}>
                    {selected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <span className="text-2xl">{method.icon}</span>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${selected ? 'text-white' : 'text-gray-200'}`}>
                      {method.label}
                    </h3>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                  
                  {/* Default fee badge */}
                  {method.hasFee && !selected && (
                    <span className="text-sm text-gray-500">
                      ${method.defaultFee?.toFixed(2)}
                    </span>
                  )}
                </button>
                
                {/* Fee input when selected */}
                {selected && method.hasFee && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <label className="text-sm text-gray-400 whitespace-nowrap">
                        Delivery fee:
                      </label>
                      <div className="relative flex-1 max-w-[120px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={getCurrentFee(method.id)}
                          onChange={(e) => handleUpdateFee(method.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          step="0.01"
                          min="0"
                          className="w-full pl-7 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Custom method form */}
        {showAddForm ? (
          <form onSubmit={handleAddCustom} className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
            <h4 className="text-white font-medium mb-3">Add custom delivery method</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={customMethod.name}
                onChange={(e) => setCustomMethod(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Method name"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <div className="relative w-24">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={customMethod.fee}
                  onChange={(e) => setCustomMethod(prev => ({ ...prev, fee: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group mb-6"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors text-sm font-medium">
              + Add custom delivery method
            </span>
          </button>
        )}

        {/* Selected count */}
        {progressData.deliveryMethods.length > 0 && (
          <p className="text-center text-purple-400 text-sm mb-6">
            {progressData.deliveryMethods.length} method{progressData.deliveryMethods.length !== 1 ? 's' : ''} selected
          </p>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4">
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
            {progressData.deliveryMethods.length > 0 ? 'Continue' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step7_Delivery













