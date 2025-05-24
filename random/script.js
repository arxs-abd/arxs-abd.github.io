document.addEventListener('DOMContentLoaded', function() {
    const pesertaTextarea = document.getElementById('peserta');
    const jumlahKelompokInput = document.getElementById('jumlahKelompok');
    const bagiKelompokButton = document.getElementById('bagiKelompok');
    const hasilDiv = document.getElementById('hasil');

    bagiKelompokButton.addEventListener('click', function() {
        const pesertaText = pesertaTextarea.value.trim();
        const jumlahKelompok = parseInt(jumlahKelompokInput.value, 10);

        if (!pesertaText || jumlahKelompok <= 0) {
            hasilDiv.innerHTML = '<p style="color: red;">Harap masukkan daftar peserta dan jumlah kelompok yang valid.</p>';
            return;
        }

        const peserta = pesertaText.split('\n').map(nama => nama.trim()).filter(nama => nama !== ""); // Pisahkan dan bersihkan nama
        const jumlahPeserta = peserta.length;

        if (jumlahPeserta < jumlahKelompok) {
            hasilDiv.innerHTML = '<p style="color: red;">Jumlah peserta kurang dari jumlah kelompok.</p>';
            return;
        }

        // Algoritma pembagian kelompok
        const kelompok = [];
        for (let i = 0; i < jumlahKelompok; i++) {
            kelompok.push([]);
        }

        // Shuffle peserta untuk acak
        const pesertaAcak = [...peserta].sort(() => Math.random() - 0.5);

        for (let i = 0; i < jumlahPeserta; i++) {
            const kelompokIndex = i % jumlahKelompok;
            kelompok[kelompokIndex].push(pesertaAcak[i]);
        }


        // Tampilkan hasil
        let hasilHTML = '';
        for (let i = 0; i < jumlahKelompok; i++) {
            hasilHTML += `
                <div class="kelompok">
                    <h2>Kelompok ${i + 1}</h2>
                    <ul>`;
            for (const nama of kelompok[i]) {
                hasilHTML += `<li>${nama}</li>`;
            }
            hasilHTML += `
                    </ul>
                </div>`;
        }
        hasilDiv.innerHTML = hasilHTML;
    });
});