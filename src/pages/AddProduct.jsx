import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import { 
  generateProductDescription, 
  generateMultiLanguageDescriptions,
  SUPPORTED_LANGUAGES 
} from '../utils/aiProductDescription'

/**
 * AddProduct Component
 * 
 * Product creation form with AI-powered multi-language description generation.
 * Supports: English, Spanish, Portuguese, German, Dutch
 * 
 * Features:
 * - Product Name input
 * - Price input (number)
 * - Key Features textarea (each feature on a new line)
 * - Multi-language description field (AI-generated or manual)
 * - Language selector to view/edit different translations
 * - AI description generation using Gemini API
 * - Save to Supabase 'products' table (JSON descriptions)
 */
function AddProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if we're in dashboard context
  const isDashboard = location.pathname.includes('/dashboard')
  
  // Form state for product inputs
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    keyFeatures: ''
  })
  
  // Multi-language descriptions state
  const [descriptions, setDescriptions] = useState({
    en: '',
    es: '',
    pt: '',
    de: '',
    nl: ''
  })
  
  // Current language being viewed/edited
  const [currentLanguage, setCurrentLanguage] = useState('en')
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('') // 'english' | 'translating' | ''
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  /**
   * Handle input field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
    if (success) setSuccess(false)
  }, [error, success])

  /**
   * Handle description change for current language
   */
  const handleDescriptionChange = useCallback((e) => {
    const value = e.target.value
    setDescriptions(prev => ({
      ...prev,
      [currentLanguage]: value
    }))
    if (error) setError(null)
    if (success) setSuccess(false)
  }, [currentLanguage, error, success])

  /**
   * Handle AI description generation (English first, then translations)
   */
  const handleAIGeneration = useCallback(async () => {
    if (!formData.name.trim()) {
      setError('Please enter a product name first')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGenerationStep('english')

    try {
      // Parse key features
      const featuresArray = formData.keyFeatures
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)

      console.log('🤖 Step 1: Generating English description for:', formData.name)

      // Step 1: Generate English description
      const englishDescription = await generateProductDescription(
        formData.name.trim(),
        featuresArray
      )

      // Update English description immediately
      setDescriptions(prev => ({
        ...prev,
        en: englishDescription
      }))

      console.log('✅ English description generated!')
      console.log('🌍 Step 2: Generating translations...')
      setGenerationStep('translating')

      // Step 2: Generate multi-language translations
      const translations = await generateMultiLanguageDescriptions(
        formData.name.trim(),
        featuresArray,
        englishDescription
      )

      // Update all descriptions
      setDescriptions(translations)
      
      console.log('✅ All translations generated successfully!')

    } catch (err) {
      console.error('Error generating descriptions:', err)
      setError('Failed to generate descriptions. Please try again or write manually.')
    } finally {
      setIsGenerating(false)
      setGenerationStep('')
    }
  }, [formData.name, formData.keyFeatures])

  /**
   * Handle product save to database
   */
  const handleProductSave = useCallback(async (e) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Please enter a product name')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    // Check if at least English description exists
    if (!descriptions.en.trim()) {
      setError('Please add a product description (use AI generation or write manually)')
      return
    }

    setIsSaving(true)

    try {
      const storeId = sessionStorage.getItem('currentStoreId') || '11111111-2222-3333-4444-555555555555'

      const featuresArray = formData.keyFeatures
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)

      // Product data with JSON descriptions for multi-language support
      const productData = {
        store_id: storeId,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        // Store descriptions as JSON object for multi-language support
        description: descriptions,
        key_features: featuresArray,
        is_available: true
      }

      if (!isSupabaseConfigured()) {
        // Demo mode
        console.log('🎮 Demo Mode: Product would be saved:', productData)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('✅ Demo product saved with multi-language descriptions!')
        
        setSuccess(true)
        setFormData({ name: '', price: '', keyFeatures: '' })
        setDescriptions({ en: '', es: '', pt: '', de: '', nl: '' })
        setCurrentLanguage('en')
        setIsSaving(false)
        return
      }

      // Insert product into Supabase
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (insertError) {
        console.error('Supabase error:', insertError)
        setError(`Failed to save product: ${insertError.message}`)
        setIsSaving(false)
        return
      }

      console.log('✅ Product saved successfully with translations:', data)
      
      setSuccess(true)
      setFormData({ name: '', price: '', keyFeatures: '' })
      setDescriptions({ en: '', es: '', pt: '', de: '', nl: '' })
      setCurrentLanguage('en')

    } catch (err) {
      console.error('Error saving product:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }, [formData, descriptions])

  // Get current language info
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)
  
  // Check if translations are available
  const hasTranslations = Object.values(descriptions).some(d => d.trim() !== '')

  // Wrapper classes based on context
  const wrapperClass = isDashboard 
    ? "space-y-6" 
    : "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"

  return (
    <div className={wrapperClass}>
      {/* Decorative background elements */}
      {!isDashboard && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
      )}

      {/* Main form card */}
      <div className={`relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full ${isDashboard ? '' : 'max-w-2xl'} border border-white/20`}>
        {/* Header section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(isDashboard ? '/dashboard/products' : '/dashboard')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Add New Product</h1>
              <p className="text-gray-400 text-sm">Create a product with AI-powered multi-language descriptions</p>
            </div>
          </div>
          
          {/* Multi-language badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg px-3 py-2 border border-purple-500/30">
            <span className="text-lg">🌍</span>
            <span className="text-sm text-gray-300">
              Supports: {SUPPORTED_LANGUAGES.map(l => l.flag).join(' ')} (EN, ES, PT, DE, NL)
            </span>
          </div>
        </div>

        {/* Product form */}
        <form onSubmit={handleProductSave} className="space-y-6">
          {/* Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Lavender Soap"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">
                Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-200 mb-2">
              Key Features
              <span className="text-gray-400 font-normal ml-2">(one per line)</span>
            </label>
            <textarea
              id="keyFeatures"
              name="keyFeatures"
              value={formData.keyFeatures}
              onChange={handleChange}
              placeholder="Natural ingredients&#10;Handmade with care&#10;Suitable for sensitive skin&#10;Eco-friendly packaging"
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter product features that will help the AI generate better descriptions
            </p>
          </div>

          {/* AI Generation Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAIGeneration}
              disabled={isGenerating || !formData.name.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>
                    {generationStep === 'english' ? 'Generating English...' : 'Translating...'}
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate All Languages (AI)</span>
                </>
              )}
            </button>
            
            <span className="text-gray-400 text-sm">
              {formData.name.trim() 
                ? 'Generates EN + 4 translations' 
                : 'Enter product name first'}
            </span>
          </div>

          {/* Language Selector and Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-200">
                Product Description <span className="text-red-400">*</span>
              </label>
              
              {/* Language Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">View/Edit:</span>
                <select
                  value={currentLanguage}
                  onChange={(e) => setCurrentLanguage(e.target.value)}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800">
                      {lang.flag} {lang.name} {descriptions[lang.code] ? '✓' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Translation status indicators */}
            {hasTranslations && (
              <div className="flex items-center gap-1 mb-2">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setCurrentLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      currentLanguage === lang.code
                        ? 'bg-purple-600 text-white'
                        : descriptions[lang.code]
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-white/5 text-gray-500 hover:bg-white/10'
                    }`}
                    title={`${lang.name} ${descriptions[lang.code] ? '(has content)' : '(empty)'}`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            )}
            
            {/* Description Textarea */}
            <div className="relative">
              <textarea
                id="description"
                value={descriptions[currentLanguage]}
                onChange={handleDescriptionChange}
                placeholder={`Write your product description in ${currentLangInfo?.name || 'English'}...`}
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none font-mono text-sm"
                required={currentLanguage === 'en'}
              />
              
              {/* Current language indicator */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                {currentLangInfo?.flag} {currentLangInfo?.name}
              </div>
            </div>
            
            <p className="mt-1 text-xs text-gray-400">
              {currentLanguage === 'en' 
                ? 'Primary language (required). Other translations are optional.'
                : `${currentLangInfo?.name} translation. Will use English if left empty.`}
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

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Product saved successfully with {Object.values(descriptions).filter(d => d.trim()).length} language(s)!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Product...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Product
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(isDashboard ? '/dashboard/products' : '/dashboard')}
              className="sm:w-auto bg-white/10 border border-white/20 text-white py-4 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
            >
              {isDashboard ? 'Back to Products' : 'Go to Dashboard'}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Products will be visible in your store once saved • Descriptions stored in 5 languages
        </p>
      </div>
    </div>
  )
}

export default AddProduct
