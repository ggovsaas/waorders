import { useMemo, useState } from 'react'

/**
 * AIDataModelBuilder
 *
 * UI for merchants to define the AI Agent's data collection schema.
 * - Prompt textarea (ai_agent.prompt)
 * - Variable list/editor: variable_name, type, required, description (+ enum options)
 * - Placeholder save function (logs to console)
 */

const TYPE_OPTIONS = ['string', 'integer', 'boolean', 'enum']

function uid(prefix = 'var') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function normalizeVariableName(value) {
  return (value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
}

function parseEnumOptions(value) {
  return (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Placeholder save logic (Supabase will be wired later)
async function saveAIDataModel(storeId, model) {
  console.group('🧠 saveAIDataModel (placeholder)')
  console.log('storeId:', storeId)
  console.log('model:', model)
  console.groupEnd()
  // simulate async
  return new Promise((resolve) => setTimeout(resolve, 250))
}

function VarRow({ v, nameTaken, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            title="Move down"
          >
            ↓
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={!!v.required}
              onChange={(e) => onChange({ ...v, required: e.target.checked })}
              className="w-4 h-4 accent-purple-600"
            />
            Required
          </label>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Variable name</p>
          <input
            value={v.variable_name}
            onChange={(e) => onChange({ ...v, variable_name: normalizeVariableName(e.target.value) })}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 ${
              nameTaken ? 'border-red-500/60 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'
            }`}
            placeholder="e.g. customer_phone"
          />
          {nameTaken && <p className="text-xs text-red-300 mt-1">Variable name must be unique.</p>}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Type</p>
          <select
            value={v.type}
            onChange={(e) => onChange({ ...v, type: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {v.type === 'enum' && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-1">Enum options</p>
          <input
            value={v.enumOptionsText || ''}
            onChange={(e) => onChange({ ...v, enumOptionsText: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. pending, paid, shipped"
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated. These are valid values the AI can collect.</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-1">Description</p>
        <input
          value={v.description}
          onChange={(e) => onChange({ ...v, description: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="What should the AI collect for this field?"
        />
      </div>
    </div>
  )
}

export default function AIDataModelBuilder() {
  const [storeId, setStoreId] = useState('demo-store')
  const [prompt, setPrompt] = useState('')
  const [variables, setVariables] = useState([
    {
      id: uid(),
      variable_name: 'customer_name',
      type: 'string',
      required: true,
      description: 'Customer full name'
    },
    {
      id: uid(),
      variable_name: 'customer_phone',
      type: 'string',
      required: true,
      description: 'WhatsApp phone number (E.164 if possible)'
    }
  ])
  const [isSaving, setIsSaving] = useState(false)

  const normalizedNameCounts = useMemo(() => {
    const counts = new Map()
    for (const v of variables) {
      const key = (v.variable_name || '').trim()
      if (!key) continue
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return counts
  }, [variables])

  const hasAnyNameIssues = useMemo(() => {
    if (variables.some((v) => !(v.variable_name || '').trim())) return true
    for (const [, count] of normalizedNameCounts.entries()) {
      if (count > 1) return true
    }
    return false
  }, [normalizedNameCounts, variables])

  const addVariable = () => {
    setVariables((prev) => [
      ...prev,
      {
        id: uid(),
        variable_name: '',
        type: 'string',
        required: false,
        description: ''
      }
    ])
  }

  const updateVariable = (id, next) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? next : v)))
  }

  const deleteVariable = (id) => {
    setVariables((prev) => prev.filter((v) => v.id !== id))
  }

  const moveVariable = (index, dir) => {
    setVariables((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSave = async () => {
    const cleanedVars = variables.map((v) => {
      const base = {
        variable_name: (v.variable_name || '').trim(),
        type: v.type,
        required: !!v.required,
        description: (v.description || '').trim()
      }
      if (v.type === 'enum') {
        return { ...base, enum_options: parseEnumOptions(v.enumOptionsText) }
      }
      return base
    })

    const model = {
      ai_agent: {
        prompt: prompt.trim()
      },
      data_model: cleanedVars
    }

    setIsSaving(true)
    try {
      await saveAIDataModel(storeId.trim() || 'demo-store', model)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Data Model Builder</h1>
            <p className="text-gray-400 text-sm">
              Define the fields your AI Agent must collect from customers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || hasAnyNameIssues}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          title={hasAnyNameIssues ? 'Fix variable names before saving (empty/duplicate).' : 'Save'}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Store context */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <p className="text-xs text-gray-400 mb-1">Store ID (placeholder)</p>
            <input
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="demo-store"
            />
          </div>
          <div className="text-xs text-gray-500">
            Saving is currently a placeholder and logs to the console. Supabase persistence will be added later.
          </div>
        </div>
      </div>

      {/* Prompt input */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">AI System Prompt</h2>
            <p className="text-sm text-gray-400">This becomes <code className="text-gray-300">ai_agent.prompt</code>.</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          className="mt-4 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
          placeholder={`You are an AI sales assistant. Collect the required fields and confirm them with the customer before placing an order.\n\nRules:\n- Ask one question at a time.\n- Validate phone number format.\n- If required info is missing, ask follow-up questions.`}
        />
      </div>

      {/* Variables editor */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Data Model Variables</h2>
            <p className="text-sm text-gray-400">
              Add the fields your AI must collect. Use <span className="text-gray-300">enum</span> for controlled values.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariable}
            className="px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            + Add variable
          </button>
        </div>

        <div className="space-y-4">
          {variables.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No variables yet. Add your first field.</div>
          ) : (
            variables.map((v, idx) => {
              const name = (v.variable_name || '').trim()
              const nameTaken = !!name && (normalizedNameCounts.get(name) || 0) > 1
              return (
                <VarRow
                  key={v.id}
                  v={v}
                  nameTaken={nameTaken}
                  isFirst={idx === 0}
                  isLast={idx === variables.length - 1}
                  onMoveUp={() => moveVariable(idx, -1)}
                  onMoveDown={() => moveVariable(idx, 1)}
                  onChange={(next) => updateVariable(v.id, next)}
                  onDelete={() => deleteVariable(v.id)}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}








