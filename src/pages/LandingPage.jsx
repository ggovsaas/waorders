import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * LandingPage Component
 * 
 * High-conversion marketing landing page for waorders.com
 * Now with i18n support for multi-language UI.
 * 
 * Sections:
 * 1. Hero - Hook & Value Proposition
 * 2. Feature Demo - Show the product in action
 * 3. Pain Points & Solutions - Empathy & Relief
 * 4. ROI & Savings - Justify the price
 * 5. Niche Targeting - Industry-specific CTAs
 * 6. Social Proof - Build trust
 * 7. Final CTA - Convert
 */

// Feature data
const FEATURES = [
  {
    icon: '🌍',
    title: 'Multi-Language Support',
    description: 'Auto-translate product descriptions to 5 languages. Reach customers worldwide without hiring translators.',
    highlight: 'EN • ES • PT • DE • NL'
  },
  {
    icon: '🔗',
    title: 'Smart Order Links',
    description: 'Generate shareable order links that work anywhere. Track every click, view, and conversion.',
    highlight: 'One-click ordering'
  },
  {
    icon: '💳',
    title: 'Integrated Payments',
    description: 'Accept card payments, bank transfers, and mobile money. Get paid before you ship.',
    highlight: '10+ payment methods'
  },
  {
    icon: '📱',
    title: 'WhatsApp-First',
    description: 'Turn your WhatsApp into a sales machine. Orders flow directly to your chat, beautifully formatted.',
    highlight: '2B+ users reached'
  }
]

// Pain points data
const PAIN_POINTS = [
  { pain: 'Lost orders buried in chat history', solution: 'Centralized order dashboard' },
  { pain: 'Manual copy-paste for every order', solution: 'Auto-generated order summaries' },
  { pain: 'Language barriers limit your market', solution: 'AI-powered translations' },
  { pain: 'Chasing customers for payment', solution: 'Pre-paid orders before delivery' },
  { pain: 'No visibility into what sells', solution: 'Real-time analytics & insights' },
  { pain: 'Expensive e-commerce platforms', solution: 'Free tier with all essentials' }
]

// Industry niches
const INDUSTRIES = [
  { name: 'E-commerce', icon: '🛒', description: 'Online stores & digital products' },
  { name: 'Restaurants', icon: '🍕', description: 'Food delivery & takeaway' },
  { name: 'Fashion', icon: '👗', description: 'Clothing & accessories' },
  { name: 'Groceries', icon: '🥬', description: 'Fresh produce & essentials' },
  { name: 'Beauty', icon: '💄', description: 'Cosmetics & skincare' },
  { name: 'Services', icon: '🔧', description: 'Bookings & appointments' }
]

// Testimonials
const TESTIMONIALS = [
  {
    quote: "We went from 50 orders/week to 200+ just by making ordering easier. waorders paid for itself in the first day.",
    author: "Maria S.",
    role: "Fashion Boutique Owner",
    avatar: "👩‍💼"
  },
  {
    quote: "My customers love ordering in their language. Sales from Brazil increased 300% after enabling Portuguese.",
    author: "Carlos R.",
    role: "Electronics Store",
    avatar: "👨‍💻"
  },
  {
    quote: "No more chasing payments! Pre-paid orders changed everything. Now I ship knowing I'm already paid.",
    author: "Aisha K.",
    role: "Homemade Foods",
    avatar: "👩‍🍳"
  }
]

function LandingPage() {
  const { t } = useTranslation()
  const { lang = 'en' } = useParams()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                waorders
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                to={`/${lang}/login`} 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                {t('common.logIn')}
              </Link>
              <Link 
                to={`/${lang}/onboarding`} 
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
              >
                {t('common.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">{t('landing.hero.badge')}</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('landing.hero.headline').split('WhatsApp')[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                WhatsApp
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('landing.hero.subheadline')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to={`/${lang}/onboarding`} 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <span>{t('landing.hero.ctaPrimary')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('landing.hero.ctaSecondary')}</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('landing.hero.trustNoCreditCard')}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('landing.hero.trustFreeTrial')}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('landing.hero.trustCancelAnytime')}
              </span>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div id="demo" className="mt-20 relative">
            <div className="relative mx-auto max-w-5xl">
              {/* Browser mockup */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white/10 rounded-lg px-4 py-1.5 text-sm text-gray-400 text-center">
                      waorders.com/your-store
                    </div>
                  </div>
                </div>
                
                {/* App preview */}
                <div className="p-8 bg-gradient-to-br from-slate-900 to-purple-900/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Product card preview */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="aspect-square bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-5xl">👗</span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">Summer Dress</h4>
                      <p className="text-purple-400 font-bold text-lg mb-3">$49.99</p>
                      <button className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium">
                        Order via WhatsApp
                      </button>
                    </div>
                    
                    {/* Order link preview */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">📱</span>
                        </div>
                        <h4 className="text-white font-semibold">Order Link Generated!</h4>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-400 mb-1">Share this link:</p>
                        <p className="text-cyan-400 text-sm font-mono truncate">wa.me/c/order/abc123</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-medium">
                          WhatsApp
                        </button>
                        <button className="flex-1 py-2 bg-white/10 text-white rounded-lg text-xs font-medium">
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    {/* Analytics preview */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-4">Today's Stats</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Orders</span>
                          <span className="text-white font-bold">24</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Revenue</span>
                          <span className="text-green-400 font-bold">$1,249</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Visitors</span>
                          <span className="text-white font-bold">156</span>
                        </div>
                        <div className="h-24 bg-white/5 rounded-lg mt-4 flex items-end justify-around p-2">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div 
                              key={i} 
                              className="w-4 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t"
                              style={{ height: `${h}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 px-4 py-2 bg-green-500/20 backdrop-blur-xl rounded-xl border border-green-500/30 text-green-400 text-sm font-medium shadow-lg animate-bounce">
                ✓ Order received!
              </div>
              <div className="absolute -right-4 top-1/3 px-4 py-2 bg-purple-500/20 backdrop-blur-xl rounded-xl border border-purple-500/30 text-purple-400 text-sm font-medium shadow-lg">
                🌍 Auto-translated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <span className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium">
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Sound familiar?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We built waorders to solve the problems we faced selling on WhatsApp
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xl">✗</span>
                  </div>
                  <p className="text-gray-400">{item.pain}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xl">✓</span>
                  </div>
                  <p className="text-white font-medium">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-3xl p-8 md:p-12 border border-purple-500/30 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.3),transparent_50%)]"></div>
            
            <div className="relative">
              <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm text-gray-300 mb-6">
                💰 Average merchant savings
              </span>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
                <div>
                  <p className="text-6xl md:text-8xl font-bold text-white mb-2">15+</p>
                  <p className="text-xl text-gray-300">Hours saved per week</p>
                </div>
                <div className="hidden md:block w-px h-24 bg-white/20"></div>
                <div>
                  <p className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">$500</p>
                  <p className="text-xl text-gray-300">Monthly savings</p>
                </div>
              </div>
              
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Stop losing orders to chat chaos. Merchants using waorders report 3x faster order processing and significantly higher conversion rates.
              </p>
              
              <Link 
                to="/onboarding" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                <span>Calculate Your Savings</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Built for every business
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trusted by thousands of merchants across all industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INDUSTRIES.map((industry, index) => (
              <Link 
                key={index}
                to={`/onboarding?industry=${industry.name.toLowerCase()}`}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center"
              >
                <span className="text-4xl mb-3 block group-hover:scale-125 transition-transform">{industry.icon}</span>
                <h3 className="text-white font-semibold mb-1">{industry.name}</h3>
                <p className="text-gray-500 text-xs">{industry.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loved by merchants worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of businesses already growing with waorders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center">
                    <span className="text-xl">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('landing.finalCta.title')}
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            {t('landing.finalCta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link 
              to={`/${lang}/onboarding`} 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all shadow-xl shadow-purple-500/30"
            >
              {t('landing.finalCta.button')}
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            {t('landing.finalCta.note')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                waorders
              </span>
            </div>
            
            <div className="flex items-center gap-8 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 waorders. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

