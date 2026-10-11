/**
 * Formats a number to Indonesian Rupiah representation (e.g. 50000 -> "Rp 50.000")
 */
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Normalizes a WhatsApp phone number into standard international format without '+' (e.g. '0812...' -> '62812...')
 */
export function normalizeWhatsApp(input) {
  if (!input) return '';
  // Remove non-digit characters
  let cleaned = input.toString().replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

/**
 * Formats a date string (YYYY-MM-DD) into Indonesian readable format (e.g. "15 Okt 2026")
 */
export function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Validates email format with basic regex requirement (must have '@' and valid domain structure)
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}
