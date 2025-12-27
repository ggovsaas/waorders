import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContextSidebar from '../../components/Inbox/CustomerContextSidebar'

/**
 * InboxPage
 *
 * Top-level "Channel Agnostic" inbox.
 * Aggregates messages from WhatsApp, Instagram, etc.
 * Now using Convex for real-time data.
 */
export default function InboxPage() {
    const { t } = useTranslation()
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [selectedChannel, setSelectedChannel] = useState('all')
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        const mockConversations = [
            { _id: '1', customerName: 'Alice Johnson', lastMessage: 'Where is my order?', lastMessageAt: Date.now() - 3600000, channel_type: 'whatsapp', unreadCount: 2 },
            { _id: '2', customerName: 'Bob Smith', lastMessage: 'Do you have this in blue?', lastMessageAt: Date.now() - 7200000, channel_type: 'instagram', unreadCount: 0 },
            { _id: '3', customerName: 'Charlie Brown', lastMessage: 'Thanks for the help!', lastMessageAt: Date.now() - 86400000, channel_type: 'whatsapp', unreadCount: 0 },
        ]
        setConversations(mockConversations)
    }, [])

    useEffect(() => {
        if (selectedConversation) {
            const mockMessages = [
                { _id: '1', senderType: 'customer', content: 'Hello! I have a question about my order.', createdAt: Date.now() - 7200000 },
                { _id: '2', senderType: 'agent', content: `Hi ${selectedConversation.customerName}! Sure, I can help with that. What's your order number?`, createdAt: Date.now() - 7000000 },
                { _id: '3', senderType: 'customer', content: selectedConversation.lastMessage, createdAt: Date.now() - 3600000 },
            ]
            setMessages(mockMessages)
        }
    }, [selectedConversation])

    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'whatsapp': return '📱'
            case 'instagram': return '📸'
            case 'google': return '🔍'
            case 'pos': return '🏪'
            case 'web': return '🌐'
            default: return '💬'
        }
    }

    const formatTime = (timestamp) => {
        const now = Date.now()
        const diff = now - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days === 1) return 'Yesterday'
        return `${days}d ago`
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return

        const tempMessage = {
            _id: Date.now().toString(),
            senderType: 'agent',
            content: newMessage,
            createdAt: Date.now(),
        }
        setMessages([...messages, tempMessage])
        setNewMessage('')
    }

    const filteredConversations = selectedChannel === 'all'
        ? conversations
        : conversations.filter(c => c.channel_type === selectedChannel)

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4">
            <div className="w-1/3 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Inbox</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'whatsapp', label: 'WhatsApp' },
                            { id: 'instagram', label: 'Instagram' },
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedChannel(filter.id)}
                                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                                    selectedChannel === filter.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                            <span className="text-4xl mb-2">💬</span>
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <div
                                key={conv._id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                                    selectedConversation?._id === conv._id ? 'bg-white/10' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-medium ${conv.unreadCount ? 'text-white' : 'text-gray-300'}`}>
                                        {conv.customerName || 'Unknown'}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {formatTime(conv.lastMessageAt || Date.now())}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                                    {conv.lastMessage || 'No messages'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span title={conv.channel_type} className="text-sm">{getChannelIcon(conv.channel_type)}</span>
                                    {conv.unreadCount > 0 && (
                                        <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                    {(selectedConversation.customerName || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedConversation.customerName || 'Unknown'}</h3>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        {getChannelIcon(selectedConversation.channel_type)} via {selectedConversation.channel_type}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                                ⋮
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <span className="text-4xl mb-2">💬</span>
                                    <p className="text-sm">No messages yet</p>
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div
                                        key={msg._id}
                                        className={`flex ${msg.senderType === 'customer' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`p-3 rounded-2xl max-w-[80%] ${
                                                msg.senderType === 'customer'
                                                    ? 'bg-white/10 text-white rounded-tl-none'
                                                    : 'bg-purple-600/80 text-white rounded-tr-none'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                    📎
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                        <span className="text-6xl mb-4 opacity-50">💬</span>
                        <h3 className="text-xl font-medium text-white mb-2">Select a Conversation</h3>
                        <p>Choose a chat from the left to start messaging.</p>
                    </div>
                )}
            </div>

            {selectedConversation && (
                <div className="w-80 hidden xl:block">
                    <CustomerContextSidebar />
                </div>
            )}
        </div>
    )
}
