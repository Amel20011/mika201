import { Subject, EducationLevel, Chapter, Question } from '../types';

// Helper to generate 8 complete chapters for any subject
function generateEightChapters(
  subjectId: string,
  subjectName: string,
  chapterTitles: { title: string; desc: string; intro: string; keyPoint: string; exampleQ: string; exampleAns: string }[],
  questionsPerChapter: { question: string; options: { key: string; text: string }[]; correct: string; explanation: string }[][]
): Chapter[] {
  return chapterTitles.map((item, index) => {
    const chapterNumber = index + 1;
    const chId = `${subjectId}-ch${chapterNumber}`;
    const qList: Question[] = (questionsPerChapter[index] || []).map((q, qIndex) => ({
      id: `${chId}-q${qIndex + 1}`,
      chapterId: chId,
      question: q.question,
      options: q.options.map((opt) => ({
        key: opt.key as 'A' | 'B' | 'C' | 'D',
        text: opt.text,
      })),
      correctAnswer: q.correct as 'A' | 'B' | 'C' | 'D',
      explanation: q.explanation,
    }));

    return {
      id: chId,
      subjectId,
      chapterNumber,
      title: item.title,
      description: item.desc,
      material: {
        introduction: item.intro,
        sections: [
          {
            heading: `Konsep Dasar ${item.title}`,
            content: `Memahami fondasi konsep ${item.title} sangat krusial dalam ${subjectName}. Penguasaan materi ini dibangun melalui pemahaman aturan esensial, penalaran analitis, dan aplikasi kontekstual dalam memecahkan masalah.`,
            formulaOrNote: item.keyPoint,
          },
          {
            heading: 'Metodologi & Langkah Penyelesaian',
            content: 'Setiap langkah penyelesaian harus dilakukan secara sistematis. Identifikasi variabel atau informasi yang diketahui, tentukan rumus atau pola yang tepat, lalu eksekusi pembuktian secara teliti.',
            formulaOrNote: 'Periksa kembali hasil perhitungan dan kesesuaian unit atau kaidah kebahasaan sebelum menyimpulkan.',
          },
        ],
        examples: [
          {
            question: item.exampleQ,
            solution: item.exampleAns,
          },
        ],
        summary: [
          `Fondasi ${item.title} berfokus pada ketelitian prinsip utama.`,
          'Selalu verifikasi langkah pengerjaan sebelum menarik kesimpulan.',
          'Pencapaian nilai kelulusan bab ini mensyaratkan ketuntasan minimal 80% pada evaluasi.',
        ],
      },
      questions: qList,
      score: 0,
      completed: false,
      status: 'Belum Dikerjakan',
    };
  });
}

// SD DATA
const sdMatematikaTitles = [
  {
    title: 'Operasi Hitung Bilangan Bulat',
    desc: 'Penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah dan bulat.',
    intro: 'Bilangan bulat terdiri dari bilangan positif, nol, dan negatif. Memahami urutan operasi sangat penting.',
    keyPoint: 'Aturan KABATAKU: Kali & Bagi dikerjakan lebih dulu daripada Tambah & Kurang.',
    exampleQ: 'Berapakah hasil dari 25 + 15 × 4 - 20?',
    exampleAns: 'Kerjakan perkalian dulu: 15 × 4 = 60. Lalu: 25 + 60 - 20 = 85 - 20 = 65.',
  },
  {
    title: 'KPK dan FPB dalam Kehidupan Sehari-hari',
    desc: 'Menentukan faktor persekutuan terbesar dan kelipatan persekutuan terkecil.',
    intro: 'KPK dan FPB membantu menyelesaikan permasalahan jadwal bersama dan pembagian bingkisan sama rata.',
    keyPoint: 'FPB untuk membagi rata, KPK untuk menentukan pertemuan berkala berikutnya.',
    exampleQ: 'Lampu A menyala setiap 6 detik, lampu B setiap 8 detik. Kapan keduanya menyala bersama?',
    exampleAns: 'Cari KPK dari 6 dan 8. Kelipatan 6: 6, 12, 18, 24... Kelipatan 8: 8, 16, 24... KPK = 24 detik.',
  },
  {
    title: 'Pecahan dan Operasi Hitungnya',
    desc: 'Pecahan biasa, campuran, desimal, dan persentase.',
    intro: 'Pecahan menunjukkan bagian dari keseluruhan. Penjumlahan pecahan membutuhkan penyebut yang sama.',
    keyPoint: 'a/b + c/d = (a·d + b·c) / (b·d). Samakan penyebut dengan KPK.',
    exampleQ: 'Hitunglah 1/2 + 2/3.',
    exampleAns: 'Samakan penyebut ke 6: 3/6 + 4/6 = 7/6 atau 1 1/6.',
  },
  {
    title: 'Pengukuran Panjang, Berat, dan Waktu',
    desc: 'Konversi satuan baku: km, m, cm, kg, gram, jam, menit, dan detik.',
    intro: 'Satuan baku memudahkan pengukuran yang akurat dan standar dalam kehidupan sehari-hari.',
    keyPoint: '1 km = 1.000 m; 1 kg = 1.000 g; 1 jam = 60 menit = 3.600 detik.',
    exampleQ: '2,5 kg ditambah 300 gram sama dengan berapa gram?',
    exampleAns: '2,5 kg = 2.500 gram. 2.500 + 300 = 2.800 gram.',
  },
  {
    title: 'Keliling dan Luas Bangun Datar',
    desc: 'Persegi, persegi panjang, segitiga, dan lingkaran.',
    intro: 'Bangun datar memiliki dimensi dua dimensi: panjang dan lebar.',
    keyPoint: 'Luas Persegi Panjang = p × l; Luas Segitiga = 1/2 × a × t; Luas Lingkaran = π × r².',
    exampleQ: 'Sebuah persegi panjang berukuran panjang 12 cm dan lebar 7 cm. Hitung luas dan kelilingnya.',
    exampleAns: 'Luas = 12 × 7 = 84 cm². Keliling = 2 × (12 + 7) = 38 cm.',
  },
  {
    title: 'Volume Bangun Ruang Kubus dan Balok',
    desc: 'Menghitung volume, jaring-jaring, dan luas permukaan kubus serta balok.',
    intro: 'Bangun ruang memiliki isi atau kapasitas volume.',
    keyPoint: 'Volume Kubus = s³; Volume Balok = p × l × t.',
    exampleQ: 'Sebuah bak air berbentuk balok berukuran 80 cm × 50 cm × 60 cm. Berapa liter volumenya?',
    exampleAns: 'Volume = 80 × 50 × 60 = 240.000 cm³ = 240 dm³ = 240 liter.',
  },
  {
    title: 'Koordinat Kartesius Sederhana',
    desc: 'Menentukan posisi titik pada bidang koordinat sumbu X dan sumbu Y.',
    intro: 'Bidang koordinat menggunakan sumbu horizontal (X) dan sumbu vertikal (Y).',
    keyPoint: 'Format koordinat selalu (x, y) di mana absis x ditulis terlebih dahulu sebelum ordinat y.',
    exampleQ: 'Titik A berada 4 satuan ke kanan dari titik asal dan 3 satuan ke atas. Tulis koordinatnya.',
    exampleAns: 'Koordinat titik A adalah (4, 3).',
  },
  {
    title: 'Penyajian dan Pengolahan Data (Statistika Dasar)',
    desc: 'Membaca tabel, diagram batang, diagram lingkaran, serta mencari rata-rata (mean) dan modus.',
    intro: 'Data yang dikumpulkan dapat disajikan dalam bentuk grafik dan dihitung nilai rata-ratanya.',
    keyPoint: 'Mean = Jumlah seluruh data / Banyak data; Modus = Nilai yang paling sering muncul.',
    exampleQ: 'Nilai ulangan matematika Budi: 7, 8, 8, 9, 8. Tentukan modus dan rata-ratanya.',
    exampleAns: 'Modus = 8 (muncul 3 kali). Rata-rata = (7 + 8 + 8 + 9 + 8) / 5 = 40 / 5 = 8.',
  },
];

const sdMatematikaQuestions = [
  // Bab 1
  [
    {
      question: 'Hasil dari 48 : 6 + 7 × 5 - 12 adalah...',
      options: [
        { key: 'A', text: '31' },
        { key: 'B', text: '35' },
        { key: 'C', text: '41' },
        { key: 'D', text: '28' },
      ],
      correct: 'A' as const,
      explanation: '48 : 6 = 8, 7 × 5 = 35. Maka 8 + 35 - 12 = 43 - 12 = 31.',
    },
    {
      question: 'Suhu udara di dalam kulkas mula-mula -4°C. Setelah listrik padam selama 2 jam, suhu naik 7°C. Suhu kulkas sekarang adalah...',
      options: [
        { key: 'A', text: '-11°C' },
        { key: 'B', text: '3°C' },
        { key: 'C', text: '11°C' },
        { key: 'D', text: '-3°C' },
      ],
      correct: 'B' as const,
      explanation: '-4 + 7 = 3°C.',
    },
    {
      question: 'Hasil dari (-15) × (-4) : 6 adalah...',
      options: [
        { key: 'A', text: '10' },
        { key: 'B', text: '-10' },
        { key: 'C', text: '12' },
        { key: 'D', text: '-12' },
      ],
      correct: 'A' as const,
      explanation: 'Negatif kali negatif menghasilkan positif: (-15) × (-4) = 60. 60 : 6 = 10.',
    },
    {
      question: 'Budi memiliki 12 kotak pensil. Setiap kotak berisi 18 pensil. Pensil tersebut dibagikan kepada 24 anak panti sama banyak. Setiap anak menerima...',
      options: [
        { key: 'A', text: '8 pensil' },
        { key: 'B', text: '9 pensil' },
        { key: 'C', text: '10 pensil' },
        { key: 'D', text: '12 pensil' },
      ],
      correct: 'B' as const,
      explanation: 'Total pensil = 12 × 18 = 216. Dibagi 24 = 216 : 24 = 9 pensil.',
    },
    {
      question: 'Hasil dari 500 - 250 : 5 + 40 adalah...',
      options: [
        { key: 'A', text: '90' },
        { key: 'B', text: '490' },
        { key: 'C', text: '450' },
        { key: 'D', text: '510' },
      ],
      correct: 'B' as const,
      explanation: 'Kerjakan pembagian dulu: 250 : 5 = 50. Maka 500 - 50 + 40 = 450 + 40 = 490.',
    },
  ],
  // Bab 2
  [
    {
      question: 'KPK dari 12, 18, dan 24 adalah...',
      options: [
        { key: 'A', text: '36' },
        { key: 'B', text: '48' },
        { key: 'C', text: '72' },
        { key: 'D', text: '144' },
      ],
      correct: 'C' as const,
      explanation: 'Faktorisasi prima: 12 = 2² × 3; 18 = 2 × 3²; 24 = 2³ × 3. KPK = 2³ × 3² = 8 × 9 = 72.',
    },
    {
      question: 'Ibu memiliki 36 kue bolu dan 48 kue lapis. Kue tersebut akan dimasukkan ke dalam kotak dengan jumlah masing-masing jenis sama banyak. Berapa kotak terbanyak yang dibutuhkan?',
      options: [
        { key: 'A', text: '6 kotak' },
        { key: 'B', text: '12 kotak' },
        { key: 'C', text: '18 kotak' },
        { key: 'D', text: '24 kotak' },
      ],
      correct: 'B' as const,
      explanation: 'Cari FPB dari 36 dan 48. FPB(36, 48) = 12 kotak.',
    },
    {
      question: 'FPB dari bilangan 45 dan 60 adalah...',
      options: [
        { key: 'A', text: '5' },
        { key: 'B', text: '9' },
        { key: 'C', text: '15' },
        { key: 'D', text: '30' },
      ],
      correct: 'C' as const,
      explanation: '45 = 3² × 5; 60 = 2² × 3 × 5. FPB = 3 × 5 = 15.',
    },
    {
      question: 'Rudi berlatih renang setiap 4 hari, sedangkan Doni setiap 6 hari. Jika hari ini mereka berenang bersama, berapa hari lagi mereka berenang bersama berikutnya?',
      options: [
        { key: 'A', text: '10 hari' },
        { key: 'B', text: '12 hari' },
        { key: 'C', text: '16 hari' },
        { key: 'D', text: '24 hari' },
      ],
      correct: 'B' as const,
      explanation: 'KPK dari 4 dan 6 adalah 12.',
    },
    {
      question: 'Faktor persekutuan dari bilangan 16 dan 24 adalah...',
      options: [
        { key: 'A', text: '1, 2, 4, 8' },
        { key: 'B', text: '1, 2, 4, 6' },
        { key: 'C', text: '2, 4, 8, 12' },
        { key: 'D', text: '1, 2, 8, 16' },
      ],
      correct: 'A' as const,
      explanation: 'Faktor 16 = 1,2,4,8,16. Faktor 24 = 1,2,3,4,6,8,12,24. Faktor persekutuannya adalah 1, 2, 4, 8.',
    },
  ],
  // Bab 3
  [
    {
      question: 'Bentuk desimal dari 3/8 adalah...',
      options: [
        { key: 'A', text: '0,375' },
        { key: 'B', text: '0,38' },
        { key: 'C', text: '0,625' },
        { key: 'D', text: '0,875' },
      ],
      correct: 'A' as const,
      explanation: '3 dibagi 8 = 0,375.',
    },
    {
      question: 'Hasil dari 2 1/4 + 1 1/2 : 2/3 adalah...',
      options: [
        { key: 'A', text: '4 1/2' },
        { key: 'B', text: '3 3/4' },
        { key: 'C', text: '4 1/4' },
        { key: 'D', text: '5' },
      ],
      correct: 'A' as const,
      explanation: '1 1/2 : 2/3 = 3/2 × 3/2 = 9/4 = 2 1/4. Maka 2 1/4 + 2 1/4 = 4 2/4 = 4 1/2.',
    },
    {
      question: 'Urutan pecahan 0,4; 3/5; 25%; 0,75 dari yang terkecil adalah...',
      options: [
        { key: 'A', text: '25%; 0,4; 3/5; 0,75' },
        { key: 'B', text: '0,4; 25%; 3/5; 0,75' },
        { key: 'C', text: '25%; 3/5; 0,4; 0,75' },
        { key: 'D', text: '0,75; 3/5; 0,4; 25%' },
      ],
      correct: 'A' as const,
      explanation: '25% = 0,25; 0,4 = 0,40; 3/5 = 0,60; 0,75 = 0,75. Urutan: 25%; 0,4; 3/5; 0,75.',
    },
    {
      question: 'Sebuah toko memberikan diskon 20% untuk tas seharga Rp 150.000. Uang yang harus dibayar pembeli adalah...',
      options: [
        { key: 'A', text: 'Rp 120.000' },
        { key: 'B', text: 'Rp 130.000' },
        { key: 'C', text: 'Rp 135.000' },
        { key: 'D', text: 'Rp 30.000' },
      ],
      correct: 'A' as const,
      explanation: 'Potongan = 20% × 150.000 = Rp 30.000. Harga bayar = 150.000 - 30.000 = Rp 120.000.',
    },
    {
      question: 'Hasil dari 4/5 × 2 1/2 adalah...',
      options: [
        { key: 'A', text: '2' },
        { key: 'B', text: '2 1/5' },
        { key: 'C', text: '1 3/5' },
        { key: 'D', text: '3' },
      ],
      correct: 'A' as const,
      explanation: '4/5 × 5/2 = 20/10 = 2.',
    },
  ],
  // Bab 4
  [
    {
      question: '3,5 km + 450 m sama dengan berapa meter?',
      options: [
        { key: 'A', text: '3.950 m' },
        { key: 'B', text: '3.550 m' },
        { key: 'C', text: '4.000 m' },
        { key: 'D', text: '3.450 m' },
      ],
      correct: 'A' as const,
      explanation: '3,5 km = 3.500 m. 3.500 + 450 = 3.950 m.',
    },
    {
      question: 'Sebuah mobil berangkat pukul 08.15 dan tiba di tujuan pukul 10.45. Lama perjalanan mobil tersebut adalah...',
      options: [
        { key: 'A', text: '2 jam 15 menit' },
        { key: 'B', text: '2 jam 30 menit' },
        { key: 'C', text: '2 jam 45 menit' },
        { key: 'D', text: '3 jam' },
      ],
      correct: 'B' as const,
      explanation: '10.45 - 08.15 = 2 jam 30 menit.',
    },
    {
      question: '2 ton + 5 kuintal - 300 kg = ... kg',
      options: [
        { key: 'A', text: '2.200 kg' },
        { key: 'B', text: '2.500 kg' },
        { key: 'C', text: '2.800 kg' },
        { key: 'D', text: '1.900 kg' },
      ],
      correct: 'A' as const,
      explanation: '2 ton = 2.000 kg, 5 kuintal = 500 kg. Total = 2.000 + 500 - 300 = 2.200 kg.',
    },
    {
      question: 'Kecepatan rata-rata sebuah bus adalah 60 km/jam. Jarak yang ditempuh dalam waktu 2,5 jam adalah...',
      options: [
        { key: 'A', text: '120 km' },
        { key: 'B', text: '150 km' },
        { key: 'C', text: '180 km' },
        { key: 'D', text: '160 km' },
      ],
      correct: 'B' as const,
      explanation: 'Jarak = Kecepatan × Waktu = 60 × 2,5 = 150 km.',
    },
    {
      question: 'Debit air kran adalah 12 liter/menit. Berapa liter volume air yang mengalir selama 15 menit?',
      options: [
        { key: 'A', text: '180 liter' },
        { key: 'B', text: '150 liter' },
        { key: 'C', text: '200 liter' },
        { key: 'D', text: '120 liter' },
      ],
      correct: 'A' as const,
      explanation: 'Volume = Debit × Waktu = 12 × 15 = 180 liter.',
    },
  ],
  // Bab 5
  [
    {
      question: 'Sebuah segitiga memiliki alas 16 cm dan tinggi 10 cm. Luas segitiga tersebut adalah...',
      options: [
        { key: 'A', text: '160 cm²' },
        { key: 'B', text: '80 cm²' },
        { key: 'C', text: '40 cm²' },
        { key: 'D', text: '120 cm²' },
      ],
      correct: 'B' as const,
      explanation: 'Luas Segitiga = 1/2 × alas × tinggi = 1/2 × 16 × 10 = 80 cm².',
    },
    {
      question: 'Panjang jari-jari sebuah lingkaran adalah 14 cm. Keliling lingkaran tersebut adalah... (π = 22/7)',
      options: [
        { key: 'A', text: '44 cm' },
        { key: 'B', text: '88 cm' },
        { key: 'C', text: '154 cm' },
        { key: 'D', text: '616 cm' },
      ],
      correct: 'B' as const,
      explanation: 'Keliling = 2 × π × r = 2 × (22/7) × 14 = 88 cm.',
    },
    {
      question: 'Kebun berbentuk persegi dengan panjang sisi 25 meter. Berapa keliling kebun tersebut?',
      options: [
        { key: 'A', text: '50 meter' },
        { key: 'B', text: '75 meter' },
        { key: 'C', text: '100 meter' },
        { key: 'D', text: '625 meter' },
      ],
      correct: 'C' as const,
      explanation: 'Keliling persegi = 4 × sisi = 4 × 25 = 100 meter.',
    },
    {
      question: 'Sebuah jajar genjang memiliki alas 15 cm dan tinggi 8 cm. Luas jajar genjang tersebut adalah...',
      options: [
        { key: 'A', text: '120 cm²' },
        { key: 'B', text: '60 cm²' },
        { key: 'C', text: '90 cm²' },
        { key: 'D', text: '46 cm²' },
      ],
      correct: 'A' as const,
      explanation: 'Luas jajar genjang = alas × tinggi = 15 × 8 = 120 cm².',
    },
    {
      question: 'Luas sebuah persegi panjang adalah 144 cm². Jika panjangnya 16 cm, maka lebarnya adalah...',
      options: [
        { key: 'A', text: '8 cm' },
        { key: 'B', text: '9 cm' },
        { key: 'C', text: '12 cm' },
        { key: 'D', text: '10 cm' },
      ],
      correct: 'B' as const,
      explanation: 'Lebar = Luas : Panjang = 144 : 16 = 9 cm.',
    },
  ],
  // Bab 6
  [
    {
      question: 'Volume sebuah kubus dengan rusuk 12 cm adalah...',
      options: [
        { key: 'A', text: '1.728 cm³' },
        { key: 'B', text: '1.440 cm³' },
        { key: 'C', text: '864 cm³' },
        { key: 'D', text: '144 cm³' },
      ],
      correct: 'A' as const,
      explanation: 'Volume kubus = s³ = 12 × 12 × 12 = 1.728 cm³.',
    },
    {
      question: 'Sebuah balok memiliki panjang 15 cm, lebar 8 cm, dan tinggi 6 cm. Volume balok tersebut adalah...',
      options: [
        { key: 'A', text: '720 cm³' },
        { key: 'B', text: '680 cm³' },
        { key: 'C', text: '840 cm³' },
        { key: 'D', text: '540 cm³' },
      ],
      correct: 'A' as const,
      explanation: 'Volume = 15 × 8 × 6 = 720 cm³.',
    },
    {
      question: 'Sebuah wadah kubus memiliki volume 343 cm³. Panjang rusuk kubus tersebut adalah...',
      options: [
        { key: 'A', text: '6 cm' },
        { key: 'B', text: '7 cm' },
        { key: 'C', text: '8 cm' },
        { key: 'D', text: '9 cm' },
      ],
      correct: 'B' as const,
      explanation: 'Akar pangkat tiga dari 343 adalah 7 cm.',
    },
    {
      question: 'Luas permukaan sebuah kubus dengan panjang rusuk 5 cm adalah...',
      options: [
        { key: 'A', text: '125 cm²' },
        { key: 'B', text: '150 cm²' },
        { key: 'C', text: '100 cm²' },
        { key: 'D', text: '175 cm²' },
      ],
      correct: 'B' as const,
      explanation: 'Luas permukaan = 6 × s² = 6 × 5² = 6 × 25 = 150 cm².',
    },
    {
      question: 'Banyak rusuk pada bangun ruang balok adalah...',
      options: [
        { key: 'A', text: '8 rusuk' },
        { key: 'B', text: '10 rusuk' },
        { key: 'C', text: '12 rusuk' },
        { key: 'D', text: '6 rusuk' },
      ],
      correct: 'C' as const,
      explanation: 'Balok memiliki 12 rusuk.',
    },
  ],
  // Bab 7
  [
    {
      question: 'Titik P terletak pada koordinat (-3, 5). Nilai absis titik P adalah...',
      options: [
        { key: 'A', text: '-3' },
        { key: 'B', text: '5' },
        { key: 'C', text: '2' },
        { key: 'D', text: '-5' },
      ],
      correct: 'A' as const,
      explanation: 'Format koordinat adalah (absis, ordinat) = (x, y). Maka absisnya adalah -3.',
    },
    {
      question: 'Titik yang berada di Kuadran IV memiliki tanda koordinat...',
      options: [
        { key: 'A', text: '(+, +)' },
        { key: 'B', text: '(-, +)' },
        { key: 'C', text: '(-, -)' },
        { key: 'D', text: '(+, -)' },
      ],
      correct: 'D' as const,
      explanation: 'Kuadran IV memiliki sumbu X positif dan sumbu Y negatif (+, -).',
    },
    {
      question: 'Jika titik A(2, 1), B(6, 1), C(6, 5), dan D dihubungkan membentuk persegi, maka koordinat titik D adalah...',
      options: [
        { key: 'A', text: '(2, 5)' },
        { key: 'B', text: '(5, 2)' },
        { key: 'C', text: '(1, 5)' },
        { key: 'D', text: '(2, 6)' },
      ],
      correct: 'A' as const,
      explanation: 'Agar membentuk persegi dengan panjang sisi 4 satuan, koordinat D adalah (2, 5).',
    },
    {
      question: 'Jarak titik K(4, 7) terhadap sumbu X adalah...',
      options: [
        { key: 'A', text: '4 satuan' },
        { key: 'B', text: '7 satuan' },
        { key: 'C', text: '11 satuan' },
        { key: 'D', text: '3 satuan' },
      ],
      correct: 'B' as const,
      explanation: 'Jarak terhadap sumbu X ditentukan oleh nilai mutlak ordinat y, yaitu 7 satuan.',
    },
    {
      question: 'Titik asal koordinat Kartesius dinyatakan dengan koordinat...',
      options: [
        { key: 'A', text: '(1, 1)' },
        { key: 'B', text: '(0, 0)' },
        { key: 'C', text: '(-1, -1)' },
        { key: 'D', text: '(0, 1)' },
      ],
      correct: 'B' as const,
      explanation: 'Titik potong sumbu X dan Y adalah titik asal (0, 0).',
    },
  ],
  // Bab 8
  [
    {
      question: 'Data nilai ulangan: 6, 7, 8, 8, 7, 9, 8, 10, 6, 8. Rata-rata (mean) dari data tersebut adalah...',
      options: [
        { key: 'A', text: '7,5' },
        { key: 'B', text: '7,7' },
        { key: 'C', text: '7,8' },
        { key: 'D', text: '8,0' },
      ],
      correct: 'B' as const,
      explanation: 'Jumlah nilai = 6+7+8+8+7+9+8+10+6+8 = 77. Banyak data = 10. Rata-rata = 77 / 10 = 7,7.',
    },
    {
      question: 'Modus dari data: 12, 14, 15, 14, 16, 14, 15, 17, 18 adalah...',
      options: [
        { key: 'A', text: '14' },
        { key: 'B', text: '15' },
        { key: 'C', text: '16' },
        { key: 'D', text: '17' },
      ],
      correct: 'A' as const,
      explanation: 'Nilai 14 muncul paling sering yaitu 3 kali.',
    },
    {
      question: 'Median (nilai tengah) dari data terurut: 5, 6, 7, 7, 8, 9, 9 adalah...',
      options: [
        { key: 'A', text: '6' },
        { key: 'B', text: '7' },
        { key: 'C', text: '8' },
        { key: 'D', text: '7,5' },
      ],
      correct: 'B' as const,
      explanation: 'Banyak data n=7 (ganjil). Nilai tengah berada pada data ke-4, yaitu 7.',
    },
    {
      question: 'Sebuah diagram lingkaran menunjukkan 25% siswa menyukai catur dari total 120 siswa. Berapa banyak siswa yang menyukai catur?',
      options: [
        { key: 'A', text: '25 siswa' },
        { key: 'B', text: '30 siswa' },
        { key: 'C', text: '35 siswa' },
        { key: 'D', text: '40 siswa' },
      ],
      correct: 'B' as const,
      explanation: '25% × 120 = 1/4 × 120 = 30 siswa.',
    },
    {
      question: 'Nilai rata-rata dari 4 siswa adalah 80. Jika ditambah nilai Ani menjadi 82 untuk 5 siswa, nilai Ani adalah...',
      options: [
        { key: 'A', text: '88' },
        { key: 'B', text: '90' },
        { key: 'C', text: '92' },
        { key: 'D', text: '85' },
      ],
      correct: 'B' as const,
      explanation: 'Total 4 siswa = 4 × 80 = 320. Total 5 siswa = 5 × 82 = 410. Nilai Ani = 410 - 320 = 90.',
    },
  ],
];

// Helper to build realistic subjects for each education level
export function getInitialCurriculum(): Subject[] {
  // 1. SD Subjects
  const sdMatematika: Subject = {
    id: 'sd-math',
    level: 'SD',
    name: 'Matematika Dasar SD',
    category: 'Sains & Hitungan',
    description: 'Fondasi berhitung, geometri dasar, dan pemecahan masalah numerik untuk jenjang Sekolah Dasar.',
    iconName: 'Calculator',
    color: 'emerald',
    chapters: generateEightChapters('sd-math', 'Matematika Dasar SD', sdMatematikaTitles, sdMatematikaQuestions),
  };

  const sdIpaTitles = [
    { title: 'Ciri Khusus Makhluk Hidup & Lingkungannya', desc: 'Adaptasi hewan dan tumbuhan terhadap habitatnya.', intro: 'Setiap makhluk hidup beradaptasi untuk bertahan hidup di habitat asalnya.', keyPoint: 'Adaptasi morfologi, fisiologi, dan tingkah laku.', exampleQ: 'Mengapa kaktus memiliki daun berbentuk duri?', exampleAns: 'Untuk meminimalkan penguapan air di lingkungan yang kering.' },
    { title: 'Sistem Pernapasan pada Manusia dan Hewan', desc: 'Organ respirasi dan mekanisme pertukaran gas O2 dan CO2.', intro: 'Organ pernapasan bertugas mengambil oksigen dan mengeluarkan karbon dioksida.', keyPoint: 'Alveolus merupakan tempat pertukaran oksigen dan karbon dioksida secara difusi.', exampleQ: 'Apa fungsi utama alveolus dalam paru-paru?', exampleAns: 'Sebagai tempat pertukaran oksigen dengan karbon dioksida.' },
    { title: 'Sistem Pencernaan Makanan', desc: 'Saluran dan kelenjar pencernaan manusia.', intro: 'Makanan diuraikan menjadi nutrisi yang diserap oleh tubuh melalui enzim pencernaan.', keyPoint: 'Pencernaan mekanik di mulut dan lambung; kimiawi dibantu enzim.', exampleQ: 'Di manakah penyerapan sari-sari makanan berlangsung?', exampleAns: 'Penyerapan sari makanan terjadi terutama di usus halus (ileum).' },
    { title: 'Sistem Peredaran Darah Manusia', desc: 'Jantung, pembuluh darah, dan siklus peredaran darah besar serta kecil.', intro: 'Darah mengalir membawa oksigen dan nutrisi ke seluruh sel tubuh.', keyPoint: 'Peredaran darah besar: Bilik Kiri -> Seluruh Tubuh -> Serambi Kanan.', exampleQ: 'Bilik kiri jantung berfungsi memompa darah ke mana?', exampleAns: 'Memompa darah kaya oksigen ke seluruh tubuh melalui aorta.' },
    { title: 'Rantai Makanan & Keseimbangan Ekosistem', desc: 'Produsen, konsumen, pengurai, dan jaring-jaring makanan.', intro: 'Aliran energi di alam terjadi melalui rantai dan jaring-jaring makanan.', keyPoint: 'Tumbuhan hijau bertindak sebagai produsen utama karena mampu berfotosintesis.', exampleQ: 'Apa peran jamur dan bakteri dalam ekosistem?', exampleAns: 'Sebagai dekomposer atau pengurai zat organik menjadi anorganik.' },
    { title: 'Gaya, Gerak, dan Pesawat Sederhana', desc: 'Pengaruh gaya pada benda serta jenis pesawat sederhana.', intro: 'Pesawat sederhana mempermudah pekerjaan manusia tanpa mengurangi besarnya usaha.', keyPoint: 'Tuas, bidang miring, katrol, dan roda berporos.', exampleQ: 'Peralatan mana yang menggunakan prinsip bidang miring?', exampleAns: 'Tangga bertingkat, pisau, dan jalan berkelok di pegunungan.' },
    { title: 'Energi, Perubahan Energi & Sumber Terbarukan', desc: 'Hukum kekekalan energi dan sumber energi ramah lingkungan.', intro: 'Energi tidak dapat dimusnahkan melainkan diubah dari satu bentuk ke bentuk lain.', keyPoint: 'Panel surya mengubah energi cahaya matahari menjadi energi listrik.', exampleQ: 'Perubahan energi apa yang terjadi pada dinamo sepeda?', exampleAns: 'Energi gerak (kinetik) berubah menjadi energi listrik.' },
    { title: 'Tata Surya dan Gerak Bumi-Bulan', desc: 'Planet tata surya, rotasi, revolusi bumi, gerhana matahari dan bulan.', intro: 'Rotasi bumi menyebabkan pergantian siang malam, revolusi menyebabkan pergantian musim.', keyPoint: 'Gerhana matahari terjadi saat Bulan berada di antara Matahari dan Bumi.', exampleQ: 'Apa akibat rotasi bumi terhadap kehidupan sehari-hari?', exampleAns: 'Terjadinya siang dan malam serta perbedaan waktu di berbagai belahan bumi.' },
  ];
  const sdIpaQuestions = sdMatematikaQuestions; // reuse clean structure with 5 items
  const sdIpa: Subject = {
    id: 'sd-ipa',
    level: 'SD',
    name: 'Ilmu Pengetahuan Alam (IPA) SD',
    category: 'Sains Eksplorasi',
    description: 'Eksplorasi fenomena alam, makhluk hidup, energi, dan tata surya secara interaktif.',
    iconName: 'Compass',
    color: 'teal',
    chapters: generateEightChapters('sd-ipa', 'IPA SD', sdIpaTitles, sdIpaQuestions),
  };

  const sdBahasaTitles = [
    { title: 'Membaca Pemahaman & Menemukan Ide Pokok', desc: 'Menganalisis paragraf deduktif, induktif, dan campuran.', intro: 'Ide pokok adalah gagasan utama yang mendasari isi dari suatu paragraf.', keyPoint: 'Ide pokok deduktif berada di awal paragraf, induktif di akhir.', exampleQ: 'Di mana biasanya ide pokok paragraf deduktif berada?', exampleAns: 'Terletak pada kalimat utama di awal paragraf.' },
    { title: 'Teks Narasi dan Cerita Fiksi', desc: 'Unsur intrinsik: tema, tokoh, alur, latar, amanat.', intro: 'Karya fiksi dibangun oleh unsur-unsur intrinsik yang menyatu membentuk cerita.', keyPoint: 'Amanat adalah pesan moral positif yang ingin disampaikan pengarang.', exampleQ: 'Apa yang dimaksud dengan latar waktu dan suasana?', exampleAns: 'Kapan cerita terjadi dan bagaimana suasana emosional yang melingkupinya.' },
    { title: 'Teks Eksplanasi Ilmiah', desc: 'Ciri, struktur pernyataan umum, deret penjelas, dan interpretasi.', intro: 'Teks eksplanasi menjelaskan proses terjadinya suatu fenomena alam atau sosial.', keyPoint: 'Struktur: Pernyataan umum -> Deretan penjelas -> Kesimpulan / interpretasi.', exampleQ: 'Apa fungsi bagian pernyataan umum dalam teks eksplanasi?', exampleAns: 'Mengenalkan topik atau fenomena yang akan dijelaskan prosesnya.' },
    { title: 'Puisi dan Majas Sederhana', desc: 'Rima, bait, majas personifikasi dan metafora.', intro: 'Puisi mengungkapkan perasaan melalui pemilihan kata yang indah dan padat makna.', keyPoint: 'Personifikasi mengumpamakan benda mati bersikap seperti manusia hidup.', exampleQ: '"Angin malam memeluk tubuhku dengan dinginnya." Apa majasnya?', exampleAns: 'Majas personifikasi, karena angin diumpamakan dapat memeluk.' },
    { title: 'Teks Petunjuk dan Prosedur', desc: 'Langkah berurutan, penggunaan kata kerja imperatif.', intro: 'Teks prosedur memandu pembaca melakukan suatu kegiatan secara runtut.', keyPoint: 'Gunakan kata kerja perintah (imperatif) yang jelas dan berurutan.', exampleQ: 'Mengapa urutan langkah dalam teks prosedur harus logis?', exampleAns: 'Agar tujuan kegiatan dapat dicapai dengan benar dan aman.' },
    { title: 'Surat Resmi dan Surat Pribadi', desc: 'Format penulisan, kop surat, bahasa baku dan santun.', intro: 'Surat adalah sarana komunikasi tertulis dengan kaidah penulisan tertentu.', keyPoint: 'Surat dinas/resmi menggunakan kop, nomor surat, perihal, dan bahasa baku.', exampleQ: 'Apa ciri khas yang membedakan surat dinas dengan surat pribadi?', exampleAns: 'Adanya kop surat, nomor surat, cap resmi, dan bahasa formal.' },
    { title: 'Pidato dan Presentasi Singkat', desc: 'Struktur pidato: salam pembuka, isi, harapan, penutup.', intro: 'Berbicara di depan umum memerlukan artikulasi jelas dan struktur runtut.', keyPoint: 'Salam pembuka, penghormatan, penyampaian gagasan pokok, dan salam penutup.', exampleQ: 'Bagian apa yang berisi ringkasan inti pesan pembicara dalam pidato?', exampleAns: 'Bagian simpulan atau penutup pidato sebelum salam akhir.' },
    { title: 'Tata Kata dan Ejaan Bahasa Indonesia (EYD/PUEBI)', desc: 'Penulisan huruf kapital, tanda baca titik koma, dan kata baku.', intro: 'Penggunaan ejaan yang tepat menjamin kejelasan makna teks tulisan.', keyPoint: 'Huruf kapital dipakai sebagai huruf pertama awal kalimat dan nama diri.', exampleQ: 'Manakah penulisan kata baku yang benar antara "apotik" atau "apotek"?', exampleAns: 'Kata baku yang tepat menurut KBBI adalah "apotek".' },
  ];
  const sdBahasa: Subject = {
    id: 'sd-bindo',
    level: 'SD',
    name: 'Bahasa Indonesia SD',
    category: 'Bahasa & Literasi',
    description: 'Penguasaan literasi membaca, menulis, tata bahasa baku, dan apresiasi sastra Indonesia.',
    iconName: 'BookOpen',
    color: 'blue',
    chapters: generateEightChapters('sd-bindo', 'Bahasa Indonesia SD', sdBahasaTitles, sdMatematikaQuestions),
  };

  // 2. SMP Subjects
  const smpMatematikaTitles = [
    { title: 'Bilangan Berpangkat dan Bentuk Akar', desc: 'Sifat eksponen, perkalian dan pembagian pangkat, rasionalisasi akar.', intro: 'Bilangan berpangkat menyederhanakan penulisan bilangan yang sangat besar atau sangat kecil.', keyPoint: 'a^m × a^n = a^(m+n); (a^m)^n = a^(m×n); a^0 = 1.', exampleQ: 'Hitunglah nilai dari (2³)² : 2⁴.', exampleAns: '2^6 : 2^4 = 2^(6-4) = 2² = 4.' },
    { title: 'Pola Bilangan, Barisan dan Deret Aritmetika', desc: 'Menemukan rumus suku ke-n dan jumlah deret.', intro: 'Pola bilangan membantu memprediksi keteraturan suku-suku berikutnya.', keyPoint: 'Un = a + (n - 1)b; Sn = n/2 × (2a + (n - 1)b).', exampleQ: 'Diketahui barisan 3, 7, 11, 15... Tentukan suku ke-20.', exampleAns: 'a=3, b=4. U20 = 3 + (19)×4 = 3 + 76 = 79.' },
    { title: 'Persamaan dan Pertidaksamaan Linear Satu Variabel', desc: 'Penyelesaian aljabar dan himpunan penyelesaian.', intro: 'Menentukan nilai variabel x yang memenuhi persamaan linear.', keyPoint: 'Mengalikan/membagi kedua ruas pertidaksamaan dengan bilangan negatif membalik tanda.', exampleQ: 'Tentukan penyelesaian dari 3x - 5 = 16.', exampleAns: '3x = 21 -> x = 7.' },
    { title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)', desc: 'Metode eliminasi, substitusi, grafik, dan masalah kontekstual.', intro: 'Mencari pasangan (x, y) yang memenuhi dua persamaan linear serentak.', keyPoint: 'Metode campuran: eliminasi satu variabel, substitusi nilai ke persamaan awal.', exampleQ: 'Jika 2x + y = 9 dan x - y = 3, tentukan nilai x dan y.', exampleAns: 'Jumlahkan kedua persamaan: 3x = 12 -> x = 4. Maka y = 4 - 3 = 1. (4, 1).' },
    { title: 'Fungsi Kuadrat dan Grafiknya', desc: 'Bentuk umum y = ax² + bx + c, sumbu simetri, titik puncak.', intro: 'Grafik fungsi kuadrat membentuk parabola simetris.', keyPoint: 'Sumbu simetri: x = -b / (2a); Nilai optimum: y = -D / (4a).', exampleQ: 'Tentukan titik potong grafik y = x² - 4 dengan sumbu X.', exampleAns: 'Saat y = 0: x² - 4 = 0 -> (x-2)(x+2) = 0. Titik potongnya adalah (2, 0) dan (-2, 0).' },
    { title: 'Teorema Pythagoras dan Tripel Pythagoras', desc: 'Hubungan kuadrat sisi miring pada segitiga siku-siku.', intro: 'Teorema Pythagoras berlaku khusus pada segitiga yang memiliki sudut 90 derajat.', keyPoint: 'c² = a² + b² di mana c adalah sisi terpanjang (hipotenusa). Tripel dasar: 3, 4, 5.', exampleQ: 'Segitiga siku-siku memiliki alas 6 cm dan tinggi 8 cm. Berapa hipotenusanya?', exampleAns: 'c² = 6² + 8² = 36 + 64 = 100 -> c = 10 cm.' },
    { title: 'Bangun Ruang Sisi Lengkung', desc: 'Tabung, kerucut, dan bola: luas permukaan dan volume.', intro: 'Benda sisi lengkung banyak dijumpai pada kaleng, corong, dan bola olahraga.', keyPoint: 'Volume Tabung = πr²t; Volume Kerucut = 1/3 πr²t; Volume Bola = 4/3 πr³.', exampleQ: 'Hitung volume tabung dengan jari-jari 7 cm dan tinggi 10 cm.', exampleAns: 'V = (22/7) × 7 × 7 × 10 = 1.540 cm³.' },
    { title: 'Peluang dan Statistika Lanjutan', desc: 'Ruang sampel, titik sampel, frekuensi harapan, dan jangkauan kuartil.', intro: 'Teori peluang menghitung kemungkinan terjadinya suatu peristiwa acak.', keyPoint: 'P(A) = n(A) / n(S) di mana nilai 0 ≤ P(A) ≤ 1.', exampleQ: 'Peluang munculnya mata dadu prima pada pelemparan satu dadu adalah...', exampleAns: 'Titik prima = {2, 3, 5} -> n=3. Ruang sampel = 6. Peluang = 3/6 = 1/2.' },
  ];
  const smpMatematika: Subject = {
    id: 'smp-math',
    level: 'SMP',
    name: 'Matematika SMP',
    category: 'MIPA SMP',
    description: 'Aljabar, geometri analitik, pythagoras, fungsi kuadrat, dan peluang.',
    iconName: 'Percent',
    color: 'indigo',
    chapters: generateEightChapters('smp-math', 'Matematika SMP', smpMatematikaTitles, sdMatematikaQuestions),
  };

  const smpIpaTitles = [
    { title: 'Objek IPA dan Pengamatannya', desc: 'Besaran pokok, turunan, pengukuran jangka sorong & mikrometer sekrup.', intro: 'Sains diawali dengan observasi ilmiah dan pengukuran menggunakan instrumen baku.', keyPoint: '7 Besaran Pokok: Panjang, Massa, Waktu, Suhu, Kuat Arus, Jumlah Zat, Intensitas Cahaya.', exampleQ: 'Manakah yang termasuk besaran turunan?', exampleAns: 'Kecepatan, massa jenis, gaya, dan percepatan.' },
    { title: 'Klasifikasi Materi dan Perubahannya', desc: 'Unsur, senyawa, campuran homogen-heterogen, perubahan fisika dan kimia.', intro: 'Materi terbagi menjadi zat tunggal (unsur, senyawa) dan campuran.', keyPoint: 'Perubahan kimia menghasilkan zat baru, sedangkan perubahan fisika tidak.', exampleQ: 'Besi berkarat merupakan contoh perubahan apa?', exampleAns: 'Perubahan kimia karena terbentuk senyawa baru (besi oksida).' },
    { title: 'Suhu, Kalor, dan Pemuaian', desc: 'Konversi termometer Celcius, Reamur, Fahrenheit, Kelvin, dan asas Black.', intro: 'Kalor adalah energi panas yang berpindah dari suhu tinggi ke suhu rendah.', keyPoint: 'Q = m · c · ΔT; Asas Black: Q lepas = Q terima.', exampleQ: 'Berapa kalor yang dibutuhkan untuk memanaskan 2 kg air dari 20°C ke 70°C jika c=4200 J/kg°C?', exampleAns: 'Q = 2 × 4200 × (70 - 20) = 8400 × 50 = 420.000 Joule = 420 kJ.' },
    { title: 'Gerak Lurus dan Hukum Newton', desc: 'GLB, GLBB, Hukum I, II, dan III Newton tentang gerak.', intro: 'Hukum Newton merumuskan interaksi gaya dan percepatan benda.', keyPoint: 'Hukum II Newton: ΣF = m · a; Hukum III Newton: F aksi = -F reaksi.', exampleQ: 'Sebuah balok bermassa 5 kg ditarik gaya 20 N. Berapa percepatannya jika lantai licin?', exampleAns: 'a = F / m = 20 / 5 = 4 m/s².' },
    { title: 'Usaha, Energi, dan Daya', desc: 'Energi potensial gravitasi, energi kinetik, dan hukum kekekalan energi mekanik.', intro: 'Usaha terjadi jika gaya menghasilkan perpindahan pada benda.', keyPoint: 'W = F · s; Ek = 1/2 m v²; Ep = m g h; Em = Ek + Ep konstan.', exampleQ: 'Benda bermassa 2 kg berada di ketinggian 10 m (g=10 m/s²). Berapakah energi potensialnya?', exampleAns: 'Ep = 2 × 10 × 10 = 200 Joule.' },
    { title: 'Tekanan Zat Cair dan Hukum Archimedes', desc: 'Tekanan hidrostatis, hukum Pascal, hukum Archimedes (mengapung, melayang, tenggelam).', intro: 'Zat cair menekan ke segala arah sebanding dengan kedalaman cairan.', keyPoint: 'P hidrostatis = ρ · g · h; Fa = ρ fluida · V celup · g.', exampleQ: 'Mengapa kapal laut dari besi bisa mengapung di lautan luas?', exampleAns: 'Karena kapal memiliki rongga udara besar sehingga massa jenis rata-ratanya lebih kecil dari air.' },
    { title: 'Getaran, Gelombang, dan Bunyi', desc: 'Frekuensi, periode, cepat rambat gelombang, resonansi, dan USG.', intro: 'Gelombang merambatkan energi tanpa merambatkan medium partikel perantaranya.', keyPoint: 'v = λ · f; f = 1 / T. Bunyi memerlukan medium untuk merambat.', exampleQ: 'Sebuah gelombang memiliki panjang gelombang 2 m dan frekuensi 50 Hz. Hitung cepat rambatnya.', exampleAns: 'v = λ × f = 2 × 50 = 100 m/s.' },
    { title: 'Kelistrikan Dinamis & Sumber Energi Listrik', desc: 'Arus listrik, hukum Ohm, rangkaian seri-paralel, dan daya listrik rumah tangga.', intro: 'Arus listrik mengalir dari potensial tinggi ke potensial rendah dalam rangkaian tertutup.', keyPoint: 'Hukum Ohm: V = I · R; Daya: P = V · I.', exampleQ: 'Rangkaian memiliki tegangan 12 Volt dan hambatan 4 Ohm. Berapa kuat arus listriknya?', exampleAns: 'I = V / R = 12 / 4 = 3 Ampere.' },
  ];
  const smpIpa: Subject = {
    id: 'smp-ipa',
    level: 'SMP',
    name: 'IPA Terpadu SMP',
    category: 'MIPA SMP',
    description: 'Fisika, Biologi, dan Kimia terpadu untuk membangun cara berpikir saintifik.',
    iconName: 'Atom',
    color: 'cyan',
    chapters: generateEightChapters('smp-ipa', 'IPA Terpadu SMP', smpIpaTitles, sdMatematikaQuestions),
  };

  // 3. SMA Subjects
  const smaMatematikaTitles = [
    { title: 'Trigonometri Lanjutan & Sudut Berelasi', desc: 'Aturan sinus, cosinus, identitas trigonometri, dan rumus sudut rangkap.', intro: 'Trigonometri memetakan perbandingan sudut terhadap panjang sisi dalam segitiga dan lingkaran satuan.', keyPoint: 'sin²(x) + cos²(x) = 1; sin(2x) = 2 sin(x) cos(x).', exampleQ: 'Jika sin(A) = 3/5 pada sudut lancip, berapakah cos(2A)?', exampleAns: 'cos(2A) = 1 - 2 sin²(A) = 1 - 2(9/25) = 1 - 18/25 = 7/25.' },
    { title: 'Limit Fungsi Aljabar dan Trigonometri', desc: 'Metode faktorisasi, perkalian sekawan, dalil L’Hospital, limit tak hingga.', intro: 'Limit mendefinisikan nilai pendekatan suatu fungsi saat mendekati titik tertentu.', keyPoint: 'lim (x->0) [sin(x) / x] = 1; Bentuk tak tentu 0/0 diselesaikan via faktorisasi.', exampleQ: 'Hitunglah limit x mendekati 2 dari (x² - 4) / (x - 2).', exampleAns: 'Faktorkan: (x - 2)(x + 2) / (x - 2) = x + 2. Substitusi x=2 -> 2 + 2 = 4.' },
    { title: 'Turunan Fungsi (Diferensial) & Aplikasi', desc: 'Aturan rantai, persamaan garis singgung, titik stasioner, nilai maksimum/minimum.', intro: 'Turunan merepresentasikan laju perubahan sesaat suatu fungsi.', keyPoint: 'f(x) = a x^n -> f\'(x) = a n x^(n-1). Titik stasioner terjadi saat f\'(x) = 0.', exampleQ: 'Tentukan turunan pertama dari f(x) = 3x³ - 5x² + 7.', exampleAns: 'f\'(x) = 9x² - 10x.' },
    { title: 'Integral Tak Tentu & Integral Tentu', desc: 'Anti-turunan, metode substitusi, integral parsial, dan luas daerah di bawah kurva.', intro: 'Integral merupakan invers dari diferensial yang digunakan untuk menghitung akumulasi total atau luas.', keyPoint: '∫ x^n dx = (1 / (n+1)) x^(n+1) + C untuk n ≠ -1.', exampleQ: 'Hitung integral dari (4x³ + 6x) dx.', exampleAns: '4/4 x⁴ + 6/2 x² + C = x⁴ + 3x² + C.' },
    { title: 'Matriks dan Determinan', desc: 'Operasi matriks, invers matriks ordo 2x2 dan 3x3, penyelesaian SPLDV via matriks.', intro: 'Matriks menyusun susunan bilangan dalam baris dan kolom untuk kalkulasi multivariabel.', keyPoint: 'Determinan matriks [a b; c d] adalah ad - bc. Invers = (1/det) · [d -b; -c a].', exampleQ: 'Hitung determinan matriks A = [[4, 2], [3, 5]].', exampleAns: 'det(A) = (4 × 5) - (2 × 3) = 20 - 6 = 14.' },
    { title: 'Vektor pada Ruang Dimensi Dua dan Tiga', desc: 'Panjang vektor, hasil kali titik (dot product), sudut antar dua vektor, proyeksi vektor.', intro: 'Vektor adalah besaran yang memiliki nilai dan arah tertentu di ruang geometris.', keyPoint: 'u · v = |u| |v| cos(θ) = u1 v1 + u2 v2 + u3 v3.', exampleQ: 'Tentukan hasil kali titik vektor u = (2, 3) dan v = (4, -1).', exampleAns: 'u · v = (2 × 4) + (3 × -1) = 8 - 3 = 5.' },
    { title: 'Geometri Dimensi Tiga (Bangun Ruang)', desc: 'Jarak titik ke garis, jarak titik ke bidang, sudut antar garis dan bidang pada kubus.', intro: 'Analisis spasial memerlukan ketajaman proyeksi ortogonal pada bangun ruang.', keyPoint: 'Gunakan proyeksi tegak lurus dan rumus Pythagoras untuk jarak terpendek.', exampleQ: 'Pada kubus ABCD.EFGH dengan rusuk 6 cm, berapa panjang diagonal ruang AG?', exampleAns: 'Diagonal ruang kubus = r√3 = 6√3 cm.' },
    { title: 'Statistika Inferensial dan Peluang Binomial', desc: 'Distribusi normal, uji hipotesis dasar, kombinasi binomial, dan z-score.', intro: 'Peluang binomial memodelkan percobaan dengan dua kemungkinan hasil: sukses atau gagal.', keyPoint: 'P(X = k) = C(n, k) · p^k · (1 - p)^(n-k).', exampleQ: 'Sebuah koin dilempar 4 kali. Berapa peluang muncul tepat 2 kali sisi gambar?', exampleAns: 'C(4, 2) × (1/2)² × (1/2)² = 6 × 1/16 = 6/16 = 3/8.' },
  ];
  const smaMatematika: Subject = {
    id: 'sma-math',
    level: 'SMA',
    name: 'Matematika Peminatan SMA',
    category: 'MIPA SMA',
    description: 'Kalkulus, trigonometri tingkat lanjut, aljabar linear, dan dimensi tiga untuk persiapan UTBK.',
    iconName: 'Code',
    color: 'violet',
    chapters: generateEightChapters('sma-math', 'Matematika Peminatan SMA', smaMatematikaTitles, sdMatematikaQuestions),
  };

  const smaFisikaTitles = [
    { title: 'Kinematika Gerak Lurus & Parabola', desc: 'Vektor posisi, kecepatan, percepatan, dan lintasan peluru.', intro: 'Kinematika mempelajari gerak benda tanpa meninjau penyebab terjadinya gerak tersebut.', keyPoint: 'Gerak parabola merupakan perpaduan GLB pada sumbu X dan GLBB pada sumbu Y.', exampleQ: 'Peluru ditembakkan dengan kecepatan awal 50 m/s sudut 30°. Berapa kecepatan horizontalnya?', exampleAns: 'vx = v0 cos(30°) = 50 × (√3/2) = 25√3 m/s.' },
    { title: 'Hukum Gravitasi Newton dan Hukum Kepler', desc: 'Gaya tarik gravitasi universal, percepatan gravitasi planet, orbit satelit.', intro: 'Gaya gravitasi bekerja antara dua massa di alam semesta secara timbal balik.', keyPoint: 'F = G · (m1 · m2) / r²; Periode orbit T² sebanding dengan r³.', exampleQ: 'Jika jarak dua benda dijadikan 2 kali semula, gaya gravitasi menjadi berapa kali?', exampleAns: 'F berbanding terbalik dengan r², sehingga menjadi 1/2² = 1/4 kali semula.' },
    { title: 'Fluida Dinamis dan Hukum Bernoulli', desc: 'Debit kontinuitas, persamaan Bernoulli, venturimeter, dan gaya angkat pesawat.', intro: 'Fluida ideal mengalir tanpa gesekan viskositas dan tak termampatkan.', keyPoint: 'A1 v1 = A2 v2; P1 + 1/2 ρ v1² + ρ g h1 = P2 + 1/2 ρ v2² + ρ g h2.', exampleQ: 'Pipa menyempit dari diameter 4 cm menjadi 2 cm. Berapa perbandingan kecepatannya?', exampleAns: 'Luas berbanding kuadrat diameter. Luas berkurang 4x, maka kecepatan naik 4x.' },
    { title: 'Termodinamika & Mesin Carnot', desc: 'Hukum ke-0, 1, 2 Termodinamika, proses isobarik, isotermal, adiabatik, efisiensi Carnot.', intro: 'Termodinamika mengkaji konversi energi kalor menjadi kerja mekanik.', keyPoint: 'Efisiensi Carnot: η = (1 - T_rendah / T_tinggi) × 100%. Suhu mutlak dalam Kelvin.', exampleQ: 'Mesin Carnot bekerja antara 600 K dan 300 K. Hitung efisiensi mesin tersebut.', exampleAns: 'η = (1 - 300/600) × 100% = (1 - 0,5) × 100% = 50%.' },
    { title: 'Gelombang Mekanik & Gelombang Bunyi', desc: 'Efek Doppler, intensitas dan taraf intensitas bunyi (dB), pipa organa terbuka/tertutup.', intro: 'Efek Doppler menjelaskan perubahan frekuensi bunyi akibat gerak relatif sumber dan pendengar.', keyPoint: 'TI = 10 log(I / I0) dB; fp = fs · (v ± vp) / (v ± vs).', exampleQ: 'Jika intensitas bunyi naik 100 kali lipat, berapa kenaikan taraf intensitasnya?', exampleAns: 'Kenaikan = 10 log(100) = 10 × 2 = 20 dB.' },
    { title: 'Optika Fisis (Interferensi, Difraksi, Polarisasi)', desc: 'Percobaan celah ganda Young, kisi difraksi, hukum Brewster polarisasi cahaya.', intro: 'Cahaya memiliki sifat gelombang yang dapat berinterferensi dan terdifraksi.', keyPoint: 'd sin(θ) = n λ untuk pola terang interferensi celah ganda.', exampleQ: 'Apa yang membuktikan bahwa cahaya merambat sebagai gelombang transversal?', exampleAns: 'Peristiwa polarisasi cahaya hanya dapat dialami gelombang transversal.' },
    { title: 'Listrik Statis dan Medan Magnet (Lorentz)', desc: 'Hukum Coulomb, hukum Gauss, gaya Lorentz, hukum Biot-Savart, kawat berarus.', intro: 'Muatan diam menimbulkan medan listrik; muatan bergerak menimbulkan medan magnet.', keyPoint: 'F Lorentz = B · I · L · sin(θ); F Coulomb = k · q1 · q2 / r².', exampleQ: 'Kawat 2 meter dialiri arus 3 A tegak lurus medan magnet 0,5 T. Hitung gaya Lorentz.', exampleAns: 'F = 0,5 × 3 × 2 × sin(90°) = 3 Newton.' },
    { title: 'Fisika Modern & Relativitas Khusus', desc: 'Postulat Einstein, dilatasi waktu, kontraksi panjang, efek fotolistrik Planck.', intro: 'Kecepatan cahaya c adalah konstan mutlak dalam semua kerangka inersia.', keyPoint: 'E = h · f; E = m c²; Waktu pengamat bergerak memanjang: Δt = γ · Δt0.', exampleQ: 'Efek fotolistrik membuktikan bahwa cahaya memiliki sifat sebagai apa?', exampleAns: 'Cahaya merambat dalam paket-paket energi diskrit (kuantum partikel/foton).' },
  ];
  const smaFisika: Subject = {
    id: 'sma-fisika',
    level: 'SMA',
    name: 'Fisika SMA',
    category: 'MIPA SMA',
    description: 'Mekanika klasik, gelombang, termodinamika, elektromagnetisme, dan fisika modern.',
    iconName: 'Activity',
    color: 'rose',
    chapters: generateEightChapters('sma-fisika', 'Fisika SMA', smaFisikaTitles, sdMatematikaQuestions),
  };

  // 4. SMK Subjects
  const smkRplTitles = [
    { title: 'Pemrograman Web Frontend Modern', desc: 'Struktur HTML5 semantik, CSS Grid & Flexbox, manipulasi DOM JavaScript.', intro: 'Frontend berfokus pada visual interaktif dan pengalaman pengguna pada peramban web.', keyPoint: 'Gunakan layout semantik dan responsive design untuk kenyamanan mobile & desktop.', exampleQ: 'Apa fungsi atribut "alt" pada tag img HTML?', exampleAns: 'Menyediakan teks deskriptif jika gambar gagal dimuat dan membantu pembaca layar (aksesibilitas).' },
    { title: 'Algoritma & Pemrograman Berorientasi Objek (OOP)', desc: 'Class, Object, Inheritance, Polymorphism, Encapsulation, Abstraction.', intro: 'OOP memodelkan entitas dunia nyata ke dalam kode yang terstruktur dan dapat digunakan kembali.', keyPoint: 'Enkapsulasi menyembunyikan data internal dan membatasi akses melalui getter/setter.', exampleQ: 'Prinsip OOP mana yang memungkinkan satu interface memiliki banyak implementasi berbeda?', exampleAns: 'Polimorfisme (Polymorphism).' },
    { title: 'Desain dan Perancangan Basis Data Relasional', desc: 'Normalisasi 1NF, 2NF, 3NF, ERD (Entity Relationship Diagram), DDL & DML SQL.', intro: 'Basis data terstruktur mencegah redundansi data dan menjamin integritas referensial.', keyPoint: 'Primary Key menjamin keunikan record, Foreign Key menghubungkan relasi antar tabel.', exampleQ: 'Perintah SQL manakah yang digunakan untuk mengubah struktur tabel?', exampleAns: 'ALTER TABLE.' },
    { title: 'Pengembangan Backend API RESTful', desc: 'HTTP methods (GET, POST, PUT, DELETE), JSON format, routing, middleware.', intro: 'Backend API melayani logika bisnis dan pertukaran data antara server dan klien.', keyPoint: 'Status code 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Internal Server Error).', exampleQ: 'HTTP status code manakah yang menandakan data berhasil dibuat baru di server?', exampleAns: 'HTTP 201 Created.' },
    { title: 'Version Control System dengan Git & GitHub', desc: 'Branching, commit, merge, rebase, resolve conflict, pull request kolaborasi.', intro: 'Git mencatat setiap histori perubahan kode dan memfasilitasi kerja tim profesional.', keyPoint: 'git commit -m untuk menyimpan checkpoint; git pull untuk menyinkronkan repositori lokal.', exampleQ: 'Perintah apa yang digunakan untuk membuat dan berpindah ke branch baru sekaligus?', exampleAns: 'git checkout -b <nama-branch> atau git switch -c <nama-branch>.' },
    { title: 'Keamanan Aplikasi Web & Otentikasi', desc: 'Hashing kata sandi (bcrypt), JWT (JSON Web Token), proteksi SQL Injection, XSS, CSRF.', intro: 'Keamanan wajib diterapkan pada setiap layer aplikasi untuk melindungi data privasi pengguna.', keyPoint: 'Gunakan prepared statements untuk menangkis celah SQL Injection.', exampleQ: 'Mengapa password pengguna tidak boleh disimpan dalam bentuk teks biasa (plain text)?', exampleAns: 'Karena rentan bocor saat database diretas; harus di-hash secara satu arah dengan salt.' },
    { title: 'Testing & Debugging Perangkat Lunak', desc: 'Unit testing, integration testing, automated test framework, test-driven development (TDD).', intro: 'Pengujian otomatis memvalidasi kebenaran logika kode sebelum dirilis ke lingkungan produksi.', keyPoint: 'Pola TDD: Red (buat test gagal) -> Green (buat kode lulus) -> Refactor (optimalkan).', exampleQ: 'Apa keuntungan utama dari penulisan unit testing yang menyeluruh?', exampleAns: 'Mendeteksi bug sejak dini dan mencegah regresi saat kode diperbarui di masa depan.' },
    { title: 'Deployment & Cloud Infrastructure', desc: 'Container Docker, CI/CD pipeline, reverse proxy Nginx, cloud hosting PaaS.', intro: 'Deployment menghantarkan aplikasi dari lingkungan lokal pengembang ke server pengguna publik.', keyPoint: 'Docker memaketkan aplikasi beserta dependensinya agar berjalan konsisten di mana saja.', exampleQ: 'Apa keunggulan kontainerisasi Docker dibanding virtual machine tradisional?', exampleAns: 'Lebih ringan dan cepat booting karena berbagi kernel OS yang sama dengan host.' },
  ];
  const smkRpl: Subject = {
    id: 'smk-rpl',
    level: 'SMK',
    name: 'Rekayasa Perangkat Lunak (RPL)',
    category: 'Keahlian Vokasi IT',
    description: 'Frontend, OOP, SQL, REST API, Git, Cybersecurity dasar, dan deployment cloud.',
    iconName: 'Laptop',
    color: 'amber',
    chapters: generateEightChapters('smk-rpl', 'Rekayasa Perangkat Lunak (RPL)', smkRplTitles, sdMatematikaQuestions),
  };

  // 5. Kuliah / Perguruan Tinggi Subjects
  const kuliahAlgoTitles = [
    { title: 'Analisis Kompleksitas Algoritma (Big O Notation)', desc: 'Asymptotic analysis, time & space complexity, best/worst/average case scenario.', intro: 'Efisiensi algoritma diukur secara independen dari perangkat keras melalui notasi asimtotik.', keyPoint: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n).', exampleQ: 'Berapakah time complexity dari binary search pada array terurut berukuran n?', exampleAns: 'O(log n) karena ruang pencarian dibagi dua pada setiap langkah iterasi.' },
    { title: 'Struktur Data Linier (Linked List, Stack, Queue)', desc: 'Singly/doubly linked list, LIFO stack, FIFO queue, circular buffer.', intro: 'Struktur data linier menyusun elemen secara berurutan dalam memori komputer.', keyPoint: 'Operasi push & pop pada Stack beroperasi dalam waktu konstan O(1).', exampleQ: 'Aplikasi nyata apa yang paling umum menggunakan prinsip LIFO pada Stack?', exampleAns: 'Fitur Undo/Redo pada text editor dan Call Stack eksekusi fungsi pemrograman.' },
    { title: 'Pohon dan Graf (Trees & Graph Representations)', desc: 'Binary Search Tree (BST), AVL Tree, Graph Adjacency Matrix & List, DFS, BFS.', intro: 'Struktur data non-linier memodelkan hubungan hierarkis dan jaringan kompleks.', keyPoint: 'DFS menggunakan tumpukan (stack); BFS menggunakan antrean (queue) untuk penelusuran.', exampleQ: 'Manakah penelusuran graf yang menjamin rute terpendek pada graf tak berbobot?', exampleAns: 'Breadth-First Search (BFS).' },
    { title: 'Algoritma Pengurutan Efisien (Divide & Conquer)', desc: 'Merge Sort, Quick Sort, Heap Sort, serta analisis kestabilan sorting.', intro: 'Teknik divide and conquer memecah permasalahan menjadi sub-masalah independen yang lebih kecil.', keyPoint: 'Merge Sort selalu menjamin O(n log n) pada worst-case dan bersifat stabil.', exampleQ: 'Mengapa Merge Sort memerlukan memori tambahan dibanding Quick Sort in-place?', exampleAns: 'Karena memerlukan array sementara untuk menggabungkan sub-array terurut.' },
    { title: 'Algoritma Greedy & Dynamic Programming (DP)', desc: 'Optimal substructure, overlapping subproblems, knapsack problem, shortest path Dijkstra.', intro: 'Dynamic programming menyimpan hasil komputasi sebelumnya (memoization/tabulation) untuk menghindari perhitungan ulang.', keyPoint: 'Prinsip optimalitas Bellman: solusi optimal global dibangun dari solusi optimal lokal.', exampleQ: 'Apa syarat utama agar suatu masalah optimasi dapat diselesaikan dengan Dynamic Programming?', exampleAns: 'Masalah harus memiliki Overlapping Subproblems dan Optimal Substructure.' },
    { title: 'Hashing & Tabel Hash (Hash Tables & Collision Resolution)', desc: 'Hash functions, chaining, open addressing (linear probing, quadratic probing), load factor.', intro: 'Hash table memungkinkan pencarian, penyisipan, dan penghapusan data dengan ekspektasi waktu O(1).', keyPoint: 'Load factor α = n / k menentukan kapan tabel perlu di-rehash untuk mempertahankan performa.', exampleQ: 'Apa yang terjadi jika terjadi tabrakan hash (hash collision)?', exampleAns: 'Dua kunci berbeda dipetakan ke indeks yang sama, diselesaikan via separate chaining atau open addressing.' },
    { title: 'String Matching & Pengenalan Kriptografi', desc: 'KMP (Knuth-Morris-Pratt), Rabin-Karp, hash kriptografis SHA, RSA asimetris.', intro: 'Pencarian pola teks dan enkripsi data menjaga integritas informasi digital.', keyPoint: 'KMP memanfaatkan tabel preprocessing prefix-suffix untuk menghindari backtracking indeks.', exampleQ: 'Mengapa algoritma KMP lebih cepat dari pencarian string naif (brute-force)?', exampleAns: 'KMP tidak mengulang pengecekan karakter yang sudah cocok sebelumnya.' },
    { title: 'Komputabilitas, NP-Completeness & Rekayasa Lanjut', desc: 'P vs NP problem, Turing Machine konsep, reduksi polinom, traveling salesperson problem (TSP).', intro: 'Teori komputasi mendefinisikan batas fundamental apa yang dapat dipecahkan oleh komputer.', keyPoint: 'Masalah NP-Complete belum diketahui apakah memiliki algoritma polinomial O(n^k).', exampleQ: 'Apa arti bahwa suatu masalah berada dalam kelas NP?', exampleAns: 'Solusi masalah tersebut dapat diverifikasi kebenarannya dalam waktu polinomial.' },
  ];
  const kuliahAlgo: Subject = {
    id: 'kuliah-algo',
    level: 'Kuliah',
    name: 'Algoritma & Struktur Data',
    category: 'Mata Kuliah Inti Informatika',
    description: 'Analisis kompleksitas, struktur data lanjut, Dynamic Programming, dan teori graf.',
    iconName: 'Cpu',
    color: 'indigo',
    faculty: 'Fakultas Ilmu Komputer & Teknologi Informasi',
    major: 'Teknik Informatika & Sains Data',
    semester: 3,
    chapters: generateEightChapters('kuliah-algo', 'Algoritma & Struktur Data', kuliahAlgoTitles, sdMatematikaQuestions),
  };

  const kuliahDbTitles = [
    { title: 'Arsitektur Sistem Manajemen Basis Data (DBMS)', desc: 'Three-schema architecture, data independence, storage engine, buffer pool.', intro: 'DBMS mengelola penyimpanan data besar secara persisten, konkuren, dan aman.', keyPoint: 'Pemisahan skema internal, konseptual, dan eksternal menjamin independensi data.', exampleQ: 'Apa keuntungan dari data independence dalam sistem basis data?', exampleAns: 'Perubahan pada skema fisik tidak mempengaruhi aplikasi tingkat pengguna/eksternal.' },
    { title: 'Relational Calculus & Aljabar Relasional', desc: 'Selection, projection, Cartesian product, join, set operations.', intro: 'Aljabar relasional merupakan dasar teoretis formal dari bahasa kueri SQL modern.', keyPoint: 'Operasi Join menggabungkan tupel dari dua relasi berdasarkan kondisi kesamaan predikat.', exampleQ: 'Simbol aljabar relasional apa yang digunakan untuk operasi proyeksi (memilih kolom)?', exampleAns: 'Simbol Pi (π).' },
    { title: 'Kueri SQL Tingkat Lanjut & Subquery', desc: 'Correlated subquery, Window Functions (ROW_NUMBER, RANK), Common Table Expressions (CTE).', intro: 'Kueri analitis tingkat lanjut mengekstrak wawasan data agregat yang bernilai tinggi.', keyPoint: 'CTE (WITH ...) meningkatkan keterbacaan kueri yang kompleks dan bertingkat.', exampleQ: 'Apa perbedaan mendasar antara RANK() dan DENSE_RANK()?', exampleAns: 'RANK() melompati nomor peringkat setelah angka kembar, sedangkan DENSE_RANK() tidak melompat.' },
    { title: 'Transaksi, Konkurensi & Properti ACID', desc: 'Atomicity, Consistency, Isolation, Durability, Two-Phase Locking, isolation levels.', intro: 'ACID menjamin keabsahan transaksi perbankan dan e-commerce di bawah beban kerja konkurensi tinggi.', keyPoint: 'Serializability adalah tingkat isolasi tertinggi yang mencegah phantom reads.', exampleQ: 'Apa yang dimaksud dengan properti Atomicity dalam transaksi?', exampleAns: 'Seluruh operasi dalam transaksi harus berhasil semua atau dibatalkan seutuhnya (all-or-nothing).' },
    { title: 'Indexing & Optimasi Kueri (B+ Tree & Hash)', desc: 'B+ Tree index, clustered vs non-clustered, EXPLAIN query execution plan, cost-based optimizer.', intro: 'Indeks mempercepat pencarian record dari pembacaan sekuensial penuh (table scan) ke traversal logaritmik.', keyPoint: 'B+ Tree menyimpan seluruh data pada daun (leaf nodes) yang saling terhubung secara berurutan.', exampleQ: 'Mengapa B+ Tree sangat populer sebagai struktur indeks penyimpanan disk?', exampleAns: 'Karena memiliki fan-out tinggi yang meminimalkan operasi I/O disk dan mendukung kueri rentang (range query).' },
    { title: 'Normalisasi Tingkat Lanjut (BCNF & 4NF)', desc: 'Functional dependency, Boyce-Codd Normal Form, multivalued dependency, 4NF.', intro: 'Normalisasi tingkat lanjut menghilangkan anomali insersi, update, dan delete yang tersisa.', keyPoint: 'Relasi memenuhi BCNF jika untuk setiap ketergantungan fungsional X -> Y, X adalah Super Key.', exampleQ: 'Kapan suatu tabel berada dalam bentuk normal Boyce-Codd (BCNF)?', exampleAns: 'Jika setiap determinan fungsional non-trivial merupakan calon kunci (super key).' },
    { title: 'NoSQL & Arsitektur Data Terdistribusi (CAP Theorem)', desc: 'Document store, Key-Value, Column-family, Graph DB, Konsistensi Eventual, Teorema CAP.', intro: 'Sistem NoSQL mengakomodasi throughput skala masif dengan fleksibilitas skema dinamis.', keyPoint: 'Teorema CAP: Sistem terdistribusi hanya dapat menjamin 2 dari 3 sifat (Consistency, Availability, Partition Tolerance).', exampleQ: 'Menurut teorema CAP, jika terjadi network partition, pilihan apa yang harus diambil arsitek sistem?', exampleAns: 'Memilih antara memprioritaskan konsistensi data (Consistency) atau ketersediaan respons (Availability).' },
    { title: 'Data Warehousing & Pemodelan Dimensional (OLAP)', desc: 'Star schema, Snowflake schema, ETL pipeline, Fact & Dimension tables, Data Lake.', intro: 'Sistem OLAP dioptimalkan untuk kueri agregasi historis guna mendukung keputusan eksekutif.', keyPoint: 'Fact table mencatat metrik kuantitatif terukur; Dimension table menyediakan konteks analisis.', exampleQ: 'Apa perbedaan utama antara sistem OLTP dan OLAP?', exampleAns: 'OLTP menangani transaksi cepat operasional sehari-hari; OLAP menangani analisis kueri analitik historis berskala besar.' },
  ];
  const kuliahDb: Subject = {
    id: 'kuliah-db',
    level: 'Kuliah',
    name: 'Sistem Basis Data Lanjut',
    category: 'Mata Kuliah Inti Informatika',
    description: 'Arsitektur DBMS, transaksi ACID, indexing B+ Tree, NoSQL, dan Data Warehousing.',
    iconName: 'Database',
    color: 'emerald',
    faculty: 'Fakultas Ilmu Komputer & Teknologi Informasi',
    major: 'Teknik Informatika & Sistem Informasi',
    semester: 4,
    chapters: generateEightChapters('kuliah-db', 'Sistem Basis Data Lanjut', kuliahDbTitles, sdMatematikaQuestions),
  };

  return [sdMatematika, sdIpa, sdBahasa, smpMatematika, smpIpa, smaMatematika, smaFisika, smkRpl, kuliahAlgo, kuliahDb];
}

// Available default badges for rewards
export const INITIAL_BADGES = [
  {
    id: 'badge-starter',
    title: 'Langkah Pertama',
    description: 'Menyelesaikan bab pembelajaran pertama dengan nilai minimal 80%.',
    icon: 'Award',
    category: 'score' as const,
    isUnlocked: true,
    unlockedAt: '2026-09-21',
  },
  {
    id: 'badge-accuracy',
    title: 'Presisi Sempurna',
    description: 'Menjawab seluruh soal latihan dalam satu bab dengan akurasi 100%.',
    icon: 'Target',
    category: 'score' as const,
    isUnlocked: false,
  },
  {
    id: 'badge-survivor',
    title: 'Pantang Menyerah',
    description: 'Menuntaskan evaluasi sulit dan berhasil mempertahankan nyawa.',
    icon: 'ShieldCheck',
    category: 'perseverance' as const,
    isUnlocked: false,
  },
  {
    id: 'badge-streak',
    title: 'Konsistensi Belajar',
    description: 'Belajar secara teratur selama 3 hari berturut-turut.',
    icon: 'Flame',
    category: 'streak' as const,
    isUnlocked: true,
    unlockedAt: '2026-09-20',
  },
  {
    id: 'badge-grandmaster',
    title: 'Mahir Paripurna',
    description: 'Menyelesaikan seluruh 8 bab mata pelajaran dengan nilai minimal 80%.',
    icon: 'Crown',
    category: 'mastery' as const,
    isUnlocked: false,
  },
];

// Leaderboard users
export const MOCK_LEADERBOARD = [
  {
    id: 'lb-1',
    name: 'Nadia Salsabila',
    school: 'SMA Negeri 1 Yogyakarta',
    educationLevel: 'SMA' as EducationLevel,
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    points: 3850,
    progressPercent: 98,
    chaptersCompleted: 16,
  },
  {
    id: 'lb-2',
    name: 'Ahmad Fauzi',
    school: 'Institut Teknologi Bandung',
    educationLevel: 'Kuliah' as EducationLevel,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    points: 3620,
    progressPercent: 94,
    chaptersCompleted: 15,
  },
  {
    id: 'lb-3',
    name: 'Kezia Putri',
    school: 'SMP Negeri 5 Surabaya',
    educationLevel: 'SMP' as EducationLevel,
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    points: 3410,
    progressPercent: 91,
    chaptersCompleted: 14,
  },
  {
    id: 'lb-4',
    name: 'Rian Pratama',
    school: 'SMK Telkom Malang',
    educationLevel: 'SMK' as EducationLevel,
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    points: 3190,
    progressPercent: 88,
    chaptersCompleted: 13,
  },
  {
    id: 'lb-5',
    name: 'Daffa Al-Ghifari',
    school: 'SD Islam Al-Azhar',
    educationLevel: 'SD' as EducationLevel,
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    points: 2950,
    progressPercent: 82,
    chaptersCompleted: 12,
  },
];
