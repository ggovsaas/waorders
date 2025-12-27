import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        <p className="text-xs text-gray-500">{value}</p>
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg bg-transparent border border-white/10"
      />
    </div>
  )
}

export default function AppearancePage() {
  const { state, updateAppearance } = useWebsite()
  const { appearance, storefront } = state

  return (
    <WebsitePageShell title="Appearance" subtitle="Theme, colors, typography and branding" icon="🎨">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'waorders', name: 'Waorders' },
                { id: 'minimal', name: 'Minimal' },
                { id: 'bold', name: 'Bold' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateAppearance({ preset: p.id })}
                  className={`px-4 py-3 rounded-xl border transition-all ${
                    appearance.preset === p.id
                      ? 'bg-purple-600/20 border-purple-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Colors</h3>
            <div className="space-y-3">
              <ColorField
                label="Primary"
                value={appearance.colors.primary}
                onChange={(v) => updateAppearance({ colors: { ...appearance.colors, primary: v } })}
              />
              <ColorField
                label="Secondary"
                value={appearance.colors.secondary}
                onChange={(v) => updateAppearance({ colors: { ...appearance.colors, secondary: v } })}
              />
              <ColorField
                label="Background"
                value={appearance.colors.background}
                onChange={(v) => updateAppearance({ colors: { ...appearance.colors, background: v } })}
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Typography</h3>
            <select
              value={appearance.font}
              onChange={(e) => updateAppearance({ font: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Inter">Inter</option>
              <option value="System">System</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Logo</h3>
              <input
                value={appearance.logoUrl}
                onChange={(e) => updateAppearance({ logoUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Logo URL (optional)"
              />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Favicon</h3>
              <input
                value={appearance.faviconUrl}
                onChange={(e) => updateAppearance({ faviconUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Favicon URL (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Corner Radius</h3>
              <input
                type="range"
                min={8}
                max={24}
                value={appearance.radius}
                onChange={(e) => updateAppearance({ radius: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">{appearance.radius}px</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Spacing</h3>
              <input
                type="range"
                min={8}
                max={28}
                value={appearance.spacing}
                onChange={(e) => updateAppearance({ spacing: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">{appearance.spacing}px</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: appearance.colors.background, borderRadius: appearance.radius }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${appearance.colors.primary}, ${appearance.colors.secondary})` }}
                >
                  <span className="text-white font-bold">W</span>
                </div>
                <div>
                  <p className="text-white font-semibold" style={{ fontFamily: appearance.font }}>
                    My Store
                  </p>
                  <p className="text-xs text-white/60">Preview</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(90deg, ${appearance.colors.primary}, ${appearance.colors.secondary})`,
                  borderRadius: appearance.radius
                }}
              >
                Order Now
              </button>
            </div>
            <div className="p-6 space-y-4" style={{ padding: appearance.spacing }}>
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5" style={{ borderRadius: appearance.radius }}>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: appearance.font }}>
                  {storefront.hero.title}
                </h2>
                <p className="text-sm text-white/70 mt-1">{storefront.hero.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl" style={{ borderRadius: appearance.radius }}>
                    <div className="h-16 rounded-lg bg-white/5 mb-3" />
                    <p className="text-white text-sm font-medium">Product {i}</p>
                    <p className="text-xs text-white/60">$0.00</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebsitePageShell>
  )
}










