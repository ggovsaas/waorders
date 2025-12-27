// Placeholder QR generator.
// Later we can swap this to a real QR library (e.g., qrcode).

/**
 * generateQRCode(keyword)
 * @param {string} keyword
 * @returns {Promise<{ keyword: string, url: string }>}
 */
export async function generateQRCode(keyword) {
  const url = `https://wa.me/?text=${encodeURIComponent(keyword || '')}`
  // Placeholder: return the URL. UI can render a QR later.
  console.log('📎 generateQRCode (placeholder)', { keyword, url })
  return { keyword, url }
}








