import React, { useState } from 'react';

const CustomerContextSidebar = () => {
    // Mock Data
    const [customer, setCustomer] = useState({
        name: "Alice Johnson",
        phone: "+1 (555) 123-4567",
        email: "alice.johnson@example.com",
        lastActivity: "2 hours ago",
        tags: ["VIP", "Repeat Customer"],
        status: "Open",
        chatbotActive: false,
    });

    const [orders, setOrders] = useState([
        { id: "ORD-001", date: "2023-10-25", total: "$120.00", status: "Completed" },
        { id: "ORD-002", date: "2023-11-02", total: "$45.50", status: "Processing" },
    ]);

    // Handlers
    const handleStatusChange = (e) => {
        setCustomer({ ...customer, status: e.target.value });
    };

    const handleChatbotToggle = () => {
        setCustomer({ ...customer, chatbotActive: !customer.chatbotActive });
    };

    return (
        <div className="w-80 border-l border-gray-200 bg-white h-full overflow-y-auto font-sans flex flex-col">
            {/* 1. Customer Profile */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        {customer.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="w-24 font-medium text-gray-400">Email:</span>
                        <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="w-24 font-medium text-gray-400">Last Active:</span>
                        <span>{customer.lastActivity}</span>
                    </div>
                </div>
            </div>

            {/* 2. CRM Actions */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">CRM Controls</h3>

                <div className="space-y-5">
                    {/* Conversation Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={customer.status}
                            onChange={handleStatusChange}
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
                        >
                            <option value="Open">Open</option>
                            <option value="Pending">Pending</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {/* Chatbot Control (Human Takeover) */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Chatbot Active</span>
                            <span className="text-xs text-gray-500">Toggle for human takeover</span>
                        </div>
                        <button
                            onClick={handleChatbotToggle}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${customer.chatbotActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${customer.chatbotActive ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {customer.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {tag}
                                </span>
                            ))}
                            <button className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent border-dashed border-gray-400">
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Order History / Bookings */}
            <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Orders</h3>
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">View All</a>
                </div>

                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{order.id}</p>
                                <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{order.total}</p>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerContextSidebar;
