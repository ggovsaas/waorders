import { useState, useCallback } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import { generateProductDescription } from '../utils/aiProductDescription'

/**
 * Step6_Products Component
 * 
 * Sixth step of onboarding - Add Products.
 * Allows user to add their first products with AI-powered descriptions.
 * 
 * Corresponds to: onboarding 6.png
 */

function Step6_Products() {
  const { addProduct, removeProduct, nextStep, prevStep, progressData } = useOnboarding()
  
  // Form state for new product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    keyFeatures: '',
    description: ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(progressData.products.length === 0)
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
   * Generate AI description
   */
  const handleAIGeneration = useCallback(async () => {
    if (!formData.name.trim()) {
      setError('Please enter a product name first')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const featuresArray = formData.keyFeatures
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const generatedDescription = await generateProductDescription(
        formData.name.trim(),
        featuresArray
      )

      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }))
    } catch (err) {
      console.error('Error generating description:', err)
      setError('Failed to generate description. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [formData.name, formData.keyFeatures])

  /**
   * Add product to list
   */
  const handleAddProduct = useCallback((e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Please enter a product name')
      return
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    setIsSaving(true)

    const product = {
      id: Date.now(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim() || 'No description',
      keyFeatures: formData.keyFeatures
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0)
    }

    addProduct(product)
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      keyFeatures: '',
      description: ''
    })
    setShowForm(false)
    setIsSaving(false)
  }, [formData, addProduct])

  /**
   * Handle back button
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/25">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Add your products
          </h1>
          <p className="text-gray-400 text-lg">
            Start with a few products to get your store ready
          </p>
        </div>

        {/* Products list */}
        {progressData.products.length > 0 && (
          <div className="bg-white/5 rounded-xl border border-white/10 mb-6 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                {progressData.products.length} product{progressData.products.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {progressData.products.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(index)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add product form */}
        {showForm ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 mb-6">
            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Name and Price row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Handmade Soap"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Key Features <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  name="keyFeatures"
                  value={formData.keyFeatures}
                  onChange={handleChange}
                  placeholder="Natural ingredients&#10;Handmade&#10;Eco-friendly"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* AI Generate Button */}
              <button
                type="button"
                onClick={handleAIGeneration}
                disabled={isGenerating || !formData.name.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Description (AI)
                  </>
                )}
              </button>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product or use AI to generate..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Form actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group mb-6"
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors font-medium">
              Add another product
            </span>
          </button>
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
            {progressData.products.length > 0 ? 'Continue' : 'Skip for now'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          You can always add more products from your dashboard
        </p>
      </div>
    </div>
  )
}

export default Step6_Products













