import { createContext, useContext, useReducer, useCallback } from 'react'

/**
 * OnboardingContext
 * 
 * Manages the complete state for the 10-step onboarding flow:
 * 
 * Step 1: Select Industry
 * Step 2: Select Goal
 * Step 3: Create Store (Name, Phone, Link)
 * Step 4: Domain/Upgrade Prompt
 * Step 5: Add Products
 * Step 6: Add Delivery Methods
 * Step 7: Add Payment Methods
 * Step 8: Customize WhatsApp Message
 * Step 9: Choose Plan (last step before ready)
 * Step 10: Store Ready - Go to Dashboard
 */

// Initial state for the entire onboarding process
const ONBOARDING_INITIAL_STATE = {
  // Current step (1-10)
  currentStep: 1,
  
  // Track if onboarding is complete
  isComplete: false,
  
  // All captured data from each step
  progressData: {
    // Step 1: Industry selection
    industry: '',
    
    // Step 2: Goals (array of selected goals)
    goals: [],
    
    // Step 3: Store details
    storeName: '',
    phone: '',
    storeLink: '',
    
    // Step 4: Domain configuration
    customDomain: '',
    useFreeSubdomain: true,
    
    // Step 5: Products (array of product objects)
    products: [],
    
    // Step 6: Delivery methods (array)
    deliveryMethods: [],
    
    // Step 7: Payment methods (array)
    paymentMethods: [],
    
    // Step 8: WhatsApp message customization
    orderFormat: 'detailed', // 'simple' | 'detailed' | 'custom'
    messageFooter: '',
    includeItemImages: true,
    autoReply: true,
    
    // Step 9: Selected plan (last step before ready)
    plan: 'free_trial', // 'free_trial' | 'basic' | 'pro'
    acceptedUpsell: false,
    selectedAddons: []
  }
}

// Action types
const ACTIONS = {
  SET_STEP: 'SET_STEP',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_ONBOARDING: 'RESET_ONBOARDING',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  ADD_PRODUCT: 'ADD_PRODUCT',
  REMOVE_PRODUCT: 'REMOVE_PRODUCT',
  ADD_DELIVERY_METHOD: 'ADD_DELIVERY_METHOD',
  REMOVE_DELIVERY_METHOD: 'REMOVE_DELIVERY_METHOD',
  ADD_PAYMENT_METHOD: 'ADD_PAYMENT_METHOD',
  REMOVE_PAYMENT_METHOD: 'REMOVE_PAYMENT_METHOD'
}

/**
 * Reducer function for managing onboarding state
 */
function onboardingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STEP:
      return {
        ...state,
        currentStep: action.payload
      }
    
    case ACTIONS.NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 10)
      }
    
    case ACTIONS.PREV_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
      }
    
    case ACTIONS.UPDATE_DATA:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          ...action.payload
        }
      }
    
    case ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          products: [...state.progressData.products, action.payload]
        }
      }
    
    case ACTIONS.REMOVE_PRODUCT:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          products: state.progressData.products.filter((_, index) => index !== action.payload)
        }
      }
    
    case ACTIONS.ADD_DELIVERY_METHOD:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          deliveryMethods: [...state.progressData.deliveryMethods, action.payload]
        }
      }
    
    case ACTIONS.REMOVE_DELIVERY_METHOD:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          deliveryMethods: state.progressData.deliveryMethods.filter((_, index) => index !== action.payload)
        }
      }
    
    case ACTIONS.ADD_PAYMENT_METHOD:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          paymentMethods: [...state.progressData.paymentMethods, action.payload]
        }
      }
    
    case ACTIONS.REMOVE_PAYMENT_METHOD:
      return {
        ...state,
        progressData: {
          ...state.progressData,
          paymentMethods: state.progressData.paymentMethods.filter((_, index) => index !== action.payload)
        }
      }
    
    case ACTIONS.COMPLETE_ONBOARDING:
      return {
        ...state,
        isComplete: true
      }
    
    case ACTIONS.RESET_ONBOARDING:
      return ONBOARDING_INITIAL_STATE
    
    default:
      return state
  }
}

// Create the context
const OnboardingContext = createContext(null)

/**
 * OnboardingProvider Component
 * 
 * Wraps the application/onboarding flow and provides state management
 */
export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(onboardingReducer, ONBOARDING_INITIAL_STATE)

  // Memoized action dispatchers for performance
  const setStep = useCallback((step) => {
    dispatch({ type: ACTIONS.SET_STEP, payload: step })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: ACTIONS.NEXT_STEP })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: ACTIONS.PREV_STEP })
  }, [])

  const updateData = useCallback((data) => {
    dispatch({ type: ACTIONS.UPDATE_DATA, payload: data })
  }, [])

  const addProduct = useCallback((product) => {
    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: product })
  }, [])

  const removeProduct = useCallback((index) => {
    dispatch({ type: ACTIONS.REMOVE_PRODUCT, payload: index })
  }, [])

  const addDeliveryMethod = useCallback((method) => {
    dispatch({ type: ACTIONS.ADD_DELIVERY_METHOD, payload: method })
  }, [])

  const removeDeliveryMethod = useCallback((index) => {
    dispatch({ type: ACTIONS.REMOVE_DELIVERY_METHOD, payload: index })
  }, [])

  const addPaymentMethod = useCallback((method) => {
    dispatch({ type: ACTIONS.ADD_PAYMENT_METHOD, payload: method })
  }, [])

  const removePaymentMethod = useCallback((index) => {
    dispatch({ type: ACTIONS.REMOVE_PAYMENT_METHOD, payload: index })
  }, [])

  const completeOnboarding = useCallback(() => {
    dispatch({ type: ACTIONS.COMPLETE_ONBOARDING })
  }, [])

  const resetOnboarding = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_ONBOARDING })
  }, [])

  // Context value with state and all action dispatchers
  const value = {
    // State
    ...state,
    
    // Navigation actions
    setStep,
    nextStep,
    prevStep,
    
    // Data actions
    updateData,
    addProduct,
    removeProduct,
    addDeliveryMethod,
    removeDeliveryMethod,
    addPaymentMethod,
    removePaymentMethod,
    
    // Flow control
    completeOnboarding,
    resetOnboarding
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

/**
 * useOnboarding Hook
 * 
 * Custom hook to access the onboarding context
 * Must be used within an OnboardingProvider
 */
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  
  return context
}

// Export action types for external use if needed
export { ACTIONS, ONBOARDING_INITIAL_STATE }

