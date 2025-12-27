import { Link } from 'react-router-dom'

/**
 * ProductsPage Component
 * 
 * Products management page showing:
 * - Products list/grid
 * - Filters and search
 * - Add product button
 */

function ProductsPage() {
  // Demo products - will be replaced with real data
  const products = []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-gray-400 text-sm">Manage your product catalog</p>
          </div>
        </div>
        <Link
          to="/dashboard/products/add"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        {/* Category Filter */}
        <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none cursor-pointer">
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
        </select>
        
        {/* Sort */}
        <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none cursor-pointer">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>
      </div>

      {/* Products Content */}
      {products.length === 0 ? (
        /* Empty State */
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📦</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No products yet
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Add your first product to start selling. You can add products manually or import them from a spreadsheet.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/dashboard/products/add"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
            >
              + Add Product
            </Link>
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all">
              Import Products
            </button>
          </div>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden hover:border-purple-500/50 transition-all group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-white/5 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-purple-400">${product.price.toFixed(2)}</p>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-medium text-white mb-1">Pro Tips</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use high-quality images to increase sales</li>
              <li>• Add detailed descriptions with AI assistance</li>
              <li>• Set up categories to help customers find products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage













