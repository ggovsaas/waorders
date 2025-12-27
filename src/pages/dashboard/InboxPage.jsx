import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContextSidebar from '../../components/Inbox/CustomerContextSidebar'

/**
 * InboxPage
 * 
 * Top-level "Channel Agnostic" inbox.
 * Aggregates messages from WhatsApp, Instagram, etc.
 */
export default function InboxPage() {
    const { t } = useTranslation()
    const [selectedConversation, setSelectedConversation] = useState(null)

    // Mock Conversations Data
    const conversations = [
        { id: 1, name: 'Alice Johnson', lastMessage: 'Where is my order?', time: '10:30 AM', channel: 'whatsapp', unread: 2 },
        { id: 2, name: 'Bob Smith', lastMessage: 'Do you have this in blue?', time: '9:15 AM', channel: 'instagram', unread: 0 },
        { id: 3, name: 'Charlie Brown', lastMessage: 'Thanks for the help!', time: 'Yesterday', channel: 'whatsapp', unread: 0 },
    ]

    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'whatsapp': return '📱';
            case 'instagram': return '📸';
            case 'google': return '🔍';
            default: return '💬';
        }
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4">
            {/* 1. Conversation List (Left) */}
            <div className="w-1/3 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Inbox</h2>
                    {/* Filters/Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Unread', 'WhatsApp', 'Instagram'].map(filter => (
                            <button key={filter} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-300 whitespace-nowrap transition-colors">
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedConversation?.id === conv.id ? 'bg-white/10' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-medium ${conv.unread ? 'text-white' : 'text-gray-300'}`}>{conv.name}</h3>
                                <span className="text-xs text-gray-500">{conv.time}</span>
                            </div>
                            <p className={`text-sm truncate ${conv.unread ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                                {conv.lastMessage}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span title={conv.channel} className="text-sm">{getChannelIcon(conv.channel)}</span>
                                {conv.unread > 0 && (
                                    <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Area (Middle) */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                    {selectedConversation.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedConversation.name}</h3>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        {getChannelIcon(selectedConversation.channel)} via {selectedConversation.channel}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                                ⋮
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Mock Message History */}
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                                    Hello! I have a question about my order.
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-purple-600/80 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                                    Hi {selectedConversation.name}! Sure, I can help with that. What's your order number?
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                                    {selectedConversation.lastMessage}
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                    📎
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                                <button className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
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

            {/* 3. Customer Context (Right Sidebar) - Using existing component */}
            {selectedConversation && (
                <div className="w-80 hidden xl:block">
                    <CustomerContextSidebar />
                </div>
            )}
        </div>
    )
}
