import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../supabaseClient'

/**
 * StoreSetup Component
 * 
 * Initial onboarding form for creating a new store.
 * Mirrors the Take.App onboarding screen (Onboarding 4.png).
 * 
 * Captures:
 * - Store Name
 * - Phone Number  
 * - Store Link (unique identifier that combines with waorders.com/)
 * 
 * On successful creation, redirects to /add-product for the next onboarding step.
 */
function StoreSetup() {
  const navigate = useNavigate()
  
  // Form state for the three required inputs
  const [formData, setFormData] = useState({
    name: '',           // Store name
    phoneNumber: '',    // Contact phone number
    storeLink: ''       // Unique store URL slug (e.g., 'mystore' -> waorders.com/mystore)
  })
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Handle input field changes
   * Updates the corresponding field in formData state
   * Clears any existing error when user starts typing
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }, [error])

  /**
   * Handle store creation form submission
   * 
   * Steps:
   * 1. Validate all fields are filled
   * 2. Validate store link format (alphanumeric and hyphens only)
   * 3. Insert new store record into Supabase 'stores' table
   * 4. On success, log message and redirect to /add-product
   * 5. On error, display appropriate error message
   */
  const handleStoreCreation = useCallback(async (e) => {
    e.preventDefault()
    setError(null)

    // Step 1: Validate all fields are filled
    if (!formData.name.trim() || !formData.phoneNumber.trim() || !formData.storeLink.trim()) {
      setError('Please fill in all fields')
      return
    }

    // Step 2: Validate store link format (only letters, numbers, and hyphens allowed)
    const linkPattern = /^[a-zA-Z0-9-]+$/
    if (!linkPattern.test(formData.storeLink)) {
      setError('Store link can only contain letters, numbers, and hyphens')
      return
    }

    // Validate phone number (basic validation)
    const phonePattern = /^[+]?[\d\s-]{8,}$/
    if (!phonePattern.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        // Demo mode - simulate success without database
        console.log('🎮 Demo Mode: Store would be created with:', {
          name: formData.name.trim(),
          phone_number: formData.phoneNumber.trim(),
          store_link: formData.storeLink.trim().toLowerCase()
        })
        
        // Simulate a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Store demo data in sessionStorage
        sessionStorage.setItem('currentStoreId', 'demo-store-id')
        sessionStorage.setItem('demoStoreData', JSON.stringify({
          name: formData.name.trim(),
          phone_number: formData.phoneNumber.trim(),
          store_link: formData.storeLink.trim().toLowerCase()
        }))
        
        console.log('✅ Demo store created! Configure Supabase for real database storage.')
        navigate('/add-product')
        return
      }

      // Hardcoded placeholder UUID for owner_id
      // This will be replaced with actual authenticated user ID once Supabase Auth is implemented
      const placeholderOwnerId = '11111111-2222-3333-4444-555555555555'

      // Step 3: Insert new store into Supabase 'stores' table
      const { data, error: insertError } = await supabase
        .from('stores')
        .insert([
          {
            owner_id: placeholderOwnerId,
            name: formData.name.trim(),
            phone_number: formData.phoneNumber.trim(),
            store_link: formData.storeLink.trim().toLowerCase(),
            delivery_methods: [],   // Empty array, to be configured later
            payment_methods: []     // Empty array, to be configured later
          }
        ])
        .select()  // Return the inserted record

      if (insertError) {
        // Handle specific error cases
        if (insertError.code === '23505') {
          // Unique constraint violation - store_link already exists
          setError('This store link is already taken. Please choose a different one.')
        } else {
          setError(`Failed to create store: ${insertError.message}`)
        }
        setIsLoading(false)
        return
      }

      // Step 4: Success - log and redirect to add-product page
      console.log('✅ Store created successfully:', data)
      
      // Store the created store ID in sessionStorage for use in product creation
      if (data && data[0]) {
        sessionStorage.setItem('currentStoreId', data[0].id)
      }
      
      // Redirect to add-product page (next step in onboarding)
      navigate('/add-product')
      
    } catch (err) {
      // Step 5: Handle unexpected errors
      console.error('Error creating store:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }, [formData, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main form card */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Header section */}
        <div className="mb-8 text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">waorders</span>
          </h1>
          <p className="text-gray-300">Let's set up your store in just a few steps</p>
        </div>

        {/* Store setup form */}
        <form onSubmit={handleStoreCreation} className="space-y-6">
          
          {/* Store Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              Store Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tube106"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Customers will contact you on this number
            </p>
          </div>

          {/* Store Link Input */}
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
              This will be your unique store URL (letters, numbers, hyphens only)
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Store...
              </span>
            ) : (
              'Create Store'
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By creating a store, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default StoreSetup
