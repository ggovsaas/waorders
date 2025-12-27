import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function MenuItemRow({ item, onUpdate, onDelete, pageSlugs }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          value={item.label}
          onChange={(e) => onUpdate({ ...item, label: e.target.value })}
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Label"
        />
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={item.visible}
            onChange={(e) => onUpdate({ ...item, visible: e.target.checked })}
            className="w-4 h-4 accent-purple-600"
          />
          Visible
        </label>
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Type</p>
          <select
            value={item.type}
            onChange={(e) => onUpdate({ ...item, type: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="internal">Internal</option>
            <option value="page">Page</option>
            <option value="url">URL</option>
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Destination</p>
          {item.type === 'page' ? (
            <select
              value={item.path}
              onChange={(e) => onUpdate({ ...item, path: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              {pageSlugs.length === 0 ? (
                <option value="">No pages yet</option>
              ) : (
                pageSlugs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          ) : (
            <input
              value={item.path}
              onChange={(e) => onUpdate({ ...item, path: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={item.type === 'internal' ? '/storefront' : 'https://example.com'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const { state, updateMenu, uid } = useWebsite()
  const { menu, pages } = state

  const pageSlugs = (pages.items || []).map((p) => p.slug).filter(Boolean)

  const setItems = (items) => updateMenu({ items })

  const addItem = () => {
    setItems([
      ...menu.items,
      { id: uid('menu'), label: 'New item', type: 'internal', path: '/storefront', visible: true }
    ])
  }

  const move = (index, dir) => {
    const next = [...menu.items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
  }

  return (
    <WebsitePageShell
      title="Menu"
      subtitle="Manage navigation items, order, and visibility"
      icon="📜"
      right={
        <button
          type="button"
          onClick={addItem}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
        >
          + Add item
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-4">
          <p className="text-sm text-gray-400">
            Tip: keep it simple. Most stores do well with 3–5 menu items.
          </p>
          <div className="space-y-4">
            {menu.items.map((item, idx) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Item {idx + 1}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 text-xs"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <MenuItemRow
                  item={item}
                  pageSlugs={pageSlugs}
                  onUpdate={(updated) => {
                    const next = [...menu.items]
                    next[idx] = updated
                    setItems(next)
                  }}
                  onDelete={() => {
                    const next = menu.items.filter((x) => x.id !== item.id)
                    setItems(next)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h3 className="text-white font-semibold mb-4">Preview</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">My Store</p>
              <div className="flex items-center gap-2">
                {(menu.items || [])
                  .filter((i) => i.visible)
                  .slice(0, 6)
                  .map((i) => (
                    <span
                      key={i.id}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-200"
                    >
                      {i.label}
                    </span>
                  ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This is a simple representation of your storefront navigation.
            </p>
          </div>
        </div>
      </div>
    </WebsitePageShell>
  )
}










