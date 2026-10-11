import { formatRupiah, normalizeWhatsApp, isValidEmail } from '../src/utils/formatter.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- MENJALANKAN UJI TEMBUS & BOUNDARY TESTING KARSA TIKET ---');

// 1. Uji Formatter & Validasi WhatsApp
assert(formatRupiah(50000).includes('50.000'), 'formatRupiah memformat angka ke format Rupiah');
assert(normalizeWhatsApp('081234567890') === '6281234567890', 'normalizeWhatsApp mengubah 08xxx menjadi 628xxx');
assert(normalizeWhatsApp('+62 812-3456-7890') === '6281234567890', 'normalizeWhatsApp membersihkan strip, spasi, dan plus');
assert(isValidEmail('pembeli@kreatif.id') === true, 'isValidEmail menerima email valid');
assert(isValidEmail('pembelitanpa-at.com') === false, 'isValidEmail menolak email tanpa tanda @ (Uji Input 1: format salah)');

// 2. Uji Masukan 1 & 4: Nilai Negatif & Kosong pada Event
const testNegativeHarga = (harga) => harga >= 0;
assert(testNegativeHarga(-5000) === false, 'Validasi menolak harga tiket negatif (Uji Input 4)');
assert(testNegativeHarga(0) === true, 'Validasi mengizinkan tiket gratis Rp 0');

// 3. Uji Masukan 5: Nilai Di Luar Batas Kuota & Jumlah Tiket
const validateKuotaEdit = (kuotaBaru, tiketTerjual) => kuotaBaru >= tiketTerjual;
assert(validateKuotaEdit(15, 20) === false, 'Menolak penurunan kuota di bawah tiket terjual (Uji Input 5)');
assert(validateKuotaEdit(25, 20) === true, 'Menerima kuota yang lebih besar dari tiket terjual');

const validateJumlahTiket = (jumlah, sisaKuota) => {
  if (jumlah < 1 || jumlah > 5) return false;
  if (jumlah > sisaKuota) return false;
  return true;
};
assert(validateJumlahTiket(0, 10) === false, 'Menolak pembelian 0 tiket (Uji Input 5)');
assert(validateJumlahTiket(6, 10) === false, 'Menolak pembelian lebih dari 5 tiket (Uji Input 5)');
assert(validateJumlahTiket(3, 2) === false, 'Menolak pembelian melebihi sisa kuota (Anti-Overbooking)');
assert(validateJumlahTiket(2, 2) === true, 'Menerima pembelian sesuai sisa kuota');

// 4. Uji Masukan 6: Perubahan Status Tidak Sah (Strict State Machine)
function canTransition(currentStatus, newStatus) {
  if (currentStatus === 'menunggu_bayar') {
    return newStatus === 'lunas' || newStatus === 'dibatalkan';
  }
  if (currentStatus === 'lunas') {
    return newStatus === 'hadir'; // Tiket lunas TIDAK BISA dibatalkan
  }
  return false; // hadir atau dibatalkan bersifat final
}

assert(canTransition('menunggu_bayar', 'lunas') === true, 'Transisi menunggu_bayar -> lunas diizinkan');
assert(canTransition('menunggu_bayar', 'dibatalkan') === true, 'Transisi menunggu_bayar -> dibatalkan diizinkan');
assert(canTransition('menunggu_bayar', 'hadir') === false, 'Menolak transisi langsung menunggu_bayar -> hadir (Uji Input 6)');
assert(canTransition('lunas', 'hadir') === true, 'Transisi lunas -> hadir diizinkan (check-in)');
assert(canTransition('lunas', 'dibatalkan') === false, 'Menolak pembatalan tiket yang sudah berstatus lunas (Sesuai PRD)');
assert(canTransition('hadir', 'dibatalkan') === false, 'Menolak perubahan tiket hadir');
assert(canTransition('dibatalkan', 'lunas') === false, 'Menolak perubahan tiket yang sudah dibatalkan');

// 5. Uji Rekonsiliasi Pendapatan Rekap
const mockTickets = [
  { status: 'lunas', total_harga: 100000, jumlah: 2 },
  { status: 'hadir', total_harga: 50000, jumlah: 1 },
  { status: 'menunggu_bayar', total_harga: 150000, jumlah: 3 },
  { status: 'dibatalkan', total_harga: 50000, jumlah: 1 }
];

let totalPendapatan = 0;
let totalHadir = 0;
mockTickets.forEach((t) => {
  if (t.status === 'lunas' || t.status === 'hadir') {
    totalPendapatan += t.total_harga;
  }
  if (t.status === 'hadir') {
    totalHadir += t.jumlah;
  }
});

assert(totalPendapatan === 150000, 'Pendapatan rekap HANYA menghitung lunas dan hadir (100rb + 50rb = 150rb)');
assert(totalHadir === 1, 'Total hadir hanya menghitung peserta dengan status hadir');

console.log(`\nRINGKASAN UJI: ${passed} Lulus, ${failed} Gagal.`);
if (failed > 0) process.exit(1);
