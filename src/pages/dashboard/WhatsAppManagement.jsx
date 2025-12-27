import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AIDataModelBuilder from './AIDataModelBuilder' // Reuse existing component

/**
 * WhatsAppManagement Page
 * 
 * Central hub for managing WhatsApp integration.
 * Tabs:
 * 1. Configuration: Connection status, Meta Token, Ice Breakers
 * 2. Automation: Flow Builder (Placeholder for now)
 * 3. AI Agent: Data Model Builder
 */
export default function WhatsAppManagement() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('configuration')

    const TABS = [
        { id: 'configuration', label: 'Configuration', icon: '⚙️' },
        { id: 'automation', label: 'Automation', icon: '🤖' },
        { id: 'ai-agent', label: 'AI Agent', icon: '🧠' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-white">WhatsApp Manager</h1>
                            <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
                                CONNECTED
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Manage your WhatsApp Business API integration</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-white/10">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'border-green-500 text-green-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'configuration' && <ConfigurationTab />}
                {activeTab === 'automation' && <AutomationTab />}
                {activeTab === 'ai-agent' && <AIAgentTab />}
            </div>
        </div>
    )
}

function ConfigurationTab() {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Status */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Connection Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-green-400 font-medium">Webhook Active</span>
                            </div>
                            <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors">
                                Test Connection
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-wider">Phone Number ID</label>
                            <div className="flex items-center gap-2">
                                <code className="bg-black/30 px-3 py-2 rounded text-sm text-gray-300 flex-1">
                                    104598237492837
                                </code>
                                <button className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ice Breakers */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Ice Breakers</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Conversation starters that appear when a new customer opens a chat with you.
                    </p>
                    <div className="space-y-3">
                        {['Where is my order?', 'Browse Products', 'Talk to Support'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <span className="text-gray-400 text-sm">#{i + 1}</span>
                                <span className="text-white flex-1">{item}</span>
                                <button className="text-gray-500 hover:text-white">✏️</button>
                            </div>
                        ))}
                        <button className="w-full py-2 border border-dashed border-white/20 text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-sm">
                            + Add Ice Breaker
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AutomationTab() {
    return (
        <div className="text-center py-20 animate-fadeIn">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🤖</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Flow Builder Coming Soon</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
                Create visual automation flows to handle customer inquiries, route support tickets, and drive sales automatically.
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Join Beta Waitlist
            </button>
        </div>
    )
}

function AIAgentTab() {
    // Reuse the existing AI Data Model Builder, but perhaps wrapped specifically for WhatsApp context if needed.
    // For now, we render it directly.
    return (
        <div className="animate-fadeIn">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6">
                <h3 className="text-purple-300 font-medium flex items-center gap-2">
                    <span>🧠</span> AI Knowledge Base
                </h3>
                <p className="text-purple-200/60 text-sm mt-1">
                    Train your WhatsApp AI agent on your business data. It will use this information to answer customer queries instantly.
                </p>
            </div>
            <AIDataModelBuilder />
        </div>
    )
}
