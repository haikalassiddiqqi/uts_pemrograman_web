// 1. Data Produk
const PRODUK = [
    { id: 1, nama: "Laptop Gaming X", harga: 15000000 },
    { id: 2, nama: "Smartphone Pro Z", harga: 8500000 },
    { id: 3, nama: "Monitor Ultra HD", harga: 4200000 },
    { id: 4, nama: "Keyboard Mekanikal", harga: 950000 },
];

let keranjang = []; // Array untuk menyimpan item yang dipesan

// Helper untuk format mata uang
const formatRupiah = (angka) => {
    return "Rp " + angka.toLocaleString('id-ID');
};

// 2. Fungsi Memuat Produk ke Halaman
function muatProduk() {
    const daftarProdukDiv = document.getElementById('daftar-produk');
    daftarProdukDiv.innerHTML = ''; // Kosongkan dulu

    PRODUK.forEach(produk => {
        const produkCard = `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${produk.nama}</h5>
                        <p class="card-text fw-bold text-primary">${formatRupiah(produk.harga)}</p>
                        <hr>
                        <div class="input-group mb-3">
                            <input type="number" class="form-control" id="jumlah-${produk.id}" value="1" min="1">
                            <button class="btn btn-primary tambah-keranjang" 
                                data-produk-id="${produk.id}"
                                data-produk-nama="${produk.nama}"
                                data-produk-harga="${produk.harga}">
                                Tambah ➕
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        daftarProdukDiv.innerHTML += produkCard;
    });

    // Menambahkan event listener ke semua tombol "Tambah"
    document.querySelectorAll('.tambah-keranjang').forEach(button => {
        button.addEventListener('click', tambahKeKeranjang);
    });
}

// 3. Fungsi Tambah ke Keranjang
function tambahKeKeranjang(event) {
    const btn = event.target;
    const id = parseInt(btn.getAttribute('data-produk-id'));
    const nama = btn.getAttribute('data-produk-nama');
    const harga = parseInt(btn.getAttribute('data-produk-harga'));

    // Ambil jumlah dari input yang sesuai
    const jumlahInput = document.getElementById(`jumlah-${id}`);
    const jumlah = parseInt(jumlahInput.value);

    // Cari apakah produk sudah ada di keranjang
    const indexItem = keranjang.findIndex(item => item.id === id);

    if (indexItem > -1) {
        // Jika sudah ada, tambahkan jumlahnya
        keranjang[indexItem].jumlah += jumlah;
    } else {
        // Jika belum ada, tambahkan item baru
        keranjang.push({ id, nama, harga, jumlah });
    }

    // Reset input jumlah ke 1 setelah ditambahkan
    jumlahInput.value = 1;

    perbaruiKeranjang(); // Panggil fungsi untuk update tampilan
}

// 4. Fungsi Hapus Item dari Keranjang
function hapusDariKeranjang(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    perbaruiKeranjang();
}

// 5. Fungsi Update Tampilan Keranjang dan Total
function perbaruiKeranjang() {
    const keranjangBody = document.getElementById('keranjang-body');
    const totalAkhirElement = document.getElementById('total-akhir');
    const tombolCheckout = document.getElementById('tombol-checkout');
    let totalAkhir = 0;
    
    keranjangBody.innerHTML = ''; // Kosongkan tampilan keranjang

    if (keranjang.length === 0) {
        keranjangBody.innerHTML = '<tr><td colspan="5" class="text-center">Keranjang masih kosong.</td></tr>';
        tombolCheckout.disabled = true;
    } else {
        keranjang.forEach(item => {
            const subtotal = item.harga * item.jumlah;
            totalAkhir += subtotal;

            const row = `
                <tr>
                    <td>${item.nama}</td>
                    <td>${formatRupiah(item.harga)}</td>
                    <td>${item.jumlah}</td>
                    <td>${formatRupiah(subtotal)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="hapusDariKeranjang(${item.id})">Hapus</button>
                    </td>
                </tr>
            `;
            keranjangBody.innerHTML += row;
        });
        tombolCheckout.disabled = false;
    }

    // Update total akhir
    totalAkhirElement.textContent = formatRupiah(totalAkhir);
}

// 6. Fungsi Checkout
function checkout() {
    if (keranjang.length === 0) {
        alert("Keranjang Anda kosong! Silakan tambahkan produk.");
        return;
    }

const konfirmasi = confirm(`Total pesanan Anda adalah ${document.getElementById('total-akhir').textContent}. Lanjutkan checkout?`);

    if (konfirmasi) {
        const detailPesanan = keranjang.map(item => `${item.nama} (${item.jumlah}x)`).join(', ');
        
        alert(`Pesanan berhasil dibuat!\n\nDetail Pesanan:\n${detailPesanan}\n\nTotal: ${document.getElementById('total-akhir').textContent}\n\nTerima kasih telah berbelanja!`);
        
        // Reset keranjang setelah checkout
        keranjang = [];
        perbaruiKeranjang();
    }
}

// 7. Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    muatProduk(); // Tampilkan daftar produk saat halaman dimuat
    perbaruiKeranjang(); // Inisialisasi tampilan keranjang
    
    // Tambahkan event listener untuk tombol checkout
    document.getElementById('tombol-checkout').addEventListener('click', checkout);
});