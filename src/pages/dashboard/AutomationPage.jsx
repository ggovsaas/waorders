import { useState } from 'react'

export default function AutomationPage() {
    const [activeRecipes, setActiveRecipes] = useState({
        abandonedCart: false,
        orderConfirmation: false,
        shippingUpdate: false,
    })

    const recipes = [
        {
            id: 'abandonedCart',
            title: 'Abandoned Cart Recovery',
            description: 'Automatically send a reminder message to customers who added items to cart but did not complete the purchase.',
            icon: '🛒',
            trigger: 'Cart inactive for 30 minutes',
            action: 'Send reminder message with cart link',
            color: 'from-orange-500/30 to-red-500/30',
            borderColor: 'border-orange-500/50',
            benefits: ['Recover lost sales', 'Personalized reminders', 'Customizable timing'],
        },
        {
            id: 'orderConfirmation',
            title: 'Order Confirmation',
            description: 'Send an instant confirmation message with order details and receipt immediately after a customer places an order.',
            icon: '✅',
            trigger: 'Order created',
            action: 'Send order confirmation with receipt',
            color: 'from-green-500/30 to-emerald-500/30',
            borderColor: 'border-green-500/50',
            benefits: ['Build trust', 'Reduce support queries', 'Professional experience'],
        },
        {
            id: 'shippingUpdate',
            title: 'Shipping Updates',
            description: 'Notify customers when their order status changes and provide tracking information automatically.',
            icon: '📦',
            trigger: 'Order status changes to shipped',
            action: 'Send tracking link and delivery estimate',
            color: 'from-blue-500/30 to-cyan-500/30',
            borderColor: 'border-blue-500/50',
            benefits: ['Keep customers informed', 'Reduce WISMO queries', 'Improve satisfaction'],
        },
    ]

    const toggleRecipe = (recipeId) => {
        setActiveRecipes(prev => ({
            ...prev,
            [recipeId]: !prev[recipeId]
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Automation Workflows</h1>
                        <p className="text-gray-400 text-sm">Pre-built recipes to automate customer communication</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <h4 className="font-medium text-blue-300 mb-1">Quick Setup Automations</h4>
                        <p className="text-sm text-blue-200/80">
                            Activate these pre-built workflow templates with one click. No complex setup required.
                            Each recipe is designed to handle common e-commerce scenarios automatically.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe) => {
                    const isActive = activeRecipes[recipe.id]

                    return (
                        <div
                            key={recipe.id}
                            className={`bg-white/5 border rounded-xl p-6 transition-all hover:shadow-lg ${
                                isActive ? `${recipe.borderColor} border-2 shadow-lg` : 'border-white/10'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${recipe.color} rounded-xl flex items-center justify-center`}>
                                    <span className="text-2xl">{recipe.icon}</span>
                                </div>
                                {isActive && (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                                        Active
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{recipe.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{recipe.description}</p>

                            <div className="space-y-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trigger</div>
                                    <div className="text-sm text-white flex items-center gap-2">
                                        <span>🔔</span>
                                        {recipe.trigger}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Action</div>
                                    <div className="text-sm text-white flex items-center gap-2">
                                        <span>⚡</span>
                                        {recipe.action}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Benefits</div>
                                <ul className="space-y-1">
                                    {recipe.benefits.map((benefit, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                            <span className="text-green-400">✓</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => toggleRecipe(recipe.id)}
                                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                                    isActive
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                        : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500'
                                }`}
                            >
                                {isActive ? 'Deactivate' : 'Activate Recipe'}
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🚀</span>
                    <h3 className="text-lg font-semibold text-white">Coming Soon: Advanced Flow Builder</h3>
                </div>
                <p className="text-gray-400 mb-4">
                    Create custom automation workflows with our visual flow builder. Define complex triggers,
                    conditions, and multi-step actions to create powerful automations tailored to your business needs.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                        Join Beta Waitlist
                    </button>
                    <button className="px-6 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all">
                        Learn More
                    </button>
                </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                        <h4 className="font-medium text-purple-300 mb-1">Pro Tip</h4>
                        <p className="text-sm text-purple-200/80">
                            Start with Order Confirmation to build customer trust, then enable Shipping Updates to reduce
                            support queries. Finally, activate Abandoned Cart Recovery to boost your conversion rate by up to 15%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
