import { useMemo, useState } from 'react'
import { generateQRCode } from '../../utils/qr'

/**
 * QuickStartConfigPage
 *
 * UI for:
 * - Ice Breakers (up to 4 preset phrases)
 * - Quick Link / QR generator (keyword-triggered flow)
 *
 * Save is a placeholder (logs config to console).
 */

async function saveQuickStartConfig(config) {
  console.group('⚡ saveQuickStartConfig (placeholder)')
  console.log('config:', config)
  console.groupEnd()
  return new Promise((resolve) => setTimeout(resolve, 250))
}

function buildQuickLink(keyword) {
  // Placeholder deep link structure (replace with your real bot endpoint later)
  // If you prefer WhatsApp-only, swap to wa.me link.
  const clean = (keyword || '').trim()
  const base = 'https://wa.me/?text='
  return `${base}${encodeURIComponent(clean)}`
}

export default function QuickStartConfigPage() {
  const [iceBreakers, setIceBreakers] = useState(['', '', '', ''])
  const [keyword, setKeyword] = useState('#start myfuel')
  const [isSaving, setIsSaving] = useState(false)
  const [qrResult, setQrResult] = useState(null)

  const quickLink = useMemo(() => buildQuickLink(keyword), [keyword])

  const cleanedConfig = useMemo(() => {
    const phrases = iceBreakers.map((s) => (s || '').trim()).filter(Boolean).slice(0, 4)
    return {
      ice_breakers: phrases,
      target_keyword: (keyword || '').trim()
    }
  }, [iceBreakers, keyword])

  const updateIceBreaker = (idx, value) => {
    setIceBreakers((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  const handleGenerate = async () => {
    const k = (keyword || '').trim()
    const res = await generateQRCode(k)
    setQrResult(res)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveQuickStartConfig(cleanedConfig)
    } finally {
      setIsSaving(false)
    }
  }

  const canSave = cleanedConfig.target_keyword.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Quick Start Config</h1>
            <p className="text-gray-400 text-sm">
              Configure Ice Breakers and generate a quick link / QR trigger for a chatbot flow.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Ice Breakers */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Ice Breakers</h2>
            <p className="text-sm text-gray-400">Up to 4 preset questions shown to customers to start the chat.</p>
          </div>
          <span className="text-xs text-gray-500">
            {cleanedConfig.ice_breakers.length}/4 active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {iceBreakers.map((val, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-400 mb-1">Phrase {idx + 1}</p>
              <input
                value={val}
                onChange={(e) => updateIceBreaker(idx, e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. What are today’s deals?"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Target flow selector */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h2 className="text-lg font-semibold text-white">Target Chatbot Keyword</h2>
        <p className="text-sm text-gray-400 mt-1">
          This keyword triggers the chatbot/flow (example: <span className="text-gray-300">#start myfuel</span>).
        </p>

        <div className="mt-4">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="#start myfuel"
          />
          {!canSave && (
            <p className="text-xs text-red-300 mt-2">Keyword is required.</p>
          )}
        </div>
      </div>

      {/* QR / Link Generator */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">QR / Quick Link Generator</h2>
            <p className="text-sm text-gray-400">
              Share this link (or QR) to start a specific flow.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            Generate QR (placeholder)
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Sample link</p>
            <div className="flex items-start gap-3">
              <code className="flex-1 text-xs text-gray-200 break-all bg-black/20 border border-white/10 rounded-xl p-3">
                {quickLink}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText?.(quickLink)}
                className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This is a placeholder link format. We’ll update it to your real chatbot endpoint later.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">QR output</p>
            <div className="h-40 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-center text-gray-400 text-sm">
              {qrResult ? (
                <div className="text-center px-4">
                  <p className="text-white font-semibold mb-1">Generated (placeholder)</p>
                  <p className="text-xs text-gray-400 break-all">{qrResult.url}</p>
                </div>
              ) : (
                'Click “Generate QR” to produce output (placeholder)'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


