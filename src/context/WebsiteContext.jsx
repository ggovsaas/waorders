import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'waorders.website.v1'

const WebsiteContext = createContext(null)

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

const DEFAULT_STATE = {
  storefront: {
    hero: {
      title: 'Welcome to My Store',
      subtitle: 'Order in seconds via WhatsApp.',
      imageUrl: ''
    },
    sections: {
      hero: true,
      categories: true,
      featuredProducts: true,
      footer: true
    },
    featuredProductIds: [],
    footerText: '© ' + new Date().getFullYear() + ' waorders. All rights reserved.'
  },
  checkout: {
    fields: {
      fullName: true,
      phone: true,
      address: true,
      notes: true
    },
    delivery: {
      delivery: true,
      pickup: true
    },
    paymentInstructions: 'Pay on delivery or via bank transfer (edit this message).',
    confirmationMessage: 'Thanks! We received your order and will confirm it shortly.',
    whatsapp: {
      phoneNumber: '',
      messageTemplate:
        'Hi! I would like to place an order.%0A%0AOrder details:%0A{{items}}%0A%0ATotal: {{total}}%0A%0AName: {{name}}%0APhone: {{phone}}%0AAddress: {{address}}%0ANotes: {{notes}}'
    }
  },
  appearance: {
    preset: 'waorders',
    colors: {
      primary: '#7c3aed',
      secondary: '#06b6d4',
      background: '#0f172a'
    },
    font: 'Inter',
    logoUrl: '',
    faviconUrl: '',
    radius: 16,
    spacing: 16
  },
  menu: {
    items: [
      { id: uid('menu'), label: 'Home', type: 'internal', path: '/storefront', visible: true },
      { id: uid('menu'), label: 'Products', type: 'internal', path: '/products', visible: true },
      { id: uid('menu'), label: 'Contact', type: 'page', path: 'contact', visible: true }
    ]
  },
  pages: {
    items: [
      {
        id: uid('page'),
        title: 'Contact',
        slug: 'contact',
        content: 'Add your contact details here.',
        seoTitle: 'Contact',
        seoDescription: 'Contact us',
        published: true,
        updatedAt: new Date().toISOString()
      }
    ]
  },
  reviews: {
    items: [
      {
        id: uid('review'),
        author: 'Jane',
        rating: 5,
        text: 'Fast ordering and great support!',
        status: 'approved', // pending | approved | rejected
        showOnStorefront: true,
        createdAt: new Date().toISOString()
      }
    ]
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const ACTIONS = {
  PATCH: 'PATCH',
  RESET: 'RESET'
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.PATCH:
      return { ...state, ...action.payload }
    case ACTIONS.RESET:
      return DEFAULT_STATE
    default:
      return state
  }
}

export function WebsiteProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const patch = useCallback((partial) => {
    dispatch({ type: ACTIONS.PATCH, payload: partial })
  }, [])

  const updateStorefront = useCallback(
    (partial) => patch({ storefront: { ...state.storefront, ...partial } }),
    [patch, state.storefront]
  )
  const updateCheckout = useCallback(
    (partial) => patch({ checkout: { ...state.checkout, ...partial } }),
    [patch, state.checkout]
  )
  const updateAppearance = useCallback(
    (partial) => patch({ appearance: { ...state.appearance, ...partial } }),
    [patch, state.appearance]
  )
  const updateMenu = useCallback(
    (partial) => patch({ menu: { ...state.menu, ...partial } }),
    [patch, state.menu]
  )
  const updatePages = useCallback(
    (partial) => patch({ pages: { ...state.pages, ...partial } }),
    [patch, state.pages]
  )
  const updateReviews = useCallback(
    (partial) => patch({ reviews: { ...state.reviews, ...partial } }),
    [patch, state.reviews]
  )

  const resetWebsite = useCallback(() => dispatch({ type: ACTIONS.RESET }), [])

  const value = useMemo(
    () => ({
      state,
      updateStorefront,
      updateCheckout,
      updateAppearance,
      updateMenu,
      updatePages,
      updateReviews,
      resetWebsite,
      uid
    }),
    [resetWebsite, state, updateAppearance, updateCheckout, updateMenu, updatePages, updateReviews, updateStorefront]
  )

  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>
}

export function useWebsite() {
  const ctx = useContext(WebsiteContext)
  if (!ctx) throw new Error('useWebsite must be used within WebsiteProvider')
  return ctx
}










