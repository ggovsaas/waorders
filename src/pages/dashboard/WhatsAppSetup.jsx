import { useState } from 'react'

export default function WhatsAppSetup() {
    const [config, setConfig] = useState({
        phoneNumberId: '',
        accessToken: '',
        verifyToken: '',
    })
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleSave = async () => {
        setIsSaving(true)
        setSuccessMessage('')

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccessMessage('WhatsApp configuration saved successfully!')

            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (error) {
            console.error('Failed to save config:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestConnection = () => {
        alert('Testing WhatsApp connection...')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">WhatsApp Configuration</h1>
                        <p className="text-gray-400 text-sm">Connect your Meta Business API credentials</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div>
                        <h4 className="font-medium text-blue-300 mb-1">Getting Started</h4>
                        <p className="text-sm text-blue-200/80">
                            To connect WhatsApp, you need to create a Meta Business App and get your credentials from the{' '}
                            <a
                                href="https://developers.facebook.com/apps"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-100"
                            >
                                Meta Developers Portal
                            </a>.
                        </p>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">✓</span>
                        <p className="text-green-300 font-medium">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Phone Number ID
                        <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={config.phoneNumberId}
                        onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                        placeholder="Enter your WhatsApp Phone Number ID"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        Found in your Meta Business App WhatsApp settings
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Access Token
                        <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                        type="password"
                        value={config.accessToken}
                        onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                        placeholder="Enter your WhatsApp Access Token"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        Generate a permanent access token from your Meta Business App
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Verify Token
                        <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={config.verifyToken}
                        onChange={(e) => setConfig({ ...config, verifyToken: e.target.value })}
                        placeholder="Enter your Webhook Verify Token"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        A custom string you create to verify webhook requests
                    </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !config.phoneNumberId || !config.accessToken || !config.verifyToken}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                    <button
                        onClick={handleTestConnection}
                        disabled={!config.phoneNumberId || !config.accessToken}
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Test Connection
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Webhook Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Webhook URL
                        </label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-black/30 px-4 py-3 rounded-lg text-sm text-gray-300">
                                https://your-domain.com/api/whatsapp-webhook
                            </code>
                            <button className="p-3 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                📋
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Webhook Events to Subscribe
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['messages', 'message_status', 'messaging_postbacks'].map((event) => (
                                <div key={event} className="bg-black/20 px-4 py-2 rounded-lg">
                                    <span className="text-white text-sm font-mono">{event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <h4 className="font-medium text-white mb-1">Setup Guide</h4>
                        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                            <li>Create a Meta Business App at developers.facebook.com</li>
                            <li>Add WhatsApp product to your app</li>
                            <li>Get your Phone Number ID from the WhatsApp API setup</li>
                            <li>Generate a permanent access token</li>
                            <li>Configure the webhook URL in your Meta app settings</li>
                            <li>Enter your credentials above and click Save</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
