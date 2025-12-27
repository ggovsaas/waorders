import { useMemo } from 'react'
import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-gray-200">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-white/10'
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full transition-transform translate-y-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

export default function StorefrontPage() {
  const { state, updateStorefront } = useWebsite()
  const { storefront, appearance } = state

  const previewStyles = useMemo(
    () => ({
      '--p': appearance.colors.primary,
      '--s': appearance.colors.secondary,
      '--bg': appearance.colors.background,
      borderRadius: `${appearance.radius}px`
    }),
    [appearance]
  )

  return (
    <WebsitePageShell
      title="Storefront"
      subtitle="Edit your home page sections and preview instantly"
      icon="🏠"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Hero</h3>
            <div className="space-y-3">
              <Toggle
                label="Show hero section"
                checked={storefront.sections.hero}
                onChange={(v) =>
                  updateStorefront({ sections: { ...storefront.sections, hero: v } })
                }
              />
              <input
                value={storefront.hero.title}
                onChange={(e) => updateStorefront({ hero: { ...storefront.hero, title: e.target.value } })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hero title"
              />
              <input
                value={storefront.hero.subtitle}
                onChange={(e) =>
                  updateStorefront({ hero: { ...storefront.hero, subtitle: e.target.value } })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hero subtitle"
              />
              <input
                value={storefront.hero.imageUrl}
                onChange={(e) =>
                  updateStorefront({ hero: { ...storefront.hero, imageUrl: e.target.value } })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hero image URL (optional)"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Sections</h3>
            <div className="divide-y divide-white/10">
              <Toggle
                label="Show categories"
                checked={storefront.sections.categories}
                onChange={(v) =>
                  updateStorefront({ sections: { ...storefront.sections, categories: v } })
                }
              />
              <Toggle
                label="Show featured products"
                checked={storefront.sections.featuredProducts}
                onChange={(v) =>
                  updateStorefront({ sections: { ...storefront.sections, featuredProducts: v } })
                }
              />
              <Toggle
                label="Show footer"
                checked={storefront.sections.footer}
                onChange={(v) =>
                  updateStorefront({ sections: { ...storefront.sections, footer: v } })
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Footer</h3>
            <textarea
              value={storefront.footerText}
              onChange={(e) => updateStorefront({ footerText: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              placeholder="Footer text"
            />
          </div>
        </div>

        {/* Preview */}
        <div
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
          style={previewStyles}
        >
          <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'var(--bg)' }}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--p), var(--s))' }}
                >
                  <span className="text-white font-bold">W</span>
                </div>
                <div>
                  <p className="text-white font-semibold">My Store</p>
                  <p className="text-xs text-white/60">Website preview</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(90deg, var(--p), var(--s))' }}
              >
                Order on WhatsApp
              </button>
            </div>

            <div className="p-6 space-y-6">
              {storefront.sections.hero && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                  {storefront.hero.imageUrl ? (
                    <div
                      className="h-40 bg-center bg-cover"
                      style={{ backgroundImage: `url(${storefront.hero.imageUrl})` }}
                    />
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-purple-600/30 to-cyan-600/30" />
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-white">{storefront.hero.title}</h2>
                    <p className="text-sm text-white/70 mt-1">{storefront.hero.subtitle}</p>
                  </div>
                </div>
              )}

              {storefront.sections.categories && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Categories</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Featured', 'New', 'Best Sellers'].map((c) => (
                      <div
                        key={c}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-center text-sm text-white/80"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {storefront.sections.featuredProducts && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Products</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                      >
                        <div className="h-20 rounded-lg bg-white/5 mb-3" />
                        <p className="text-white text-sm font-medium">Product {i}</p>
                        <p className="text-xs text-white/60">$0.00</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {storefront.sections.footer && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/60">{storefront.footerText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WebsitePageShell>
  )
}










