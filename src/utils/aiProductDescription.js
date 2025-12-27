/**
 * AI Product Description Generator - Multi-Language Support
 * 
 * Uses Google Gemini API to generate compelling product descriptions
 * in multiple languages: English, Spanish, Portuguese, German, Dutch.
 * 
 * Dependencies:
 * - @google/generative-ai (install with: npm install @google/generative-ai)
 * 
 * Environment Variables Required:
 * - VITE_GEMINI_API_KEY: Your Google Gemini API key
 * 
 * Usage:
 * import { generateProductDescription, generateMultiLanguageDescriptions } from './utils/aiProductDescription';
 * 
 * // Single language (English)
 * const description = await generateProductDescription('Lavender Soap', ['Natural', 'Handmade']);
 * 
 * // Multi-language
 * const translations = await generateMultiLanguageDescriptions('Lavender Soap', ['Natural'], baseDescription);
 */

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' }
]

// Current stable Gemini model
const GEMINI_MODEL = 'gemini-1.5-flash'

/**
 * Generates a compelling product description using Gemini AI (English)
 * 
 * @param {string} productName - The name of the product
 * @param {string[]} keyFeatures - Array of key features or selling points
 * @returns {Promise<string>} - The generated product description in markdown format
 */
export async function generateProductDescription(productName, keyFeatures = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  // Check 1: API Key exists
  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ VITE_GEMINI_API_KEY is missing or empty!')
    console.error('   Please add your Gemini API key to .env file:')
    console.error('   VITE_GEMINI_API_KEY=your_api_key_here')
    console.error('   Then restart the development server.')
    return generateFallbackDescription(productName, keyFeatures)
  }

  // Check 2: API Key format (basic validation)
  if (apiKey.length < 20) {
    console.error('❌ VITE_GEMINI_API_KEY appears to be invalid (too short)')
    console.error('   Please verify your API key is correct.')
    return generateFallbackDescription(productName, keyFeatures)
  }

  console.log('🤖 Generating AI product description...')
  console.log('   Product:', productName)
  console.log('   Features:', keyFeatures.join(', ') || 'None specified')
  console.log('   Model:', GEMINI_MODEL)

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,  // Balanced creativity for marketing copy
        maxOutputTokens: 512,
      }
    })

    // Format features as bullet points
    const featuresList = keyFeatures.length > 0
      ? keyFeatures.map(feature => `- ${feature}`).join('\n')
      : ''

    // Strong persona-driven prompt with explicit elaboration instructions
    const prompt = `You are a highly creative and experienced e-commerce copywriter. Your task is to write a compelling, 150-word product description for the following item.

Product Name: ${productName}

${featuresList ? `Key Features to elaborate on:\n${featuresList}` : ''}

**INSTRUCTIONS:**
1. Use an enthusiastic, benefit-driven tone.
2. **Crucially: Do not simply list the features.** Instead, integrate and expand on each feature, explaining the direct benefit to the customer (e.g., 'Contoured Neck Support' becomes 'Engineered to promote perfect spinal alignment, relieving morning stiffness').
3. The output must be a single, flowing marketing description using Markdown for simple formatting (like **bolding** key phrases).
4. Do not include the headings 'Product Name' or 'Key Features' in the final output.
5. Write as if you're speaking directly to an excited customer who is about to make a purchase.
6. End with a compelling call-to-action.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim() === '') {
      console.error('❌ Gemini API returned empty response')
      return generateFallbackDescription(productName, keyFeatures)
    }

    console.log('✅ AI description generated successfully!')
    console.log('   Length:', text.trim().split(/\s+/).length, 'words')
    return text.trim()
    
  } catch (error) {
    // Detailed error logging
    console.error('❌ Error generating product description:')
    console.error('   Error name:', error.name)
    console.error('   Error message:', error.message)
    
    if (error.message?.includes('API_KEY_INVALID')) {
      console.error('   → Your API key is invalid. Please check it at https://aistudio.google.com/apikey')
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      console.error('   → Permission denied. Make sure the Gemini API is enabled for your project.')
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      console.error('   → API quota exceeded. Please check your usage limits.')
    } else if (error.message?.includes('model')) {
      console.error('   → Model error. The specified model may not be available.')
    } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
      console.error('   → Network error. Please check your internet connection.')
    }
    
    return generateFallbackDescription(productName, keyFeatures)
  }
}

/**
 * Generates multi-language product descriptions using Gemini AI
 * 
 * Takes the base English description and translates it to Spanish, Portuguese,
 * German, and Dutch while maintaining the marketing tone and markdown formatting.
 * 
 * @param {string} productName - The name of the product
 * @param {string[]} keyFeatures - Array of key features or selling points
 * @param {string} baseDescription - The English description to translate
 * @returns {Promise<Object>} - Object with translations: { en, es, pt, de, nl }
 */
export async function generateMultiLanguageDescriptions(productName, keyFeatures = [], baseDescription) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  // Default response with English only
  const defaultResponse = {
    en: baseDescription,
    es: '',
    pt: '',
    de: '',
    nl: ''
  }
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ VITE_GEMINI_API_KEY is missing. Cannot generate translations.')
    return defaultResponse
  }

  if (!baseDescription || baseDescription.trim() === '') {
    console.warn('⚠️ No base description provided for translation.')
    return defaultResponse
  }

  console.log('🌍 Generating multi-language descriptions...')

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL
    })

    const prompt = `You are an expert multilingual e-commerce copywriter and translator. Your task is to translate the following product description into 4 languages while maintaining:
- The same persuasive marketing tone
- All markdown formatting (bold text, bullet points)
- SEO optimization for each language
- Cultural relevance for each target market

Product Name: ${productName}

Original English Description:
${baseDescription}

Please provide translations in the following format. Return ONLY a valid JSON object with no additional text or markdown code blocks:

{
  "en": "${baseDescription.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
  "es": "[Spanish translation here]",
  "pt": "[Portuguese (Brazilian) translation here]",
  "de": "[German translation here]",
  "nl": "[Dutch translation here]"
}

Important:
- Keep the exact markdown formatting from the original
- Translate product benefits, not just words
- Use natural, native-sounding language for each locale
- The product name "${productName}" should remain as-is (do not translate brand/product names)
- Return ONLY the JSON object, no other text`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text().trim()
    
    // Clean up the response - remove markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.slice(7)
    }
    if (text.startsWith('```')) {
      text = text.slice(3)
    }
    if (text.endsWith('```')) {
      text = text.slice(0, -3)
    }
    text = text.trim()

    try {
      const translations = JSON.parse(text)
      
      // Validate the response has all required languages
      const requiredLanguages = ['en', 'es', 'pt', 'de', 'nl']
      const hasAllLanguages = requiredLanguages.every(lang => 
        translations[lang] && typeof translations[lang] === 'string'
      )
      
      if (!hasAllLanguages) {
        console.warn('Translation response missing some languages, filling gaps...')
        requiredLanguages.forEach(lang => {
          if (!translations[lang]) {
            translations[lang] = lang === 'en' ? baseDescription : ''
          }
        })
      }
      
      console.log('✅ Multi-language descriptions generated successfully!')
      return translations
      
    } catch (parseError) {
      console.error('Failed to parse translation response:', parseError)
      console.log('Raw response:', text)
      return defaultResponse
    }
    
  } catch (error) {
    console.error('Error generating multi-language descriptions:', error)
    return defaultResponse
  }
}

/**
 * Generates a simple fallback description when AI generation fails
 * 
 * @param {string} productName - The name of the product
 * @param {string[]} keyFeatures - Array of key features
 * @returns {string} - A basic product description
 */
function generateFallbackDescription(productName, keyFeatures) {
  console.warn('⚠️ Using fallback description (AI generation failed or unavailable)')
  
  let description = `**${productName}**\n\n`
  
  if (keyFeatures.length > 0) {
    description += `Introducing the **${productName}** - designed with you in mind.\n\n`
    description += '**Features:**\n'
    keyFeatures.forEach(feature => {
      description += `• ${feature}\n`
    })
    description += '\nExperience the difference quality makes.'
  } else {
    description += `Discover our **${productName}** - crafted for excellence.\n\n`
    description += 'Premium quality meets exceptional design. Perfect for those who appreciate the finer things.\n\n'
    description += '*Add product features to generate a more detailed AI description.*'
  }
  
  return description
}

/**
 * Generates fallback multi-language descriptions
 * Returns the same base description for all languages (no translation)
 * 
 * @param {string} baseDescription - The base description
 * @returns {Object} - Object with all languages set to base description
 */
export function generateFallbackMultiLanguage(baseDescription) {
  return {
    en: baseDescription,
    es: baseDescription,
    pt: baseDescription,
    de: baseDescription,
    nl: baseDescription
  }
}
