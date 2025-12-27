import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function CheckboxRow({ label, checked, onChange, hint }) {
  return (
    <label className="flex items-start justify-between gap-4 py-2">
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-purple-600 mt-1"
      />
    </label>
  )
}

export default function CheckoutPage() {
  const { state, updateCheckout } = useWebsite()
  const { checkout } = state

  const sample = {
    items: '1× Product A\n2× Product B',
    total: '$39.00',
    name: 'John Doe',
    phone: '+1 555-123-4567',
    address: '123 Main St',
    notes: 'Leave at the door'
  }

  const whatsappPreview = checkout.whatsapp.messageTemplate
    .replace('{{items}}', encodeURIComponent(sample.items))
    .replace('{{total}}', encodeURIComponent(sample.total))
    .replace('{{name}}', encodeURIComponent(sample.name))
    .replace('{{phone}}', encodeURIComponent(sample.phone))
    .replace('{{address}}', encodeURIComponent(sample.address))
    .replace('{{notes}}', encodeURIComponent(sample.notes))

  return (
    <WebsitePageShell title="Checkout" subtitle="Control fields, delivery, payments, and WhatsApp confirmation" icon="🛒">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-2">Fields</h3>
            <div className="divide-y divide-white/10">
              <CheckboxRow
                label="Full name"
                checked={checkout.fields.fullName}
                onChange={(v) => updateCheckout({ fields: { ...checkout.fields, fullName: v } })}
              />
              <CheckboxRow
                label="Phone number"
                checked={checkout.fields.phone}
                onChange={(v) => updateCheckout({ fields: { ...checkout.fields, phone: v } })}
              />
              <CheckboxRow
                label="Address"
                checked={checkout.fields.address}
                onChange={(v) => updateCheckout({ fields: { ...checkout.fields, address: v } })}
                hint="Recommended for delivery orders"
              />
              <CheckboxRow
                label="Notes"
                checked={checkout.fields.notes}
                onChange={(v) => updateCheckout({ fields: { ...checkout.fields, notes: v } })}
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Delivery / Pickup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-200">Delivery</span>
                <input
                  type="checkbox"
                  checked={checkout.delivery.delivery}
                  onChange={(e) =>
                    updateCheckout({ delivery: { ...checkout.delivery, delivery: e.target.checked } })
                  }
                  className="w-5 h-5 accent-purple-600"
                />
              </label>
              <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-200">Pickup</span>
                <input
                  type="checkbox"
                  checked={checkout.delivery.pickup}
                  onChange={(e) =>
                    updateCheckout({ delivery: { ...checkout.delivery, pickup: e.target.checked } })
                  }
                  className="w-5 h-5 accent-purple-600"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Payment instructions</h3>
            <textarea
              rows={4}
              value={checkout.paymentInstructions}
              onChange={(e) => updateCheckout({ paymentInstructions: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              placeholder="Explain how customers should pay"
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Confirmation message</h3>
            <textarea
              rows={3}
              value={checkout.confirmationMessage}
              onChange={(e) => updateCheckout({ confirmationMessage: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              placeholder="Shown after customer submits an order"
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">WhatsApp integration</h3>
            <div className="space-y-3">
              <input
                value={checkout.whatsapp.phoneNumber}
                onChange={(e) =>
                  updateCheckout({ whatsapp: { ...checkout.whatsapp, phoneNumber: e.target.value } })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="WhatsApp phone number (e.g. +15551234567)"
              />
              <textarea
                rows={5}
                value={checkout.whatsapp.messageTemplate}
                onChange={(e) =>
                  updateCheckout({ whatsapp: { ...checkout.whatsapp, messageTemplate: e.target.value } })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                placeholder="WhatsApp message template (URL-encoded line breaks recommended)"
              />
              <p className="text-xs text-gray-500">
                Variables: <span className="text-gray-300">{'{{items}} {{total}} {{name}} {{phone}} {{address}} {{notes}}'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-2">Checkout preview</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              {checkout.fields.fullName && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Full name</p>
                  <div className="h-10 rounded-xl bg-white/5 border border-white/10" />
                </div>
              )}
              {checkout.fields.phone && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <div className="h-10 rounded-xl bg-white/5 border border-white/10" />
                </div>
              )}
              {checkout.fields.address && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Address</p>
                  <div className="h-10 rounded-xl bg-white/5 border border-white/10" />
                </div>
              )}
              {checkout.fields.notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <div className="h-20 rounded-xl bg-white/5 border border-white/10" />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {checkout.delivery.delivery && (
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Delivery
                  </span>
                )}
                {checkout.delivery.pickup && (
                  <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Pickup
                  </span>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Payment instructions</p>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{checkout.paymentInstructions}</p>
              </div>

              <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600">
                Place order
              </button>

              <p className="text-xs text-gray-500 text-center">{checkout.confirmationMessage}</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">WhatsApp message preview</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-gray-500 break-all">
                wa.me link (preview):{' '}
                <span className="text-gray-300">
                  {checkout.whatsapp.phoneNumber
                    ? `https://wa.me/${checkout.whatsapp.phoneNumber.replace(/[^\d]/g, '')}?text=${whatsappPreview}`
                    : '(add a phone number to generate link)'}
                </span>
              </p>
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-sm text-gray-200">
                  Hi! I would like to place an order.
                  <br />
                  <br />
                  Order details:
                  <br />
                  {sample.items.split('\n').map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                  <br />
                  Total: {sample.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebsitePageShell>
  )
}











