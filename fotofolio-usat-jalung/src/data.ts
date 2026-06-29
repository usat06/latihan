import { Skill, Certificate, Activity, PersonalPhoto, GuestbookEntry } from './types';

export const DEVELOPER_PROFILE = {
  name: "Alif Dewantara",
  title: "Informatics Engineering Student",
  specialization: "Full-Stack Web Developer & AI Enthusiast",
  university: "Universitas Negeri Informatika",
  bio: "Mahasiswa Teknik Informatika semester 6 yang menyukai pengembangan sistem berbasis web, kecerdasan buatan, dan seni fotografi. Memiliki dedikasi tinggi dalam menulis kode yang bersih, efisien, serta senang berkolaborasi dalam proyek inovatif.",
  email: "alif.dewantara@student.uni.ac.id",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  avatar: "https://drive.google.com/file/d/1FsC4u0FJS_Pppgl3kNO_5vZXIjnmo--G/view?usp=drivesdk", // Sleek portrait
  heroBackground: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=1920",
  stats: [
    { label: "IPK Kumulatif", value: "3.88" },
    { label: "Proyek Selesai", value: "18+" },
    { label: "Sertifikasi", value: "8" },
    { label: "Jam Ngoding", value: "2400+" }
  ]
};

export const SKILLS_DATA: Skill[] = [
  // Frontend
  {
    id: "s-1",
    name: "React.js & Next.js",
    level: 90,
    category: "Frontend",
    iconName: "Code2",
    description: "Pengembangan single-page application dan server-side rendering dengan performa optimal."
  },
  {
    id: "s-2",
    name: "TypeScript",
    level: 85,
    category: "Frontend",
    iconName: "ShieldAlert",
    description: "Penulisan kode JavaScript berskala besar dengan tipe data statis yang aman dan minim bug."
  },
  {
    id: "s-3",
    name: "Tailwind CSS",
    level: 95,
    category: "Frontend",
    iconName: "Paintbrush",
    description: "Pembuatan antarmuka responsif, modern, dan pixel-perfect menggunakan utilitas kelas utility-first."
  },
  // Backend
  {
    id: "s-4",
    name: "Node.js & Express",
    level: 80,
    category: "Backend",
    iconName: "Server",
    description: "Pembuatan API RESTful berskala tinggi, middleware keamanan, dan manajemen basis data."
  },
  {
    id: "s-5",
    name: "PostgreSQL & Prisma ORM",
    level: 78,
    category: "Backend",
    iconName: "Database",
    description: "Desain skema database relasional, kueri optimal, dan migrasi struktur data teratur."
  },
  // Tools & DevOps
  {
    id: "s-6",
    name: "Git & GitHub",
    level: 88,
    category: "Tools & DevOps",
    iconName: "GitBranch",
    description: "Manajemen repositori tim, branching workflows (Git Flow), dan integrasi continuous integration (CI/CD)."
  },
  {
    id: "s-7",
    name: "Docker & Containerization",
    level: 75,
    category: "Tools & DevOps",
    iconName: "Box",
    description: "Pembuatan container aplikasi mandiri untuk memastikan konsistensi deployment di server lokal maupun cloud."
  },
  // Sedang Dipelajari (Things currently being learned)
  {
    id: "s-8",
    name: "Machine Learning (TensorFlow & Python)",
    level: 60,
    category: "Sedang Dipelajari",
    iconName: "BrainCircuit",
    description: "Mempelajari algoritma regresi, klasifikasi citra medis, dan pemrosesan bahasa alami (NLP)."
  },
  {
    id: "s-9",
    name: "Cloud Computing (Google Cloud Platform)",
    level: 55,
    category: "Sedang Dipelajari",
    iconName: "Cloud",
    description: "Eksplorasi layanan Cloud Run, Cloud SQL, App Engine, dan otomatisasi infrastruktur awan."
  },
  {
    id: "s-10",
    name: "Go (Golang)",
    level: 45,
    category: "Sedang Dipelajari",
    iconName: "Terminal",
    description: "Mendalami arsitektur microservices berkinerja tinggi, concurrency, dan saluran goroutines."
  }
];

export const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "cert-1",
    title: "Menjadi Front-End Web Developer Expert",
    issuer: "Dicoding Indonesia",
    date: "2025-11-20",
    credentialId: "DSC-882190-FRONTEND",
    credentialUrl: "https://dicoding.com",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", // Laptop showing code
    skillsLearned: ["Web Performance Optimization", "PWA (Progressive Web Apps)", "Automation Testing (Cypress, Jasmine)", "Clean Code"]
  },
  {
    id: "cert-2",
    title: "Google Cloud Computing Foundations",
    issuer: "Google Cloud & Partner",
    date: "2025-08-15",
    credentialId: "GCP-CF-908122-ALIF",
    credentialUrl: "https://cloud.google.com",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800", // Modern server room
    skillsLearned: ["Cloud Infrastructure", "Kubernetes Engine (GKE)", "Identity Access Management (IAM)", "Data Analytics Foundations"]
  },
  {
    id: "cert-3",
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI via Coursera",
    date: "2026-02-10",
    credentialId: "COURSERA-ML-DEEP-31",
    credentialUrl: "https://coursera.org",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800", // Artificial Intelligence artwork
    skillsLearned: ["Supervised Learning", "Neural Networks", "Unsupervised Learning", "Recommender Systems", "Anomaly Detection"]
  },
  {
    id: "cert-4",
    title: "Architecting on AWS (Associate)",
    issuer: "Amazon Web Services (AWS)",
    date: "2025-05-02",
    credentialId: "AWS-ASA-992120-N",
    credentialUrl: "https://aws.amazon.com",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", // Deep blue cloud fiber lights
    skillsLearned: ["High Availability Systems", "VPC & Security Groups", "Amazon EC2 & S3", "Auto Scaling Group"]
  }
];

export const ACTIVITIES_DATA: Activity[] = [
  {
    id: "act-1",
    title: "Juara 2 Hackathon Smart City Nasional",
    date: "2025-10-18",
    location: "Gedung Edukasi Utama & Balai Kota",
    description: "Bersama tim beranggotakan 3 orang, kami mengembangkan prototipe aplikasi 'Lapor-Pak!', sebuah platform IoT pendeteksi sampah otomatis di sungai perkotaan menggunakan sensor ultrasonik dan pemrosesan citra AI.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800", // Tech Hackathon/Teamwork
    tags: ["Hackathon", "IoT", "AI Image Classification", "React Native"]
  },
  {
    id: "act-2",
    title: "Lead Google Developer Student Clubs (GDSC)",
    date: "2025-09-01",
    location: "Fakultas Ilmu Komputer, Universitas",
    description: "Terpilih sebagai Lead GDSC di tingkat kampus untuk memimpin komunitas belajar pengembangan teknologi. Kami mengorganisasi workshop mingguan, boot camp pemrograman intensif, dan sesi berbagi industri teknologi yang dihadiri oleh lebih dari 500 mahasiswa.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800", // Presentation / Seminar
    tags: ["Kepemimpinan", "Komunitas", "Workshop", "Developer Student Clubs"]
  },
  {
    id: "act-3",
    title: "Asisten Laboratorium Rekayasa Perangkat Lunak",
    date: "2025-02-15",
    location: "Laboratorium Komputer Lantai 3",
    description: "Bertanggung jawab mendampingi dosen dalam mengajar mata kuliah Struktur Data dan Desain Pola Pemrograman (Design Patterns) untuk 80+ mahasiswa angkatan bawah. Mengoreksi tugas praktikum mingguan, menyusun soal kuis, dan membimbing pengerjaan tugas akhir berupa REST API berbasis Node.js.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", // Lab environment / Mentoring
    tags: ["Asisten Lab", "Struktur Data", "Design Patterns", "Mentoring"]
  },
  {
    id: "act-4",
    title: "Relawan Pengajar 'Coding Goes to School'",
    date: "2025-06-20",
    location: "SD & SMP Bakti Nusantara, Daerah",
    description: "Menginisiasi program pengenalan dasar logika komputasional (Computational Thinking) bagi siswa tingkat dasar menggunakan bahasa visual Scratch dan micro:bit. Upaya membantu literasi digital sejak dini di sekolah marginal.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", // Classroom / Teaching
    tags: ["Sosial", "Pengabdian", "Scratch", "Computational Thinking"]
  }
];

export const PERSONAL_PHOTOS_DATA: PersonalPhoto[] = [
  {
    id: "p-photo-1",
    title: "Fokus di Balik Meja Kerja",
    description: "Momen saat melakukan debugging rutin dan merancang arsitektur database untuk rilis proyek open source teranyar.",
    location: "Home Workspace Studio, Jakarta",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", // Cozy tech workstation with hands typing
    cameraInfo: "Fujifilm X-T5, XF 23mm f/1.4",
    date: "2026-03-12"
  },
  {
    id: "p-photo-2",
    title: "Eksplorasi di Hutan Pinus",
    description: "Menyempatkan diri berinteraksi dengan alam bebas di akhir pekan untuk menyegarkan pikiran (refreshing) dan mencari inspirasi visual baru.",
    location: "Hutan Pinus Cikole, Lembang",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", // Casual male portrait smiling
    cameraInfo: "Sony Alpha 7 IV, FE 50mm f/1.2",
    date: "2025-11-05"
  },
  {
    id: "p-photo-3",
    title: "Potret Street Photography Jakarta",
    description: "Melatih kepekaan menangkap momen keseharian urban (candid) di trotoar ibu kota selepas jam sibuk.",
    location: "Kawasan MRT Bundaran HI, Jakarta",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", // Close-up portrait male in street
    cameraInfo: "Leica M11, Summilux 35mm f/1.4",
    date: "2025-12-10"
  },
  {
    id: "p-photo-4",
    title: "Berbagi di Forum Developer",
    description: "Dokumentasi candid ketika membawakan materi optimasi React performance di meetup bulanan komunitas regional.",
    location: "Co-Working Space Kebayoran",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", // Confident male in formal shirt speaking
    cameraInfo: "Sony Alpha 7R V, 70-200mm f/2.8",
    date: "2026-01-22"
  }
];

export const GUESTBOOK_SEED: GuestbookEntry[] = [
  {
    id: "g-1",
    name: "Dr. Ir. Hermawan Sutanto, M.T.",
    message: "Alif adalah mahasiswa bimbingan saya yang sangat tekun. Tugas akhirnya dirancang dengan metodologi perangkat lunak yang sangat kokoh. Pertahankan prestasimu!",
    date: "2026-06-15",
    role: "Dosen Pembimbing"
  },
  {
    id: "g-2",
    name: "Rizky Ramadhan",
    message: "Bro Alif kalau ngajarin pemrograman di laboratorium asik banget. Penjelasan struktur data yang biasanya ribet jadi gampang dicerna. Sukses selalu, mentor!",
    date: "2026-06-22",
    role: "Rekan Mahasiswa"
  },
  {
    id: "g-3",
    name: "Nabila Fitriana",
    message: "Desain UI/UX buatan Alif di Hackathon kemarin dapet pujian dari para juri. Sangat fungsional dan responsif. Beruntung bisa satu tim dengan kamu!",
    date: "2026-06-26",
    role: "Rekan Satu Tim"
  }
];
