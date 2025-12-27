import { OnboardingProvider, useOnboarding } from '../context/OnboardingContext'
import Step1_Industry from './Step1_Industry'
import Step2_Goal from './Step2_Goal'
import Step3_PlanCTA from './Step3_PlanCTA'
import Step4_StoreSetup from './Step4_StoreSetup'
import Step5_Domain from './Step5_Domain'
import Step6_Products from './Step6_Products'
import Step7_Delivery from './Step7_Delivery'
import Step8_Payment from './Step8_Payment'
import Step9_WhatsApp from './Step9_WhatsApp'
import Step11_Ready from './Step11_Ready'

/**
 * OnboardingStepRenderer
 * 
 * Internal component that renders the appropriate step based on currentStep.
 * Uses a switch statement to conditionally render the correct component.
 */
function OnboardingStepRenderer() {
  const { currentStep } = useOnboarding()

  // Render the appropriate step component based on currentStep
  switch (currentStep) {
    case 1:
      return <Step1_Industry />
    case 2:
      return <Step2_Goal />
    case 3:
      return <Step4_StoreSetup />
    case 4:
      return <Step5_Domain />
    case 5:
      return <Step6_Products />
    case 6:
      return <Step7_Delivery />
    case 7:
      return <Step8_Payment />
    case 8:
      return <Step9_WhatsApp />
    case 9:
      return <Step3_PlanCTA />
    case 10:
      return <Step11_Ready />
    default:
      return <Step1_Industry />
  }
}

/**
 * ProgressBar Component
 * 
 * Visual indicator showing progress through the 10-step onboarding
 */
function ProgressBar() {
  const { currentStep } = useOnboarding()
  const progress = (currentStep / 10) * 100

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress track */}
      <div className="h-1 bg-white/10">
        {/* Progress fill */}
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="absolute top-2 right-4 text-xs text-gray-400 font-medium">
        Step {currentStep} of 10
      </div>
    </div>
  )
}

/**
 * OnboardingFlow Component
 * 
 * Main container for the entire 10-step onboarding process.
 * Wraps content with OnboardingProvider and renders the current step.
 * 
 * Flow:
 * Step 1: Select Industry
 * Step 2: Select Goal
 * Step 3: Create Store (Name, Phone, Link)
 * Step 4: Domain/Upgrade Prompt
 * Step 5: Add Products
 * Step 6: Add Delivery Methods
 * Step 7: Add Payment Methods
 * Step 8: Customize WhatsApp Message
 * Step 9: Choose Plan (moved to last step before ready)
 * Step 10: Store Ready - Go to Dashboard
 */
function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
        {/* Progress bar at top */}
        <ProgressBar />
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        
        {/* Step content */}
        <div className="relative z-10 pt-8">
          <OnboardingStepRenderer />
        </div>
      </div>
    </OnboardingProvider>
  )
}

export default OnboardingFlow

