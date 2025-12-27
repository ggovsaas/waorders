import WebsitePageShell from './website/WebsitePageShell'

export default function OrdersPage() {
  return (
    <WebsitePageShell title="Orders" subtitle="Track and manage incoming orders" icon="📋">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📋</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Orders coming soon</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          This will show orders initiated via WhatsApp and your website checkout.
        </p>
      </div>
    </WebsitePageShell>
  )
}











