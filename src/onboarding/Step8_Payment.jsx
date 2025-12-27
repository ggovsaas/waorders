import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

/**
 * Step8_Payment Component
 * 
 * Eighth step of onboarding - Add Payment Methods.
 * Configure how customers will pay for their orders.
 * 
 * Corresponds to: onboarding 8.png
 */

// Predefined payment options
const PAYMENT_OPTIONS = [
  {
    id: 'cash',
    label: 'Cash on Delivery',
    icon: '💵',
    description: 'Accept cash when delivering orders',
    requiresSetup: false
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank transfers to your account',
    requiresSetup: true,
    setupFields: ['bankName', 'accountNumber', 'accountName']
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: '💳',
    description: 'Accept Visa, Mastercard, and more',
    requiresSetup: true,
    badge: 'Coming Soon',
    disabled: true
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿️',
    description: 'Accept PayPal payments',
    requiresSetup: true,
    setupFields: ['paypalEmail']
  },
  {
    id: 'mobile_money',
    label: 'Mobile Money',
    icon: '📲',
    description: 'M-Pesa, GCash, and other mobile wallets',
    requiresSetup: true,
    setupFields: ['mobileNumber']
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    icon: '₿',
    description: 'Accept Bitcoin, USDT, and more',
    requiresSetup: true,
    badge: 'PRO',
    disabled: false
  }
]

function Step8_Payment() {
  const { addPaymentMethod, removePaymentMethod, nextStep, prevStep, progressData } = useOnboarding()
  
  const [expandedMethod, setExpandedMethod] = useState(null)
  const [setupData, setSetupData] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * Toggle a payment method
   */
  const handleToggleMethod = (method) => {
    if (method.disabled) return
    
    const existingIndex = progressData.paymentMethods.findIndex(m => m.id === method.id)
    
    if (existingIndex >= 0) {
      removePaymentMethod(existingIndex)
      setExpandedMethod(null)
    } else {
      addPaymentMethod({
        id: method.id,
        label: method.label,
        icon: method.icon,
        setupData: setupData[method.id] || {}
      })
      
      if (method.requiresSetup && !method.disabled) {
        setExpandedMethod(method.id)
      }
    }
  }

  /**
   * Update setup data for a method
   */
  const handleSetupChange = (methodId, field, value) => {
    setSetupData(prev => ({
      ...prev,
      [methodId]: {
        ...(prev[methodId] || {}),
        [field]: value
      }
    }))
    
    // Update the method in context
    const existingIndex = progressData.paymentMethods.findIndex(m => m.id === methodId)
    if (existingIndex >= 0) {
      const updatedMethod = {
        ...progressData.paymentMethods[existingIndex],
        setupData: {
          ...(setupData[methodId] || {}),
          [field]: value
        }
      }
      removePaymentMethod(existingIndex)
      addPaymentMethod(updatedMethod)
    }
  }

  /**
   * Check if method is selected
   */
  const isSelected = (methodId) => {
    return progressData.paymentMethods.some(m => m.id === methodId)
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

  /**
   * Render setup fields based on method type
   */
  const renderSetupFields = (method) => {
    if (!method.setupFields) return null
    
    return (
      <div className="px-4 pb-4 pt-0 space-y-3">
        {method.setupFields.includes('bankName') && (
          <input
            type="text"
            value={setupData[method.id]?.bankName || ''}
            onChange={(e) => handleSetupChange(method.id, 'bankName', e.target.value)}
            placeholder="Bank name"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
        {method.setupFields.includes('accountNumber') && (
          <input
            type="text"
            value={setupData[method.id]?.accountNumber || ''}
            onChange={(e) => handleSetupChange(method.id, 'accountNumber', e.target.value)}
            placeholder="Account number"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
        {method.setupFields.includes('accountName') && (
          <input
            type="text"
            value={setupData[method.id]?.accountName || ''}
            onChange={(e) => handleSetupChange(method.id, 'accountName', e.target.value)}
            placeholder="Account holder name"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
        {method.setupFields.includes('paypalEmail') && (
          <input
            type="email"
            value={setupData[method.id]?.paypalEmail || ''}
            onChange={(e) => handleSetupChange(method.id, 'paypalEmail', e.target.value)}
            placeholder="PayPal email address"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
        {method.setupFields.includes('mobileNumber') && (
          <input
            type="tel"
            value={setupData[method.id]?.mobileNumber || ''}
            onChange={(e) => handleSetupChange(method.id, 'mobileNumber', e.target.value)}
            placeholder="Mobile money number"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className={`w-full max-w-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-green-500/25">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Payment methods
          </h1>
          <p className="text-gray-400 text-lg">
            How will customers pay for their orders?
          </p>
        </div>

        {/* Payment options */}
        <div className="space-y-3 mb-6">
          {PAYMENT_OPTIONS.map((method) => {
            const selected = isSelected(method.id)
            const expanded = expandedMethod === method.id && selected
            
            return (
              <div
                key={method.id}
                className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                  method.disabled
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : selected
                      ? 'bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <button
                  onClick={() => handleToggleMethod(method)}
                  disabled={method.disabled}
                  className="w-full flex items-center gap-4 p-4 text-left disabled:cursor-not-allowed"
                >
                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    method.disabled
                      ? 'border-white/10'
                      : selected
                        ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent'
                        : 'border-white/30'
                  }`}>
                    {selected && !method.disabled && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <span className="text-2xl">{method.icon}</span>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${method.disabled ? 'text-gray-500' : selected ? 'text-white' : 'text-gray-200'}`}>
                        {method.label}
                      </h3>
                      {method.badge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          method.badge === 'Coming Soon'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                  
                  {/* Expand indicator for setup methods */}
                  {selected && method.requiresSetup && !method.disabled && (
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedMethod(expanded ? null : method.id)
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {/* Setup fields */}
                {expanded && renderSetupFields(method)}
              </div>
            )
          })}
        </div>

        {/* Selected count */}
        {progressData.paymentMethods.length > 0 && (
          <p className="text-center text-purple-400 text-sm mb-6">
            {progressData.paymentMethods.length} method{progressData.paymentMethods.length !== 1 ? 's' : ''} selected
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
            {progressData.paymentMethods.length > 0 ? 'Continue' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step8_Payment













