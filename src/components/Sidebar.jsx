import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Sidebar Component
 * 
 * Full-featured navigation sidebar for the merchant dashboard.
 * Implements the complete navigation structure from the design specs.
 * Now with i18n support for multi-language UI.
 * 
 * Sections:
 * - Summary (first item)
 * - Store: Open, Change store, Create new store
 * - Management: Products (All, Category, Discounts), Customers, Chats (Inbox, Broadcasts, Chatbot), Analytics, Settings
 * - Sales Channels: Website (Design - Storefront, Checkout, Appearance, Menu, Pages, Reviews), WhatsApp, Instagram, Google, Point of Sale, Table Booking
 */

/**
 * NavItem Component
 * 
 * Individual navigation item with optional children/submenu
 */
function NavItem({ item, isActive, hasChildren, isExpanded, onToggle, lang }) {
  const location = useLocation()
  const basePath = `/${lang}`

  // Resolve full path with language prefix
  const getFullPath = (path) => {
    if (path.startsWith('/onboarding') || path.startsWith('/')) {
      return `${basePath}${path}`
    }
    return path
  }

  // Check if any child is active
  const isChildActive = item.children?.some(child => {
    const childFullPath = getFullPath(child.path)
    return child.exact
      ? location.pathname === childFullPath
      : location.pathname.startsWith(childFullPath)
  })

  const active = isActive || isChildActive

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${active
              ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border border-purple-500/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Submenu */}
        <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pl-10 py-1 space-y-1">
            {item.children.map((child) => {
              const childFullPath = getFullPath(child.path)
              const itemFullPath = getFullPath(item.path)
              const childActive = child.exact
                ? location.pathname === childFullPath
                : location.pathname.startsWith(childFullPath) && location.pathname !== itemFullPath

              return (
                <Link
                  key={child.path}
                  to={childFullPath}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${childActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span>{child.label}</span>
                  {child.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${child.badge === 'PRO' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                      {child.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      to={getFullPath(item.path)}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${active
          ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border border-purple-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </div>
      {item.badge && (
        <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${item.badge === 'CONNECTED' ? 'bg-green-500/20 text-green-400' :
            item.badge === 'BETA' ? 'bg-yellow-500/20 text-yellow-400' :
              item.badge === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
          }`}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function Sidebar() {
  const location = useLocation()
  const { lang = 'en' } = useParams()
  const { t } = useTranslation()
  const [expandedItems, setExpandedItems] = useState([]) // All collapsed by default

  // Navigation structure - simplified flat list
  const NAV_ITEMS = [
    {
      section: null, // Main navigation items
      items: [
        {
          path: '/dashboard',
          label: t('nav.dashboard', 'Dashboard'),
          icon: '📊',
          exact: true
        },
        {
          path: '/dashboard/inbox',
          label: t('nav.inbox', 'Inbox'),
          icon: '📥',
          badge: 'NEW'
        },
        {
          path: '/dashboard/orders',
          label: t('nav.orders', 'Orders'),
          icon: '📋'
        },
        {
          path: '/dashboard/products',
          label: t('nav.products'),
          icon: '📦',
          children: [
            { path: '/dashboard/products', label: t('nav.allProducts'), exact: true },
            { path: '/dashboard/products/categories', label: t('nav.categories') },
            { path: '/dashboard/products/discounts', label: t('nav.discounts') }
          ]
        },
        {
          path: '/dashboard/customers',
          label: t('nav.customers'),
          icon: '👥'
        },
        // Renamed 'Chats' to 'Campaigns' or just kept 'Tools' for Broadcasts/Chatbot if needed, 
        // or just keep them accessible?
        // For now, I'll keep a "Marketing & Automation" or similar, or just leave "Chats" but without Inbox.
        // Let's call it "Engagement" to be broader? Or keep "Chats" but remove Inbox child?
        // User asked to "Update sidebar so Inbox is a primary item". 
        // I will keep Broadcasts/Chatbot under "Engagement" for clarity.
        {
          path: '/dashboard/chats',
          label: t('nav.engagement', 'Engagement'),
          icon: '💬',
          children: [
            { path: '/dashboard/chats/broadcasts', label: t('nav.broadcasts') },
            { path: '/dashboard/chats/chatbot', label: t('nav.chatbot'), badge: 'PRO' }
          ]
        },
        {
          path: '/dashboard/analytics',
          label: t('nav.analytics'),
          icon: '📈'
        }
      ]
    },
    {
      section: t('nav.salesChannels'),
      items: [
        {
          path: '/dashboard/website',
          label: t('nav.website'),
          icon: '🌐',
          children: [
            { path: '/dashboard/website/storefront', label: t('nav.storefront') },
            { path: '/dashboard/website/checkout', label: t('nav.checkout') },
            { path: '/dashboard/website/appearance', label: t('nav.appearance') },
            { path: '/dashboard/website/menu', label: t('nav.menu') },
            { path: '/dashboard/website/pages', label: t('nav.pages') },
            { path: '/dashboard/website/reviews', label: t('nav.reviews') }
          ]
        },
        {
          path: '/dashboard/whatsapp',
          label: t('nav.whatsapp'),
          icon: '📱',
          badge: 'CONNECTED'
        },
        {
          path: '/dashboard/instagram',
          label: t('nav.instagram'),
          icon: '📸',
          badge: 'CONNECT'
        },
        {
          path: '/dashboard/google',
          label: t('nav.google'),
          icon: '🔍',
          badge: 'CONNECT'
        },
        {
          path: '/dashboard/pos',
          label: t('nav.pos'),
          icon: '💳',
          badge: 'BETA'
        },
        {
          path: '/dashboard/bookings',
          label: t('nav.tableBooking'),
          icon: '📅'
        }
      ]
    }
  ]

  /**
   * Check if path is active
   */
  const isActive = (item) => {
    const fullPath = `/${lang}${item.path}`
    if (item.exact) {
      return location.pathname === fullPath
    }
    return location.pathname.startsWith(fullPath)
  }

  /**
   * Toggle expanded state for items with children
   */
  const toggleExpand = (label) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              waorders
            </h1>
            <p className="text-xs text-gray-400">Merchant Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_ITEMS.map((section, sectionIndex) => (
          <div key={section.section || `section-${sectionIndex}`}>
            {section.section && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  lang={lang}
                  isActive={isActive(item)}
                  hasChildren={!!item.children}
                  isExpanded={expandedItems.includes(item.label)}
                  onToggle={() => toggleExpand(item.label)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
