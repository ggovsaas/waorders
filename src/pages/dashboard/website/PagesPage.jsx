import { useMemo, useState } from 'react'
import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function slugify(input) {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function PagesPage() {
  const { state, updatePages, uid } = useWebsite()
  const pages = state.pages.items || []
  const [selectedId, setSelectedId] = useState(pages[0]?.id || null)

  const selected = useMemo(() => pages.find((p) => p.id === selectedId) || null, [pages, selectedId])

  const setItems = (items) => updatePages({ items })

  const createPage = () => {
    const id = uid('page')
    const now = new Date().toISOString()
    const newPage = {
      id,
      title: 'New page',
      slug: `page-${pages.length + 1}`,
      content: 'Write your content here...',
      seoTitle: 'New page',
      seoDescription: '',
      published: false,
      updatedAt: now
    }
    setItems([newPage, ...pages])
    setSelectedId(id)
  }

  const updateSelected = (partial) => {
    if (!selected) return
    const now = new Date().toISOString()
    const next = pages.map((p) => (p.id === selected.id ? { ...p, ...partial, updatedAt: now } : p))
    setItems(next)
  }

  const deleteSelected = () => {
    if (!selected) return
    const next = pages.filter((p) => p.id !== selected.id)
    setItems(next)
    setSelectedId(next[0]?.id || null)
  }

  const slugTaken = (slug) => pages.some((p) => p.slug === slug && p.id !== selected?.id)

  return (
    <WebsitePageShell
      title="Pages"
      subtitle="Create custom pages (About, Contact, FAQ, Policies) with SEO"
      icon="📄"
      right={
        <button
          type="button"
          onClick={createPage}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
        >
          + New page
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
          <div className="space-y-2">
            {pages.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                No pages yet. Create your first page.
              </div>
            ) : (
              pages.map((p) => {
                const active = p.id === selectedId
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      active
                        ? 'bg-purple-600/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-gray-400">/{p.slug}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                          p.published ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {p.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-5">
          {!selected ? (
            <div className="p-10 text-center text-gray-400">Select a page to edit.</div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSelected({ published: !selected.published })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selected.published
                        ? 'bg-green-500/15 border-green-500/30 text-green-300'
                        : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {selected.published ? 'Published' : 'Draft'}
                  </button>
                  <p className="text-xs text-gray-500">Updated {new Date(selected.updatedAt).toLocaleString()}</p>
                </div>

                <button
                  type="button"
                  onClick={deleteSelected}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Title</p>
                  <input
                    value={selected.title}
                    onChange={(e) => {
                      const title = e.target.value
                      const nextSlug = slugify(title)
                      updateSelected({ title, seoTitle: title, slug: selected.slug ? selected.slug : nextSlug })
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Slug</p>
                  <input
                    value={selected.slug}
                    onChange={(e) => updateSelected({ slug: slugify(e.target.value) })}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white outline-none focus:ring-2 ${
                      slugTaken(selected.slug) ? 'border-red-500/60 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'
                    }`}
                  />
                  {slugTaken(selected.slug) && (
                    <p className="text-xs text-red-300 mt-1">Slug already in use.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Content</p>
                <textarea
                  rows={10}
                  value={selected.content}
                  onChange={(e) => updateSelected({ content: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">SEO title</p>
                  <input
                    value={selected.seoTitle}
                    onChange={(e) => updateSelected({ seoTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">SEO description</p>
                  <input
                    value={selected.seoDescription}
                    onChange={(e) => updateSelected({ seoDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-white font-semibold mb-2">Preview</p>
                <p className="text-xs text-gray-500 mb-3">/{selected.slug}</p>
                <div className="bg-black/20 rounded-xl p-4">
                  <h2 className="text-white font-bold mb-2">{selected.title}</h2>
                  <p className="text-gray-200 whitespace-pre-wrap text-sm">{selected.content}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WebsitePageShell>
  )
}










