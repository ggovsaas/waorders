import { Link } from 'react-router-dom'

/**
 * DashboardHome Component
 * 
 * Main dashboard summary page showing:
 * - Quick stats (Orders, Revenue, Customers, Products)
 * - Quick actions
 * - Recent activity
 */

function DashboardHome() {
  // Demo data for stats
  const stats = [
    { label: 'Total Orders', value: '0', change: '+0%', icon: '📦', color: 'purple' },
    { label: 'Revenue', value: '$0.00', change: '+0%', icon: '💰', color: 'green' },
    { label: 'Customers', value: '0', change: '+0%', icon: '👥', color: 'blue' },
    { label: 'Products', value: '0', change: '+0%', icon: '🏷️', color: 'orange' }
  ]

  // Quick actions
  const quickActions = [
    { label: 'Add Product', path: '/dashboard/products/add', icon: '➕', description: 'Create a new product' },
    { label: 'View Orders', path: '/dashboard/orders', icon: '📋', description: 'Check recent orders' },
    { label: 'Edit Storefront', path: '/dashboard/website/storefront', icon: '🏠', description: 'Update your website home' },
    { label: 'Customize Checkout', path: '/dashboard/website/checkout', icon: '🛒', description: 'Edit checkout fields & WhatsApp' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your store today.
          </p>
        </div>
        <Link
          to="/dashboard/products/add"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'purple' ? 'bg-purple-500/20' :
                stat.color === 'green' ? 'bg-green-500/20' :
                stat.color === 'blue' ? 'bg-blue-500/20' :
                'bg-orange-500/20'
              }`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <span className="text-sm text-green-400 font-medium">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all group"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                <span className="text-xl">{action.icon}</span>
              </div>
              <h3 className="font-medium text-white mb-1">{action.label}</h3>
              <p className="text-xs text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-sm text-purple-400 hover:text-purple-300">
              View all →
            </Link>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-400 mb-2">No orders yet</p>
            <p className="text-sm text-gray-500">When you receive orders, they'll appear here.</p>
          </div>
        </div>

        {/* Store Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Store Activity</h2>
            <Link to="/dashboard/analytics" className="text-sm text-purple-400 hover:text-purple-300">
              View analytics →
            </Link>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-400 mb-2">No activity yet</p>
            <p className="text-sm text-gray-500">Share your store to start getting visitors!</p>
          </div>
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🚀</span>
          <h2 className="text-lg font-semibold text-white">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { task: 'Add your first product', done: false, path: '/dashboard/products/add' },
            { task: 'Customize your checkout', done: false, path: '/dashboard/website/checkout' },
            { task: 'Set your brand colors', done: false, path: '/dashboard/website/appearance' },
            { task: 'Edit your storefront', done: false, path: '/dashboard/website/storefront' }
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                item.done 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-white/30'
              }`}>
                {item.done && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                {item.task}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome





